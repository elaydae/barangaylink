const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { afterEach, test } = require('node:test');
const vm = require('node:vm');
const { createApp } = require('../server');

const instances = [];
const validRequest = {
  name: 'Test Resident',
  address: '12 Sample Street',
  contact: '0917-123-4567',
  email: 'resident@example.test',
  document: 'Barangay Clearance',
  purpose: 'Employment'
};

async function startServer() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'barangaylink-'));
  const dataFile = path.join(directory, 'requests.json');
  const server = createApp({ dataFile, staticDir: path.join(__dirname, '..') }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  instances.push({ directory, server, dataFile });
  return { baseUrl: `http://127.0.0.1:${server.address().port}`, dataFile };
}

async function closeServer(server) {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

async function loadApi(fetchImpl) {
  const context = { window: { location: { protocol: 'http:', origin: 'http://localhost:3000' } }, fetch: fetchImpl };
  vm.runInNewContext(await fs.readFile(path.join(__dirname, '..', 'js', 'api.js'), 'utf8'), context);
  return context.window.BarangayApi;
}

afterEach(async () => {
  for (const instance of instances.splice(0)) {
    await closeServer(instance.server);
    await fs.rm(instance.directory, { recursive: true, force: true });
  }
});

test('health endpoint confirms the frontend can connect to Express', async () => {
  const { baseUrl } = await startServer();
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { status: 'ok' } });
});

test('valid submissions receive unique references and are shared by collection and detail reads', async () => {
  const { baseUrl } = await startServer();
  const [first, second] = await Promise.all([
    fetch(`${baseUrl}/api/requests`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validRequest) }),
    fetch(`${baseUrl}/api/requests`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validRequest) })
  ]);
  assert.equal(first.status, 201);
  assert.equal(second.status, 201);
  const firstRequest = (await first.json()).data;
  const secondRequest = (await second.json()).data;
  assert.notEqual(firstRequest.reference, secondRequest.reference);
  assert.match(firstRequest.reference, /^BL-\d{4}-[A-F0-9]{32}$/);
  assert.equal(firstRequest.status, 'pending');
  assert.equal(firstRequest.name, validRequest.name);
  const collection = await (await fetch(`${baseUrl}/api/requests`)).json();
  const detail = await (await fetch(`${baseUrl}/api/requests/${firstRequest.reference}`)).json();
  assert.equal(collection.data.length, 2);
  assert.ok(collection.data.some((item) => item.reference === firstRequest.reference));
  assert.deepEqual(detail.data, firstRequest);
});

