const serviceCatalog = [
  { name: 'Barangay Clearance', category: 'Certificates & Clearances', icon: '📄', description: 'Request a barangay clearance for applicable personal, employment, business, or other purposes.', requirements: ['Valid identification', 'Complete resident information', 'Purpose of request'], who: 'Residents of the barangay and authorized representatives.', information: 'Purpose, current address, and contact details.', processing: '2 to 3 working days', core: true },
  { name: 'Certificate of Residency', category: 'Certificates & Clearances', icon: '🏠', description: 'Confirm your current address and residency status within the barangay.', requirements: ['Valid government ID', 'Current address details', 'Purpose of request'], who: 'Residents who need proof of their barangay address.', information: 'Length of residency and current address.', processing: '2 to 3 working days', core: true },
  { name: 'Certificate of Indigency', category: 'Certificates & Clearances', icon: '🤝', description: 'Request certification commonly used for support programs, scholarships, and financial assistance.', requirements: ['Valid ID', 'Complete household information', 'Supporting income document, if applicable'], who: 'Residents requesting assistance or program support.', information: 'Household details and reason for assistance.', processing: '3 to 5 working days', core: true },
  { name: 'Certificate of Good Moral Character', category: 'Certificates & Clearances', icon: '⭐', description: 'Obtain a certification of good standing for school, employment, or other official purposes.', requirements: ['Valid government ID', 'Complete resident information', 'Purpose of request'], who: 'Residents with a verifiable barangay record.', information: 'Purpose and requesting organization.', processing: '3 to 5 working days' },
  { name: 'Certificate of No Pending Case', category: 'Certificates & Clearances', icon: '🛡️', description: 'Request certification that confirms your barangay case status for an official transaction.', requirements: ['Valid government ID', 'Complete resident information', 'Purpose of request'], who: 'Residents requesting status certification.', information: 'Purpose and organization requiring the document.', processing: '3 to 5 working days' },
  { name: 'General Barangay Certification', category: 'Certificates & Clearances', icon: '📜', description: 'Request a general certification for a purpose not covered by another document type.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed purpose statement'], who: 'Residents with a valid barangay certification request.', information: 'Specific certification wording or purpose.', processing: '3 to 5 working days' },
  { name: 'Barangay Business Clearance', category: 'Business & Permits', icon: '🏪', description: 'Request barangay clearance for a business operating or applying to operate in the community.', requirements: ['Owner valid ID', 'Business name and address', 'Proof of business registration, if available'], who: 'Business owners or authorized representatives.', information: 'Business activity, location, and ownership details.', processing: '3 to 5 working days' },
  { name: 'Business Permit', category: 'Business & Permits', icon: '📦', description: 'Request barangay approval or validation for a business permit and local operations.', requirements: ['Business name and address', 'Owner identification', 'Supporting business documents'], who: 'Business owners or authorized representatives.', information: 'Business activity, location, and ownership details.', processing: '3 to 5 working days', core: true },
  { name: 'Business Permit Assistance', category: 'Business & Permits', icon: '🧾', description: 'Get guidance and assistance in preparing a local business permit request.', requirements: ['Owner valid ID', 'Business name and address', 'Available business documents'], who: 'Business owners and aspiring entrepreneurs.', information: 'Business type, location, and assistance needed.', processing: '1 to 2 working days' },
  { name: 'Business Location Certification', category: 'Business & Permits', icon: '📍', description: 'Request certification of a business location within the barangay.', requirements: ['Owner valid ID', 'Complete business address', 'Proof of occupancy or ownership'], who: 'Business owners or authorized representatives.', information: 'Exact location and nature of business.', processing: '3 to 5 working days' },
  { name: 'First-Time Job Seeker Certification', category: 'Community Services', icon: '💼', description: 'Request certification for qualified first-time job seekers applying for employment documents.', requirements: ['Valid government ID', 'Resident information', 'First-time job seeker declaration'], who: 'Qualified first-time job seekers who are barangay residents.', information: 'Target employer and employment requirements.', processing: '2 to 3 working days' },
  { name: 'Solo Parent Certification Assistance', category: 'Community Services', icon: '👤', description: 'Request assistance with the certification process for solo parents.', requirements: ['Valid ID', 'Proof of solo parent status', 'Complete household information'], who: 'Residents applying for solo parent support.', information: 'Household details and supporting circumstances.', processing: '3 to 5 working days' },
  { name: 'Senior Citizen Assistance Request', category: 'Community Services', icon: '🧓', description: 'Submit a request for barangay assistance and support for a senior citizen.', requirements: ['Senior citizen valid ID', 'Resident information', 'Description of assistance needed'], who: 'Senior citizens or their authorized representatives.', information: 'Type of assistance and preferred contact details.', processing: '3 to 5 working days' },
  { name: 'Community Assistance Request', category: 'Community Services', icon: '🫱', description: 'Request help from the barangay for a community or household concern.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed assistance request'], who: 'Barangay residents with a documented need for assistance.', information: 'Situation details and requested support.', processing: '3 to 5 working days' },
  { name: 'Barangay ID Request', category: 'Resident Services', icon: '🪪', description: 'Request a barangay identification card for local transactions and resident verification.', requirements: ['Valid government ID', 'Recent photo, if required', 'Complete resident information'], who: 'Registered residents of the barangay.', information: 'Address, contact details, and emergency contact.', processing: '5 to 7 working days' },
  { name: 'Resident Information Update', category: 'Resident Services', icon: '✏️', description: 'Request an update to your resident profile or barangay records.', requirements: ['Valid government ID', 'Updated information', 'Supporting document for the change'], who: 'Registered residents updating their records.', information: 'Field to update and the corrected details.', processing: '2 to 3 working days' },
  { name: 'Document Correction Request', category: 'Resident Services', icon: '📝', description: 'Request correction of an error in a previously issued barangay document.', requirements: ['Valid government ID', 'Copy of document to correct', 'Proof of correct information'], who: 'Residents with an issued document containing an error.', information: 'Incorrect entry, corrected entry, and reason.', processing: '3 to 5 working days' },
  { name: 'General Certification Request', category: 'Resident Services', icon: '📁', description: 'Start a request for a resident certification not listed as a specific service.', requirements: ['Valid government ID', 'Complete resident information', 'Detailed purpose statement'], who: 'Residents with a valid certification request.', information: 'Requested certification and intended use.', processing: '3 to 5 working days' }
];

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');

  const serviceGrid = document.querySelector('[data-service-grid]');
  if (serviceGrid) {
    const searchInput = document.querySelector('#service-search');
    const emptyState = document.querySelector('[data-service-empty]');
    const count = document.querySelector('[data-service-count]');
    const detail = document.querySelector('#service-detail');
    let activeCategory = 'all';

    function showServiceDetail(service) {
      if (!detail) return;
      detail.classList.remove('hidden');
      detail.querySelector('[data-detail-icon]').textContent = service.icon;
      detail.querySelector('[data-detail-category]').textContent = service.category;
      detail.querySelector('[data-detail-name]').textContent = service.name;
      detail.querySelector('[data-detail-description]').textContent = service.description;
      detail.querySelector('[data-detail-who]').textContent = service.who;
      detail.querySelector('[data-detail-information]').textContent = service.information;
      detail.querySelector('[data-detail-processing]').textContent = service.processing;
      detail.querySelector('[data-detail-requirements]').innerHTML = service.requirements.map((requirement) => `<li>${requirement}</li>`).join('');
      detail.querySelector('[data-detail-request]').href = `request.html?service=${encodeURIComponent(service.name)}`;
      detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderServices() {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
      const filtered = serviceCatalog.filter((service) => {
        const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
        const matchesSearch = !query || `${service.name} ${service.category} ${service.description}`.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      });
      serviceGrid.innerHTML = filtered.map((service) => `<article class="service-card"><div class="service-icon" aria-hidden="true">${service.icon}</div><span class="category-label">${service.category}</span><h3>${service.name}</h3><p>${service.description}</p><ul>${service.requirements.slice(0, 3).map((requirement) => `<li>${requirement}</li>`).join('')}</ul><span class="processing-time">Estimated: ${service.processing}</span><div class="card-actions"><button class="btn btn-ghost small" type="button" data-view-service="${service.name}">View Requirements</button><a class="btn btn-primary small" href="request.html?service=${encodeURIComponent(service.name)}">Request Service</a></div></article>`).join('');
      if (count) count.textContent = filtered.length;
      if (emptyState) emptyState.classList.toggle('hidden', filtered.length > 0);
      serviceGrid.querySelectorAll('[data-view-service]').forEach((button) => {
        button.addEventListener('click', () => showServiceDetail(serviceCatalog.find((service) => service.name === button.dataset.viewService)));
      });
    }

    document.querySelectorAll('[data-category]').forEach((button) => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.category;
        document.querySelectorAll('[data-category]').forEach((tab) => {
          const isActive = tab === button;
          tab.classList.toggle('active', isActive);
          tab.setAttribute('aria-selected', String(isActive));
        });
        renderServices();
      });
    });
    if (searchInput) searchInput.addEventListener('input', renderServices);
    renderServices();
  }

  const documentType = document.querySelector('#document-type');
  if (documentType) {
    const selectedService = new URLSearchParams(window.location.search).get('service');
    documentType.innerHTML = '<option value="">Select a service</option>' + serviceCatalog.map((service) => `<option value="${service.name}">${service.name}</option>`).join('');
    if (selectedService && serviceCatalog.some((service) => service.name === selectedService)) documentType.value = selectedService;
    const requirementsList = document.querySelector('[data-request-requirements]');
    const requirementIntro = document.querySelector('[data-request-requirement-intro]');
    function updateRequestRequirements() {
      const service = serviceCatalog.find((item) => item.name === documentType.value) || serviceCatalog[0];
      if (requirementsList) requirementsList.innerHTML = service.requirements.map((requirement) => `<li>${requirement}</li>`).join('');
      if (requirementIntro) requirementIntro.textContent = `${service.name} requirements`;
    }
    documentType.addEventListener('change', updateRequestRequirements);
    updateRequestRequirements();
  }

  if (navToggle && siteHeader) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      siteHeader.classList.toggle('nav-open');
    });
  }

  document.querySelectorAll('.toggle-password').forEach((button) => {
    button.addEventListener('click', () => {
      const input = button.parentElement.querySelector('input');
      if (!input) return;

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      button.textContent = isPassword ? 'Hide' : 'Show';
      button.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  const requestForm = document.querySelector('.request-form');
  if (requestForm) {
    const steps = Array.from(requestForm.querySelectorAll('.step-panel'));
    const nextButtons = requestForm.querySelectorAll('[data-next]');
    const prevButtons = requestForm.querySelectorAll('[data-prev]');
    const stepLabel = requestForm.querySelector('[data-step-label]');
    let currentStep = 0;

    function validateStep(stepIndex) {
      const currentPanel = steps[stepIndex];
      const fields = currentPanel.querySelectorAll('input, select, textarea');

      for (const field of fields) {
        if (field.required && !field.value.trim()) {
          field.focus();
          field.reportValidity();
          return false;
        }
      }

      return true;
    }

    function updateStepUI() {
      steps.forEach((step, index) => {
        step.classList.toggle('active', index === currentStep);
      });

      if (stepLabel) {
        stepLabel.textContent = `Step ${currentStep + 1} of ${steps.length}`;
      }

      const isLastStep = currentStep === steps.length - 1;
      const submitButton = requestForm.querySelector('[data-submit]');
      if (submitButton) {
        submitButton.classList.toggle('hidden', !isLastStep);
      }

      requestForm.querySelectorAll('[data-next]').forEach((button) => {
        button.classList.toggle('hidden', isLastStep);
      });

      requestForm.querySelectorAll('[data-prev]').forEach((button) => {
        button.classList.toggle('hidden', currentStep === 0);
      });
    }

    nextButtons.forEach((button) => {
      button.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;
        currentStep += 1;
        updateStepUI();
      });
    });

    prevButtons.forEach((button) => {
      button.addEventListener('click', () => {
        currentStep -= 1;
        updateStepUI();
      });
    });

    requestForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!validateStep(currentStep)) return;

      const message = document.querySelector('.form-message');
      if (message) {
        message.textContent = requestForm.dataset.successMessage || 'Your request has been submitted successfully. Please review your status in tracking.';
        message.classList.add('show');
      }
    });

    updateStepUI();
  }

  const statusFilter = document.querySelector('#statusFilter');
  const documentFilter = document.querySelector('#documentFilter');
  const requestRows = document.querySelectorAll('[data-status]');

  function applyTableFilters() {
    const selectedStatus = statusFilter ? statusFilter.value : 'all';
    const selectedDocument = documentFilter ? documentFilter.value : 'all';

    requestRows.forEach((row) => {
      const rowStatus = row.dataset.status;
      const rowDocument = row.dataset.document;
      const matchesStatus = selectedStatus === 'all' || rowStatus === selectedStatus;
      const matchesDocument = selectedDocument === 'all' || rowDocument === selectedDocument;
      row.hidden = !(matchesStatus && matchesDocument);
    });
  }

  if (statusFilter) statusFilter.addEventListener('change', applyTableFilters);
  if (documentFilter) documentFilter.addEventListener('change', applyTableFilters);

  const trackForm = document.querySelector('.track-form');
  if (trackForm) {
    trackForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = trackForm.querySelector('input');
      const result = document.querySelector('.track-result');

      if (!input || !result) return;

      if (!input.value.trim()) {
        input.focus();
        input.reportValidity();
        return;
      }

      result.classList.remove('hidden');
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.querySelectorAll('[data-confirm]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const actionText = button.dataset.confirm || 'Are you sure you want to continue?';
      const confirmAction = window.confirm(actionText);
      if (!confirmAction) {
        event.preventDefault();
      }
    });
  });

  const modal = document.querySelector('.modal');
  const modalTrigger = document.querySelector('[data-open-modal]');
  const closeModalButton = document.querySelector('[data-close-modal]');

  if (modalTrigger && modal) {
    modalTrigger.addEventListener('click', () => modal.classList.add('show'));
  }

  if (closeModalButton && modal) {
    closeModalButton.addEventListener('click', () => modal.classList.remove('show'));
  }

  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.classList.remove('show');
      }
    });
  }

  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const requiredFields = form.querySelectorAll('[required]');
      for (const field of requiredFields) {
        if (!field.value.trim()) {
          event.preventDefault();
          field.focus();
          field.reportValidity();
          break;
        }
      }
    });
  });
});
