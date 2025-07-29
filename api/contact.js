// Contact form API for Vercel deployment
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, inquiryType, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Naam, email en bericht zijn verplicht' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ongeldig email adres' 
      });
    }

    // Validate inquiry type - ensure it's one of the 6 valid options
    const validInquiryTypes = [
      'Algemene informatie',
      'Gratis telefonisch intake',
      'Interesse in pakket particulieren',
      'Interesse in pakket zzp\'ers/eenmanszaak',
      'Interesse in pakket ondernemers bv/nv',
      'Administratieve vraag'
    ];

    if (!inquiryType || !validInquiryTypes.includes(inquiryType)) {
      return res.status(400).json({ 
        error: 'Ongeldig type aanvraag geselecteerd' 
      });
    }

    // Log complete submission with all form fields
    console.log('=== XENRA CONTACTFORMULIER SUBMISSION ===');
    console.log('Tijdstempel:', new Date().toLocaleString('nl-NL'));
    console.log('Naam:', name);
    console.log('Email:', email);
    console.log('Telefoon:', phone || 'Niet opgegeven');
    console.log('Type aanvraag:', inquiryType);
    console.log('Bericht:', message);
    console.log('==========================================');

    // Send email to info@xenra.nl using Formspree
    try {
      const emailSubject = `Nieuw contactformulier: ${inquiryType}`;
      const emailBody = `Nieuwe aanvraag via xenra.nl contactformulier

Naam: ${name}
Email: ${email}
Telefoon: ${phone || 'Niet opgegeven'}
Type aanvraag: ${inquiryType}

Bericht:
${message}

---
Verzonden op: ${new Date().toLocaleString('nl-NL')}
Via: Xenra Nederland Website`;

      // Use fetch to send email via Formspree (works directly from Vercel)
      const formspreeResponse = await fetch('https://formspree.io/f/mwpkynol', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone || 'Niet opgegeven',
          inquiry_type: inquiryType,
          message: emailBody,
          _replyto: email,
          _subject: emailSubject
        })
      });

      if (formspreeResponse.ok) {
        console.log('✅ Email successfully sent to info@xenra.nl via Formspree');
      } else {
        const errorText = await formspreeResponse.text();
        console.log('❌ Formspree email failed:', errorText);
      }
      
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Bedankt voor uw bericht. Wij zullen z.s.m. reageren op uw mail.',
      data: {
        name,
        email,
        inquiryType,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Er is een fout opgetreden. Probeer het opnieuw of bel ons op 085 08 06 142.'
    });
  }
}