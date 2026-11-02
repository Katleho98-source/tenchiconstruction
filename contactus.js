document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const statusDiv = document.getElementById('contactStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearContactErrors();

    let valid = true;

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const deptEmail = document.getElementById('department').value;
    const deptText = document.getElementById('department').options[document.getElementById('department').selectedIndex].text;
    const message = document.getElementById('contactMessage').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;

    // Name Validation
    if (name.length < 2) {
      showError('contactNameError', 'Please enter your full name.');
      valid = false;
    }

    // Email Validation
    if (!emailRegex.test(email)) {
      showError('contactEmailError', 'Please enter a valid email address.');
      valid = false;
    }

    // Phone Validation
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      showError('contactPhoneError', 'Please enter a valid 10-digit SA phone number.');
      valid = false;
    }

    // Department Validation
    if (!deptEmail) {
      showError('deptError', 'Please select a destination department.');
      valid = false;
    }

    // Message Length Validation
    if (message.length < 20) {
      showError('contactMsgError', 'Message must be at least 20 characters long.');
      valid = false;
    }

    if (valid) {
      // Build Pre-Filled Email Link
      const emailSubject = encodeURIComponent(`Website Inquiry: ${deptText} - ${name}`);
      const emailBody = encodeURIComponent(
        `Dear Tenchi Constructions Team,\n\n` +
        `You have received a new contact submission from your website:\n\n` +
        `Sender Name: ${name}\n` +
        `Contact Phone: ${phone}\n` +
        `Contact Email: ${email}\n` +
        `Target Department: ${deptText}\n\n` +
        `Message Content:\n${message}\n\n` +
        `---\n` +
        `Sent via Tenchi Constructions Web Contact Portal`
      );

      const mailtoUrl = `mailto:${deptEmail}?subject=${emailSubject}&body=${emailBody}`;

      // Trigger user's mail client
      window.location.href = mailtoUrl;

      // Provide UI Feedback
      statusDiv.className = 'status-msg success';
      statusDiv.innerHTML = `<strong>Success!</strong> Your default email client has been launched with your validated message. If it didn't open automatically, <a href="${mailtoUrl}">click here to send directly</a>.`;
      statusDiv.classList.remove('hidden');
      
      contactForm.reset();
    }
  });

  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearContactErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    statusDiv.classList.add('hidden');
  }
});