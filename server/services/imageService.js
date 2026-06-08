const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

let usedImages = new Set();

function resetUsedImages() { usedImages = new Set(); }
function markUsed(imagePath) { if (imagePath) usedImages.add(imagePath); }

const CATEGORY_JPG_MAP = {
  'kardiologija': '/uploads/cat-cardio.jpg',
  'nevrologija': '/uploads/cat-neuro.jpg',
  'onkologija': '/uploads/cat-oncology.jpg',
  'psihijatrija': '/uploads/cat-psychiatry.jpg',
  'pedijatrija': '/uploads/cat-pediatrics.jpg',
  'infektivni-bolesti': '/uploads/cat-infectious.jpg',
  'ishrana': '/uploads/cat-nutrition.jpg',
  'stomatologija': '/uploads/cat-dental.jpg',
  'farmacija': '/uploads/cat-pharmacy.jpg',
  'medicinski-tehnologii': '/uploads/cat-medtech.jpg',
  'medicina-na-trud': '/uploads/cat-occupational.jpg',
  'opsta-medicina': '/uploads/cat-general.jpg',
  'imunologija': '/uploads/img126.jpg',
  'endokrinologija': '/uploads/img103.jpg',
  'fitnes-i-prevencija': '/uploads/img117.jpg',
  'genetika': '/uploads/img125.jpg',
  'farmakologija': '/uploads/img122.jpg',
  'javno-zdravje': '/uploads/img109.jpg',
};

const IMG_MAP = {};
const IMG_POOL = [];
for (let i = 101; i <= 127; i++) {
  const p = '/uploads/img' + i + '.jpg';
  const f = 'img' + i + '.jpg';
  if (fs.existsSync(path.join(UPLOADS_DIR, f))) {
    IMG_POOL.push(p);
    IMG_MAP[f] = p;
  }
}

const KEYWORD_TO_IMAGES = {
  'heart': ['img101.jpg','img102.jpg','img103.jpg','cat-cardio.jpg'],
  'kardiologija': ['cat-cardio.jpg','img102.jpg','img103.jpg'],
  'blood pressure': ['img101.jpg','img102.jpg'],
  'brain': ['img104.jpg','img105.jpg','cat-neuro.jpg'],
  'nevrologija': ['cat-neuro.jpg','img104.jpg','img105.jpg'],
  'alzheimer': ['img104.jpg','img105.jpg'],
  'parkinson': ['img104.jpg','img105.jpg'],
  'cancer research': ['img106.jpg','img107.jpg','cat-oncology.jpg','img122.jpg','img123.jpg'],
  'onkologija': ['cat-oncology.jpg','img106.jpg','img107.jpg'],
  'psychology': ['img108.jpg','img109.jpg','img110.jpg','cat-psychiatry.jpg'],
  'psihijatrija': ['cat-psychiatry.jpg','img108.jpg','img109.jpg','img110.jpg'],
  'mental health': ['img108.jpg','img109.jpg','img110.jpg'],
  'adolescent depression': ['img108.jpg','img110.jpg'],
  'child healthcare': ['img111.jpg','img112.jpg','cat-pediatrics.jpg'],
  'pedijatrija': ['cat-pediatrics.jpg','img111.jpg','img112.jpg'],
  'child vaccination': ['img111.jpg','img112.jpg'],
  'virus': ['img113.jpg','img114.jpg','cat-infectious.jpg'],
  'infektivni-bolesti': ['cat-infectious.jpg','img113.jpg','img114.jpg'],
  'antibiotic resistance': ['img113.jpg','img114.jpg'],
  'healthy food': ['img115.jpg','img116.jpg','cat-nutrition.jpg'],
  'ishrana': ['cat-nutrition.jpg','img115.jpg','img116.jpg'],
  'mediterranean diet': ['img115.jpg','img116.jpg'],
  'digestive health': ['img116.jpg','img115.jpg'],
  'fitness': ['img117.jpg','img118.jpg','img119.jpg'],
  'fitnes-i-prevencija': ['img117.jpg','img118.jpg','img119.jpg'],
  'exercise': ['img117.jpg','img118.jpg','img119.jpg'],
  'dentistry': ['img120.jpg','img121.jpg','cat-dental.jpg'],
  'stomatologija': ['cat-dental.jpg','img120.jpg','img121.jpg'],
  'pharmacy': ['img122.jpg','img123.jpg','cat-pharmacy.jpg'],
  'farmacija': ['cat-pharmacy.jpg','img122.jpg','img123.jpg'],
  'medications pills': ['img122.jpg','img123.jpg'],
  'clinical trials': ['img122.jpg','img124.jpg'],
  'medical technology': ['img124.jpg','img125.jpg','cat-medtech.jpg'],
  'medicinski-tehnologii': ['cat-medtech.jpg','img124.jpg','img125.jpg'],
  'immune system': ['img126.jpg','img127.jpg'],
  'imunologija': ['img126.jpg','img127.jpg'],
  'autoimmune disease': ['img126.jpg','img127.jpg'],
  'diabetes glucose': ['img103.jpg','img101.jpg'],
  'endokrinologija': ['img103.jpg','img101.jpg'],
  'thyroid diabetes': ['img103.jpg'],
  'metabolic syndrome': ['img103.jpg','img101.jpg'],
  'dna genetics': ['img125.jpg','img126.jpg'],
  'genetika': ['img125.jpg','img126.jpg'],
  'pharmacology': ['img122.jpg','img123.jpg','img124.jpg'],
  'farmakologija': ['img122.jpg','img123.jpg'],
  'public health community': ['img109.jpg','img115.jpg','img117.jpg'],
  'javno-zdravje': ['img109.jpg','img115.jpg'],
  'general medicine': ['img101.jpg','img104.jpg','cat-general.jpg'],
  'opsta-medicina': ['cat-general.jpg','img101.jpg','img104.jpg'],
  'occupational health': ['img117.jpg','img118.jpg','cat-occupational.jpg'],
  'medicina-na-trud': ['cat-occupational.jpg','img117.jpg','img118.jpg'],
  'nerve': ['img104.jpg','img105.jpg'],
  'existing': IMG_POOL,
};

