const serviceCatalog = [
  { name: 'Barangay Clearance', category: 'Certificates & Clearances', icon: '📄', description: 'Request a barangay clearance for applicable personal, employment, business, or other purposes.', requirements: ['Valid identification', 'Complete resident information', 'Purpose of request'], processing: '2 to 3 working days', core: true },
  { name: 'Certificate of Residency', category: 'Certificates & Clearances', icon: '🏠', description: 'Confirm your current address and residency status within the barangay.', requirements: ['Valid government ID', 'Current address details', 'Purpose of request'], processing: '2 to 3 working days', core: true },
  { name: 'Certificate of Indigency', category: 'Certificates & Clearances', icon: '🤝', description: 'Request certification commonly used for support programs, scholarships, and financial assistance.', requirements: ['Valid ID', 'Complete household information', 'Supporting income document, if applicable'], processing: '3 to 5 working days', core: true },
  { name: 'Certificate of Good Moral Character', category: 'Certificates & Clearances', icon: '⭐', description: 'Obtain a certification of good standing for school, employment, or another official purpose.', requirements: ['Valid government ID', 'Complete resident information', 'Purpose of request'], processing: '3 to 5 working days' },
  { name: 'Certificate of No Pending Case', category: 'Certificates & Clearances', icon: '🛡️', description: 'Request certification that confirms your barangay case status for an official transaction.', requirements: ['Valid government ID', 'Complete resident information', 'Purpose of request'], processing: '3 to 5 working days' },
  { name: 'General Barangay Certification', category: 'Certificates & Clearances', icon: '📜', description: 'Request a general certification for a purpose not covered by another document type.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed purpose statement'], processing: '3 to 5 working days' },
  { name: 'Barangay Business Clearance', category: 'Business & Permits', icon: '🏪', description: 'Request barangay clearance for a business operating or applying to operate in the community.', requirements: ['Owner valid ID', 'Business name and address', 'Proof of business registration, if available'], processing: '3 to 5 working days' },
  { name: 'Business Permit', category: 'Business & Permits', icon: '📦', description: 'Request barangay approval or validation for a business permit and local operations.', requirements: ['Business name and address', 'Owner identification', 'Supporting business documents'], processing: '3 to 5 working days', core: true },
  { name: 'Business Permit Assistance', category: 'Business & Permits', icon: '🧾', description: 'Get guidance and assistance in preparing a local business permit request.', requirements: ['Owner valid ID', 'Business name and address', 'Available business documents'], processing: '1 to 2 working days' },
  { name: 'Business Location Certification', category: 'Business & Permits', icon: '📍', description: 'Request certification of a business location within the barangay.', requirements: ['Owner valid ID', 'Complete business address', 'Proof of occupancy or ownership'], processing: '3 to 5 working days' },
  { name: 'First-Time Job Seeker Certification', category: 'Community Services', icon: '💼', description: 'Request certification for qualified first-time job seekers applying for employment documents.', requirements: ['Valid government ID', 'Resident information', 'First-time job seeker declaration'], processing: '2 to 3 working days' },
  { name: 'Solo Parent Certification Assistance', category: 'Community Services', icon: '👤', description: 'Request assistance with the certification process for solo parents.', requirements: ['Valid ID', 'Proof of solo parent status', 'Complete household information'], processing: '3 to 5 working days' },
  { name: 'Senior Citizen Assistance Request', category: 'Community Services', icon: '🧓', description: 'Submit a request for barangay assistance and support for a senior citizen.', requirements: ['Senior citizen valid ID', 'Resident information', 'Description of assistance needed'], processing: '3 to 5 working days' },
  { name: 'Community Assistance Request', category: 'Community Services', icon: '🫱', description: 'Request help from the barangay for a community or household concern.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed assistance request'], processing: '3 to 5 working days' },
  { name: 'Barangay ID Request', category: 'Resident Services', icon: '🪪', description: 'Request a barangay identification card for local transactions and resident verification.', requirements: ['Valid government ID', 'Recent photo, if required', 'Complete resident information'], processing: '5 to 7 working days' },
  { name: 'Resident Information Update', category: 'Resident Services', icon: '✏️', description: 'Request an update to your resident profile or barangay records.', requirements: ['Valid government ID', 'Updated information', 'Supporting document for the change'], processing: '2 to 3 working days' },
  { name: 'Document Correction Request', category: 'Resident Services', icon: '📝', description: 'Request correction of an error in a previously issued barangay document.', requirements: ['Valid government ID', 'Copy of document to correct', 'Proof of correct information'], processing: '3 to 5 working days' },
  { name: 'General Certification Request', category: 'Resident Services', icon: '📁', description: 'Start a request for a resident certification not listed as a specific service.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed purpose statement'], processing: '3 to 5 working days' }
];

