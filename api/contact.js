export default async function handler(req, res) {
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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        message: 'Naam, email en bericht zijn verplicht' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Ongeldig email adres' 
      });
    }

    // Log the contact form submission (in production you'd save to database or send email)
    console.log('Contact form submission:', {
      name,
      email,
      phone: phone || 'Niet opgegeven',
      subject: subject || 'Algemene informatie',
      message,
      timestamp: new Date().toISOString()
    });

    // In production, here you would:
    // 1. Save to database
    // 2. Send email notification to info@xenra.nl
    // 3. Send confirmation email to user

    return res.status(200).json({ 
      message: 'Bedankt voor uw bericht. Wij nemen zo spoedig mogelijk contact met u op.',
      success: true
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      message: 'Er is een fout opgetreden. Probeer het later opnieuw.' 
    });
  }
}