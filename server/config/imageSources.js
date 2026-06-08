const path = require('path');
const fs = require('fs');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');

const knownFiles = new Set();
try { fs.readdirSync(UPLOADS_DIR).filter(f => f.endsWith('.jpg') || f.endsWith('.png')).forEach(f => knownFiles.add(f)); } catch(e) {}

function findLocalFile(prefix) {
  return [...knownFiles].find(f => f.startsWith(prefix) && (f.endsWith('.jpg') || f.endsWith('.png')));
}

const CATEGORY_IMAGES = {
  kardiologija:              { file: '/uploads/cat-cardio.jpg',      keyword: 'heart',          unsplashId: 'ilya-pavlov-OqtafYT5kTw' },
  nevrologija:               { file: '/uploads/cat-neuro.jpg',       keyword: 'brain',          unsplashId: 'robina-weermeijer-dI1y5F0Vtdk' },
  onkologija:                { file: '/uploads/cat-oncology.jpg',    keyword: 'cancer research',unsplashId: 'national-cancer-institute-L8tWZT4CcVQ' },
  psihijatrija:              { file: '/uploads/cat-psychiatry.jpg',  keyword: 'psychology',     unsplashId: 'sincerely-media-dGxOgeXAXwE' },
  pedijatrija:               { file: '/uploads/cat-pediatrics.jpg',  keyword: 'child healthcare',unsplashId: 'jelleke-vanooteghem-su00wR3UGjA' },
  'infektivni-bolesti': { file: '/uploads/cat-infectious.jpg',  keyword: 'virus',          unsplashId: 'cdc-7SZr11N0Gq0' },
  ishrana:                   { file: '/uploads/cat-nutrition.jpg',   keyword: 'healthy food',   unsplashId: 'anna-pelzer-IGfIGP5ONV0' },
  stomatologija:             { file: '/uploads/cat-dental.jpg',      keyword: 'dentistry',      unsplashId: 'caroline-lm-8N3oFhEiJfE' },
  farmacija:                 { file: '/uploads/cat-pharmacy.jpg',    keyword: 'pharmacy',       unsplashId: 'jess-bailey-l3N9Q27zULw' },
  'medicinski-tehnologii':   { file: '/uploads/cat-medtech.jpg',     keyword: 'medical technology', unsplashId: 'jesse-orrico-V2gG0JhT7dM' },
  'medicina-na-trud':        { file: '/uploads/cat-occupational.jpg',keyword: 'occupational health', unsplashId: 'brook-cagle-D6q7wTN_7hk' },
  'opsta-medicina':          { file: '/uploads/cat-general.jpg',     keyword: 'general medicine', unsplashId: 'mufid-majnun-9BSR0HcezMI' },
  imunologija:               { file: null, keyword: 'immune system', unsplashId: 'national-cancer-institute-NFvdKI9aC2U' },
  endokrinologija:           { file: null, keyword: 'thyroid diabetes', unsplashId: 'myriam-zilles-KlVgA7nLpLk' },
  'fitnes-i-prevencija':     { file: null, keyword: 'fitness',      unsplashId: 'sven-mieke-MsCgmHqL4Rs' },
  genetika:                  { file: null, keyword: 'DNA genetics',  unsplashId: 'sangharsh-lohakare-AzKNI0Z2yEk' },
  farmakologija:             { file: null, keyword: 'medications pills', unsplashId: 'jess-bailey-l3N9Q27zULw' },
  'javno-zdravje':           { file: null, keyword: 'public health community', unsplashId: 'mufid-majnun-9BSR0HcezMI' },
};