const STORAGE_KEYS = {
  requests: 'barangaylink.requests',
  profile: 'barangaylink.profile',
  sequence: 'barangaylink.sequence',
  auth: 'barangaylink.auth',
  concerns: 'barangaylink.concerns',
  barangayInfo: 'barangaylink.barangayInfo'
};
const DEMO_ACCOUNTS = [
  { email: 'demo@bl.com', password: '123456', role: 'resident', name: 'Demo Resident' },
  { email: 'staff@bl.com', password: '123456', role: 'staff', name: 'Demo Staff/Admin' }
];
const STATUS_LABELS = { pending: 'Pending Review', review: 'Under Review', approved: 'Approved', rejected: 'Rejected', ready: 'Ready for Release', released: 'Released' };
const STATUS_ORDER = ['pending', 'review', 'approved', 'ready', 'released'];
const defaultProfile = { name: 'Juan Dela Cruz', address: '123 Rizal Street, Barangay San Isidro', contact: '0917-123-4567', email: 'juan.delacruz@email.com' };
const defaultBarangayInfo = {
  name: 'Barangay San Isidro',
  description: 'Barangay San Isidro is a residential and commercial community committed to responsive, transparent public service. The barangay serves its residents through streamlined online and over-the-counter transactions, regular community programs, and an active peace and order council.',
  classification: 'Urban Barangay',
  population: '8,450',
  puroks: '7',
  established: '1987',
  trunkline: '(02) 555-0148',
  hotline: '0917-000-1122',
  email: 'barangaysanisidro@lgu.gov.ph',
  facebook: 'facebook.com/BarangaySanIsidroOfficial',
  address: '123 Rizal Street, Barangay San Isidro',
  locationDescription: 'The barangay hall is located beside the covered court and public elementary school, a 5-minute walk from the main highway jeepney terminal.'
};
const STAFF_NAV_HTML = '<a href="staff-dashboard.html">Staff Dashboard</a><a href="staff-request.html">Request Review</a><a href="concerns.html">Reported Concerns</a><a href="barangay-info.html">Barangay Information</a><a href="emergency.html">Emergency</a>';
const CONCERN_STATUS = {
  submitted: { label: 'Submitted', badge: 'status-pending' },
  progress: { label: 'In Progress', badge: 'status-review' },
  resolved: { label: 'Resolved', badge: 'status-approved' }
};
const SAMPLE_CONCERNS = [
  { id: 'CNC-2026-0031', type: 'Garbage Collection', title: 'Garbage Collection Delay', location: 'Purok 3, near the basketball court', description: 'Garbage has not been collected for several days.', urgency: 'Medium', reporter: 'Juan Dela Cruz', anonymous: false, submittedBy: 'demo@bl.com', reportedAt: '2026-09-03T12:00:00', status: 'progress' },
  { id: 'CNC-2026-0027', type: 'Street Light', title: 'Broken Street Light', location: 'Rizal Street corner', description: 'The street light on the corner is not working at night.', urgency: 'High', reporter: 'Juan Dela Cruz', anonymous: false, submittedBy: 'demo@bl.com', reportedAt: '2026-08-20T12:00:00', status: 'resolved' },
  { id: 'CNC-2026-0019', type: 'Drainage Issue', title: 'Clogged Drainage', location: 'Purok 5 main road', description: 'Drainage is clogged and water pools on the road after rain.', urgency: 'Medium', reporter: 'Juan Dela Cruz', anonymous: false, submittedBy: 'demo@bl.com', reportedAt: '2026-08-30T12:00:00', status: 'submitted' }
];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { showToast('Your browser could not save this change.', 'error'); }
}

function getRequests() { const requests = readStorage(STORAGE_KEYS.requests, []); return Array.isArray(requests) ? requests : []; }
function saveRequests(requests) { writeStorage(STORAGE_KEYS.requests, requests); window.dispatchEvent(new Event('barangaylink:data')); }
function getProfile() { const profile = readStorage(STORAGE_KEYS.profile, {}); return { ...defaultProfile, ...(profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : {}) }; }
function saveProfile(profile) { writeStorage(STORAGE_KEYS.profile, profile); window.dispatchEvent(new Event('barangaylink:data')); }
function getBarangayInfo() {
  const stored = readStorage(STORAGE_KEYS.barangayInfo, {});
  return {
    ...defaultBarangayInfo,
    ...(stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {})
  };
}

function saveBarangayInfo(info) {
  writeStorage(STORAGE_KEYS.barangayInfo, info);
  window.dispatchEvent(new Event('barangaylink:data'));
}
function getAuth() { const auth = readStorage(STORAGE_KEYS.auth, null); return auth && (auth.role === 'resident' || auth.role === 'staff') ? auth : null; }
function setAuth(account) { writeStorage(STORAGE_KEYS.auth, { email: account.email, role: account.role, name: account.name }); }
function clearAuth() { try { localStorage.removeItem(STORAGE_KEYS.auth); } catch (error) {} }
function getConcerns() {
  const stored = readStorage(STORAGE_KEYS.concerns, null);
  if (Array.isArray(stored)) return stored;
  writeStorage(STORAGE_KEYS.concerns, SAMPLE_CONCERNS);
  return SAMPLE_CONCERNS.slice();
}
function saveConcerns(list) { writeStorage(STORAGE_KEYS.concerns, list); window.dispatchEvent(new Event('barangaylink:data')); }
function nextConcernId(list) {
  const highest = list.reduce((max, item) => Math.max(max, Number(String(item.id).split('-').pop()) || 0), 0);
  return `CNC-${new Date().getFullYear()}-${String(highest + 1).padStart(4, '0')}`;
}
function escapeHtml(value) { return String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character])); }
function formatDate(value) { return value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '-'; }
function getService(name) { return serviceCatalog.find((service) => service.name === name); }

