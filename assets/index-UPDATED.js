// Contact Form Handler
function handleContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const contactData = {
    naam: formData.get('naam') || formData.get('name'),
    email: formData.get('email'),
    telefoon: formData.get('telefoon') || formData.get('phone'),
    bericht: formData.get('bericht') || formData.get('message'),
    typeAanvraag: formData.get('typeAanvraag') || 'Algemene informatie'
  };

  // Track form submission
  if (window.trackContactForm) {
    window.trackContactForm(contactData.typeAanvraag);
  }

  // Send to API
  fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showSuccessMessage(data.message || 'Bedankt voor uw bericht. Wij nemen z.s.m. contact met u op.');
      form.reset();
    } else {
      showErrorMessage(data.error || 'Er is een fout opgetreden. Probeer het opnieuw.');
    }
  })
  .catch(error => {
    console.error('Contact form error:', error);
    showErrorMessage('Er is een fout opgetreden bij het versturen van uw bericht.');
  });
}

// Registration Form Handler
function handleRegistrationForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const formData = new FormData(form);
  
  const registrationData = {
    firstName: formData.get('firstName') || formData.get('voornaam'),
    lastName: formData.get('lastName') || formData.get('achternaam'),
    email: formData.get('email'),
    phone: formData.get('phone') || formData.get('telefoon'),
    address: formData.get('address') || formData.get('adres'),
    postalCode: formData.get('postalCode') || formData.get('postcode'),
    city: formData.get('city') || formData.get('plaats'),
    dateOfBirth: formData.get('dateOfBirth') || formData.get('geboortedatum'),
    package: formData.get('package') || formData.get('pakket'),
    monthlyAmount: formData.get('monthlyAmount') || formData.get('maandBedrag')
  };

  // Send to API
  fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(registrationData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      showSuccessMessage(data.message);
      form.reset();
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } else {
      showErrorMessage(data.error || 'Er is een fout opgetreden. Probeer het opnieuw.');
    }
  })
  .catch(error => {
    console.error('Registration form error:', error);
    showErrorMessage('Er is een fout opgetreden bij het verwerken van uw aanmelding.');
  });
}

// Success/Error Message Display
function showSuccessMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
  alertDiv.innerHTML = message;
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 7000);
}

function showErrorMessage(message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
  alertDiv.innerHTML = message;
  document.body.appendChild(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 7000);
}

// Initialize form handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Contact forms
  const contactForms = document.querySelectorAll('form[data-contact-form], #contactForm, .contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', handleContactForm);
  });

  // Registration forms
  const registrationForms = document.querySelectorAll('form[data-registration-form], #registrationForm, .registration-form');
  registrationForms.forEach(form => {
    form.addEventListener('submit', handleRegistrationForm);
  });

  // Generic form detection by submit button text
  const allForms = document.querySelectorAll('form');
  allForms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitButton) {
      const buttonText = submitButton.textContent || submitButton.value;
      
      if (buttonText.toLowerCase().includes('contact') || 
          buttonText.toLowerCase().includes('bericht') ||
          buttonText.toLowerCase().includes('verstuur')) {
        form.addEventListener('submit', handleContactForm);
      }
      
      if (buttonText.toLowerCase().includes('aanmeld') || 
          buttonText.toLowerCase().includes('afsluiten') ||
          buttonText.toLowerCase().includes('direct')) {
        form.addEventListener('submit', handleRegistrationForm);
      }
    }
  });
});

console.log('✅ Xenra formulier handlers geladen - contact en registratie formulieren werken nu!');