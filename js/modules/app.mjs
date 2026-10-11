import { enforceAuthentication, initLogout, initNavigation, initPublicNav } from './navigation.mjs';
import { initAdditionalRequestForms, initRequest, initServices, renderDashboard, renderHistory, renderTracking } from './resident.mjs';
import { initStaffRequest, renderStaffDashboard } from './staff.mjs';
import { renderResidentConcerns, renderStaffConcerns, renderStaffDashboardConcerns, initStaffSharedPages } from './community.mjs';
import { initAuth, initBarangayInfo, initPhoneFormatting, initProfile } from './account.mjs';

function initializeApplication() {
  if (!enforceAuthentication()) return;

  initStaffSharedPages();
  initLogout();
  initPublicNav();
  initNavigation();
  initServices();
  initRequest();
  initAdditionalRequestForms();
  renderDashboard();
  renderHistory();
  renderTracking();
  renderStaffDashboard();
  renderStaffDashboardConcerns();
  renderResidentConcerns();
  renderStaffConcerns();
  initStaffRequest();
  initProfile();
  initBarangayInfo();
  initPhoneFormatting();
  initAuth();

  document.querySelectorAll('.toggle-password').forEach((button) => button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Hide' : 'Show';
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
  }));

  const modal = document.querySelector('.modal');
  const trigger = document.querySelector('[data-open-modal]');
  const close = document.querySelector('[data-close-modal]');
  if (trigger && modal) trigger.addEventListener('click', () => modal.classList.add('show'));
  if (close && modal) close.addEventListener('click', () => modal.classList.remove('show'));
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.classList.remove('show');
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') modal.classList.remove('show');
    });
  }

  window.addEventListener('barangaylink:data', () => {
    renderStaffDashboardConcerns();
    renderResidentConcerns();
    renderStaffConcerns();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}