test('repeating a submission with the same idempotency key returns its existing request', async () => {
  const { baseUrl, dataFile } = await startServer();
  const submit = () => fetch(`${baseUrl}/api/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'Idempotency-Key': 'browser-retry-key-0001' },
    body: JSON.stringify(validRequest)
  });
  const responses = await Promise.all([submit(), submit()]);
  assert.deepEqual(responses.map((response) => response.status).sort(), [200, 201]);
  const [first, second] = await Promise.all(responses.map((response) => response.json()));
  assert.equal(first.data.reference, second.data.reference);
  const stored = JSON.parse(await fs.readFile(dataFile, 'utf8'));
  assert.equal(stored.length, 1);
  assert.equal(stored[0].submissionKey, 'browser-retry-key-0001');
  assert.equal(Object.hasOwn(first.data, 'submissionKey'), false);
});

test('missing, malformed and unacceptable request fields return structured validation errors', async () => {
  const { baseUrl } = await startServer();
  const missing = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({})
  });
  assert.equal(missing.status, 400);
  const missingBody = await missing.json();
  assert.equal(missingBody.error.code, 'VALIDATION_ERROR');
  assert.ok(missingBody.error.fields.name);
  assert.ok(missingBody.error.fields.document);

  const invalid = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...validRequest, email: 'nope', contact: 'abc', document: 'Unknown Service', purpose: 'Make something up' })
  });
  assert.equal(invalid.status, 400);
  const invalidBody = await invalid.json();
  assert.ok(invalidBody.error.fields.email);
  assert.ok(invalidBody.error.fields.contact);
  assert.ok(invalidBody.error.fields.document);
  assert.ok(invalidBody.error.fields.purpose);
});

test('malformed JSON and oversized bodies receive structured JSON errors with client error status', async () => {
  const { baseUrl } = await startServer();
  const malformed = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"name":'
  });
  assert.equal(malformed.status, 400);
  assert.equal(malformed.headers.get('content-type').split(';')[0], 'application/json');
  assert.equal((await malformed.json()).error.code, 'INVALID_JSON');

  const oversized = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...validRequest, extra: 'x'.repeat(33 * 1024) })
  });
  assert.equal(oversized.status, 413);
  assert.equal(oversized.headers.get('content-type').split(';')[0], 'application/json');
  assert.equal((await oversized.json()).error.code, 'PAYLOAD_TOO_LARGE');
});

test('unknown references and API endpoints return explicit 404 JSON errors', async () => {
  const { baseUrl } = await startServer();
  const missing = await fetch(`${baseUrl}/api/requests/BL-2099-UNKNOWN`);
  assert.equal(missing.status, 404);
  assert.equal((await missing.json()).error.code, 'REQUEST_NOT_FOUND');
  const endpoint = await fetch(`${baseUrl}/api/no-such-endpoint`);
  assert.equal(endpoint.status, 404);
  assert.equal((await endpoint.json()).error.code, 'ENDPOINT_NOT_FOUND');
});

test('status updates validate allowed transitions and stay consistent across request views', async () => {
  const { baseUrl } = await startServer();
  const created = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validRequest)
  });
  const request = (await created.json()).data;
  const missingReason = await fetch(`${baseUrl}/api/requests/${request.reference}/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'rejected' })
  });
  assert.equal(missingReason.status, 400);
  const transition = await fetch(`${baseUrl}/api/requests/${request.reference}/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'review' })
  });
  assert.equal(transition.status, 200);
  const next = await fetch(`${baseUrl}/api/requests/${request.reference}/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'approved' })
  });
  assert.equal(next.status, 200);
  const blocked = await fetch(`${baseUrl}/api/requests/${request.reference}/status`, {
    method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'released' })
  });
  assert.equal(blocked.status, 409);
  const residentView = await (await fetch(`${baseUrl}/api/requests/${request.reference}`)).json();
  const staffQueue = await (await fetch(`${baseUrl}/api/requests`)).json();
  assert.equal(residentView.data.status, 'approved');
  assert.equal(staffQueue.data[0].status, 'approved');
});

test('request data persists after restarting the Express application', async () => {
  const { baseUrl, dataFile } = await startServer();
  const created = await fetch(`${baseUrl}/api/requests`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validRequest)
  });
  const request = (await created.json()).data;
  const instance = instances[instances.length - 1];
  await closeServer(instance.server);
  instance.server = createApp({ dataFile, staticDir: path.join(__dirname, '..') }).listen(0);
  await new Promise((resolve) => instance.server.once('listening', resolve));
  const afterRestart = await fetch(`http://127.0.0.1:${instance.server.address().port}/api/requests/${request.reference}`);
  assert.deepEqual((await afterRestart.json()).data, request);
});

test('API client reports network failures instead of returning a success-shaped fallback', async () => {
  const client = await loadApi(async () => { throw new Error('offline'); });
  await assert.rejects(client.getRequests(), /Cannot connect to BarangayLink/);
});

test('API client prevents file URLs and gives the correct local server URL', async () => {
  let fetchCalled = false;
  const context = {
    window: { location: { protocol: 'file:', origin: 'null' } },
    fetch: async () => { fetchCalled = true; }
  };
  vm.runInNewContext(await fs.readFile(path.join(__dirname, '..', 'js', 'api.js'), 'utf8'), context);
  await assert.rejects(context.window.BarangayApi.createRequest(validRequest, 'browser-retry-key-0001'), /local file.*npm start.*http:\/\/localhost:3000/);
  assert.equal(fetchCalled, false);
});

