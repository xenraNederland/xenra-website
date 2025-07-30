export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, inquiryType, message } = req.body;

    // Basic validation
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

    // Log the submission for debugging
    console.log('Xenra contact form submission:', {
      name,
      email,
      phone: phone || 'Niet opgegeven',
      inquiryType: inquiryType || 'Algemene informatie',
      message,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Bedankt voor uw bericht. Wij zullen z.s.m. reageren op uw mail.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het versturen van uw bericht' 
    });
  }
}