function showToast(message, type = 'success') {
  let toast = document.querySelector('[data-toast]');
  if (!toast) { toast = document.createElement('div'); toast.dataset.toast = 'true'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); document.body.appendChild(toast); }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

function initNavigation() {
  const toggle = document.querySelector('.dashboard-nav-toggle');
  const sidebar = document.querySelector('#resident-sidebar, #staff-sidebar');
  const close = document.querySelector('.dashboard-sidebar-close');
  const overlay = document.querySelector('.dashboard-menu-overlay');

  if (!toggle || !sidebar || !close || !overlay) return;

  const isStaff = getAuth()?.role === 'staff';
  const isResidentMenu = !isStaff && sidebar.id === 'resident-sidebar';
  if (isResidentMenu) document.body.classList.add('resident-menu-layout');
  const residentDocked = () => isResidentMenu && window.matchMedia('(min-width: 761px)').matches;
  sidebar.querySelectorAll('.dashboard-sidebar-nav a').forEach((link) => {
    const isLogout = link.textContent.trim().toLowerCase() === 'logout';
    const targetPath = new URL(link.href, window.location.href).pathname.replace(/\/$/, '').toLowerCase();
    const currentPath = window.location.pathname.replace(/\/$/, '').toLowerCase();
    link.classList.toggle('active', !isLogout && targetPath === currentPath);
  });

  const closeMenu = (restoreFocus = true) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');

    sidebar.setAttribute('aria-hidden', 'true');
    sidebar.classList.remove('is-open');

    if (residentDocked()) document.body.classList.add('resident-sidebar-collapsed');

    overlay.classList.remove('is-open');
    window.setTimeout(() => {
      if (!overlay.classList.contains('is-open')) overlay.hidden = true;
    }, 280);

    document.body.classList.remove('menu-open');

    if (isStaff) {
      document.body.classList.add('staff-sidebar-collapsed');
      toggle.hidden = false;
    }

    if (residentDocked()) {
      overlay.hidden = true;
      document.body.classList.remove('menu-open');
    }

    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');

    sidebar.setAttribute('aria-hidden', 'false');
    sidebar.classList.add('is-open');

    if (residentDocked()) document.body.classList.remove('resident-sidebar-collapsed');

    if (isStaff) {
      document.body.classList.remove('staff-sidebar-collapsed');

      // Hide hamburger while staff sidebar is open
      toggle.hidden = true;

      // Staff sidebar behaves like a fixed pane,
      // so don't darken the whole page.
      overlay.hidden = true;
      overlay.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    } else if (residentDocked()) {
      toggle.hidden = false;
      overlay.hidden = true;
      overlay.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    } else {
      overlay.hidden = false;
      window.requestAnimationFrame(() => overlay.classList.add('is-open'));
      document.body.classList.add('menu-open');
    }
  };

  if (residentDocked()) {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Hide navigation menu');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('resident-sidebar-collapsed');
    overlay.hidden = true;
  }

  toggle.addEventListener('click', () => {
    if (toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    } else {
      openMenu();
    }
  });

  close.addEventListener('click', () => closeMenu());

  overlay.addEventListener('click', () => {
    if (!isStaff) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      closeMenu();
    }
  });

  const currentPage =
    window.location.pathname.split('/').pop() || 'index.html';

  const activePage =
    currentPage === 'request.html'
      ? 'services.html'
      : currentPage;

  let assigned = false;

  sidebar.querySelectorAll('a[href]').forEach((link) => {
    const active =
      link.getAttribute('href') === activePage && !assigned;

    link.classList.toggle('active', active);

    if (active) {
      link.setAttribute('aria-current', 'page');
      assigned = true;
    } else {
      link.removeAttribute('aria-current');
    }
  });

  // Staff sidebar starts OPEN automatically.
  if (isStaff) {
    document.body.classList.add('staff-mode');
    openMenu();
  }
}

function enforceAuthentication() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const publicPages = ['index.html', 'login.html', 'register.html'];
  const staffPages = ['staff-dashboard.html', 'staff-request.html'];
  const protectedPage = !publicPages.includes(page);
  const auth = getAuth();
  if (protectedPage && !auth) { window.location.replace('login.html'); return false; }
  if (staffPages.includes(page) && auth?.role !== 'staff') { window.location.replace(auth?.role === 'resident' ? 'dashboard.html' : 'login.html'); return false; }
  if (auth?.role === 'staff' && ['dashboard.html', 'services.html', 'request.html', 'tracking.html', 'history.html', 'profile.html'].includes(page)) { window.location.replace('staff-dashboard.html'); return false; }
  return true;
}

function initLogout() {
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link || link.textContent.trim() !== 'Logout' || !link.closest('.nav-actions, .dashboard-sidebar-nav')) return;
    event.preventDefault();
    clearAuth();
    window.location.href = window.location.pathname.toLowerCase().includes('/pages/') ? '../index.html' : 'index.html';
  });
}

function initPublicNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page !== 'index.html') return;
  const auth = getAuth();
  const navActions = document.querySelector('.nav-actions');
  if (navActions) {
    navActions.innerHTML = auth
      ? '<a href="pages/profile.html" class="btn btn-ghost">Profile</a><a href="pages/login.html" class="btn btn-primary">Logout</a>'
      : '<a href="pages/register.html" class="btn btn-ghost">Sign Up</a><a href="pages/login.html" class="btn btn-primary">Log In</a>';
  }
  const accountLabel = Array.from(document.querySelectorAll('.dashboard-sidebar-nav .nav-section')).find((el) => el.textContent.trim() === 'Account');
  if (accountLabel) {
    let sibling = accountLabel.nextElementSibling;
    while (sibling && sibling.tagName === 'A') { const next = sibling.nextElementSibling; sibling.remove(); sibling = next; }
    accountLabel.insertAdjacentHTML('afterend', auth
      ? '<a href="pages/profile.html">Profile</a><a href="pages/login.html">Logout</a>'
      : '<a href="pages/register.html">Sign Up</a><a href="pages/login.html">Log In</a>');
  }
}

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
function validateRequest(form, step) {
  const fields = step === 0 ? [form.querySelector('#document-type')] : step === 2 ? Array.from(form.querySelectorAll('.step-panel.active input[required]')) : [];
  let valid = true;
  fields.forEach((field) => { clearFieldError(field); if (!field.value.trim()) { setFieldError(field, field.id === 'document-type' ? 'Please select a document.' : `Please enter your ${field.name === 'fullName' ? 'full name' : field.name === 'contactNumber' ? 'contact number' : field.name}.`); if (valid) field.focus(); valid = false; } });
  if (step === 2) { const email = form.querySelector('#req-email'); const contact = form.querySelector('#req-contact-number'); if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setFieldError(email, 'Please enter a valid email address.'); valid = false; } if (contact.value && !/^[0-9+()\-\s]{7,20}$/.test(contact.value)) { setFieldError(contact, 'Please enter a valid contact number.'); valid = false; } const purpose = form.querySelector('#request-purpose'); const other = form.querySelector('#request-purpose-other'); clearFieldError(purpose); if (!purpose.value) { setFieldError(purpose, 'Please select the purpose of your request.'); valid = false; } if (purpose.value === 'Other') { clearFieldError(other); if (!other.value.trim()) { setFieldError(other, 'Please specify the purpose of your request.'); if (valid) other.focus(); valid = false; } } }
  return valid;
}

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
  form.addEventListener('submit', (event) => { event.preventDefault(); if (!validateRequest(form, 2)) { current = 2; updateUI(); return; } const profileData = { name: form.querySelector('#req-full-name').value.trim(), address: form.querySelector('#req-address').value.trim(), contact: form.querySelector('#req-contact-number').value.trim(), email: form.querySelector('#req-email').value.trim() }; const sequence = Number(localStorage.getItem(STORAGE_KEYS.sequence) || 124) + 1; localStorage.setItem(STORAGE_KEYS.sequence, String(sequence)); const reference = `BL-${new Date().getFullYear()}-${String(sequence).padStart(5, '0')}`; const request = { reference, ...profileData, document: select.value, purpose: getPurposeValue(), submittedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'pending', rejectionReason: '' }; saveRequests([request, ...getRequests()]); saveProfile(profileData); form.querySelector('[data-submission-reference]').textContent = reference; form.querySelector('[data-submission-track]').href = `tracking.html?reference=${encodeURIComponent(reference)}`; form.querySelector('[data-submission-success]').classList.remove('hidden'); form.querySelectorAll('.step-actions, .step-panel').forEach((element) => element.classList.add('hidden')); showToast('Request submitted successfully'); });
  updatePurposeOther();
  updateUI();
}

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
function renderDashboard() {
  const container = document.querySelector('[data-dashboard-requests]');
  if (!container) return;
  const requests = getRequests();
  const stats = { total: requests.length, pending: 0, review: 0, approved: 0, ready: 0, released: 0 };
  requests.forEach((request) => { if (stats[request.status] !== undefined) stats[request.status] += 1; });
  Object.keys(stats).forEach((key) => {
    const element = document.querySelector(`[data-stat="${key}"]`);
    if (element) element.textContent = stats[key];
  });
  const activeRequests = requests.filter((request) => !['released', 'rejected'].includes(request.status));
  container.innerHTML = activeRequests.slice(0, 5).map((request) => `<tr data-status="${escapeHtml(request.status)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td><a class="action-link" href="tracking.html?reference=${encodeURIComponent(request.reference)}">Track Request</a></td></tr>`).join('');
  const empty = document.querySelector('[data-dashboard-empty]');
  if (empty) empty.classList.toggle('hidden', activeRequests.length > 0);
}