test('API client explains HTML 404 responses instead of reporting a JSON parse error', async () => {
  const client = await loadApi(async () => ({
    ok: false,
    status: 404,
    headers: { get: () => 'text/html; charset=utf-8' },
    text: async () => '<!doctype html><title>Not Found</title>'
  }));
  await assert.rejects(client.createRequest(validRequest, 'browser-retry-key-0001'), (error) => {
    assert.match(error.message, /API is unavailable.*HTTP 404.*text\/html/);
    assert.match(error.message, /npm start/);
    assert.equal(error.status, 404);
    return true;
  });
});

test('API client identifies successful but unexpected responses as ambiguous and safe to retry', async () => {
  const responses = [
    { ok: true, status: 201, contentType: 'text/html', body: '<h1>Created</h1>' },
    { ok: true, status: 201, contentType: 'application/json', body: '{bad json' }
  ];
  for (const response of responses) {
    const client = await loadApi(async () => ({
      ok: response.ok,
      status: response.status,
      headers: { get: () => response.contentType },
      text: async () => response.body
    }));
    await assert.rejects(client.createRequest(validRequest, 'browser-retry-key-0001'), /request may have been received; retrying is safe/);
  }
});

test('API client rejects a JSON success envelope that is missing the created request reference', async () => {
  const client = await loadApi(async () => ({
    ok: true,
    status: 201,
    headers: { get: () => 'application/json' },
    text: async () => JSON.stringify({ data: { status: 'pending' } })
  }));
  await assert.rejects(client.createRequest(validRequest, 'browser-retry-key-0001'), /did not include a request reference.*retrying is safe/);
});

test('API client parses a successful JSON response and sends the stable submission key', async () => {
  let requestOptions;
  const client = await loadApi(async (url, options) => {
    requestOptions = { url, options };
    return {
      ok: true,
      status: 201,
      headers: { get: () => 'application/json; charset=utf-8' },
      text: async () => JSON.stringify({ data: { reference: 'BL-2026-TEST' } })
    };
  });
  const result = await client.createRequest(validRequest, 'browser-retry-key-0001');
  assert.deepEqual(JSON.parse(JSON.stringify(result)), { reference: 'BL-2026-TEST' });
  assert.equal(requestOptions.url, 'http://localhost:3000/api/requests');
  assert.equal(requestOptions.options.headers['Content-Type'], 'application/json');
  assert.equal(requestOptions.options.headers['Idempotency-Key'], 'browser-retry-key-0001');
});

test('static application pages remain served and use the backend client on request workflows', async () => {
  const { baseUrl } = await startServer();
  for (const page of ['index.html', 'pages/request.html', 'pages/history.html', 'pages/tracking.html', 'pages/staff-dashboard.html', 'pages/staff-request.html']) {
    const response = await fetch(`${baseUrl}/${page}`);
    assert.equal(response.status, 200, `${page} should still be served`);
  }
  const history = await (await fetch(`${baseUrl}/pages/history.html`)).text();
  assert.match(history, /<script src="\.\.\/js\/api\.js"><\/script>/);
  assert.doesNotMatch(history, /REQ-2026-00124/);
});

test('JSON persistence files are not exposed by static file serving', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'barangaylink-static-'));
  const dataFile = path.join(directory, 'data', 'requests.json');
  const server = createApp({ dataFile, staticDir: directory }).listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  instances.push({ directory, server, dataFile });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  await fetch(`${baseUrl}/api/requests`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(validRequest)
  });
  const exposedFile = await fetch(`${baseUrl}/data/requests.json`);
  assert.equal(exposedFile.status, 404);
});
