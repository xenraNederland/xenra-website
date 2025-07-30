# Xenra Nederland Website - Vercel Deployment

## Deployment Instructies

### Stap 1: GitHub Repository
1. Maak een nieuwe GitHub repository aan (bijv. `xenra-website`)
2. Upload alle bestanden uit deze map naar de repository

### Stap 2: Vercel Deployment
1. Ga naar [vercel.com](https://vercel.com) en log in
2. Klik op "New Project"
3. Selecteer je GitHub repository
4. Framework: **Other** (niet React/Next.js)
5. Build Command: laat leeg
6. Output Directory: laat leeg
7. Install Command: laat leeg
8. Klik "Deploy"

### Stap 3: Custom Domain
1. Ga naar je Vercel project dashboard
2. Klik op "Settings" → "Domains"
3. Voeg je domein toe (bijv. xenra.nl en www.xenra.nl)
4. Update je DNS settings bij je domain provider:
   - A record: xenra.nl → Vercel IP
   - CNAME record: www.xenra.nl → je-project.vercel.app

## Functionaliteit

### Contactformulier
- Het contactformulier werkt via Vercel serverless functions
- API endpoint: `/api/contact`
- Alle form submissions worden gelogd in Vercel Functions
- Formulier heeft volledige validatie

### Features
- ✅ Volledig responsive design
- ✅ Contact pagina met twee-kolom layout
- ✅ Werkend contactformulier met 6 type aanvraag opties
- ✅ Services pagina met direct links naar contact
- ✅ Premium calculator
- ✅ SEO geoptimaliseerd
- ✅ Google Analytics ready

## Technische Details
- Static site met Vercel serverless API
- Geen database nodig voor basic functionaliteit
- Contactformulier submissions via serverless functions
- Volledige CORS ondersteuning
- Mobile-first responsive design

## Support
Voor technische vragen of aanpassingen, neem contact op via info@xenra.nl