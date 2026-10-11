import * as Data from './data.mjs';
import { setFieldError, clearFieldError } from './resident.mjs';
const { DEMO_ACCOUNTS, getProfile, saveProfile, getBarangayInfo, saveBarangayInfo, getAuth, setAuth, showToast } = Data;

function initProfile() { const form = document.querySelector('[data-profile-form]'); if (!form) return; const load = () => { const profile = getProfile(); Object.entries(profile).forEach(([key, value]) => { const input = form.elements[key]; if (input) input.value = value; const display = document.querySelector(`[data-profile-display="${key}"]`); if (display) display.textContent = value; }); document.querySelectorAll('[data-profile-name]').forEach((element) => element.textContent = profile.name); }; form.addEventListener('submit', (event) => { event.preventDefault(); const data = Object.fromEntries(new FormData(form)); let valid = true; Object.entries(data).forEach(([key, value]) => { const field = form.elements[key]; clearFieldError(field); if (!String(value).trim()) { setFieldError(field, 'This field is required.'); valid = false; } }); if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { setFieldError(form.elements.email, 'Please enter a valid email address.'); valid = false; } if (!valid) return; saveProfile(data); load(); document.querySelector('.modal')?.classList.remove('show'); showToast('Profile updated.'); }); load(); }

/** Handles demo registration/login forms; credentials and role assignment are frontend-only. */
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
/** Renders editable barangay details; staff changes persist locally and are visible in resident views. */
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
/** Keeps phone inputs in the expected display format without changing their stored field names. */
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

export { initProfile, initAuth, initBarangayInfo, initPhoneFormatting };