function renderHistory() { const body = document.querySelector('[data-history-rows]'); if (!body) return; const requests = getRequests(); body.innerHTML = requests.map((request) => `<tr data-status="${escapeHtml(request.status)}" data-document="${escapeHtml(request.document)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td>${escapeHtml(formatDate(request.updatedAt))}</td><td><a href="tracking.html?reference=${encodeURIComponent(request.reference)}" class="action-link">Track Request</a></td></tr>`).join(''); const empty = document.querySelector('[data-history-empty]'); if (empty) empty.classList.toggle('hidden', requests.length > 0); const search = document.querySelector('#request-search'); const status = document.querySelector('#statusFilter'); const documentFilter = document.querySelector('#documentFilter'); const filter = () => body.querySelectorAll('tr').forEach((row) => { const query = search ? search.value.toLowerCase() : ''; row.hidden = !(`${row.textContent}`.toLowerCase().includes(query) && (!status || status.value === 'all' || row.dataset.status === status.value) && (!documentFilter || documentFilter.value === 'all' || row.dataset.document === documentFilter.value)); }); [search, status, documentFilter].filter(Boolean).forEach((field) => field.addEventListener('input', filter)); filter(); }

function renderTracking() { const form = document.querySelector('.track-form'); if (!form) return; const input = form.querySelector('input'); const result = document.querySelector('[data-track-result]'); const empty = document.querySelector('[data-track-empty]'); const show = (reference) => { const request = getRequests().find((item) => item.reference.toLowerCase() === reference.trim().toLowerCase()); if (!request) { result.classList.add('hidden'); empty.classList.remove('hidden'); showToast('Request not found. Check your reference number.', 'error'); return; } empty.classList.add('hidden'); result.classList.remove('hidden'); document.querySelector('[data-track-reference]').textContent = request.reference; document.querySelector('[data-track-document]').textContent = request.document; document.querySelector('[data-track-applicant]').textContent = request.name; document.querySelector('[data-track-date]').textContent = formatDate(request.submittedAt); document.querySelector('[data-track-status]').textContent = STATUS_LABELS[request.status] || request.status; const timeline = document.querySelector('[data-track-timeline]'); const currentIndex = request.status === 'rejected' ? -1 : STATUS_ORDER.indexOf(request.status); timeline.innerHTML = ['Submitted', 'Received', 'Under Review', 'Approved', 'Ready for Release', 'Released'].map((label, index) => `<div class="timeline-item ${index <= currentIndex + 1 ? 'done' : ''} ${index === currentIndex + 1 ? 'active' : ''}"><span class="timeline-dot" aria-hidden="true"></span><div><strong>${label}</strong></div></div>`).join(''); result.scrollIntoView({ behavior: 'smooth', block: 'start' }); }; form.addEventListener('submit', (event) => { event.preventDefault(); if (!input.value.trim()) { input.setAttribute('aria-invalid', 'true'); showToast('Enter a request reference number.', 'error'); return; } show(input.value); }); const queryReference = new URLSearchParams(window.location.search).get('reference'); if (queryReference) { input.value = queryReference; show(queryReference); } }

function renderStaffDashboard() { const body = document.querySelector('[data-staff-rows]'); if (!body) return; const requests = getRequests(); const counts = { total: requests.length, pending: 0, review: 0, approved: 0, rejected: 0, ready: 0 }; requests.forEach((request) => { if (counts[request.status] !== undefined) counts[request.status] += 1; }); Object.keys(counts).forEach((key) => { const element = document.querySelector(`[data-staff-stat="${key}"]`); if (element) element.textContent = counts[key]; }); body.innerHTML = requests.map((request) => `<tr data-status="${escapeHtml(request.status)}" data-document="${escapeHtml(request.document)}"><td>${escapeHtml(request.reference)}</td><td>${escapeHtml(request.name)}</td><td>${escapeHtml(request.document)}</td><td>${escapeHtml(formatDate(request.submittedAt))}</td><td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(STATUS_LABELS[request.status] || request.status)}</span></td><td><a href="staff-request.html?reference=${encodeURIComponent(request.reference)}" class="action-link">Review</a></td></tr>`).join(''); const empty = document.querySelector('[data-staff-empty]'); if (empty) empty.classList.toggle('hidden', requests.length > 0); const search = document.querySelector('#staff-search'); const status = document.querySelector('#staff-status-filter'); const documentFilter = document.querySelector('#staff-doc-filter'); const filter = () => body.querySelectorAll('tr').forEach((row) => { const query = search ? search.value.toLowerCase() : ''; row.hidden = !(`${row.textContent}`.toLowerCase().includes(query) && (!status || status.value === 'all' || row.dataset.status === status.value) && (!documentFilter || documentFilter.value === 'all' || row.dataset.document === documentFilter.value)); }); [search, status, documentFilter].filter(Boolean).forEach((field) => field.addEventListener('input', filter)); filter(); }

