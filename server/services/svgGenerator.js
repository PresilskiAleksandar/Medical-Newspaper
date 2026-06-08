const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const W = 1200, H = 675;

const LAYOUTS = [
  'centered', 'left-heavy', 'right-heavy', 'diagonal-tl', 'diagonal-tr',
  'split-horizontal', 'split-vertical', 'circular', 'grid-2x2', 'grid-3x1',
  'stacked', 'triptych', 'framed', 'floating', 'bottom-heavy',
];

const CATEGORY_DESIGN = {
  kardiologija: {
    name: 'Кардиологија', colors: ['#e74c3c','#c0392b','#e91e63','#b71c1c','#ff5252'],
    icons: ['heart','ecg','artery','blood-cell','stethoscope'],
  },
  nevrologija: {
    name: 'Неврологија', colors: ['#8e44ad','#6c3483','#9b59b6','#4a148c','#ce93d8'],
    icons: ['brain','neuron','eye','ear','nerve'],
  },
  onkologija: {
    name: 'Онкологија', colors: ['#2c3e50','#1a252f','#34495e','#1b2838','#4a6572'],
    icons: ['dna','microscope','dna','cell-division','syringe'],
  },
  psihijatrija: {
    name: 'Психијатрија', colors: ['#1abc9c','#16a085','#2ecc71','#0d7a6b','#5df0d0'],
    icons: ['brain','heart','brain','nerve','eye'],
  },
  pedijatrija: {
    name: 'Педијатрија', colors: ['#3498db','#2980b9','#5dade2','#1565c0','#82b1ff'],
    icons: ['child','heart','baby','stethoscope','child'],
  },
  'infektivni-bolesti': {
    name: 'Инфективни Болести', colors: ['#e67e22','#d35400','#f39c12','#bf360c','#ff8a65'],
    icons: ['virus','microscope','bacteria','syringe','shield'],
  },
  ishrana: {
    name: 'Исхрана', colors: ['#27ae60','#1e8449','#2ecc71','#1b5e20','#81c784'],
    icons: ['food','apple','food','stomach','drop'],
  },
  stomatologija: {
    name: 'Стоматологија', colors: ['#e74c3c','#c0392b','#f1948a','#bf360c','#ff8a80'],
    icons: ['tooth','tooth','bone','tooth','shield'],
  },
  farmacija: {
    name: 'Фармација', colors: ['#1abc9c','#16a085','#48c9b0','#00695c','#4db6ac'],
    icons: ['pharmacy','capsule','pill','shield','syringe'],
  },
  'medicinski-tehnologii': {
    name: 'Медицински Технологии', colors: ['#34495e','#2c3e50','#5d6d7e','#1a237e','#7986cb'],
    icons: ['tech','mri','microscope','monitor','dna'],
  },
  'medicina-na-trud': {
    name: 'Медицина на Труд', colors: ['#e67e22','#d35400','#f5b041','#bf360c','#ffab40'],
    icons: ['shield','fitness','shield','bone','heart'],
  },
  'opsta-medicina': {
    name: 'Општа Медицина', colors: ['#3498db','#2980b9','#85c1e9','#1565c0','#64b5f6'],
    icons: ['stethoscope','heart','syringe','monitor','shield'],
  },
  imunologija: {
    name: 'Имунологија', colors: ['#2980b9','#1a5276','#5499c7','#0d47a1','#42a5f5'],
    icons: ['shield','virus','dna','microscope','drop'],
  },
  endokrinologija: {
    name: 'Ендокринологија', colors: ['#d4ac0d','#b7950b','#f1c40f','#f57f17','#fff176'],
    icons: ['thyroid','drop','heart','dna','capsule'],
  },
  'fitnes-i-prevencija': {
    name: 'Фитнес и Превенција', colors: ['#2ecc71','#27ae60','#58d68d','#1b5e20','#66bb6a'],
    icons: ['fitness','heart','fitness','drop','shield'],
  },
  genetika: {
    name: 'Генетика', colors: ['#9b59b6','#7d3c98','#af7ac5','#4a148c','#ba68c8'],
    icons: ['dna','microscope','dna','cell-division','monitor'],
  },
  farmakologija: {
    name: 'Фармакологија', colors: ['#1abc9c','#148f77','#45b39d','#004d40','#4db6ac'],
    icons: ['pharmacy','capsule','pill','microscope','shield'],
  },
  'javno-zdravje': {
    name: 'Јавно Здравје', colors: ['#34495e','#2c3e50','#5d6d7e','#1b2838','#78909c'],
    icons: ['globe','shield','heart','monitor','people'],
  },
};

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function generateHeartSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.2} C${x} ${y-s*0.5}, ${x-s*0.5} ${y-s*0.6}, ${x-s*0.7} ${y-s*0.4} C${x-s*0.9} ${y-s*0.2}, ${x-s*0.9} ${y+s*0.1}, ${x-s*0.7} ${y+s*0.3} L${x} ${y+s*0.7} L${x+s*0.7} ${y+s*0.3} C${x+s*0.9} ${y+s*0.1}, ${x+s*0.9} ${y-s*0.2}, ${x+s*0.7} ${y-s*0.4} C${x+s*0.5} ${y-s*0.6}, ${x} ${y-s*0.5}, ${x} ${y-s*0.2}Z" fill="${c1}" opacity="0.9"/>`;
}
function generateECGSVG(x, y, s, c1, c2) {
  const mid = y;
  const w = s * 2;
  const pts = [[x-w,mid],[x-w*0.4,mid],[x-w*0.3,mid-s*0.3],[x-w*0.15,mid+s*0.3],[x,mid],[x+w*0.15,mid],[x+w*0.3,mid-s*0.5],[x+w*0.4,mid+s*0.5],[x+w*0.6,mid],[x+w*0.75,mid],[x+w*0.85,mid-s*0.3],[x+w,mid+s*0.3],[x+w*1.1,mid]];
  const d = pts.map((p,i)=>(i===0?'M':'L')+p[0]+' '+p[1]).join(' ');
  return `<path d="${d}" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
}
function generateBrainSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.7} C${x-s*0.6} ${y-s*0.7}, ${x-s*0.9} ${y-s*0.3}, ${x-s*0.9} ${y} C${x-s*0.9} ${y+s*0.2}, ${x-s*0.7} ${y+s*0.4}, ${x-s*0.5} ${y+s*0.5} C${x-s*0.6} ${y+s*0.7}, ${x-s*0.5} ${y+s*0.9}, ${x-s*0.3} ${y+s*0.9} C${x-s*0.2} ${y+s*0.9}, ${x-s*0.1} ${y+s*0.8}, ${x} ${y+s*0.7} C${x+s*0.1} ${y+s*0.8}, ${x+s*0.2} ${y+s*0.9}, ${x+s*0.3} ${y+s*0.9} C${x+s*0.5} ${y+s*0.9}, ${x+s*0.6} ${y+s*0.7}, ${x+s*0.5} ${y+s*0.5} C${x+s*0.7} ${y+s*0.4}, ${x+s*0.9} ${y+s*0.2}, ${x+s*0.9} ${y} C${x+s*0.9} ${y-s*0.3}, ${x+s*0.6} ${y-s*0.7}, ${x} ${y-s*0.7}Z" fill="${c1}" opacity="0.85"/>
  <path d="M${x-s*0.3} ${y-s*0.3} L${x+s*0.3} ${y+s*0.3} M${x+s*0.3} ${y-s*0.3} L${x-s*0.3} ${y+s*0.3}" stroke="${c2}" stroke-width="2" opacity="0.3" stroke-linecap="round"/>`;
}
function generateDNASVG(x, y, s, c1, c2) {
  const r = s * 0.4;
  const twist = s * 0.2;
  return `<path d="M${x-r} ${y-s*0.6} Q${x+r+twist} ${y-s*0.3}, ${x+r} ${y} Q${x-r+twist} ${y+s*0.3}, ${x-r} ${y+s*0.6}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <path d="M${x+r} ${y-s*0.6} Q${x-r-twist} ${y-s*0.3}, ${x-r} ${y} Q${x+r-twist} ${y+s*0.3}, ${x+r} ${y+s*0.6}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x-r}" y1="${y-s*0.6}" x2="${x+r}" y2="${y-s*0.6}" stroke="${c1}" stroke-width="2" opacity="0.5"/>
  <line x1="${x-r}" y1="${y+s*0.6}" x2="${x+r}" y2="${y+s*0.6}" stroke="${c1}" stroke-width="2" opacity="0.5"/>`;
}
function generateVirusSVG(x, y, s, c1, c2) {
  const r = s * 0.4;
  let svg = `<circle cx="${x}" cy="${y}" r="${r}" fill="${c1}" opacity="0.7"/>`;
  for (let a = 0; a < 360; a += 45) {
    const rad = a * Math.PI / 180;
    const x1 = x + Math.cos(rad) * r;
    const y1 = y + Math.sin(rad) * r;
    const x2 = x + Math.cos(rad) * (r + s*0.2);
    const y2 = y + Math.sin(rad) * (r + s*0.2);
    svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c1}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
  }
  return svg;
}
function generateMicroscopeSVG(x, y, s, c1, c2) {
  const bx = x - s*0.15, by = y + s*0.2, bw = s*0.3, bh = s*0.15;
  return `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" fill="${c1}" opacity="0.8"/>
  <rect x="${x-s*0.02}" y="${y-s*0.6}" width="${s*0.04}" height="${s*0.8}" rx="2" fill="${c1}" opacity="0.85"/>
  <path d="M${x-s*0.1} ${y-s*0.6} Q${x} ${y-s*0.8}, ${x+s*0.1} ${y-s*0.6}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <path d="M${x-s*0.4} ${by+bh} L${x+s*0.4} ${by+bh}" stroke="${c1}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
  <circle cx="${x}" cy="${y-s*0.35}" r="${s*0.03}" fill="${c2}" opacity="0.6"/>`;
}
function generateSyringeSVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.08}" y="${y-s*0.5}" width="${s*0.16}" height="${s*0.6}" rx="2" fill="${c1}" opacity="0.85"/>
  <rect x="${x-s*0.15}" y="${y+s*0.1}" width="${s*0.3}" height="${s*0.04}" rx="1" fill="${c1}" opacity="0.7"/>
  <rect x="${x-s*0.15}" y="${y+s*0.18}" width="${s*0.3}" height="${s*0.04}" rx="1" fill="${c1}" opacity="0.7"/>
  <path d="M${x} ${y-s*0.5} L${x} ${y-s*0.65}" stroke="${c1}" stroke-width="2.5" opacity="0.85"/>
  <path d="M${x-s*0.3} ${y+s*0.5} L${x} ${y-s*0.65} L${x+s*0.3} ${y+s*0.5}" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.6"/>`;
}
function generateStethoscopeSVG(x, y, s, c1, c2) {
  return `<circle cx="${x}" cy="${y+s*0.2}" r="${s*0.15}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <circle cx="${x}" cy="${y+s*0.2}" r="${s*0.06}" fill="${c1}" opacity="0.5"/>
  <path d="M${x} ${y-s*0.2} Q${x-s*0.3} ${y-s*0.5}, ${x-s*0.4} ${y-s*0.7} Q${x-s*0.5} ${y-s*0.9}, ${x-s*0.3} ${y-s*0.9} Q${x-s*0.1} ${y-s*0.9}, ${x} ${y-s*0.7} Q${x+s*0.1} ${y-s*0.9}, ${x+s*0.3} ${y-s*0.9} Q${x+s*0.5} ${y-s*0.9}, ${x+s*0.4} ${y-s*0.7} Q${x+s*0.3} ${y-s*0.5}, ${x} ${y-s*0.2}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>`;
}
function generateChildSVG(x, y, s, c1, c2) {
  const r = s * 0.25;
  return `<circle cx="${x}" cy="${y-s*0.15}" r="${r}" fill="${c1}" opacity="0.85"/>
  <circle cx="${x-r*0.3}" cy="${y-s*0.2}" r="2.5" fill="rgba(255,255,255,0.7)"/>
  <circle cx="${x+r*0.3}" cy="${y-s*0.2}" r="2.5" fill="rgba(255,255,255,0.7)"/>
  <path d="M${x-r*0.25} ${y-s*0.05} Q${x} ${y+s*0.05}, ${x+r*0.25} ${y-s*0.05}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round"/>
  <path d="M${x-s*0.3} ${y+r+s*0.05} Q${x} ${y+r+s*0.2}, ${x+s*0.3} ${y+r+s*0.05}" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.6"/>`;
}
function generatePharmacySVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.2}" y="${y-s*0.35}" width="${s*0.4}" height="${s*0.7}" rx="4" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x}" y1="${y-s*0.2}" x2="${x}" y2="${y+s*0.2}" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x-s*0.12}" y1="${y}" x2="${x+s*0.12}" y2="${y}" stroke="${c1}" stroke-width="3" opacity="0.85"/>`;
}
function generateTechSVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.35}" y="${y-s*0.3}" width="${s*0.7}" height="${s*0.5}" rx="4" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x-s*0.15}" y1="${y+s*0.2}" x2="${x-s*0.15}" y2="${y+s*0.35}" stroke="${c1}" stroke-width="2" opacity="0.6"/>
  <line x1="${x+s*0.15}" y1="${y+s*0.2}" x2="${x+s*0.15}" y2="${y+s*0.35}" stroke="${c1}" stroke-width="2" opacity="0.6"/>
  <line x1="${x-s*0.3}" y1="${y+s*0.35}" x2="${x+s*0.3}" y2="${y+s*0.35}" stroke="${c1}" stroke-width="2" opacity="0.6"/>
  <circle cx="${x}" cy="${y-s*0.05}" r="${s*0.08}" fill="${c1}" opacity="0.3"/>
  <rect x="${x-s*0.4}" y="${y-s*0.4}" width="${s*0.8}" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>`;
}
function generateMonitorSVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.35}" y="${y-s*0.25}" width="${s*0.7}" height="${s*0.45}" rx="3" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.85"/>
  <path d="M${x-s*0.25} ${y+s*0.05} L${x-s*0.1} ${y-s*0.05} L${x} ${y+s*0.05} L${x+s*0.15} ${y-s*0.1}" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.7"/>
  <line x1="${x-s*0.1}" y1="${y+s*0.2}" x2="${x+s*0.1}" y2="${y+s*0.2}" stroke="${c1}" stroke-width="2" opacity="0.5"/>`;
}
function generateFitnessSVG(x, y, s, c1, c2) {
  return `<circle cx="${x-s*0.25}" cy="${y}" r="${s*0.15}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <circle cx="${x+s*0.25}" cy="${y}" r="${s*0.15}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x-s*0.4}" y1="${y}" x2="${x-s*0.25}" y2="${y}" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <line x1="${x+s*0.25}" y1="${y}" x2="${x+s*0.4}" y2="${y}" stroke="${c1}" stroke-width="3" opacity="0.85"/>`;
}
function generateShieldSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.5} L${x+s*0.4} ${y-s*0.25} L${x+s*0.4} ${y+s*0.1} Q${x+s*0.4} ${y+s*0.35}, ${x} ${y+s*0.5} Q${x-s*0.4} ${y+s*0.35}, ${x-s*0.4} ${y+s*0.1} L${x-s*0.4} ${y-s*0.25} Z" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <path d="M${x-s*0.15} ${y} L${x-s*0.05} ${y+s*0.12} L${x+s*0.15} ${y-s*0.08}" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>`;
}
function generateGlobeSVG(x, y, s, c1, c2) {
  const r = s * 0.35;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.85"/>
  <ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.5}" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <line x1="${x-r}" y1="${y}" x2="${x+r}" y2="${y}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <path d="M${x-r*0.5} ${y-r} Q${x} ${y}, ${x-r*0.5} ${y+r} M${x+r*0.5} ${y-r} Q${x} ${y}, ${x+r*0.5} ${y+r}" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>`;
}
function generateThyroidSVG(x, y, s, c1, c2) {
  return `<ellipse cx="${x-s*0.2}" cy="${y}" rx="${s*0.2}" ry="${s*0.25}" fill="${c1}" opacity="0.7"/>
  <ellipse cx="${x+s*0.2}" cy="${y}" rx="${s*0.2}" ry="${s*0.25}" fill="${c1}" opacity="0.7"/>
  <path d="M${x-s*0.2} ${y-s*0.25} Q${x} ${y-s*0.4}, ${x+s*0.2} ${y-s*0.25}" fill="none" stroke="${c1}" stroke-width="2" opacity="0.6"/>`;
}
function generateBacteriaSVG(x, y, s, c1, c2) {
  const r = s * 0.3;
  return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*0.6}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.8" transform="rotate(30, ${x}, ${y})"/>
  <circle cx="${x+r*0.5}" cy="${y-r*0.3}" r="3" fill="${c1}" opacity="0.5"/>
  <circle cx="${x-r*0.3}" cy="${y+r*0.4}" r="2.5" fill="${c1}" opacity="0.5"/>
  <circle cx="${x+r*0.4}" cy="${y+r*0.2}" r="2" fill="${c1}" opacity="0.5"/>`;
}
function generateCapsuleSVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.08}" y="${y-s*0.35}" width="${s*0.16}" height="${s*0.7}" rx="${s*0.08}" fill="${c1}" opacity="0.8"/>
  <rect x="${x-s*0.08}" y="${y-s*0.35}" width="${s*0.16}" height="${s*0.35}" rx="${s*0.08}" fill="${c2}" opacity="0.6"/>`;
}
function generatePillSVG(x, y, s, c1, c2) {
  return `<rect x="${x-s*0.35}" y="${y-s*0.12}" width="${s*0.7}" height="${s*0.24}" rx="${s*0.12}" fill="${c1}" opacity="0.8"/>
  <line x1="${x}" y1="${y-s*0.12}" x2="${x}" y2="${y+s*0.12}" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>`;
}
function generateArterySVG(x, y, s, c1, c2) {
  return `<path d="M${x-s*0.8} ${y+s*0.1} Q${x-s*0.3} ${y-s*0.4}, ${x} ${y-s*0.2} Q${x+s*0.3} ${y}, ${x+s*0.8} ${y-s*0.2}" fill="none" stroke="${c1}" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
  <path d="M${x-s*0.8} ${y+s*0.2} Q${x-s*0.3} ${y-s*0.3}, ${x} ${y-s*0.1} Q${x+s*0.3} ${y+s*0.1}, ${x+s*0.8} ${y-s*0.1}" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" opacity="0.4"/>`;
}
function generateNeuronSVG(x, y, s, c1, c2) {
  const br = s * 0.12;
  return `<circle cx="${x}" cy="${y}" r="${br}" fill="${c1}" opacity="0.8"/>
  <line x1="${x}" y1="${y-br}" x2="${x+s*0.5}" y2="${y-s*0.5}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <line x1="${x+br*0.7}" y1="${y-br*0.7}" x2="${x+s*0.7}" y2="${y-s*0.15}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <line x1="${x+br}" y1="${y}" x2="${x+s*0.6}" y2="${y+s*0.2}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <line x1="${x-br}" y1="${y}" x2="${x-s*0.5}" y2="${y-s*0.2}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <line x1="${x-br*0.7}" y1="${y+br*0.7}" x2="${x-s*0.4}" y2="${y+s*0.4}" stroke="${c1}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="${x+s*0.5}" cy="${y-s*0.5}" r="3" fill="${c1}" opacity="0.4"/>
  <circle cx="${x+s*0.7}" cy="${y-s*0.15}" r="2.5" fill="${c1}" opacity="0.4"/>`;
}
function generateEyeSVG(x, y, s, c1, c2) {
  return `<ellipse cx="${x}" cy="${y}" rx="${s*0.4}" ry="${s*0.25}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.8"/>
  <circle cx="${x}" cy="${y}" r="${s*0.12}" fill="${c1}" opacity="0.6"/>
  <circle cx="${x}" cy="${y}" r="${s*0.04}" fill="rgba(255,255,255,0.5)"/>`;
}
function generateEarSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.35} Q${x+s*0.3} ${y-s*0.3}, ${x+s*0.35} ${y} Q${x+s*0.35} ${y+s*0.3}, ${x+s*0.2} ${y+s*0.4} Q${x+s*0.1} ${y+s*0.35}, ${x+s*0.15} ${y+s*0.2} Q${x+s*0.2} ${y+s*0.1}, ${x+s*0.15} ${y} Q${x+s*0.1} ${y-s*0.15}, ${x} ${y-s*0.35}" fill="none" stroke="${c1}" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>`;
}
function generateDropSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.4} Q${x+s*0.3} ${y+s*0.05}, ${x+s*0.3} ${y+s*0.2} Q${x+s*0.3} ${y+s*0.4}, ${x} ${y+s*0.4} Q${x-s*0.3} ${y+s*0.4}, ${x-s*0.3} ${y+s*0.2} Q${x-s*0.3} ${y+s*0.05}, ${x} ${y-s*0.4}Z" fill="${c1}" opacity="0.7"/>`;
}
function generateBoneSVG(x, y, s, c1, c2) {
  const r = s * 0.1;
  return `<rect x="${x-s*0.35}" y="${y-r}" width="${s*0.7}" height="${r*2}" rx="${r}" fill="${c1}" opacity="0.8"/>
  <circle cx="${x-s*0.35}" cy="${y}" r="${r*1.3}" fill="${c1}" opacity="0.7"/>
  <circle cx="${x+s*0.35}" cy="${y}" r="${r*1.3}" fill="${c1}" opacity="0.7"/>`;
}
function generateAppleSVG(x, y, s, c1, c2) {
  return `<path d="M${x} ${y-s*0.35} Q${x-s*0.3} ${y-s*0.4}, ${x-s*0.25} ${y} Q${x-s*0.25} ${y+s*0.3}, ${x} ${y+s*0.35} Q${x+s*0.25} ${y+s*0.3}, ${x+s*0.25} ${y} Q${x+s*0.3} ${y-s*0.4}, ${x} ${y-s*0.35}Z" fill="${c1}" opacity="0.8"/>
  <path d="M${x} ${y-s*0.35} Q${x+s*0.05} ${y-s*0.5}, ${x+s*0.1} ${y-s*0.45}" fill="none" stroke="${c1}" stroke-width="2" opacity="0.8"/>`;
}
function generateStomachSVG(x, y, s, c1, c2) {
  return `<path d="M${x-s*0.15} ${y-s*0.35} Q${x-s*0.45} ${y+s*0.1}, ${x-s*0.25} ${y+s*0.35} Q${x} ${y+s*0.45}, ${x+s*0.25} ${y+s*0.35} Q${x+s*0.45} ${y+s*0.1}, ${x+s*0.15} ${y-s*0.35}Z" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.8"/>
  <path d="M${x-s*0.15} ${y-s*0.35} L${x+s*0.15} ${y-s*0.35}" stroke="${c1}" stroke-width="3" stroke-linecap="round" opacity="0.8"/>`;
}
function generatePeopleSVG(x, y, s, c1, c2) {
  return `<circle cx="${x-s*0.2}" cy="${y-s*0.25}" r="${s*0.1}" fill="${c1}" opacity="0.7"/>
  <circle cx="${x+s*0.2}" cy="${y-s*0.15}" r="${s*0.08}" fill="${c1}" opacity="0.7"/>
  <path d="M${x-s*0.2} ${y-s*0.15} Q${x-s*0.2} ${y+s*0.1}, ${x-s*0.35} ${y+s*0.2} L${x-s*0.05} ${y+s*0.2} Q${x-s*0.2} ${y+s*0.1}, ${x-s*0.2} ${y-s*0.15}Z" fill="${c1}" opacity="0.6"/>
  <path d="M${x+s*0.2} ${y-s*0.05} Q${x+s*0.2} ${y+s*0.1}, ${x+s*0.35} ${y+s*0.2} L${x+s*0.05} ${y+s*0.2} Q${x+s*0.2} ${y+s*0.1}, ${x+s*0.2} ${y-s*0.05}Z" fill="${c1}" opacity="0.6"/>`;
}
function generateCellDivisionSVG(x, y, s, c1, c2) {
  return `<circle cx="${x-s*0.15}" cy="${y}" r="${s*0.2}" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.7"/>
  <circle cx="${x+s*0.15}" cy="${y}" r="${s*0.2}" fill="none" stroke="${c1}" stroke-width="2.5" opacity="0.7"/>
  <circle cx="${x-s*0.15}" cy="${y}" r="${s*0.08}" fill="${c1}" opacity="0.4"/>
  <circle cx="${x+s*0.15}" cy="${y}" r="${s*0.08}" fill="${c1}" opacity="0.4"/>`;
}
function generateBabySVG(x, y, s, c1, c2) {
  const r = s * 0.2;
  return `<circle cx="${x}" cy="${y-s*0.1}" r="${r}" fill="${c1}" opacity="0.8"/>
  <circle cx="${x-r*0.25}" cy="${y-s*0.15}" r="2" fill="rgba(255,255,255,0.7)"/>
  <circle cx="${x+r*0.25}" cy="${y-s*0.15}" r="2" fill="rgba(255,255,255,0.7)"/>
  <path d="M${x-r*0.2} ${y-s*0.02} Q${x} ${y+s*0.06}, ${x+r*0.2} ${y-s*0.02}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M${x-s*0.25} ${y+r+s*0.02} Q${x} ${y+r+s*0.15}, ${x+s*0.25} ${y+r+s*0.02}" fill="none" stroke="${c1}" stroke-width="2" opacity="0.6"/>`;
}
function generateMRISVG(x, y, s, c1, c2) {
  const r = s * 0.3;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.7"/>
  <circle cx="${x}" cy="${y}" r="${r*0.7}" fill="none" stroke="${c1}" stroke-width="1.5" opacity="0.4"/>
  <circle cx="${x}" cy="${y}" r="${r*0.35}" fill="${c1}" opacity="0.15"/>
  <line x1="${x-r}" y1="${y}" x2="${x+r}" y2="${y}" stroke="${c1}" stroke-width="1" opacity="0.3"/>
  <line x1="${x}" y1="${y-r}" x2="${x}" y2="${y+r}" stroke="${c1}" stroke-width="1" opacity="0.3"/>`;
}
function generateToothSVG(x, y, s, c1, c2) {
  const cx = x, cy = y, r = s * 0.15;
  return `<path d="M${cx-r*0.8} ${cy-s*0.3} Q${cx-r*1.2} ${cy+s*0.05}, ${cx-r*1.0} ${cy+s*0.35} L${cx+r*0.2} ${cy+s*0.4} L${cx+r*1.0} ${cy+s*0.35} Q${cx+r*1.2} ${cy+s*0.05}, ${cx+r*0.8} ${cy-s*0.3} Z" fill="${c1}" opacity="0.85"/>
  <rect x="${cx-r*0.3}" y="${cy-s*0.2}" width="${r*0.6}" height="${r*0.5}" rx="2" fill="rgba(255,255,255,0.3)"/>`;
}
function generateFoodSVG(x, y, s, c1, c2) {
  const r = s * 0.35;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c1}" stroke-width="3" opacity="0.75"/>
  <circle cx="${x}" cy="${y}" r="${r*0.6}" fill="${c1}" opacity="0.3"/>
  <path d="M${x-s*0.15} ${y-s*0.1} L${x+s*0.15} ${y+s*0.1} M${x-s*0.15} ${y+s*0.1} L${x+s*0.15} ${y-s*0.1}" stroke="${c1}" stroke-width="2" opacity="0.5"/>
  <circle cx="${x-s*0.08}" cy="${y-s*0.05}" r="4" fill="rgba(255,255,255,0.4)"/>
  <circle cx="${x+s*0.08}" cy="${y+s*0.08}" r="3" fill="rgba(255,255,255,0.4)"/>`;
}
function generateNerveSVG(x, y, s, c1, c2) {
  return `<path d="M${x-s*0.5} ${y} Q${x-s*0.2} ${y-s*0.3}, ${x} ${y} Q${x+s*0.2} ${y+s*0.3}, ${x+s*0.5} ${y}" fill="none" stroke="${c1}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M${x-s*0.3} ${y-s*0.15} Q${x-s*0.1} ${y-s*0.35}, ${x+s*0.1} ${y-s*0.15}" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <path d="M${x-s*0.2} ${y+s*0.15} Q${x} ${y+s*0.35}, ${x+s*0.2} ${y+s*0.15}" fill="none" stroke="${c1}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>`;
}