const ARTICLE_KEYWORD_TO_TOPIC = {
  // Cardiology
  'heart': 'kardiologija', 'cardiology': 'kardiologija', 'cardiovascular': 'kardiologija', 'blood pressure': 'kardiologija',
  'hypertension': 'kardiologija', 'ecg': 'kardiologija', 'arrhythmia': 'kardiologija', 'cholesterol': 'kardiologija',
  'artery': 'kardiologija', 'cardiac': 'kardiologija', 'heart attack': 'kardiologija', 'stroke': 'kardiologija',
  'atrial fibrillation': 'kardiologija', 'stent': 'kardiologija', 'bypass': 'kardiologija',

  // Neurology
  'brain': 'nevrologija', 'neurology': 'nevrologija', 'neurological': 'nevrologija', 'alzheimer': 'nevrologija',
  'parkinson': 'nevrologija', 'dementia': 'nevrologija', 'migraine': 'nevrologija', 'seizure': 'nevrologija',
  'epilepsy': 'nevrologija', 'neurons': 'nevrologija', 'nerve': 'nevrologija', 'spinal cord': 'nevrologija',
  'multiple sclerosis': 'nevrologija', 'cerebral': 'nevrologija',

  // Oncology
  'cancer': 'onkologija', 'oncology': 'onkologija', 'tumor': 'onkologija', 'malignant': 'onkologija',
  'chemotherapy': 'onkologija', 'radiation therapy': 'onkologija', 'immunotherapy': 'onkologija',
  'biopsy': 'onkologija', 'carcinoma': 'onkologija', 'leukemia': 'onkologija',

  // Psychiatry
  'depression': 'psihijatrija', 'anxiety': 'psihijatrija', 'psychiatry': 'psihijatrija', 'mental health': 'psihijatrija',
  'psychology': 'psihijatrija', 'therapy': 'psihijatrija', 'stress': 'psihijatrija', 'cognitive behavioral': 'psihihijatrija',
  'bipolar': 'psihijatrija', 'schizophrenia': 'psihijatrija', 'adhd': 'psihijatrija', 'autism': 'psihijatrija',
  'wellness': 'psihijatrija', 'mindfulness': 'psihijatrija',

  // Pediatrics
  'pediatrics': 'pedijatrija', 'children': 'pedijatrija', 'child': 'pedijatrija', 'infant': 'pedijatrija',
  'newborn': 'pedijatrija', 'vaccination': 'pedijatrija', 'adolescent': 'pedijatrija', 'pediatric': 'pedijatrija',

  // Infectious Diseases
  'virus': 'infektivni-bolesti', 'bacteria': 'infektivni-bolesti', 'infection': 'infektivni-bolesti',
  'infectious': 'infektivni-bolesti', 'antibiotic': 'infektivni-bolesti', 'vaccine': 'infektivni-bolesti',
  'pandemic': 'infektivni-bolesti', 'covid': 'infektivni-bolesti', 'microbiology': 'infektivni-bolesti',

  // Nutrition
  'nutrition': 'ishrana', 'diet': 'ishrana', 'food': 'ishrana', 'healthy eating': 'ishrana',
  'vitamin': 'ishrana', 'mineral': 'ishrana', 'antioxidant': 'ishrana', 'calories': 'ishrana',
  'mediterranean diet': 'ishrana', 'obesity': 'ishrana', 'weight loss': 'ishrana',

  // Immunology
  'immune': 'imunologija', 'immunology': 'imunologija', 'antibody': 'imunologija', 'autoimmune': 'imunologija',
  'lymphocyte': 'imunologija', 'allergy': 'imunologija', 'immunization': 'imunologija',

  // Endocrinology
  'diabetes': 'endokrinologija', 'thyroid': 'endokrinologija', 'hormone': 'endokrinologija',
  'endocrinology': 'endokrinologija', 'insulin': 'endokrinologija', 'glucose': 'endokrinologija',
  'metabolic': 'endokrinologija',

  // Fitness
  'fitness': 'fitnes-i-prevencija', 'exercise': 'fitnes-i-prevencija', 'workout': 'fitnes-i-prevencija',
  'prevention': 'fitnes-i-prevencija', 'physical activity': 'fitnes-i-prevencija',

  // Genetics
  'dna': 'genetika', 'genetics': 'genetika', 'gene': 'genetika', 'genome': 'genetika',
  'crispr': 'genetika', 'mutation': 'genetika', 'chromosome': 'genetika',

  // Pharmacology
  'pharmacy': 'farmakologija', 'pharmacology': 'farmakologija', 'medication': 'farmakologija',
  'drug': 'farmakologija', 'prescription': 'farmakologija', 'pharmaceutical': 'farmakologija',
  'clinical trial': 'farmakologija',

  // Dentistry
  'dentistry': 'stomatologija', 'dental': 'stomatologija', 'teeth': 'stomatologija', 'oral health': 'stomatologija',

  // General Medicine
  'general practice': 'opsta-medicina', 'primary care': 'opsta-medicina', 'diagnosis': 'opsta-medicina',
  'medical examination': 'opsta-medicina', 'telemedicine': 'opsta-medicina',

  // Occupational Medicine
  'occupational': 'medicina-na-trud', 'workplace safety': 'medicina-na-trud', 'ergonomic': 'medicina-na-trud',

  // Medical Technology
  'medical technology': 'medicinski-tehnologii', 'mri': 'medicinski-tehnologii', 'ultrasound': 'medicinski-tehnologii',
  'robotic surgery': 'medicinski-tehnologii', 'digital health': 'medicinski-tehnologii',

  // Public Health
  'public health': 'javno-zdravje', 'epidemiology': 'javno-zdravje', 'health policy': 'javno-zdravje',
};

