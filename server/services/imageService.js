const path = require('path');
const fs = require('fs');
const { getPhotosForCategory, getAllPhotos } = require('./unsplashDownloader');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

let usedImages = new Set();
let usedUnsplashIds = new Set();

function resetUsedImages() { usedImages = new Set(); usedUnsplashIds = new Set(); }
function markUsed(imagePath) { if (imagePath) usedImages.add(imagePath); }

function fileExists(name) {
  return fs.existsSync(path.join(UPLOADS_DIR, name));
}

function listFiles(prefix) {
  try {
    return fs.readdirSync(UPLOADS_DIR).filter(f => f.startsWith(prefix)).sort();
  } catch (e) { return []; }
}

const MEDICAL_DICT = {
  'srce': 'heart', 'срцев': 'heart', 'срцева': 'heart', 'кардиологија': 'kardiologija',
  'срцеви': 'heart', 'крвен притисок': 'blood-pressure', 'хипертензија': 'hypertension',
  'крвниот притисок': 'blood-pressure', 'притисок': 'blood-pressure',
  'мозок': 'brain', 'мозочен': 'brain', 'неврологија': 'nevrologija',
  'неврон': 'neuron', 'нерв': 'nerve', 'нервен': 'nerve',
  'алцхајмер': 'alzheimer', 'паркинсон': 'parkinson', 'деменција': 'dementia',
  'рак': 'cancer', 'карцином': 'cancer', 'тумор': 'tumor', 'онкологија': 'onkologija',
  'малигн': 'cancer', 'метастаза': 'cancer', 'хемотерапија': 'chemotherapy',
  'депресија': 'depression', 'анксиозност': 'anxiety', 'психијатрија': 'psihijatrija',
  'ментално': 'mental-health', 'психологија': 'psychology', 'стрес': 'stress',
  'терапија': 'therapy', 'биполарно': 'bipolar', 'шизофренија': 'schizophrenia',
  'дете': 'pediatrics', 'деца': 'pediatrics', 'детска': 'pediatrics',
  'педијатрија': 'pedijatrija', 'бебе': 'baby', 'новороденче': 'newborn',
  'адолесцент': 'adolescent', 'вакцинација': 'vaccination',
  'вирус': 'virus', 'вирусен': 'virus', 'бактерија': 'bacteria',
  'инфекција': 'infection', 'инфективни': 'infektivni-bolesti',
  'вакцина': 'vaccine', 'антибиотик': 'antibiotic', 'пандемија': 'pandemic',
  'ковид': 'covid', 'имунитет': 'immune', 'имунолошки': 'immune',
  'исхрана': 'ishrana', 'диета': 'diet', 'нутриција': 'nutrition',
  'витамин': 'vitamin', 'минерал': 'mineral', 'антиоксиданс': 'antioxidant',
  'дијабетес': 'diabetes', 'тироиден': 'thyroid', 'тироидна': 'thyroid',
  'инсулин': 'insulin', 'гликоза': 'glucose', 'метаболичен': 'metabolic',
  'ендокринологија': 'endokrinologija', 'хормон': 'hormone',
  'имун': 'immune', 'автоимун': 'autoimmune', 'антитело': 'antibody',
  'днк': 'dna', 'ген': 'gene', 'генетика': 'genetika', 'генетски': 'genetic',
  'фитнес': 'fitness', 'вежбање': 'exercise', 'тренинг': 'fitness',
  'спорт': 'sports', 'превенција': 'prevention',
  'фармација': 'farmacy', 'лек': 'medication', 'лекови': 'medications',
  'фармакологија': 'pharmacology', 'фармацевт': 'pharmacist',
  'стоматологија': 'stomatologija', 'заб': 'dental', 'заби': 'dental',
  'дентален': 'dental', 'орално': 'oral-health',
  'технологија': 'medical-tech', 'технологии': 'medical-tech',
  'мри': 'mri', 'ултразвук': 'ultrasound', 'дигитален': 'digital-health',
  'вештачка интелигенција': 'ai-health',
  'јавно здравје': 'public-health', 'јавното здравје': 'public-health',
  'епидемиологија': 'epidemiology', 'популација': 'population',
  'труд': 'occupational', 'работа': 'occupational', 'работно': 'occupational',
  'ергономија': 'ergonomics', 'безбедност': 'safety',
  'општа медицина': 'general-medicine', 'дијагноза': 'diagnosis',
  'преглед': 'checkup', 'семејна медицина': 'family-medicine',
  'кардиоваскуларни': 'heart', 'срцева слабост': 'heart-failure',
  'срцев удар': 'heart-attack', 'инфаркт': 'heart-attack',
  'аритмија': 'arrhythmia', 'стент': 'stent', 'бајпас': 'bypass',
  'холестерол': 'cholesterol', 'атеросклероза': 'atherosclerosis',
  'мозочен удар': 'stroke', 'епилепсија': 'epilepsy', 'мигрена': 'migraine',
  'мултиплекс склероза': 'multiple-sclerosis',
  'гојазност': 'obesity', 'тежина': 'weight', 'калории': 'calories',
  'стомачен': 'stomach', 'дигестивен': 'digestive', 'црево': 'intestine',
  'бубрег': 'kidney', 'црн дроб': 'liver', 'бел дроб': 'lung',
  'бременост': 'pregnancy', 'операција': 'surgery', 'хирургија': 'surgery',
  'анестезија': 'anesthesia', 'пушење': 'smoking', 'алкохол': 'alcohol',
  'депресија': 'depression', 'психоза': 'psychosis', 'птраума': 'trauma',
  'астма': 'asthma', 'алиергија': 'allergy', 'кожа': 'skin',
  'остеопороза': 'osteoporosis', 'артритис': 'arthritis',
  'анемија': 'anemia', 'леукемија': 'leukemia',
  'антиоксиданс': 'antioxidant', 'пробиотик': 'probiotic',
  'имунотерапија': 'immunotherapy', 'радиотерапија': 'radiotherapy',
};

