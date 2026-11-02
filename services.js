document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('enquiryForm');
  const serviceSelect = document.getElementById('serviceType');
  const sqmGroup = document.getElementById('sqmGroup');
  const responseBox = document.getElementById('enquiryResponse');
  const responseContent = document.getElementById('responseContent');

  // Rates per square meter
  const rates = {
    residential: 1500,
    commercial: 2500,
    roofing: 800,
    sponsorship: 0
  };

  // Toggle SQM input visibility based on selection
  serviceSelect.addEventListener('change', () => {
    if (serviceSelect.value === 'sponsorship') {
      sqmGroup.style.display = 'none';
    } else {
      sqmGroup.style.display = 'block';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let isValid = true;

    // Field References
    const name = document.getElementById('enquiryName').value.trim();
    const email = document.getElementById('enquiryEmail').value.trim();
    const phone = document.getElementById('enquiryPhone').value.trim();
    const service = serviceSelect.value;
    const sqm = parseFloat(document.getElementById('projectSqm').value);
    const notes = document.getElementById('enquiryNotes').value.trim();

    // Regex Patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/; // South African phone validation pattern

    // 1. Name Validation
    if (name.length < 2) {
      showError('nameError', 'Please enter your full name (at least 2 characters).');
      isValid = false;
    }

    // 2. Email Validation
    if (!emailRegex.test(email)) {
      showError('emailError', 'Please enter a valid email address.');
      isValid = false;
    }

    // 3. Phone Validation
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      showError('phoneError', 'Enter a valid 10-digit South African contact number (e.g., 0821234567).');
      isValid = false;
    }

    // 4. Service Selection Validation
    if (!service) {
      showError('serviceError', 'Please select a service category.');
      isValid = false;
    }

    // 5. SQM Validation (if service requires area)
    if (service !== 'sponsorship' && (isNaN(sqm) || sqm < 10 || sqm > 5000)) {
      showError('sqmError', 'Project size must be between 10m² and 5,000m².');
      isValid = false;
    }

    // 6. Notes Length Validation
    if (notes.length < 15) {
      showError('notesError', 'Please provide a brief description (at least 15 characters).');
      isValid = false;
    }

    // Process Response on Success
    if (isValid) {
      processEnquiry(name, service, sqm, notes);
    }
  });

  function processEnquiry(name, service, sqm, notes) {
    let costEstimateText = "";
    let timelineText = "Estimated Project Start: Within 2–3 weeks following initial site assessment.";

    if (service === 'sponsorship') {
      costEstimateText = "<strong>Type:</strong> Community/Sponsorship Enquiry (Non-commercial)";
      timelineText = "Our CSI team reviews applications on a bi-weekly basis.";
    } else {
      const totalCost = sqm * rates[service];
      const formattedCost = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(totalCost);
      costEstimateText = `<strong>Estimated Cost:</strong> ${formattedCost} (Excl. VAT)`;
    }

    responseContent.innerHTML = `
      <p>Thank you, <strong>${escapeHtml(name)}</strong>! Your enquiry has been processed successfully.</p>
      <ul>
        <li><strong>Service Selected:</strong> ${capitalize(service)} Construction</li>
        <li>${costEstimateText}</li>
        <li><strong>Availability:</strong> ${timelineText}</li>
      </ul>
      <p><em>A confirmation copy and detailed architectural breakdown will be sent to your inbox shortly.</em></p>
    `;

    responseBox.classList.remove('hidden');
    responseBox.scrollIntoView({ behavior: 'smooth' });
  }

  function showError(id, msg) {
    document.getElementById(id).textContent = msg;
  }

  function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
  }
});