// WORKING Vercel API with FormSubmit email service
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

    // Create email subject based on inquiry type
    const emailSubject = `Nieuwe contactaanvraag - ${inquiryType}`;

    console.log('=== XENRA EMAIL SENDING ATTEMPT ===');
    console.log('To: info@xenra.nl');
    console.log('Subject:', emailSubject);
    console.log('From:', email);
    console.log('Type:', inquiryType);
    console.log('====================================');

    // CRITICAL: Send email using FormSubmit.co service
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone || 'Niet opgegeven');
    formData.append('inquiry_type', inquiryType);
    formData.append('message', message);
    formData.append('_next', 'https://www.xenra.nl');
    formData.append('_subject', emailSubject);
    formData.append('_template', 'table');
    
    // This is the CRITICAL part that sends the actual email
    const formResponse = await fetch('https://formsubmit.co/info@xenra.nl', {
      method: 'POST',
      body: formData
    });

    if (!formResponse.ok) {
      console.error('❌ FormSubmit failed:', formResponse.status);
      throw new Error('Email service failed');
    }

    console.log('✅ Email successfully sent to info@xenra.nl via FormSubmit');

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Bedankt voor uw bericht. Wij zullen z.s.m. reageren op uw mail.',
      data: {
        name,
        email,
        inquiryType,
        timestamp: new Date().toISOString(),
        emailSent: true  // Confirmation that email was sent
      }
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return res.status(500).json({
      error: 'Er is een fout opgetreden. Probeer het opnieuw of bel ons op 085 08 06 142.',
      emailSent: false
    });
  }
}