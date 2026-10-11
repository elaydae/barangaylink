/*
 * Shared prototype catalog used by the landing page, service browser, and
 * request form. Request records save the selected service name, so keep names
 * stable or update the readers of stored requests when renaming a service.
 */
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

/*
 * Browser storage used by this prototype:
 * barangaylink.profile stores resident contact/profile fields.
 * barangaylink.auth stores the demo user's email, role, and name.
 * barangaylink.concerns stores community concern records.
 * barangaylink.barangayInfo stores editable barangay details.
 *
 * Request records are owned by the Express API and are never cached in localStorage.
 * Other prototype data remains browser-local; client-side roles are not access control.
 */
const STORAGE_KEYS = {
  profile: 'barangaylink.profile',
  auth: 'barangaylink.auth',
  concerns: 'barangaylink.concerns',
  barangayInfo: 'barangaylink.barangayInfo'
};
// Credentials are for the frontend demonstration only; production login belongs on the backend.
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

/** Safely reads prototype data, using a caller-provided default for missing or invalid JSON. */
function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value === null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

/** Shared persistence boundary so localStorage write failures are reported consistently. */
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { showToast('Your browser could not save this change.', 'error'); }
}

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
/* This frontend demo role controls page presentation/redirects; it does not secure data. */
function getAuth() { const auth = readStorage(STORAGE_KEYS.auth, null); return auth && (auth.role === 'resident' || auth.role === 'staff') ? auth : null; }
function setAuth(account) { writeStorage(STORAGE_KEYS.auth, { email: account.email, role: account.role, name: account.name }); }
function clearAuth() { try { localStorage.removeItem(STORAGE_KEYS.auth); } catch (error) {} }
/* Concern records contain id, type, title, location, description, urgency, reporter, anonymous,
 * submittedBy, reportedAt, status, plus optional contact/address fields on resident submissions.
 * Resident and staff views share these names, so update both renderers when changing the shape. */
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

/** Shared accessible notification used by validation, persistence, and status workflows. */
function showToast(message, type = 'success') {
  let toast = document.querySelector('[data-toast]');
  if (!toast) { toast = document.createElement('div'); toast.dataset.toast = 'true'; toast.setAttribute('role', 'status'); toast.setAttribute('aria-live', 'polite'); document.body.appendChild(toast); }
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove('show'), 3600);
}

/**
 * Initializes the sidebar shared by resident and staff pages. Keep its HTML IDs/classes
 * and role-specific navigation setup in sync when changing either menu.
 */

export { serviceCatalog, STORAGE_KEYS, DEMO_ACCOUNTS, STATUS_LABELS, STATUS_ORDER, defaultProfile, defaultBarangayInfo, STAFF_NAV_HTML, CONCERN_STATUS, SAMPLE_CONCERNS, readStorage, writeStorage, getProfile, saveProfile, getBarangayInfo, saveBarangayInfo, getAuth, setAuth, clearAuth, getConcerns, saveConcerns, nextConcernId, escapeHtml, formatDate, getService, showToast };
