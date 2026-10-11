import { clearAuth, getAuth } from './data.mjs';

function initNavigation() {
  const toggle = document.querySelector('.dashboard-nav-toggle, .dashboard-sidebar-reopen');
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

      // Keep the menu reopen control hidden while the staff sidebar is open.
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

/**
 * Demo-only route guard based on the role saved in localStorage. Residents use
 * dashboard/services/request/tracking/history/profile and community pages;
 * staff use the staff dashboard/request review and shared concerns/info pages.
 * Redirects improve navigation, but real authorization and record protection
 * must be enforced by an API.
 */
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

/** Removes the demo session and returns the user to the public landing page. */
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

/** Renders catalog-backed service cards and binds the category/search controls. */

export { initNavigation, enforceAuthentication, initLogout, initPublicNav };
