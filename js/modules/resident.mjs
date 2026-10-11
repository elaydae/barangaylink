import * as Data from './data.mjs';
const { serviceCatalog, STATUS_LABELS, STATUS_ORDER, getProfile, saveProfile, escapeHtml, formatDate, getService, showToast } = Data;
function initServices() {
  const grid = document.querySelector('[data-service-grid]');
  if (!grid) return;
  const search = document.querySelector('#service-search');
  const empty = document.querySelector('[data-service-empty]');
  const count = document.querySelector('[data-service-count]');
  const detail = document.querySelector('#service-detail');
  const pagePrefix = /\/pages\//i.test(window.location.pathname) ? '' : 'pages/';
  let category = 'all';
  const renderDetail = (service) => { if (!detail || !service) return; detail.classList.remove('hidden'); detail.querySelector('[data-detail-icon]').textContent = service.icon; detail.querySelector('[data-detail-category]').textContent = service.category; detail.querySelector('[data-detail-name]').textContent = service.name; detail.querySelector('[data-detail-description]').textContent = service.description; detail.querySelector('[data-detail-processing]').textContent = service.processing; detail.querySelector('[data-detail-requirements]').innerHTML = service.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join(''); detail.querySelector('[data-detail-request]').href = `${pagePrefix}request.html?service=${encodeURIComponent(service.name)}`; detail.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const render = () => { const query = search ? search.value.trim().toLowerCase() : ''; const items = serviceCatalog.filter((service) => (category === 'all' || service.category === category) && (!query || `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(query))); grid.innerHTML = items.map((service) => `<article class="service-card"><div class="service-icon" aria-hidden="true">${service.icon}</div><span class="category-label">${escapeHtml(service.category)}</span><h3>${escapeHtml(service.name)}</h3><p>${escapeHtml(service.description)}</p><ul>${service.requirements.slice(0, 3).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><span class="processing-time">Estimated: ${escapeHtml(service.processing)}</span><div class="card-actions">${detail ? `<button class="btn btn-ghost small" type="button" data-view-service="${escapeHtml(service.name)}">View Requirements</button>` : `<a class="btn btn-ghost small" href="${pagePrefix}services.html">View Requirements</a>`}<a class="btn btn-primary small" href="${pagePrefix}request.html?service=${encodeURIComponent(service.name)}">Request Service</a></div></article>`).join(''); if (count) count.textContent = items.length; if (empty) empty.classList.toggle('hidden', items.length > 0); grid.querySelectorAll('[data-view-service]').forEach((button) => button.addEventListener('click', () => renderDetail(getService(button.dataset.viewService)))); };
  document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { category = button.dataset.category; document.querySelectorAll('[data-category]').forEach((tab) => { const active = tab === button; tab.classList.toggle('active', active); tab.setAttribute('aria-selected', String(active)); }); render(); }));
  if (search) search.addEventListener('input', render);
  const clear = document.querySelector('[data-clear-search]');
  if (clear) clear.addEventListener('click', () => { search.value = ''; category = 'all'; document.querySelector('[data-category="all"]').click(); });
  render();
}

function setFieldError(field, message) { let error = field.parentElement.querySelector('.field-error'); if (!error) { error = document.createElement('p'); error.className = 'field-error'; field.parentElement.appendChild(error); } error.textContent = message; field.setAttribute('aria-invalid', 'true'); }
function clearFieldError(field) { const error = field.parentElement.querySelector('.field-error'); if (error) error.textContent = ''; field.removeAttribute('aria-invalid'); }
/** Validates the active request step and writes errors into the form's accessible field hooks. */
function validateRequest(form, step) {
  const fields = step === 0 ? [form.querySelector('#document-type')] : step === 2 ? Array.from(form.querySelectorAll('.step-panel.active input[required]')) : [];
  let valid = true;
  fields.forEach((field) => { clearFieldError(field); if (!field.value.trim()) { setFieldError(field, field.id === 'document-type' ? 'Please select a document.' : `Please enter your ${field.name === 'fullName' ? 'full name' : field.name === 'contactNumber' ? 'contact number' : field.name}.`); if (valid) field.focus(); valid = false; } });
  if (step === 2) { const email = form.querySelector('#req-email'); const contact = form.querySelector('#req-contact-number'); if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setFieldError(email, 'Please enter a valid email address.'); valid = false; } if (contact.value && !/^[0-9+()\-\s]{7,20}$/.test(contact.value)) { setFieldError(contact, 'Please enter a valid contact number.'); valid = false; } const purpose = form.querySelector('#request-purpose'); const other = form.querySelector('#request-purpose-other'); clearFieldError(purpose); if (!purpose.value) { setFieldError(purpose, 'Please select the purpose of your request.'); valid = false; } if (purpose.value === 'Other') { clearFieldError(other); if (!other.value.trim()) { setFieldError(other, 'Please specify the purpose of your request.'); if (valid) other.focus(); valid = false; } } }
  return valid;
}

/** Coordinates the multi-step document form and submits confirmed requests to Express. */
function initRequest() {
  const form = document.querySelector('.request-form');
  if (!form) return;
  const select = form.querySelector('#document-type');
  if (!select) return;
  const profile = getProfile();
  const purpose = form.querySelector('#request-purpose');
  const purposeOther = form.querySelector('#request-purpose-other');
  const purposeOtherField = form.querySelector('[data-purpose-other-field]');
  const getPurposeValue = () => purpose.value === 'Other' ? purposeOther.value.trim() : purpose.value;
  const queryService = new URLSearchParams(window.location.search).get('service');
  select.innerHTML = '<option value="">Select a service</option>' + serviceCatalog.map((service) => `<option value="${escapeHtml(service.name)}">${escapeHtml(service.name)}</option>`).join('');
  if (queryService && getService(queryService)) select.value = queryService;
  ['full-name', 'address', 'contact-number', 'req-email'].forEach((id) => { const field = form.querySelector(`#${id}`); if (field && !field.value) field.value = id === 'full-name' ? profile.name : id === 'address' ? profile.address : id === 'contact-number' ? profile.contact : profile.email; });
  const steps = Array.from(form.querySelectorAll('.step-panel')); let current = 0;
  const updateRequirements = () => { const service = getService(select.value); const list = form.querySelector('[data-request-requirements]'); const intro = form.querySelector('[data-request-requirement-intro]'); if (service) { intro.textContent = `${service.name} requirements`; list.innerHTML = service.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join(''); } else { intro.textContent = 'Select a service to view requirements'; list.innerHTML = ''; } };
  const updateReview = () => { const values = { document: select.value || '-', name: form.querySelector('#req-full-name').value || '-', address: form.querySelector('#req-address').value || '-', contact: form.querySelector('#req-contact-number').value || '-', email: form.querySelector('#req-email').value || '-', purpose: getPurposeValue() || '-' }; Object.keys(values).forEach((key) => { const target = form.querySelector(`[data-review-${key}]`); if (target) target.textContent = values[key]; }); };
  const updateUI = () => { steps.forEach((step, index) => step.classList.toggle('active', index === current)); form.querySelector('[data-step-label]').textContent = `Step ${current + 1} of ${steps.length}`; form.querySelectorAll('[data-next]').forEach((button) => button.classList.toggle('hidden', current === steps.length - 1)); form.querySelector('[data-submit]').classList.toggle('hidden', current !== steps.length - 1); form.querySelectorAll('[data-prev]').forEach((button) => button.classList.toggle('hidden', current === 0)); updateRequirements(); if (current === steps.length - 1) updateReview(); };
  form.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => { if (current === 0 && !validateRequest(form, 0)) return; if (current === 2 && !validateRequest(form, 2)) return; current = Math.min(current + 1, steps.length - 1); updateUI(); }));
  form.querySelectorAll('[data-prev]').forEach((button) => button.addEventListener('click', () => { current = Math.max(current - 1, 0); updateUI(); }));
  select.addEventListener('change', updateRequirements);
  const updatePurposeOther = () => { const isOther = purpose.value === 'Other'; purposeOtherField.classList.toggle('hidden', !isOther); purposeOther.required = isOther; if (!isOther) { purposeOther.value = ''; clearFieldError(purposeOther); } };
  purpose.addEventListener('change', updatePurposeOther);
  purposeOther.addEventListener('input', () => { if (current === steps.length - 1) updateReview(); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (form.dataset.submitting === 'true') return;
    if (!validateRequest(form, 2)) { current = 2; updateUI(); return; }
    const submit = form.querySelector('[data-submit]');
    const message = form.querySelector('.form-message');
    const profileData = {
      name: form.querySelector('#req-full-name').value.trim(),
      address: form.querySelector('#req-address').value.trim(),
      contact: form.querySelector('#req-contact-number').value.trim(),
      email: form.querySelector('#req-email').value.trim()
    };
    const purposeValue = getPurposeValue();
    const data = {
      ...profileData,
      document: select.value,
      purpose: purpose.value === 'Other' ? `Other: ${purposeValue}` : purposeValue
    };
    if (!form.dataset.submissionKey) form.dataset.submissionKey = window.crypto.randomUUID();
    form.dataset.submitting = 'true';
    submit.disabled = true;
    submit.textContent = 'Submitting…';
    message.textContent = 'Submitting your request…';
    message.classList.add('show');
    try {
      const request = await window.BarangayApi.createRequest(data, form.dataset.submissionKey);
      delete form.dataset.submissionKey;
      saveProfile(profileData);
      form.querySelector('[data-submission-reference]').textContent = request.reference;
      form.querySelector('[data-submission-track]').href = `tracking.html?reference=${encodeURIComponent(request.reference)}`;
      form.querySelector('[data-submission-success]').classList.remove('hidden');
      form.querySelectorAll('.step-actions, .step-panel').forEach((element) => element.classList.add('hidden'));
      message.textContent = '';
      showToast('Request submitted successfully.');
    } catch (error) {
      Object.entries(error.fields || {}).forEach(([field, text]) => {
        const input = form.elements[field === 'name' ? 'fullName' : field === 'address' ? 'address' : field === 'contact' ? 'contactNumber' : field === 'email' ? 'email' : field === 'document' ? 'documentType' : field];
        if (input) setFieldError(input, text);
      });
      message.textContent = error.message;
      message.classList.add('show');
      showToast(error.message, 'error');
    } finally {
      form.dataset.submitting = 'false';
      submit.disabled = false;
      submit.textContent = 'Submit Request';
    }
  });
  updatePurposeOther();
  updateUI();
}

/** Adds step navigation and validation to shared concern forms; saveNewConcern handles persistence. */
function initAdditionalRequestForms() {
  document.querySelectorAll('.request-form[data-success-message]').forEach((form) => {
    const steps = Array.from(form.querySelectorAll('.step-panel'));
    let current = 0;
    const update = () => { steps.forEach((step, index) => step.classList.toggle('active', index === current)); form.querySelector('[data-step-label]').textContent = `Step ${current + 1} of ${steps.length}`; form.querySelectorAll('[data-next]').forEach((button) => button.classList.toggle('hidden', current === steps.length - 1)); form.querySelector('[data-submit]').classList.toggle('hidden', current !== steps.length - 1); form.querySelectorAll('[data-prev]').forEach((button) => button.classList.toggle('hidden', current === 0)); };
    const concernType = form.querySelector('#concern-type');
    const concernLocation = form.querySelector('#concern-location');
    const requiredMessage = 'This field is required.';
    const updateConcernPlaceholder = () => {
      if (concernType) {
        concernType.options[0].textContent = concernType.value ? 'Select a concern type' : concernType.getAttribute('aria-invalid') === 'true' ? requiredMessage : 'Select a concern type';
        if (concernType.value) concernType.removeAttribute('aria-invalid');
      }
      if (concernLocation) {
        if (concernLocation.value.trim()) concernLocation.removeAttribute('aria-invalid');
        concernLocation.placeholder = 'Street, purok, or landmark';
      }
    };
    if (concernType) concernType.addEventListener('change', updateConcernPlaceholder);
    if (concernLocation) concernLocation.addEventListener('input', updateConcernPlaceholder);
    const validate = () => { let valid = true; form.querySelectorAll('.step-panel.active [required]').forEach((field) => { clearFieldError(field); if (!field.value.trim()) { if (field === concernType) { field.setAttribute('aria-invalid', 'true'); field.options[0].textContent = requiredMessage; } else if (field === concernLocation) { field.setAttribute('aria-invalid', 'true'); field.placeholder = requiredMessage; } else setFieldError(field, requiredMessage); if (valid) field.focus(); valid = false; } }); if (concernLocation && concernLocation.value.trim()) concernLocation.placeholder = 'Street, purok, or landmark'; if (!valid) showToast('Please complete all required fields.', 'error'); return valid; };
    form.querySelectorAll('[data-next]').forEach((button) => button.addEventListener('click', () => { if (!validate()) return; current = Math.min(current + 1, steps.length - 1); update(); }));
    form.querySelectorAll('[data-prev]').forEach((button) => button.addEventListener('click', () => { current = Math.max(current - 1, 0); update(); }));
    form.addEventListener('submit', (event) => { event.preventDefault(); if (!validate()) return; if (form.hasAttribute('data-concern-form')) saveNewConcern(form); const message = form.querySelector('.form-message'); if (message) { message.textContent = form.dataset.successMessage; message.classList.add('show'); } showToast('Concern submitted successfully.'); });
    update();
  });
}

function statusClass(status) { return `status-${status === 'review' ? 'review' : status}`; }
function setRequestPageState(target, message, kind = 'loading') {
  const container = target.closest('.table-wrapper') || target.parentElement;
  let state = container.querySelector('[data-api-status]');
  if (!state) {
    state = document.createElement('p');
    state.dataset.apiStatus = '';
    state.className = 'request-api-state';
    state.setAttribute('aria-live', 'polite');
    container.prepend(state);
  }
  state.textContent = message || '';
  state.dataset.state = kind;
  state.hidden = !message;
}

function bindRequestFilters(body, search, status, documentFilter) {
  const filter = () => body.querySelectorAll('tr').forEach((row) => {
    const query = search ? search.value.trim().toLowerCase() : '';
    row.hidden = !row.textContent.toLowerCase().includes(query)
      || Boolean(status && status.value !== 'all' && row.dataset.status !== status.value)
      || Boolean(documentFilter && documentFilter.value !== 'all' && row.dataset.document !== documentFilter.value);
  });
  if (body.dataset.filtersBound) return;
  body.dataset.filtersBound = 'true';
  [search, status, documentFilter].filter(Boolean).forEach((field) => field.addEventListener('input', filter));
  filter();
}

/** Builds resident dashboard counts and active-request links from the API. */
async function renderDashboard() {
  const container = document.querySelector('[data-dashboard-requests]');
  if (!container) return;
  setRequestPageState(container, 'Loading requests…');
  try {
  const requests = await window.BarangayApi.getRequests();
  const stats = { total: requests.length, pending: 0, review: 0, approved: 0, ready: 0, released: 0 };
  requests.forEach((request) => { if (stats[request.status] !== undefined) stats[request.status] += 1; });
  Object.keys(stats).forEach((key) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (element) element.textContent = stats[key];
  });
  const activeRequests = requests.filter((request) => !['released', 'rejected'].includes(request.status));
  container.innerHTML = activeRequests.slice(0, 5).map((request) => `<tr data-status="${escapeHtml(request.status)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td><a class="action-link" href="tracking.html?reference=${encodeURIComponent(request.reference)}">Track Request</a></td></tr>`).join('');
  setRequestPageState(container, '', 'empty');
  const empty = document.querySelector('[data-dashboard-empty]');
  if (empty) empty.classList.toggle('hidden', activeRequests.length > 0);
  } catch (error) {
    container.replaceChildren();
    setRequestPageState(container, error.message, 'error');
  }
}

/** Renders API-backed requests and applies history search and filters. */
async function renderHistory() {
  const body = document.querySelector('[data-history-rows]');
  if (!body) return;
  const empty = document.querySelector('[data-history-empty]');
  setRequestPageState(body, 'Loading request history…');
  try {
    const requests = await window.BarangayApi.getRequests();
    body.innerHTML = requests.map((request) => `<tr data-status="${escapeHtml(request.status)}" data-document="${escapeHtml(request.document)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td>${escapeHtml(formatDate(request.updatedAt))}</td><td><a href="tracking.html?reference=${encodeURIComponent(request.reference)}" class="action-link">Track Request</a></td></tr>`).join('');
    setRequestPageState(body, '', 'empty');
    if (empty) empty.classList.toggle('hidden', requests.length > 0);
    bindRequestFilters(body, document.querySelector('#request-search'), document.querySelector('#statusFilter'), document.querySelector('#documentFilter'));
  } catch (error) {
    body.replaceChildren();
    if (empty) empty.classList.add('hidden');
    setRequestPageState(body, error.message, 'error');
  }
}

/** Resolves a request reference into its current status details and timeline. */
function renderTracking() {
  const form = document.querySelector('.track-form');
  if (!form) return;
  const input = form.querySelector('input');
  const result = document.querySelector('[data-track-result]');
  const empty = document.querySelector('[data-track-empty]');
  let message = form.querySelector('[data-api-status]');
  if (!message) {
    message = document.createElement('p');
    message.dataset.apiStatus = '';
    message.className = 'request-api-state';
    message.hidden = true;
    message.setAttribute('aria-live', 'polite');
    form.after(message);
  }
  const show = async (reference) => {
    result.classList.add('hidden');
    empty.classList.add('hidden');
    message.textContent = 'Looking up request…';
    message.dataset.state = 'loading';
    message.hidden = false;
    try {
      const request = await window.BarangayApi.getRequest(reference.trim());
      message.textContent = '';
      message.hidden = true;
      result.classList.remove('hidden');
      document.querySelector('[data-track-reference]').textContent = request.reference;
      document.querySelector('[data-track-document]').textContent = request.document;
      document.querySelector('[data-track-applicant]').textContent = request.name;
      document.querySelector('[data-track-date]').textContent = formatDate(request.submittedAt);
      document.querySelector('[data-track-status]').textContent = STATUS_LABELS[request.status] || request.status;
      if (request.rejectionReason) {
        let reason = result.querySelector('[data-track-rejection]');
        if (!reason) {
          reason = document.createElement('p');
          reason.dataset.trackRejection = '';
          result.insertBefore(reason, result.querySelector('[data-track-timeline]'));
        }
        reason.textContent = `Rejection reason: ${request.rejectionReason}`;
      } else {
        result.querySelector('[data-track-rejection]')?.remove();
      }
      const timeline = document.querySelector('[data-track-timeline]');
      const currentIndex = request.status === 'rejected' ? -1 : STATUS_ORDER.indexOf(request.status);
      timeline.innerHTML = ['Submitted', 'Received', 'Under Review', 'Approved', 'Ready for Release', 'Released'].map((label, index) => `<div class="timeline-item ${index <= currentIndex + 1 ? 'done' : ''} ${index === currentIndex + 1 ? 'active' : ''}"><span class="timeline-dot" aria-hidden="true"></span><div><strong>${label}</strong></div></div>`).join('');
    } catch (error) {
      if (error.status === 404) {
        empty.classList.remove('hidden');
        message.textContent = '';
        message.hidden = true;
      } else {
        message.textContent = error.message;
        message.dataset.state = 'error';
        message.hidden = false;
      }
    }
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.value.trim()) {
      input.setAttribute('aria-invalid', 'true');
      showToast('Enter a request reference number.', 'error');
      return;
    }
    input.removeAttribute('aria-invalid');
    show(input.value);
  });
  const queryReference = new URLSearchParams(window.location.search).get('reference');
  if (queryReference) {
    input.value = queryReference;
    show(queryReference);
  }
}

/** Populates staff summary and queue from the same API records residents see. */

export { initServices, setFieldError, clearFieldError, validateRequest, initRequest, initAdditionalRequestForms, statusClass, setRequestPageState, bindRequestFilters, renderDashboard, renderHistory, renderTracking };
