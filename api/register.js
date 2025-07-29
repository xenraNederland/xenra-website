export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      address, 
      postalCode, 
      city, 
      dateOfBirth, 
      package: selectedPackage,
      monthlyAmount 
    } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !phone || !selectedPackage) {
      return res.status(400).json({ 
        error: 'Alle verplichte velden moeten worden ingevuld' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Ongeldig email adres' 
      });
    }

    // Dutch postal code validation (1234AB format)
    const postalCodeRegex = /^[1-9][0-9]{3}[A-Z]{2}$/i;
    if (postalCode && !postalCodeRegex.test(postalCode.replace(/\s/g, ''))) {
      return res.status(400).json({ 
        error: 'Ongeldig postcode formaat (gebruik 1234AB)' 
      });
    }

    // Phone validation (basic Dutch format)
    const phoneRegex = /^(\+31|0)[0-9]{9}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        error: 'Ongeldig telefoonnummer (gebruik Nederlands formaat)' 
      });
    }

    // Log the registration (in production, you'd save this to database and send email)
    console.log('📋 Aanmelding Direct Afsluiten:', {
      timestamp: new Date().toLocaleString('nl-NL'),
      naam: `${firstName} ${lastName}`,
      email,
      telefoon: cleanPhone,
      adres: `${address || ''}, ${postalCode || ''} ${city || ''}`.trim(),
      geboortedatum: dateOfBirth,
      pakket: selectedPackage,
      maandBedrag: monthlyAmount
    });

    // Here you would:
    // 1. Save registration to database
    // 2. Send confirmation email to customer
    // 3. Send notification email to info@xenra.nl
    
    // In production, add your email service integration here:
    // await sendRegistrationEmails({
    //   customerEmail: email,
    //   customerName: `${firstName} ${lastName}`,
    //   package: selectedPackage,
    //   monthlyAmount
    // });

    return res.status(200).json({ 
      success: true, 
      message: `Bedankt ${firstName}! Uw aanmelding voor het ${selectedPackage} pakket is ontvangen. Wij nemen binnen 2 werkdagen contact met u op om alles af te ronden.` 
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Er is een fout opgetreden bij het verwerken van uw aanmelding' 
    });
  }
}