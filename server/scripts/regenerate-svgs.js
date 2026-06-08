const { regenerateAllSVGs } = require('../services/svgGenerator');
const fs = require('fs');
const path = require('path');

// Also update the medical-fallback.svg
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const FALLBACK = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
<defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" style="stop-color:#2c3e50"/><stop offset="100%" style="stop-color:#34495e"/></linearGradient>
<linearGradient id="ic" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" style="stop-color:rgba(255,255,255,0.85)"/><stop offset="100%" style="stop-color:rgba(255,255,255,0.5)"/></linearGradient></defs>
<rect width="1200" height="675" fill="url(#bg)"/>
<circle cx="600" cy="310" r="80" fill="none" stroke="url(#ic)" stroke-width="4" opacity="0.8"/>
<circle cx="600" cy="310" r="30" fill="url(#ic)" opacity="0.4"/>
<line x1="600" y1="390" x2="600" y2="460" stroke="url(#ic)" stroke-width="5" opacity="0.8"/>
<line x1="560" y1="430" x2="640" y2="430" stroke="url(#ic)" stroke-width="5" opacity="0.8"/>
<line x1="600" y1="460" x2="570" y2="510" stroke="url(#ic)" stroke-width="5" opacity="0.8"/>
<line x1="600" y1="460" x2="630" y2="510" stroke="url(#ic)" stroke-width="5" opacity="0.8"/>
<circle cx="600" cy="180" r="120" fill="rgba(255,255,255,0.03)"/>
<circle cx="1000" cy="580" r="200" fill="rgba(255,255,255,0.03)"/>
<circle cx="200" cy="580" r="140" fill="rgba(255,255,255,0.03)"/>
<text x="600" y="570" text-anchor="middle" fill="rgba(255,255,255,0.12)" font-family="'Segoe UI',Arial,sans-serif" font-size="18" letter-spacing="3">MEDICAL</text>
</svg>`;

fs.writeFileSync(path.join(UPLOADS_DIR, 'medical-fallback.svg'), FALLBACK);
console.log('Updated medical-fallback.svg');

regenerateAllSVGs().then(n => {
  console.log('Done. Generated ' + n + ' SVGs');
}).catch(e => { console.error(e); process.exit(1); });