const UNSPLASH_PHOTOS_BY_KEYWORD = {
  'heart': ['ilya-pavlov-OqtafYT5kTw', 'myriam-zilles-8N3oFhEiJfE', 'bruno-martins-tJ4n7Oq2w8o'],
  'brain': ['robina-weermeijer-dI1y5F0Vtdk', 'sincerely-media-dGxOgeXAXwE'],
  'cancer research': ['national-cancer-institute-L8tWZT4CcVQ', 'national-cancer-institute-NFvdKI9aC2U', 'national-cancer-institute-W6aKcS0hE7E'],
  'psychology': ['sincerely-media-dGxOgeXAXwE', 'priscilla-du-preez-XkKCi44j1KQ'],
  'child healthcare': ['jelleke-vanooteghem-su00wR3UjGjA', 'kelly-sikkema-Oz-JhFkVn6E'],
  'virus': ['cdc-7SZr11N0Gq0', 'cdc-NKI2K3Jj6H0'],
  'healthy food': ['anna-pelzer-IGfIGP5ONV0', 'lily-banse--YHSwy6uqvk'],
  'dentistry': ['caroline-lm-8N3oFhEiJfE', 'mohamed-elsayed-2utKjVms50U'],
  'pharmacy': ['jess-bailey-l3N9Q27zULw', 'jess-bailey-JihocMpj_5I'],
  'medical technology': ['jesse-orrico-V2gG0JhT7dM', 'national-cancer-institute-W6aKcS0hE7E'],
  'occupational health': ['brook-cagle-D6q7wTN_7hk'],
  'general medicine': ['mufid-majnun-9BSR0HcezMI', 'hush-naidoo-jade-phpt8J4I6M4'],
  'immune system': ['national-cancer-institute-NFvdKI9aC2U'],
  'thyroid diabetes': ['myriam-zilles-KlVgA7nLpLk'],
  'fitness': ['sven-mieke-MsCgmHqL4Rs', 'humphrey-muleba-LJqJw9sBZ0E'],
  'DNA genetics': ['sangharsh-lohakare-AzKNI0Z2yEk'],
  'medications pills': ['jess-bailey-l3N9Q27zULw', 'jess-bailey-m61fQ9qC5bk'],
  'public health community': ['mufid-majnun-9BSR0HcezMI'],
  'blood pressure': ['myriam-zilles-KlVgA7nLpLk'],
  'sedentary lifestyle': ['brook-cagle-D6q7wTN_7hk'],
  'alzheimer brain': ['robina-weermeijer-dI1y5F0Vtdk'],
  'parkinson brain': ['robina-weermeijer-dI1y5F0Vtdk'],
  'cancer biomarkers': ['national-cancer-institute-L8tWZT4CcVQ'],
  'immunotherapy cancer': ['national-cancer-institute-NFvdKI9aC2U'],
  'adolescent depression': ['priscilla-du-preez-XkKCi44j1KQ'],
  'digital detox': ['sincerely-media-dGxOgeXAXwE'],
  'child vaccination': ['jelleke-vanooteghem-su00wR3UjGjA'],
  'rare pediatric diseases': ['kelly-sikkema-Oz-JhFkVn6E'],
  'antibiotic resistance': ['cdc-7SZr11N0Gq0'],
  'antiviral research': ['cdc-NKI2K3Jj6H0'],
  'mediterranean diet': ['anna-pelzer-IGfIGP5ONV0'],
  'digestive health': ['lily-banse--YHSwy6uqvk'],
  'autoimmune disease': ['national-cancer-institute-NFvdKI9aC2U'],
  'mrna vaccine': ['cdc-7SZr11N0Gq0'],
  'diabetes glucose': ['myriam-zilles-KlVgA7nLpLk'],
  'metabolic syndrome': ['myriam-zilles-KlVgA7nLpLk'],
  'CRISPR gene': ['sangharsh-lohakare-AzKNI0Z2yEk'],
  'pharmacogenetics': ['jess-bailey-l3N9Q27zULw'],
  'clinical trials': ['jess-bailey-m61fQ9qC5bk'],
  'drug interactions': ['jess-bailey-l3N9Q27zULw'],
  'health inequalities': ['mufid-majnun-9BSR0HcezMI'],
  'chronic disease prevention': ['national-cancer-institute-L8tWZT4CcVQ'],
};

module.exports = { CATEGORY_IMAGES, ARTICLE_KEYWORD_TO_TOPIC, UNSPLASH_PHOTOS_BY_KEYWORD, knownFiles };
