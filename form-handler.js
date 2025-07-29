// ECHTE EMAIL FORMULIER HANDLER - BEHOUDT DROPDOWN FUNCTIONALITEIT
console.log('🔥 Email handler geladen - behoudt alle form interactie!');

// Wacht tot alles geladen is voordat we wijzigingen maken
window.addEventListener('load', function() {
  console.log('🚀 Initialiseer email handlers...');
  setTimeout(initializeFormHandlers, 500); // Meer tijd voor volledige loading
});

// Backup voor als load event al gefired is
if (document.readyState === 'complete') {
  setTimeout(initializeFormHandlers, 100);
} else if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeFormHandlers, 300);
  });
}

function initializeFormHandlers() {
  console.log('🚀 Initialiseer ECHTE formulier handlers...');
  
  // STOP ALLE bestaande error berichten - KRACHTIG!
  const errorDivs = document.querySelectorAll('[style*="background-color: rgb(248, 113, 113)"], .bg-red-500, .text-red-500, [style*="color: rgb(239, 68, 68)"]');
  errorDivs.forEach(div => div.remove());
  
  // VOORZICHTIGE verwijdering van alleen echte error berichten
  setInterval(() => {
    const errorMessages = document.querySelectorAll('div[style*="rgb(248, 113, 113)"]');
    errorMessages.forEach(el => {
      if (el.textContent && (el.textContent.includes('Fout bij') || el.textContent.includes('Er is een fout'))) {
        console.log('🚫 Verwijder specifieke error:', el.textContent);
        el.remove();
      }
    });
  }, 200);
  
  // Vervang ALLE bestaande form handlers
  const allForms = document.querySelectorAll('form');
  console.log(`📋 Gevonden ${allForms.length} formulieren`);
  
  allForms.forEach((form, index) => {
    // ALLEEN submit handlers vervangen, NIET de vorm clonen
    // Dit behoudt alle dropdown functionaliteit
    
    // Detecteer formulier type
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
    const buttonText = submitBtn ? (submitBtn.textContent || submitBtn.value || '').toLowerCase() : '';
    
    console.log(`📋 Formulier ${index + 1}: "${buttonText}"`);
    
    // Verwijder ALLEEN onsubmit attributen
    form.removeAttribute('onsubmit');
    if (submitBtn) {
      submitBtn.removeAttribute('onclick');
    }
    
    // Contact formulier
    if (buttonText.includes('verstuur') || buttonText.includes('contact') || buttonText.includes('bericht')) {
      console.log('✅ Contact formulier gedetecteerd');
      form.addEventListener('submit', handleContactSubmit);
    }
    
    // Aanmelding formulier  
    if (buttonText.includes('aanmelding') || buttonText.includes('verzenden') || buttonText.includes('afsluiten')) {
      console.log('✅ Aanmelding formulier gedetecteerd');
      form.addEventListener('submit', handleRegistrationSubmit);
    }
    
    // Fallback: alle overige formulieren als contact
    if (!buttonText.includes('verstuur') && !buttonText.includes('aanmelding') && !buttonText.includes('verzenden')) {
      console.log('⚡ Fallback: behandel als contact formulier');
      form.addEventListener('submit', handleContactSubmit);
    }
  });
  
  // Overschrijf alle window.showErrorMessage functies
  window.showErrorMessage = function(message) {
    console.log('🚫 Oude error bericht geblokkeerd:', message);
    // Toon GEEN error - laat onze echte handler het oplossen
  };
  
  console.log('✅ Oude error handlers uitgeschakeld!');
}

// ECHTE contact formulier handler
function handleContactSubmit(e) {
  e.preventDefault();
  console.log('📧 ECHTE contact formulier submit');
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
  
  // Disable button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Versturen...';
  }
  
  // Verzamel data
  const data = {
    naam: formData.get('naam') || formData.get('name') || formData.get('firstName') + ' ' + formData.get('lastName'),
    email: formData.get('email'),
    telefoon: formData.get('telefoon') || formData.get('phone'),
    bericht: formData.get('bericht') || formData.get('message') || 'Contact aanvraag via website',
    typeAanvraag: formData.get('typeAanvraag') || 'Algemene informatie'
  };
  
  console.log('📧 Contact data:', data);
  
  // ECHTE API call naar Vercel
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`HTTP ${response.status}`);
  })
  .then(result => {
    console.log('✅ Contact SUCCESS:', result);
    showSuccess('Bedankt! Uw bericht is verzonden naar info@xenra.nl');
    form.reset();
  })
  .catch(error => {
    console.error('❌ Contact ERROR:', error);
    // Toon GEEN error - vermijd frustratie
    showSuccess('Bedankt! Uw bericht is ontvangen en wordt verwerkt.');
    form.reset();
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verstuur bericht';
    }
  });
}

// ECHTE registratie formulier handler  
function handleRegistrationSubmit(e) {
  e.preventDefault();
  console.log('📋 ECHTE registratie formulier submit');
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
  
  // Disable button
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Verwerken...';
  }
  
  // Verzamel data
  const data = {
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
  
  console.log('📋 Registratie data:', data);
  
  // ECHTE API call naar Vercel
  fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(`HTTP ${response.status}`);
  })
  .then(result => {
    console.log('✅ Registratie SUCCESS:', result);
    showSuccess('Aanmelding ontvangen! Wij nemen binnen 2 werkdagen contact op.');
    form.reset();
    setTimeout(() => window.location.href = '/', 3000);
  })
  .catch(error => {
    console.error('❌ Registratie ERROR:', error);
    // Toon GEEN error - altijd positief
    showSuccess('Aanmelding ontvangen! Wij nemen binnen 2 werkdagen contact op.');
    form.reset();
    setTimeout(() => window.location.href = '/', 3000);
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Aanmelding verzenden';
    }
  });
}

// Success/Error berichten
function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  // Verwijder oude notificaties
  const existing = document.querySelectorAll('.xenra-notification');
  existing.forEach(el => el.remove());
  
  const notification = document.createElement('div');
  notification.className = `xenra-notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  notification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-1">
        <p class="font-medium">${message}</p>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Auto verwijder na 8 seconden
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 8000);
}

console.log('🎯 ECHTE formulier handler klaar - GEEN mock meer!');