function initStaffRequest() {
  const actions = document.querySelectorAll('[data-status-action]');
  if (!actions.length) return;
  const searchInput = document.querySelector('#review-search');
  const listBody = document.querySelector('[data-review-rows]');
  const listEmpty = document.querySelector('[data-review-empty]');
  const rejectionField = document.querySelector('[data-rejection-field]');
  const rejectionReason = document.querySelector('#rejection-reason');
  const rejectionError = document.querySelector('[data-rejection-error]');
  let reference = new URLSearchParams(window.location.search).get('reference') || getRequests()[0]?.reference;
  let request = null;
  const display = (key, value) => { const element = document.querySelector(`[data-staff-detail="${key}"]`); if (element) element.textContent = value || '-'; };

  const renderList = () => {
    if (!listBody) return;
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const matches = getRequests().filter((item) => !query || [item.reference, item.name, item.document, item.status, STATUS_LABELS[item.status], formatDate(item.submittedAt)].join(' ').toLowerCase().includes(query));
    listBody.innerHTML = matches.map((item) => `<tr class="${item.reference === reference ? 'is-selected' : ''}"><td>${escapeHtml(item.reference)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.document)}</td><td>${escapeHtml(formatDate(item.submittedAt))}</td><td><span class="status-badge ${statusClass(item.status)}">${escapeHtml(STATUS_LABELS[item.status] || item.status)}</span></td><td><button type="button" class="action-link" data-review-select="${escapeHtml(item.reference)}">Review</button></td></tr>`).join('');
    if (listEmpty) listEmpty.classList.toggle('hidden', matches.length > 0);
  };

  const load = () => {
    request = getRequests().find((item) => item.reference === reference) || null;
    if (!request) return;
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
    load();
    renderList();
    try { window.history.replaceState(null, '', `?reference=${encodeURIComponent(reference)}`); } catch (error) {}
    document.querySelector('.request-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  actions.forEach((button) => button.addEventListener('click', () => {
    if (!request) { showToast('No request selected.', 'error'); return; }
    const status = button.dataset.statusAction;
    if (status === 'rejected') {
      rejectionField.classList.remove('hidden');
      if (!rejectionReason.value.trim()) { rejectionError.textContent = 'Please provide a reason for rejecting this request.'; rejectionReason.focus(); return; }
    }
    if (status === 'rejected') {
      if (!window.confirm('Are you sure you want to reject this request?')) return;
    } else if (!window.confirm(`Update this request to ${STATUS_LABELS[status]}?`)) return;
    const requests = getRequests();
    const target = requests.find((item) => item.reference === request.reference);
    target.status = status;
    target.updatedAt = new Date().toISOString();
    target.rejectionReason = status === 'rejected' ? rejectionReason.value.trim() : '';
    saveRequests(requests);
    load();
    showToast(status === 'rejected' ? 'Request rejected.' : 'Request status updated.');
  }));

  window.addEventListener('barangaylink:data', renderList);
  load();
  renderList();
}

function saveNewConcern(form) {
  const data = Object.fromEntries(new FormData(form));
  const auth = getAuth();
  const list = getConcerns();
  const concern = {
    id: nextConcernId(list),
    type: data.concernType,
    title: data.concernType,
    location: (data.location || '').trim(),
    description: (data.description || '').trim(),
    urgency: data.urgency,
    reporter: (data.fullName || '').trim(),
    contact: (data.contactNumber || '').trim(),
    address: (data.address || '').trim(),
    anonymous: form.querySelector('[name="anonymous"]')?.checked === true,
    submittedBy: auth?.email || '',
    reportedAt: new Date().toISOString(),
    status: 'submitted'
  };
  saveConcerns([concern, ...list]);
}

function renderStaffDashboardConcerns() {
  const body = document.querySelector('[data-dash-concern-rows]');
  if (!body) return;
  const concerns = getConcerns();
  const counts = { total: concerns.length, submitted: 0, progress: 0, resolved: 0 };
  concerns.forEach((item) => { if (counts[item.status] !== undefined) counts[item.status] += 1; });
  Object.keys(counts).forEach((key) => {
    const element = document.querySelector(`[data-concern-stat="${key}"]`);
    if (element) element.textContent = counts[key];
  });
  const urgencyClass = { High: 'status-rejected', Medium: 'status-pending', Low: 'status-approved' };
  body.innerHTML = concerns.map((item) => {
    const status = CONCERN_STATUS[item.status] || CONCERN_STATUS.submitted;
    return `<tr data-status="${escapeHtml(item.status)}"><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.title || item.type)}</strong><br /><small>${escapeHtml(item.location)}</small></td><td>${item.anonymous ? 'Anonymous' : escapeHtml(item.reporter)}</td><td><span class="urgency-badge ${urgencyClass[item.urgency] || 'status-review'}">${escapeHtml(item.urgency || '-')}</span></td><td>${escapeHtml(formatDate(item.reportedAt))}</td><td><span class="status-badge ${status.badge}">${status.label}</span></td><td><a href="concerns.html" class="action-link">Review</a></td></tr>`;
  }).join('');
  const search = document.querySelector('#dash-concern-search');
  const statusFilter = document.querySelector('#dash-concern-status');
  const filter = () => {
    const query = (search?.value || '').trim().toLowerCase();
    const wanted = statusFilter?.value || 'all';
    let visible = 0;
    body.querySelectorAll('tr').forEach((row) => {
      const show = row.textContent.toLowerCase().includes(query) && (wanted === 'all' || row.dataset.status === wanted);
      row.hidden = !show;
      if (show) visible += 1;
    });
    document.querySelector('[data-dash-concern-empty]')?.classList.toggle('hidden', visible > 0);
  };
  if (!body.dataset.bound) {
    body.dataset.bound = 'true';
    [search, statusFilter].filter(Boolean).forEach((field) => field.addEventListener('input', filter));
  }
  filter();
}

