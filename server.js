const express = require('express');
const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const SERVICE_NAMES = new Set([
  'Barangay Clearance',
  'Certificate of Residency',
  'Certificate of Indigency',
  'Certificate of Good Moral Character',
  'Certificate of No Pending Case',
  'General Barangay Certification',
  'Barangay Business Clearance',
  'Business Permit',
  'Business Permit Assistance',
  'Business Location Certification',
  'First-Time Job Seeker Certification',
  'Solo Parent Certification Assistance',
  'Senior Citizen Assistance Request',
  'Community Assistance Request',
  'Barangay ID Request',
  'Resident Information Update',
  'Document Correction Request',
  'General Certification Request'
]);

const PURPOSES = new Set([
  'Employment',
  'Education',
  'Business or permit',
  'Government transaction',
  'Personal records'
]);

const ALLOWED_TRANSITIONS = {
  pending: ['review'],
  review: ['approved', 'rejected'],
  approved: ['ready'],
  ready: ['released'],
  released: [],
  rejected: []
};
const VALID_STATUSES = new Set(Object.keys(ALLOWED_TRANSITIONS));

function validateRequest(body) {
  const errors = {};
  const required = ['name', 'address', 'contact', 'email', 'document', 'purpose'];
  const value = (field) => typeof body[field] === 'string' ? body[field].trim() : '';

  required.forEach((field) => {
    if (!value(field)) errors[field] = 'This field is required.';
  });
  const limits = { name: 100, address: 200, contact: 20, email: 254, purpose: 200 };
  Object.entries(limits).forEach(([field, limit]) => {
    if (value(field).length > limit) errors[field] = `Must be ${limit} characters or fewer.`;
  });
  if (value('name') && value('name').length < 2) errors.name = 'Name must be at least 2 characters.';
  if (value('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) {
    errors.email = 'Enter a valid email address.';
  }
  if (value('contact') && !/^[0-9+()\-\s]{7,20}$/.test(value('contact'))) {
    errors.contact = 'Enter a valid contact number.';
  }
  if (value('document') && !SERVICE_NAMES.has(value('document'))) {
    errors.document = 'Select an available service.';
  }
  const purpose = value('purpose');
  if (purpose && !PURPOSES.has(purpose) && !(purpose.startsWith('Other: ') && purpose.length > 7)) {
    errors.purpose = 'Select an available purpose or specify Other.';
  }
  return errors;
}

function createApp(options = {}) {
  const dataFile = options.dataFile || process.env.BARANGAYLINK_DATA_FILE || path.join(__dirname, 'data', 'requests.json');
  const staticDir = options.staticDir || __dirname;
  let writeQueue = Promise.resolve();
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  async function readRequests() {
    try {
      const contents = await fs.readFile(dataFile, 'utf8');
      const requests = JSON.parse(contents);
      if (!Array.isArray(requests)) throw new Error('Request data must be a JSON array.');
      return requests;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, '[]\n', { flag: 'wx' }).catch((writeError) => {
        if (writeError.code !== 'EEXIST') throw writeError;
      });
      return [];
    }
  }

  function updateRequests(update) {
    const operation = writeQueue.then(async () => {
      const requests = await readRequests();
      const result = await update(requests);
      const temporaryFile = `${dataFile}.${process.pid}.${randomUUID()}.tmp`;
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      try {
        await fs.writeFile(temporaryFile, `${JSON.stringify(requests, null, 2)}\n`, { flag: 'wx' });
        await fs.rename(temporaryFile, dataFile);
      } catch (error) {
        await fs.rm(temporaryFile, { force: true });
        throw error;
      }
      return result;
    });
    writeQueue = operation.catch(() => {});
    return operation;
  }

  const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
  const notFound = (res) => res.status(404).json({
    error: { code: 'REQUEST_NOT_FOUND', message: 'No request matches that reference number.' }
  });

  app.get('/api/health', (req, res) => res.json({ data: { status: 'ok' } }));
  app.get('/api/requests', asyncRoute(async (req, res) => {
    const requests = await readRequests();
    requests.sort((left, right) => right.submittedAt.localeCompare(left.submittedAt));
    res.json({ data: requests.map(({ submissionKey: ignoredKey, ...request }) => request) });
  }));
  app.get('/api/requests/:reference', asyncRoute(async (req, res) => {
    const request = (await readRequests()).find((item) => item.reference.toLowerCase() === req.params.reference.toLowerCase());
    if (!request) return notFound(res);
    const { submissionKey: ignoredKey, ...publicRequest } = request;
    res.json({ data: publicRequest });
  }));
  app.post('/api/requests', asyncRoute(async (req, res) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A JSON object is required.' } });
    }
    const errors = validateRequest(req.body);
    if (Object.keys(errors).length) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Check the request fields and try again.', fields: errors }
      });
    }
    const submissionKey = req.get('Idempotency-Key');
    if (submissionKey && !/^[\w-]{16,100}$/.test(submissionKey)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Idempotency-Key must be 16 to 100 letters, numbers, underscores, or hyphens.' }
      });
    }
    const now = new Date().toISOString();
    const request = {
      reference: `BL-${now.slice(0, 4)}-${randomUUID().replace(/-/g, '').toUpperCase()}`,
      submissionKey,
      name: req.body.name.trim(),
      address: req.body.address.trim(),
      contact: req.body.contact.trim(),
      email: req.body.email.trim().toLowerCase(),
      document: req.body.document.trim(),
      purpose: req.body.purpose.trim(),
      submittedAt: now,
      updatedAt: now,
      status: 'pending',
      rejectionReason: ''
    };
    const result = await updateRequests((requests) => {
      if (submissionKey) {
        const existing = requests.find((item) => item.submissionKey === submissionKey);
        if (existing) return { request: existing, duplicate: true };
      }
      requests.unshift(request);
      return { request, duplicate: false };
    });
    const { submissionKey: ignoredKey, ...publicRequest } = result.request;
    res.status(result.duplicate ? 200 : 201).json({ data: publicRequest });
  }));
  app.patch('/api/requests/:reference/status', asyncRoute(async (req, res) => {
    const status = req.body && typeof req.body.status === 'string' ? req.body.status : '';
    const reason = req.body && typeof req.body.rejectionReason === 'string' ? req.body.rejectionReason.trim() : '';
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Choose a valid request status.' } });
    }
    if (status === 'rejected' && !reason) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A rejection reason is required.' } });
    }
    if (reason.length > 500) {
      return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Rejection reason must be 500 characters or fewer.' } });
    }
    const updated = await updateRequests((requests) => {
      const request = requests.find((item) => item.reference.toLowerCase() === req.params.reference.toLowerCase());
      if (!request) return null;
      if (!ALLOWED_TRANSITIONS[request.status].includes(status)) {
        const error = new Error(`Cannot move a ${request.status} request to ${status}.`);
        error.statusCode = 409;
        error.code = 'INVALID_STATUS_TRANSITION';
        throw error;
      }
      request.status = status;
      request.updatedAt = new Date().toISOString();
      request.rejectionReason = status === 'rejected' ? reason : '';
      return request;
    });
    if (!updated) return notFound(res);
    const { submissionKey: ignoredKey, ...publicRequest } = updated;
    res.json({ data: publicRequest });
  }));

  app.use('/api', (req, res) => res.status(404).json({
    error: { code: 'ENDPOINT_NOT_FOUND', message: 'The requested API endpoint does not exist.' }
  }));
  app.use('/data', (req, res) => res.sendStatus(404));
  app.use(express.static(staticDir));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({ error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON.' } });
    }
    const status = error.statusCode || error.status || 500;
    if (status >= 500) console.error('Request API error:', error);
    res.status(status).json({
      error: {
        code: error.code || (error.type === 'entity.too.large' ? 'PAYLOAD_TOO_LARGE' : 'INTERNAL_ERROR'),
        message: status >= 500 ? 'The server could not complete the request.' : error.message
      }
    });
  });
  return app;
}

if (require.main === module) {
  const configuredPort = process.env.PORT === undefined ? 3000 : Number(process.env.PORT);
  if (!Number.isInteger(configuredPort) || configuredPort < 1 || configuredPort > 65535) {
    console.error(`Invalid PORT "${process.env.PORT}". Set PORT to an integer from 1 to 65535.`);
    process.exitCode = 1;
  } else {
    const server = createApp().listen(configuredPort);
    server.on('listening', () => {
      const address = server.address();
      console.log(`BarangayLink is available at http://localhost:${address.port}`);
    });
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${configuredPort} is already in use. Stop the other process or start BarangayLink with PORT=<available-port>.`);
      } else {
        console.error(`BarangayLink could not start: ${error.message}`);
      }
      process.exitCode = 1;
    });
  }
}

module.exports = { createApp, validateRequest };