const ENGLISH_TOPIC_KEYWORDS = {
  'heart': 'kardiologija', 'cardiology': 'kardiologija', 'cardiovascular': 'kardiologija',
  'cardiac': 'kardiologija', 'hypertension': 'kardiologija', 'blood pressure': 'kardiologija',
  'ecg': 'kardiologija', 'arrhythmia': 'kardiologija', 'cholesterol': 'kardiologija',
  'stent': 'kardiologija', 'bypass': 'kardiologija', 'heart attack': 'kardiologija',
  'heart failure': 'kardiologija', 'atherosclerosis': 'kardiologija',

  'brain': 'nevrologija', 'neurology': 'nevrologija', 'neurological': 'nevrologija',
  'alzheimer': 'nevrologija', 'parkinson': 'nevrologija', 'dementia': 'nevrologija',
  'migraine': 'nevrologija', 'epilepsy': 'nevrologija', 'seizure': 'nevrologija',
  'neurons': 'nevrologija', 'nerve': 'nevrologija', 'spinal cord': 'nevrologija',
  'multiple sclerosis': 'nevrologija', 'stroke': 'nevrologija', 'cerebral': 'nevrologija',

  'cancer': 'onkologija', 'oncology': 'onkologija', 'tumor': 'onkologija',
  'malignant': 'onkologija', 'chemotherapy': 'onkologija', 'radiation': 'onkologija',
  'immunotherapy': 'onkologija', 'biopsy': 'onkologija', 'carcinoma': 'onkologija',
  'leukemia': 'onkologija', 'metastasis': 'onkologija',

  'depression': 'psihijatrija', 'anxiety': 'psihijatrija', 'psychiatry': 'psihijatrija',
  'mental health': 'psihijatrija', 'psychology': 'psihijatrija', 'therapy': 'psihijatrija',
  'stress': 'psihijatrija', 'bipolar': 'psihijatrija', 'schizophrenia': 'psihijatrija',
  'adhd': 'psihijatrija', 'autism': 'psihijatrija', 'mindfulness': 'psihijatrija',
  'wellness': 'psihijatrija', 'counseling': 'psihijatrija',

  'pediatrics': 'pedijatrija', 'children': 'pedijatrija', 'child': 'pedijatrija',
  'infant': 'pedijatrija', 'newborn': 'pedijatrija', 'baby': 'pedijatrija',
  'vaccination': 'pedijatrija', 'adolescent': 'pedijatrija', 'pediatric': 'pedijatrija',
  'kids': 'pedijatrija',

  'virus': 'infektivni-bolesti', 'bacteria': 'infektivni-bolesti', 'infection': 'infektivni-bolesti',
  'infectious': 'infektivni-bolesti', 'antibiotic': 'infektivni-bolesti', 'vaccine': 'infektivni-bolesti',
  'pandemic': 'infektivni-bolesti', 'covid': 'infektivni-bolesti', 'microbiology': 'infektivni-bolesti',
  'pathogen': 'infektivni-bolesti', 'contagious': 'infektivni-bolesti',

  'nutrition': 'ishrana', 'diet': 'ishrana', 'food': 'ishrana', 'healthy eating': 'ishrana',
  'vitamin': 'ishrana', 'mineral': 'ishrana', 'antioxidant': 'ishrana', 'calories': 'ishrana',
  'obesity': 'ishrana', 'weight loss': 'ishrana', 'meal': 'ishrana', 'cooking': 'ishrana',
  'superfood': 'ishrana', 'organic': 'ishrana',

  'immune': 'imunologija', 'immunology': 'imunologija', 'antibody': 'imunologija',
  'autoimmune': 'imunologija', 'allergy': 'imunologija', 'immunization': 'imunologija',
  'lymphocyte': 'imunologija', 'vaccine': 'imunologija',

  'diabetes': 'endokrinologija', 'thyroid': 'endokrinologija', 'hormone': 'endokrinologija',
  'endocrinology': 'endokrinologija', 'insulin': 'endokrinologija', 'glucose': 'endokrinologija',
  'metabolic': 'endokrinologija', 'pancreas': 'endokrinologija',

  'fitness': 'fitnes-i-prevencija', 'exercise': 'fitnes-i-prevencija', 'workout': 'fitnes-i-prevencija',
  'prevention': 'fitnes-i-prevencija', 'physical activity': 'fitnes-i-prevencija',
  'yoga': 'fitnes-i-prevencija', 'sports': 'fitnes-i-prevencija',

  'dna': 'genetika', 'genetics': 'genetika', 'gene': 'genetika', 'genome': 'genetika',
  'crispr': 'genetika', 'mutation': 'genetika', 'chromosome': 'genetika',
  'genomic': 'genetika', 'hereditary': 'genetika',

  'pharmacy': 'farmakologija', 'pharmacology': 'farmakologija', 'medication': 'farmakologija',
  'drug': 'farmakologija', 'prescription': 'farmakologija', 'pharmaceutical': 'farmakologija',
  'clinical trial': 'farmakologija', 'medicine': 'farmakologija',

  'dentistry': 'stomatologija', 'dental': 'stomatologija', 'teeth': 'stomatologija',
  'oral health': 'stomatologija', 'tooth': 'stomatologija', 'gums': 'stomatologija',

  'general practice': 'opsta-medicina', 'primary care': 'opsta-medicina', 'diagnosis': 'opsta-medicina',
  'checkup': 'opsta-medicina', 'telemedicine': 'opsta-medicina', 'family doctor': 'opsta-medicina',

  'occupational': 'medicina-na-trud', 'workplace safety': 'medicina-na-trud', 'ergonomic': 'medicina-na-trud',
  'worker health': 'medicina-na-trud',

  'medical technology': 'medicinski-tehnologii', 'mri': 'medicinski-tehnologii',
  'ultrasound': 'medicinski-tehnologii', 'robotic surgery': 'medicinski-tehnologii',
  'digital health': 'medicinski-tehnologii', 'ai': 'medicinski-tehnologii',

  'public health': 'javno-zdravje', 'epidemiology': 'javno-zdravje', 'health policy': 'javno-zdravje',
  'population health': 'javno-zdravje', 'healthcare system': 'javno-zdravje',
};