function renderResidentConcerns() {
  const box = document.querySelector('[data-my-concerns]');
  if (!box) return;
  const auth = getAuth();
  const mine = getConcerns().filter((item) => item.submittedBy === auth?.email);
  box.innerHTML = mine.length ? mine.map((item) => {
    const status = CONCERN_STATUS[item.status] || CONCERN_STATUS.submitted;
    return `<article class="request-item"><div class="request-top"><div><h3>${escapeHtml(item.title || item.type)}</h3><p>Concern ID: ${escapeHtml(item.id)} &middot; ${escapeHtml(item.location)}</p></div><span class="status-badge ${status.badge}">${status.label}</span></div><div class="request-meta"><p>Date Reported: ${escapeHtml(formatDate(item.reportedAt))}</p><p>Status: ${status.label}</p></div></article>`;
  }).join('') : '<p>You have not reported any concerns yet.</p>';
}

function applyConcernFilter() {
  const body = document.querySelector('[data-staff-concern-rows]');
  if (!body) return;
  const query = (document.querySelector('#concern-search')?.value || '').trim().toLowerCase();
  const status = document.querySelector('#concern-status-filter')?.value || 'all';
  let visible = 0;
  body.querySelectorAll('tr').forEach((row) => {
    const show = row.textContent.toLowerCase().includes(query) && (status === 'all' || row.dataset.status === status);
    row.hidden = !show;
    if (show) visible += 1;
  });
  document.querySelector('[data-staff-concern-empty]')?.classList.toggle('hidden', visible > 0);
}

