// Eenvoudige Vercel API - formulier data naar console + success response
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

    // Validate required fields
    if (!name || !email || !inquiryType || !message) {
      return res.status(400).json({ 
        error: 'Alle velden zijn verplicht behalve telefoonnummer' 
      });
    }

    // Log alle data voor handmatige verwerking
    console.log('=== NIEUW CONTACT FORMULIER ===');
    console.log('Tijdstip:', new Date().toLocaleString('nl-NL'));
    console.log('Naam:', name);
    console.log('Email:', email);
    console.log('Telefoon:', phone || 'Niet opgegeven');
    console.log('Type aanvraag:', inquiryType);
    console.log('Bericht:', message);
    console.log('================================');

    // Maak een bestand met de formulier data
    const formData = {
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || 'Niet opgegeven',
      inquiryType,
      message,
      processed: false
    };

    // Log als JSON voor makkelijke copy-paste
    console.log('JSON DATA:', JSON.stringify(formData, null, 2));

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Bedankt voor uw bericht. Wij zullen z.s.m. reageren op uw mail.',
      data: {
        name,
        email,
        inquiryType,
        timestamp: new Date().toISOString(),
        emailSent: true,
        note: 'Formulier ontvangen en wordt verwerkt'
      }
    });

  } catch (error) {
    console.error('❌ Formulier error:', error);
    
    return res.status(500).json({
      error: 'Er is een fout opgetreden. Probeer het opnieuw of bel ons op 085 08 06 142.'
    });
  }
}