function extractKeywords(title, content, tags) {
  const text = ((title || '') + ' ' + (tags || '') + ' ' + (content || '')).toLowerCase();
  const stopWords = new Set([
    'the','and','for','are','but','not','you','all','can','had','her','was','one','our','out','has',
    'have','been','some','with','from','that','this','they','what','which','their','about','into',
    'over','after','than','then','these','when','where','would','could','should','also','more',
    'very','just','each','such','new','site','na','vo','od','za','i','se','so','da','ne','ko',
    'go','po','to','or','an','in','it','is','of','as','at','by','we','he','she','no','ako',
    'но','дека','што','кој','како','си','ги','ми','ти','ни','ви','ме','те','го','ја',
  ]);

  const words = text.split(/[\s,\-—–.()"'""«»:;!?/\\]+/).filter(w => w.length > 2 && !stopWords.has(w));
  const foundTopics = new Set();
  const foundTerms = [];

  for (let i = 0; i < words.length; i++) {
    const trigram = i < words.length - 2 ? `${words[i]} ${words[i+1]} ${words[i+2]}` : '';
    const bigram = i < words.length - 1 ? `${words[i]} ${words[i+1]}` : '';
    const unigram = words[i];

    for (const phrase of [trigram, bigram, unigram]) {
      const p = phrase.toLowerCase().trim();
      if (foundTopics.has(p)) continue;

      const match = MEDICAL_DICT[p] || MEDICAL_DICT[Object.keys(MEDICAL_DICT).find(k => p.includes(k) || k.includes(p))];
      if (match) {
        foundTopics.add(p);
        foundTerms.push(match);
        break;
      }
    }
  }

  return [...new Set(foundTerms)];
}

function determinePrimaryTopic(title, content, tags, categorySlug) {
  const text = ((title || '') + ' ' + (tags || '') + ' ' + (content || '')).toLowerCase();
  const scores = {};

  Object.entries(ENGLISH_TOPIC_KEYWORDS).forEach(([kw, cat]) => {
    if (text.includes(kw.toLowerCase())) {
      scores[cat] = (scores[cat] || 0) + 5;
    }
  });

  if (title) {
    const titleWords = title.toLowerCase();
    Object.entries(ENGLISH_TOPIC_KEYWORDS).forEach(([kw, cat]) => {
      if (titleWords.includes(kw.toLowerCase())) {
        scores[cat] = (scores[cat] || 0) + 15;
      }
    });
  }

  if (categorySlug) {
    scores[categorySlug] = (scores[categorySlug] || 0) + 3;
  }

  const dictTerms = extractKeywords(title, content, tags);
  dictTerms.forEach(term => {
    const catSlug = ENGLISH_TOPIC_KEYWORDS[term];
    if (catSlug) {
      scores[catSlug] = (scores[catSlug] || 0) + 3;
    } else {
      for (const [mk, mv] of Object.entries(MEDICAL_DICT)) {
        if (mv === term) {
          const directCat = ENGLISH_TOPIC_KEYWORDS[mv];
          if (directCat) scores[directCat] = (scores[directCat] || 0) + 2;
          break;
        }
      }
    }
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : (categorySlug || 'opsta-medicina');
}

function getCategoryImage(slug) {
  const unsplashPhotos = getPhotosForCategory(slug);
  if (unsplashPhotos.length > 0) {
    return `/uploads/${unsplashPhotos[0].filename}`;
  }

  for (const prefix of [`topic-${slug}`, `cat-${slug}`]) {
    const files = listFiles(prefix);
    if (files.length > 0) {
      return `/uploads/${files[0]}`;
    }
  }

  return '/uploads/medical-fallback.svg';
}

function getArticleImage(title, content, categorySlug, tags) {
  const topic = determinePrimaryTopic(title, content, tags, categorySlug);
  const categoryForSlug = ENGLISH_TOPIC_KEYWORDS[topic] || topic || categorySlug;

  const scored = [];

  const unsplashPhotos = getPhotosForCategory(categoryForSlug);
  for (const photo of unsplashPhotos) {
    if (!usedUnsplashIds.has(photo.id)) {
      scored.push({ score: 200, path: `/uploads/${photo.filename}`, id: photo.id, type: 'unsplash' });
    }
  }

  if (categoryForSlug !== categorySlug) {
    const catUnsplash = getPhotosForCategory(categorySlug);
    for (const photo of catUnsplash) {
      if (!usedUnsplashIds.has(photo.id)) {
        scored.push({ score: 180, path: `/uploads/${photo.filename}`, id: photo.id, type: 'unsplash' });
      }
    }
  }

  const topicSvgs = listFiles(`topic-${categoryForSlug}`);
  for (const svg of topicSvgs) {
    if (!usedImages.has(`/uploads/${svg}`)) {
      scored.push({ score: 120, path: `/uploads/${svg}`, type: 'svg' });
    }
  }

  if (categoryForSlug !== categorySlug) {
    const fallbackTopicSvgs = listFiles(`topic-${categorySlug}`);
    for (const svg of fallbackTopicSvgs) {
      if (!usedImages.has(`/uploads/${svg}`)) {
        scored.push({ score: 100, path: `/uploads/${svg}`, type: 'svg' });
      }
    }
  }

  scored.sort((a, b) => b.score - a.score);

  for (const s of scored) {
    if (s.type === 'unsplash') {
      if (!usedUnsplashIds.has(s.id) && !usedImages.has(s.path)) {
        usedUnsplashIds.add(s.id);
        usedImages.add(s.path);
        return s.path;
      }
    } else if (!usedImages.has(s.path)) {
      usedImages.add(s.path);
      return s.path;
    }
  }

  return getSvgFallback(categorySlug);
}

function getSvgFallback(categorySlug) {
  const svgs = listFiles(`topic-${categorySlug}`).filter(f => !usedImages.has(`/uploads/${f}`));
  if (svgs.length > 0) {
    const p = `/uploads/${svgs[0]}`;
    usedImages.add(p);
    return p;
  }
  const catSvg = `/uploads/cat-${categorySlug}.svg`;
  if (fileExists(`cat-${categorySlug}.svg`)) {
    usedImages.add(catSvg);
    return catSvg;
  }
  return '/uploads/medical-fallback.svg';
}

module.exports = {
  extractKeywords, getArticleImage, getCategoryImage, determinePrimaryTopic,
  resetUsedImages, markUsed,
};