const ICON_GENERATORS = {
  'heart': generateHeartSVG, 'ecg': generateECGSVG, 'brain': generateBrainSVG,
  'dna': generateDNASVG, 'virus': generateVirusSVG, 'microscope': generateMicroscopeSVG,
  'syringe': generateSyringeSVG, 'stethoscope': generateStethoscopeSVG,
  'child': generateChildSVG, 'pharmacy': generatePharmacySVG, 'tech': generateTechSVG,
  'monitor': generateMonitorSVG, 'fitness': generateFitnessSVG, 'shield': generateShieldSVG,
  'globe': generateGlobeSVG, 'thyroid': generateThyroidSVG, 'bacteria': generateBacteriaSVG,
  'capsule': generateCapsuleSVG, 'pill': generatePillSVG, 'artery': generateArterySVG,
  'neuron': generateNeuronSVG, 'eye': generateEyeSVG, 'ear': generateEarSVG,
  'drop': generateDropSVG, 'bone': generateBoneSVG, 'apple': generateAppleSVG,
  'stomach': generateStomachSVG, 'people': generatePeopleSVG,
  'cell-division': generateCellDivisionSVG, 'baby': generateBabySVG,
  'mri': generateMRISVG, 'tooth': generateToothSVG, 'food': generateFoodSVG,
  'nerve': generateNerveSVG,
};

