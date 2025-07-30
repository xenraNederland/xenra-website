export default function handler(req, res) {
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
    const { name, email, phone, message, inquiryType } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Naam, email en bericht zijn verplicht' 
      });
    }

    // Log the contact submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      inquiryType,
      message: message.substring(0, 100) + '...'
    });

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Bedankt voor uw bericht. Wij nemen spoedig contact met u op.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({
      error: 'Er is een fout opgetreden. Probeer het later opnieuw.'
    });
  }
}