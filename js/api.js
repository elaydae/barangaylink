(() => {
  async function request(path, options = {}) {
    if (window.location?.protocol === 'file:') {
      throw new Error('BarangayLink is open as a local file. Run "npm start" in the project folder, then open http://localhost:3000.');
    }
    let response;
    try {
      response = await fetch(`${window.location.origin}${path}`, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers }
      });
    } catch (error) {
      throw new Error('Cannot connect to BarangayLink. Check that the server is running and try again.');
    }

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text().catch(() => '');
    let payload = null;
    const isJson = /(^|\/|\+)json(?:\s*;|$)/i.test(contentType);
    try {
      if (responseText && isJson) payload = JSON.parse(responseText);
    } catch (error) {
      if (response.ok) {
        throw new Error(`The server returned invalid JSON (${contentType || 'unknown content type'}). Your request may have been received; retrying is safe.`);
      }
    }
    if (!response.ok) {
      const message = payload?.error?.message;
      const description = isJson
        ? (message || `The server returned HTTP ${response.status} without an API error message.`)
        : `The request API is unavailable at this address (HTTP ${response.status}, ${contentType || 'non-JSON response'}). Start BarangayLink with "npm start" and open http://localhost:3000.`;
      const error = new Error(description);
      error.status = response.status;
      error.fields = payload?.error?.fields || {};
      throw error;
    }
    if (!isJson || !payload || typeof payload !== 'object' || !Object.hasOwn(payload, 'data')) {
      throw new Error(`The server returned an unexpected response (${contentType || 'empty or unknown content type'}). Your request may have been received; retrying is safe.`);
    }
    return payload.data;
  }

  window.BarangayApi = Object.freeze({
    health: () => request('/api/health'),
    getRequests: () => request('/api/requests'),
    getRequest: (reference) => request(`/api/requests/${encodeURIComponent(reference)}`),
    createRequest: async (data, submissionKey) => {
      const created = await request('/api/requests', {
        method: 'POST',
        headers: submissionKey ? { 'Idempotency-Key': submissionKey } : {},
        body: JSON.stringify(data)
      });
      if (!created || typeof created !== 'object' || typeof created.reference !== 'string' || !created.reference) {
        throw new Error('The server response did not include a request reference. Your request may have been received; retrying is safe.');
      }
      return created;
    },
    updateStatus: (reference, data) => request(`/api/requests/${encodeURIComponent(reference)}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  });
})();
