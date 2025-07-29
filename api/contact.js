export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { naam, email, telefoon, bericht, typeAanvraag = 'Algemene informatie' } = req.body;

    // Basic validation
    if (!naam || !email || !bericht) {
      return res.status(400).json({ 
        error: 'Naam, email en bericht zijn verplichte velden' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ongeldig email adres' 
      });
    }

    // ECHTE EMAIL VERSTUREN naar info@xenra.nl
    const emailData = {
      timestamp: new Date().toLocaleString('nl-NL'),
      naam,
      email,
      telefoon: telefoon || 'Niet opgegeven',
      typeAanvraag,
      bericht
    };
    
    console.log('📧 Contact Form Submission:', emailData);

    // Verstuur email via FormSubmit service (gratis en betrouwbaar)
    const formSubmitResponse = await fetch('https://formsubmit.co/info@xenra.nl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: naam,
        email: email,
        phone: telefoon || 'Niet opgegeven',
        type: typeAanvraag,
        message: bericht,
        _subject: `Nieuw contactbericht van ${naam} - ${typeAanvraag}`,
        _template: 'table'
      })
    });

    if (!formSubmitResponse.ok) {
      throw new Error('Email service failed');
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Bedankt voor uw bericht. Wij nemen z.s.m. contact met u op.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het versturen van uw bericht' 
    });
  }
}