const MEDICAL_DICT = {
  'srce': 'heart', 'срцев': 'heart', 'срцева': 'heart', 'кардиологија': 'kardiologija', 'срцеви': 'heart',
  'крвен притисок': 'blood pressure', 'хипертензија': 'blood pressure', 'крвниот притисок': 'blood pressure',
  'мозок': 'brain', 'мозочен': 'brain', 'неврологија': 'nevrologija', 'неврон': 'brain', 'нерв': 'nerve', 'нервен': 'nerve',
  'алцхајмер': 'alzheimer', 'паркинсон': 'parkinson', 'деменција': 'alzheimer',
  'рак': 'cancer research', 'карцином': 'cancer research', 'тумор': 'cancer research', 'онкологија': 'onkologija',
  'депресија': 'adolescent depression', 'анксиозност': 'psychology', 'психијатрија': 'psihijatrija',
  'ментално': 'mental health', 'психологија': 'psychology', 'стрес': 'psychology', 'терапија': 'psychology',
  'дете': 'child healthcare', 'деца': 'child healthcare', 'детска': 'child healthcare', 'педијатрија': 'pedijatrija',
  'вирус': 'virus', 'вирусен': 'virus', 'бактерија': 'antibiotic resistance', 'инфекција': 'virus',
  'инфективни': 'infektivni-bolesti', 'вакцина': 'child vaccination', 'вакцинација': 'child vaccination',
  'исхрана': 'ishrana', 'диета': 'mediterranean diet', 'нутриција': 'healthy food', 'витамин': 'healthy food',
  'дијабетес': 'diabetes glucose', 'тироиден': 'thyroid diabetes', 'тироидна': 'thyroid diabetes',
  'инсулин': 'diabetes glucose', 'гликоза': 'diabetes glucose', 'метаболичен': 'metabolic syndrome',
  'ендокринологија': 'endokrinologija', 'хормон': 'thyroid diabetes',
  'имун': 'immune system', 'имунолошки': 'immune system', 'автоимун': 'autoimmune disease', 'антитело': 'immune system',
  'днк': 'dna genetics', 'ген': 'dna genetics', 'генетика': 'genetika', 'генетски': 'dna genetics',
  'фитнес': 'fitness', 'вежбање': 'fitness', 'тренинг': 'fitness', 'спорт': 'fitness', 'превенција': 'fitness',
  'фармација': 'farmacija', 'лек': 'medications pills', 'лекови': 'medications pills',
  'фармакологија': 'farmakologija', 'фармацевт': 'pharmacy',
  'стоматологија': 'stomatologija', 'заб': 'dentistry', 'заби': 'dentistry', 'дентален': 'dentistry',
  'технологија': 'medical technology', 'технологии': 'medical technology', 'мри': 'medical technology',
  'ултразвук': 'medical technology', 'дигитален': 'medical technology',
  'јавно здравје': 'javno-zdravje', 'јавното здравје': 'javno-zdravje', 'епидемиологија': 'public health community',
  'труд': 'medicina-na-trud', 'работа': 'occupational health', 'работно': 'occupational health',
  'општа медицина': 'opsta-medicina', 'дијагноза': 'general medicine', 'преглед': 'general medicine',
  'пушење': 'general medicine', 'алкохол': 'general medicine',
  'кардиоваскуларни': 'heart', 'срцева слабост': 'heart', 'срцев удар': 'heart', 'инфаркт': 'heart',
  'атријална': 'heart', 'аритмија': 'heart', 'стент': 'heart',
  'мозочен удар': 'brain', 'епилепсија': 'neurology', 'мигрена': 'neurology',
  'антибиотик': 'antibiotic resistance', 'пандемија': 'virus', 'ковид': 'virus',
  'гојазност': 'healthy food', 'тежина': 'fitness', 'калории': 'healthy food',
  'стомачен': 'digestive health', 'дигестивен': 'digestive health', 'црево': 'digestive health',
  'бубрег': 'general medicine', 'црн дроб': 'general medicine',
  'бременост': 'child healthcare', 'операција': 'medical technology', 'хирургија': 'medical technology',
  'вештачка интелигенција': 'medical technology',
};