function renderStaffConcerns() {
  const body = document.querySelector('[data-staff-concern-rows]');
  if (!body) return;
  const options = (current) => Object.entries(CONCERN_STATUS).map(([value, meta]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${meta.label}</option>`).join('');
  body.innerHTML = getConcerns().map((item) => `<tr data-status="${escapeHtml(item.status)}"><td>${escapeHtml(item.id)}</td><td><strong>${escapeHtml(item.title || item.type)}</strong><br /><small>${escapeHtml(item.description)}</small></td><td>${escapeHtml(item.location)}</td><td>${item.anonymous ? 'Anonymous' : escapeHtml(item.reporter)}</td><td>${escapeHtml(item.urgency)}</td><td>${escapeHtml(formatDate(item.reportedAt))}</td><td><select class="concern-status-select" data-concern-id="${escapeHtml(item.id)}" aria-label="Update status for ${escapeHtml(item.id)}">${options(item.status)}</select></td></tr>`).join('');
  if (!body.dataset.bound) {
    body.dataset.bound = 'true';
    ['#concern-search', '#concern-status-filter'].forEach((selector) => document.querySelector(selector)?.addEventListener('input', applyConcernFilter));
    body.addEventListener('change', (event) => {
      const select = event.target.closest('[data-concern-id]');
      if (!select) return;
      const list = getConcerns();
      const target = list.find((item) => item.id === select.dataset.concernId);
      if (!target) return;
      target.status = select.value;
      target.updatedAt = new Date().toISOString();
      saveConcerns(list);
      showToast('Concern status updated.');
    });
  }
  applyConcernFilter();
}

// Staff can open the shared community pages (concerns, barangay info, emergency).
// Give them the staff sidebar and hide resident-only content instead of redirecting.
function initStaffSharedPages() {
  const auth = getAuth();
  if (auth?.role !== 'staff') return;
  document.querySelectorAll('[data-resident-only]').forEach((element) => element.classList.add('hidden'));
  document.querySelectorAll('[data-staff-only]').forEach((element) => element.classList.remove('hidden'));
  const sidebar = document.querySelector('#resident-sidebar');
  if (!sidebar) return;
  sidebar.id = 'staff-sidebar';
  sidebar.classList.add('staff-sidebar');
  sidebar.setAttribute('aria-label', 'Staff navigation');
  const nav = sidebar.querySelector('.dashboard-sidebar-nav');
  if (nav) { nav.setAttribute('aria-label', 'Staff navigation'); nav.innerHTML = STAFF_NAV_HTML; }
  const title = sidebar.querySelector('.dashboard-sidebar-header h2');
  if (title) title.textContent = 'BarangayLink';
  document.querySelector('.dashboard-nav-toggle')?.setAttribute('aria-controls', 'staff-sidebar');
  document.querySelector('.site-header')?.classList.add('staff-header');
  const actions = document.querySelector('.nav-actions');
  if (actions) actions.innerHTML = '<a href="login.html" class="btn btn-primary">Logout</a>';
}

function initProfile() { const form = document.querySelector('[data-profile-form]'); if (!form) return; const load = () => { const profile = getProfile(); Object.entries(profile).forEach(([key, value]) => { const input = form.elements[key]; if (input) input.value = value; const display = document.querySelector(`[data-profile-display="${key}"]`); if (display) display.textContent = value; }); document.querySelectorAll('[data-profile-name]').forEach((element) => element.textContent = profile.name); }; form.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); let valid = true; Object.entries(data).forEach(([key, value]) => { const field = form.elements[key]; clearFieldError(field); if (!String(value).trim()) { setFieldError(field, 'This field is required.'); valid = false; } }); if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setFieldError(form.elements.email, 'Please enter a valid email address.'); valid = false; } if (!valid) return; saveProfile(data); load(); document.querySelector('.modal')?.classList.remove('show'); showToast('Profile updated.'); }); load(); }

function initAuth() {
  document.querySelectorAll('.auth-form').forEach((form) => form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((field) => { clearFieldError(field); if (!field.value.trim()) { setFieldError(field, 'This field is required.'); valid = false; } });
    const email = form.querySelector('input[type="email"]');
    if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { setFieldError(email, 'Please enter a valid email address.'); valid = false; }
    const password = form.querySelector('input[name="password"]');
    const confirm = form.querySelector('input[name="confirmPassword"]');
    if (confirm && password.value !== confirm.value) { setFieldError(confirm, 'Passwords do not match.'); valid = false; }
    if (!valid) return;
    if (form.querySelector('#login-email')) {
      const account = DEMO_ACCOUNTS.find((item) => item.email === email.value.trim().toLowerCase() && item.password === password.value);
      if (!account) { setFieldError(password, 'Incorrect demo email or password.'); showToast('Incorrect email or password.', 'error'); return; }
      setAuth(account);
      window.location.href = account.role === 'staff' ? 'staff-dashboard.html' : 'dashboard.html';
      return;
    }
    showToast('Account form completed for this prototype.');
  }));
}
function initBarangayInfo() {
  const form = document.querySelector('#barangay-edit-form');
  const modal = document.querySelector('#barangay-edit-modal');
  const editButton = document.querySelector('[data-open-barangay-edit]');

  if (!form || !modal) return;

  const render = () => {
    const info = getBarangayInfo();

    document.querySelectorAll('[data-barangay-display]').forEach((element) => {
      const key = element.dataset.barangayDisplay;

      if (info[key] !== undefined) {
        element.textContent = info[key];
      }
    });
  };

  const openModal = () => {
    const auth = getAuth();

    if (auth?.role !== 'staff') return;

    const info = getBarangayInfo();

    Object.entries(info).forEach(([key, value]) => {
      const field = form.elements[key];

      if (field) {
        field.value = value;
      }
    });

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  };

  if (editButton) {
    editButton.addEventListener('click', openModal);
  }

  document.querySelectorAll('[data-close-barangay-edit]').forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const auth = getAuth();

    if (auth?.role !== 'staff') return;

    const data = Object.fromEntries(new FormData(form));

    saveBarangayInfo(data);
    render();
    closeModal();

    showToast('Barangay information updated.');
  });

  render();
}
function initPhoneFormatting() {
  const trunkline = document.querySelector('#barangay-trunkline');
  const hotline = document.querySelector('#barangay-hotline');

  if (trunkline) {
    trunkline.addEventListener('input', () => {
      let digits = trunkline.value.replace(/\D/g, '').slice(0, 9);

      if (digits.length <= 2) {
        trunkline.value = digits ? `(${digits}` : '';
      } else if (digits.length <= 5) {
        trunkline.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else {
        trunkline.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 5)}-${digits.slice(5)}`;
      }
    });
  }

  if (hotline) {
    hotline.addEventListener('input', () => {
      let digits = hotline.value.replace(/\D/g, '').slice(0, 11);

      if (digits.length <= 4) {
        hotline.value = digits;
      } else if (digits.length <= 7) {
        hotline.value = `${digits.slice(0, 4)}-${digits.slice(4)}`;
      } else {
        hotline.value = `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
      }
    });
  }
}
document.addEventListener('DOMContentLoaded', () => {
  if (!enforceAuthentication()) return;
  initStaffSharedPages(); initLogout(); initPublicNav(); initNavigation(); initServices(); initRequest(); initAdditionalRequestForms(); renderDashboard(); renderHistory(); renderTracking(); renderStaffDashboard(); renderStaffDashboardConcerns(); renderResidentConcerns(); renderStaffConcerns(); initStaffRequest(); initProfile(); initBarangayInfo(); initPhoneFormatting(); initAuth();
  document.querySelectorAll('.toggle-password').forEach((button) => button.addEventListener('click', () => { const input = button.parentElement.querySelector('input'); const visible = input.type === 'password'; input.type = visible ? 'text' : 'password'; button.textContent = visible ? 'Hide' : 'Show'; button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password'); }));
  const modal = document.querySelector('.modal'); const trigger = document.querySelector('[data-open-modal]'); const close = document.querySelector('[data-close-modal]'); if (trigger && modal) trigger.addEventListener('click', () => modal.classList.add('show')); if (close && modal) close.addEventListener('click', () => modal.classList.remove('show')); if (modal) { modal.addEventListener('click', (event) => { if (event.target === modal) modal.classList.remove('show'); }); document.addEventListener('keydown', (event) => { if (event.key === 'Escape') modal.classList.remove('show'); }); }
  window.addEventListener('barangaylink:data', () => { renderDashboard(); renderHistory(); renderTracking(); renderStaffDashboard(); renderStaffDashboardConcerns(); renderResidentConcerns(); renderStaffConcerns(); });
});
