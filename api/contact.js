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

    // Log the form submission (in production, you'd send this to your email service)
    console.log('📧 Contact Form Submission:', {
      timestamp: new Date().toLocaleString('nl-NL'),
      naam,
      email,
      telefoon: telefoon || 'Niet opgegeven',
      typeAanvraag,
      bericht
    });

    // Here you would integrate with your email service
    // For now, we'll simulate successful email sending
    
    // In production, add your email service integration here:
    // await sendEmailToXenra({
    //   from: email,
    //   naam,
    //   telefoon,
    //   typeAanvraag,
    //   bericht
    // });

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