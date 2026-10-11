import * as Data from './data.mjs';
const { STAFF_NAV_HTML, CONCERN_STATUS, getAuth, getConcerns, saveConcerns, nextConcernId, escapeHtml, formatDate, showToast } = Data;
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
  document.querySelector('.dashboard-nav-toggle, .dashboard-sidebar-reopen')?.setAttribute('aria-controls', 'staff-sidebar');
  document.querySelector('.site-header')?.classList.add('staff-header');
  const actions = document.querySelector('.nav-actions');
  if (actions) actions.innerHTML = '<a href="login.html" class="btn btn-primary">Logout</a>';
}

/** Loads and validates the shared resident profile form; profile fields also prefill document requests. */

export { saveNewConcern, renderStaffDashboardConcerns, renderResidentConcerns, applyConcernFilter, renderStaffConcerns, initStaffSharedPages };
