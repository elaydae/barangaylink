import * as Data from './data.mjs';
import { statusClass, setRequestPageState, bindRequestFilters } from './resident.mjs';
const { STATUS_LABELS, getAuth, escapeHtml, formatDate, showToast } = Data;

async function renderStaffDashboard() {
  const body = document.querySelector('[data-staff-rows]');
  if (!body) return;
  const empty = document.querySelector('[data-staff-empty]');
  setRequestPageState(body, 'Loading request queue…');
  try {
    const requests = await window.BarangayApi.getRequests();
    const counts = { total: requests.length, pending: 0, review: 0, approved: 0, rejected: 0, ready: 0 };
    requests.forEach((request) => { if (counts[request.status] !== undefined) counts[request.status] += 1; });
    Object.keys(counts).forEach((key) => {
      const element = document.querySelector(`[data-staff-stat="${key}"]`);
      if (element) element.textContent = counts[key];
    });
    body.innerHTML = requests.map((request) => `<tr data-status="${escapeHtml(request.status)}" data-document="${escapeHtml(request.document)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.name)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td><a href="staff-request.html?reference=${encodeURIComponent(request.reference)}" class="action-link">Review</a></td></tr>`).join('');
    setRequestPageState(body, '', 'empty');
    if (empty) empty.classList.toggle('hidden', requests.length > 0);
    bindRequestFilters(body, document.querySelector('#staff-search'), document.querySelector('#staff-status-filter'), document.querySelector('#staff-doc-filter'));
  } catch (error) {
    body.replaceChildren();
    if (empty) empty.classList.add('hidden');
    setRequestPageState(body, error.message, 'error');
  }
}

