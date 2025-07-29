// Vercel contact API with native email sending
import nodemailer from 'nodemailer';

// Configure SMTP transporter exactly like the main server
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: 'mail.xenra.nl',
    port: 587,
    secure: false,
    auth: {
      user: 'info@xenra.nl',
      pass: 'Geenen12@'
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
};

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

    // Create email content
    const emailSubject = `Nieuw contactformulier: ${inquiryType}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2B5B4B; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">📧 Nieuw Contactformulier</h1>
          <p style="margin: 5px 0 0 0;">Xenra Nederland Website</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #ddd;">
          <h2 style="color: #2B5B4B;">Formulier Details</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold; width: 120px;">Naam:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;">${email}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Telefoon:</td>
              <td style="padding: 10px 0;">${phone || 'Niet opgegeven'}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 10px 0; font-weight: bold;">Type aanvraag:</td>
              <td style="padding: 10px 0;"><span style="background: #F4F1E8; padding: 4px 8px; border-radius: 4px; color: #2B5B4B; font-weight: bold;">${inquiryType}</span></td>
            </tr>
          </table>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 6px;">
            <h3 style="margin: 0 0 10px 0; color: #2B5B4B;">💬 Bericht:</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
            <p style="margin: 0;"><strong>Verzonden op:</strong> ${new Date().toLocaleString('nl-NL')}</p>
            <p style="margin: 0;"><strong>Via:</strong> Xenra Nederland Website (www.xenra.nl)</p>
          </div>
        </div>
      </div>
    `;

    console.log('=== XENRA EMAIL SENDING ATTEMPT ===');
    console.log('To: info@xenra.nl');
    console.log('Subject:', emailSubject);
    console.log('From:', email);
    console.log('====================================');

    // Send email using native Nodemailer
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"${name}" <info@xenra.nl>`,
      to: 'info@xenra.nl',
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
      text: `Nieuwe aanvraag van ${name} (${email})\nType: ${inquiryType}\nTelefoon: ${phone || 'Niet opgegeven'}\n\nBericht:\n${message}`
    });

    console.log('✅ Email successfully sent to info@xenra.nl via native SMTP');

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
    console.error('❌ Email sending failed:', error);
    return res.status(500).json({
      error: 'Er is een fout opgetreden. Probeer het opnieuw of bel ons op 085 08 06 142.'
    });
  }
}