function generateSVG(categorySlug, index) {
  const design = CATEGORY_DESIGN[categorySlug];
  if (!design) return null;

  const c1 = design.colors[0];
  const c2 = design.colors[index % design.colors.length];
  const c3 = design.colors[(index + 1) % design.colors.length];
  const layout = LAYOUTS[index % LAYOUTS.length];

  const iconNames = design.icons;
  const mainIcon = iconNames[index % iconNames.length];
  const secondIcon = iconNames[(index + 1) % iconNames.length];
  const thirdIcon = iconNames[(index + 2) % iconNames.length];

  const bgGrad = `linear-gradient(${index * 15}deg, ${c1}, ${c2})`;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  svg += `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">`;
  svg += `<stop offset="0%" style="stop-color:${c1}"/>`;
  svg += `<stop offset="100%" style="stop-color:${c2}"/>`;
  svg += `</linearGradient>`;
  svg += `<linearGradient id="g2" x1="100%" y1="0%" x2="0%" y2="100%">`;
  svg += `<stop offset="0%" style="stop-color:${c2}"/>`;
  svg += `<stop offset="100%" style="stop-color:${c3}"/>`;
  svg += `</linearGradient>`;
  svg += `<linearGradient id="ol" x1="0%" y1="0%" x2="0%" y2="100%">`;
  svg += `<stop offset="0%" style="stop-color:rgba(255,255,255,0.12)"/>`;
  svg += `<stop offset="100%" style="stop-color:rgba(0,0,0,0.08)"/>`;
  svg += `</linearGradient>`;
  svg += `</defs>`;

  svg += `<rect width="${W}" height="${H}" fill="url(#g)"/>`;
  svg += `<rect width="${W}" height="${H}" fill="url(#ol)"/>`;

  const decoHue = (index * 37) % 360;
  svg += `<circle cx="${W*0.08}" cy="${H*0.08}" r="${W*0.25}" fill="rgba(255,255,255,0.03)"/>`;
  svg += `<circle cx="${W*0.92}" cy="${H*0.92}" r="${W*0.3}" fill="rgba(255,255,255,0.03)"/>`;
  svg += `<circle cx="${W*0.9}" cy="${H*0.08}" r="${W*0.1}" fill="rgba(255,255,255,0.03)"/>`;
  svg += `<circle cx="${W*0.1}" cy="${H*0.9}" r="${W*0.12}" fill="rgba(255,255,255,0.03)"/>`;

  const mainGen = ICON_GENERATORS[mainIcon] || generateHeartSVG;
  const secondGen = ICON_GENERATORS[secondIcon] || generateHeartSVG;
  const thirdGen = ICON_GENERATORS[thirdIcon] || generateHeartSVG;

  const ix = W * 0.3, iy = H * 0.4, is = 100;
  const ix2 = W * 0.7, iy2 = H * 0.4, is2 = 80;
  const ix3 = W * 0.5, iy3 = H * 0.6, is3 = 60;

  if (layout === 'centered') {
    svg += `<g transform="translate(0, -15)">${mainGen(ix, iy-15, is*1.2, 'url(#g)', 'url(#g2)')}</g>`;
  } else if (layout === 'left-heavy') {
    svg += `<g transform="translate(-100, -10)">${mainGen(ix-50, iy, is*1.1, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(120, 10)">${secondGen(ix2+20, iy2, is2*0.8, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'right-heavy') {
    svg += `<g transform="translate(100, -10)">${mainGen(ix2+50, iy, is*1.1, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(-120, 10)">${secondGen(ix-50, iy2, is2*0.8, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'diagonal-tl') {
    svg += `<g transform="translate(-80, -50)">${mainGen(ix-20, iy-20, is, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(100, 60)">${secondGen(ix2+10, iy2+10, is2*0.7, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'diagonal-tr') {
    svg += `<g transform="translate(80, -50)">${mainGen(ix2+20, iy-20, is, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(-100, 60)">${secondGen(ix-10, iy2+10, is2*0.7, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'split-horizontal') {
    svg += `<g transform="translate(-160, -20)">${mainGen(ix-30, iy-10, is*0.9, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(0, 10)">${secondGen(W*0.5, iy, is*0.9, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'split-vertical') {
    svg += `<g transform="translate(-80, -50)">${mainGen(ix, iy-30, is*0.85, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(-80, 50)">${secondGen(ix, iy+30, is*0.85, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'circular') {
    for (let a = 0; a < 360; a += 120) {
      const rad = a * Math.PI / 180;
      const lx = W*0.5 + Math.cos(rad) * 180;
      const ly = H*0.4 + Math.sin(rad) * 100;
      sg = (a === 0) ? mainGen : (a === 120 ? secondGen : thirdGen);
      sc = (a === 0) ? 'url(#g)' : 'url(#g2)';
      svg += `<g>${sg(lx, ly, 55, sc, 'url(#g)')}</g>`;
    }
  } else if (layout === 'grid-2x2') {
    svg += `<g>${mainGen(W*0.25, H*0.28, 60, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g>${secondGen(W*0.75, H*0.28, 60, 'url(#g2)', 'url(#g)')}</g>`;
    svg += `<g>${thirdGen(W*0.25, H*0.6, 60, 'url(#g2)', 'url(#g)')}</g>`;
    svg += `<g>${mainGen(W*0.75, H*0.6, 60, 'url(#g)', 'url(#g2)')}</g>`;
  } else if (layout === 'grid-3x1') {
    svg += `<g>${mainGen(W*0.2, H*0.4, 55, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g>${secondGen(W*0.5, H*0.4, 55, 'url(#g2)', 'url(#g)')}</g>`;
    svg += `<g>${thirdGen(W*0.8, H*0.4, 55, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'stacked') {
    svg += `<g>${mainGen(W*0.5, H*0.28, 65, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g>${secondGen(W*0.5, H*0.52, 50, 'url(#g2)', 'url(#g)')}</g>`;
  } else if (layout === 'triptych') {
    svg += `<g>${mainGen(W*0.2, H*0.4, 50, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(0, -10)">${secondGen(W*0.5, H*0.38, 60, 'url(#g2)', 'url(#g)')}</g>`;
    svg += `<g>${thirdGen(W*0.8, H*0.4, 50, 'url(#g)', 'url(#g2)')}</g>`;
  } else if (layout === 'framed') {
    svg += `<rect x="${W*0.05}" y="${H*0.05}" width="${W*0.9}" height="${H*0.9}" rx="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>`;
    svg += `<g transform="translate(0, -15)">${mainGen(W*0.5, H*0.38, is*1.1, 'url(#g)', 'url(#g2)')}</g>`;
  } else if (layout === 'floating') {
    svg += `<g transform="translate(-40, -30) rotate(-10, ${W*0.4}, ${H*0.4})">${mainGen(W*0.35, H*0.35, 70, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g transform="translate(40, 20) rotate(10, ${W*0.65}, ${H*0.5})">${secondGen(W*0.65, H*0.5, 60, 'url(#g2)', 'url(#g)')}</g>`;
  } else {
    svg += `<g transform="translate(0, -40)">${mainGen(W*0.5, H*0.3, is*1.3, 'url(#g)', 'url(#g2)')}</g>`;
    svg += `<g>${secondGen(W*0.3, H*0.7, 45, 'url(#g2)', 'url(#g)')}</g>`;
    svg += `<g>${thirdGen(W*0.7, H*0.7, 45, 'url(#g2)', 'url(#g)')}</g>`;
  }

  svg += `<text x="${W*0.5}" y="${H-35}" text-anchor="middle" fill="rgba(255,255,255,0.12)" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="18" font-weight="300" letter-spacing="3">${design.name.toUpperCase()}</text>`;

  for (let i = 0; i < 3; i++) {
    const dx = W * 0.5 - 25 + i * 25;
    svg += `<circle cx="${dx}" cy="${H-22}" r="2.5" fill="rgba(255,255,255,${0.1 + i * 0.03})"/>`;
  }

  svg += `</svg>`;
  return svg;
}

async function regenerateAllSVGs(perCategory = 30) {
  console.log(`Regenerating SVGs with enhanced design (${perCategory} per category)...`);
  let total = 0;

  for (const [slug, design] of Object.entries(CATEGORY_DESIGN)) {
    for (let i = 0; i < perCategory; i++) {
      const svgContent = generateSVG(slug, i);
      if (!svgContent) continue;
      const idx = String(i + 1).padStart(2, '0');
      const filename = `topic-${slug}-${idx}.svg`;
      fs.writeFileSync(path.join(UPLOADS_DIR, filename), svgContent);
      total++;
    }
    const catSvg = generateSVG(slug, 0);
    if (catSvg) {
      fs.writeFileSync(path.join(UPLOADS_DIR, `cat-${slug}.svg`), catSvg);
    }
  }

  console.log(`Generated ${total} SVGs across ${Object.keys(CATEGORY_DESIGN).length} categories`);
  return total;
}

module.exports = { generateSVG, regenerateAllSVGs, ICON_GENERATORS, CATEGORY_DESIGN, LAYOUTS };