function extractKeywords(title, content) {
  const fullText = (title + ' ' + (content || '')).toLowerCase();
  const stopWords = new Set(['the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has','have','been','some','with','from','that','this','they','what','which','their','about','into','over','after','than','then','these','when','where','would','could','should','also','more','very','just','each','such','new','site','na','vo','od','za','i','se','so','da','ne','ko','go','po','to','or','an','in','it','is','of','as','at','by','we','he','she','no']);
  const raw = fullText.split(/[\s,\-—–.()"''""«»:;!?/\\]+/).filter(w => w.length > 3 && !stopWords.has(w));
  const seen = new Set();
  const results = [];

  for (let i = 0; i < raw.length; i++) {
    const trigram = i < raw.length - 2 ? raw[i] + ' ' + raw[i+1] + ' ' + raw[i+2] : '';
    const bigram = i < raw.length - 1 ? raw[i] + ' ' + raw[i+1] : '';
    const unigram = raw[i];
    for (const phrase of [trigram, bigram, unigram]) {
      if (seen.has(phrase)) continue;
      const match = findKeyword(phrase);
      if (match) {
        seen.add(phrase);
        results.push(match);
        break;
      }
    }
  }
  return [...new Set(results)];
}

function findKeyword(phrase) {
  const p = phrase.toLowerCase().trim();
  if (KEYWORD_TO_IMAGES[p]) return p;
  for (const [mk, mv] of Object.entries(MEDICAL_DICT)) {
    if (p === mk || p.startsWith(mk + ' ') || p.endsWith(' ' + mk) || p.includes(mk)) {
      return mv;
    }
  }
  return null;
}

function getCategoryImage(slug) {
  if (CATEGORY_JPG_MAP[slug]) {
    const f = path.basename(CATEGORY_JPG_MAP[slug]);
    if (fs.existsSync(path.join(UPLOADS_DIR, f))) return CATEGORY_JPG_MAP[slug];
  }
  const jpgPath = '/uploads/cat-' + slug + '.jpg';
  if (fs.existsSync(path.join(UPLOADS_DIR, 'cat-' + slug + '.jpg'))) return jpgPath;
  const svgPath = '/uploads/cat-' + slug + '.svg';
  if (fs.existsSync(path.join(UPLOADS_DIR, 'cat-' + slug + '.svg'))) return svgPath;
  return '/uploads/medical-fallback.svg';
}

function fileExists(name) {
  return fs.existsSync(path.join(UPLOADS_DIR, name));
}

function getArticleImage(title, content, categorySlug) {
  const keywords = extractKeywords(title, content);

  const scored = [];
  for (const kw of keywords) {
    const candidates = KEYWORD_TO_IMAGES[kw];
    if (candidates) {
      candidates.forEach(f => {
        if (fileExists(f)) scored.push({ score: 100, path: '/uploads/' + f, keyword: kw });
      });
    }
  }

  if (CATEGORY_JPG_MAP[categorySlug]) {
    const f = path.basename(CATEGORY_JPG_MAP[categorySlug]);
    if (fileExists(f)) scored.push({ score: 60, path: CATEGORY_JPG_MAP[categorySlug], keyword: 'cat-' + categorySlug });
  }

  for (const p of IMG_POOL) {
    const f = path.basename(p);
    if (fileExists(f)) scored.push({ score: 30, path: p, keyword: 'generic' });
  }

  scored.sort((a, b) => b.score - a.score);

  for (const s of scored) {
    if (!usedImages.has(s.path)) {
      usedImages.add(s.path);
      return s.path;
    }
  }

  return getSvgFallback(categorySlug);
}

function getSvgFallback(categorySlug) {
  const prefix = 'topic-' + categorySlug;
  try {
    const svgs = fs.readdirSync(UPLOADS_DIR)
      .filter(f => f.startsWith(prefix) && f.endsWith('.svg'))
      .filter(f => !usedImages.has('/uploads/' + f));
    if (svgs.length > 0) {
      const p = '/uploads/' + svgs[0];
      usedImages.add(p);
      return p;
    }
  } catch(e) {}
  const catSvg = '/uploads/cat-' + categorySlug + '.svg';
  if (fs.existsSync(path.join(UPLOADS_DIR, 'cat-' + categorySlug + '.svg'))) {
    usedImages.add(catSvg);
    return catSvg;
  }
  return '/uploads/medical-fallback.svg';
}

module.exports = {
  extractKeywords, getArticleImage, getCategoryImage,
  resetUsedImages, markUsed,
};