/** Loads requests for staff review and sends status changes to the backend. */
function initStaffRequest() {
  const actions = document.querySelectorAll('[data-status-action]');
  if (!actions.length) return;
  const searchInput = document.querySelector('#review-search');
  const listBody = document.querySelector('[data-review-rows]');
  const listEmpty = document.querySelector('[data-review-empty]');
  const rejectionField = document.querySelector('[data-rejection-field]');
  const rejectionReason = document.querySelector('#rejection-reason');
  const rejectionError = document.querySelector('[data-rejection-error]');
  let reference = new URLSearchParams(window.location.search).get('reference');
  let request = null;
  let requests = [];
  let saving = false;
  const display = (key, value) => { const element = document.querySelector(`[data-staff-detail="${key}"]`); if (element) element.textContent = value || '-'; };
  let apiStatus = document.querySelector('[data-staff-api-status]');
  if (!apiStatus) {
    apiStatus = document.createElement('p');
    apiStatus.dataset.staffApiStatus = '';
    apiStatus.className = 'request-api-state';
    apiStatus.hidden = true;
    apiStatus.setAttribute('aria-live', 'polite');
    document.querySelector('.request-card').prepend(apiStatus);
  }

  const renderList = () => {
    if (!listBody) return;
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const matches = requests.filter((item) => !query || [item.reference, item.name, item.document, item.status, STATUS_LABELS[item.status], formatDate(item.submittedAt)].join(' ').toLowerCase().includes(query));
    listBody.innerHTML = matches.map((item) => `<tr class="${item.reference === reference ? 'is-selected' : ''}"><td>${escapeHtml(item.reference)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.document)}</td><td>${escapeHtml(formatDate(item.submittedAt))}</td><td><span class="status-badge ${statusClass(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span></td><td><button type="button" class="action-link" data-review-select="${escapeHtml(item.reference)}">Review</button></td></tr>`).join('');
    if (listEmpty) listEmpty.classList.toggle('hidden', matches.length > 0);
  };

  const loadList = async () => {
    apiStatus.textContent = 'Loading review queue…';
    apiStatus.dataset.state = 'loading';
    apiStatus.hidden = false;
    try {
      requests = await window.BarangayApi.getRequests();
      apiStatus.textContent = '';
      apiStatus.hidden = true;
      if (!reference && requests[0]) reference = requests[0].reference;
      renderList();
      if (reference) await load();
      else clearDetails();
    } catch (error) {
      requests = [];
      listBody.replaceChildren();
      listEmpty.classList.add('hidden');
      apiStatus.textContent = error.message;
      apiStatus.dataset.state = 'error';
      apiStatus.hidden = false;
      clearDetails();
    }
  };

  const clearDetails = () => {
    request = null;
    ['reference', 'name', 'address', 'contact', 'email', 'document', 'purpose', 'date'].forEach((key) => display(key, key === 'reference' ? 'No request selected' : '-'));
    actions.forEach((button) => { button.disabled = true; button.setAttribute('aria-disabled', 'true'); });
  };

  const load = async () => {
    if (!reference) { clearDetails(); return; }
    try {
      request = await window.BarangayApi.getRequest(reference);
    } catch (error) {
      request = null;
      clearDetails();
      apiStatus.textContent = error.status === 404 ? 'No request matches the selected reference.' : error.message;
      apiStatus.dataset.state = 'error';
      apiStatus.hidden = false;
      return;
    }
    Object.entries({ reference: request.reference, name: request.name, address: request.address, contact: request.contact, email: request.email, document: request.document, purpose: request.purpose, date: formatDate(request.submittedAt) }).forEach(([key, value]) => display(key, value));
    const select = document.querySelector('#status-select');
    if (select) select.value = request.status;
    const enabledActions = {
      pending: ['review'],
      review: ['approved', 'rejected'],
      approved: ['ready'],
      ready: ['released'],
      released: [],
      rejected: []
    }[request.status] || [];
    actions.forEach((button) => {
      const enabled = enabledActions.includes(button.dataset.statusAction);
      button.disabled = !enabled;
      button.setAttribute('aria-disabled', String(!enabled));
    });
    if (rejectionField) rejectionField.classList.toggle('hidden', request.status !== 'rejected');
    if (rejectionReason) rejectionReason.value = request.status === 'rejected' ? (request.rejectionReason || '') : '';
    if (rejectionError) rejectionError.textContent = '';
  };

  if (searchInput) searchInput.addEventListener('input', renderList);
  if (listBody) listBody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-review-select]');
    if (!button) return;
    reference = button.dataset.reviewSelect;
    renderList();
    load();
    try { window.history.replaceState(null, '', `?reference=${encodeURIComponent(reference)}`); } catch (error) {}
    document.querySelector('.request-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  actions.forEach((button) => button.addEventListener('click', async () => {
    if (saving) return;
    if (!request) { showToast('No request selected.', 'error'); return; }
    const status = button.dataset.statusAction;
    if (status === 'rejected') {
      rejectionField.classList.remove('hidden');
      if (!rejectionReason.value.trim()) { rejectionError.textContent = 'Please provide a reason for rejecting this request.'; rejectionReason.focus(); return; }
    }
    if (status === 'rejected') {
      if (!window.confirm('Are you sure you want to reject this request?')) return;
    } else if (!window.confirm(`Update this request to ${STATUS_LABELS[status]}?`)) return;
    saving = true;
    actions.forEach((action) => { action.disabled = true; });
    apiStatus.textContent = 'Saving status…';
    apiStatus.dataset.state = 'loading';
    apiStatus.hidden = false;
    try {
      await window.BarangayApi.updateStatus(request.reference, {
        status,
        rejectionReason: status === 'rejected' ? rejectionReason.value.trim() : ''
      });
      requests = await window.BarangayApi.getRequests();
      apiStatus.textContent = '';
      apiStatus.hidden = true;
      await load();
      renderList();
      showToast(status === 'rejected' ? 'Request rejected.' : 'Request status updated.');
    } catch (error) {
      apiStatus.textContent = error.message;
      apiStatus.dataset.state = 'error';
      apiStatus.hidden = false;
      showToast(error.message, 'error');
      await load();
    } finally {
      saving = false;
    }
  }));

  if (searchInput) searchInput.addEventListener('input', renderList);
  loadList();
}

/** Converts the concern form fields into the shared concern record shape and saves locally. */

export { renderStaffDashboard, initStaffRequest };
