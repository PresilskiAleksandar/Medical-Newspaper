const https = require('https');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const MANIFEST_PATH = path.join(UPLOADS_DIR, 'unsplash-manifest.json');

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const API_BASE = 'api.unsplash.com';

const CATEGORY_SEARCH_QUERIES = {
  kardiologija: [
    'heart anatomy medical', 'cardiologist examination', 'ECG electrocardiogram',
    'cardiac surgery operation', 'heart blood vessels', 'blood pressure measurement',
    'echocardiography ultrasound', 'heart rhythm monitor', 'cardiovascular system',
  ],
  nevrologija: [
    'brain MRI scan', 'neurons neuroscience', 'neurology doctor',
    'brain anatomy medical', 'neurological examination', 'brain activity mapping',
    'nerve cells microscope', 'spinal cord anatomy', 'EEG brain monitoring',
  ],
  onkologija: [
    'cancer research laboratory', 'oncology treatment', 'tumor cells microscope',
    'chemotherapy patient', 'radiation therapy medical', 'cancer DNA research',
    'oncology consultation', 'biopsy pathology', 'immunotherapy cancer treatment',
  ],
  psihijatrija: [
    'therapy counseling session', 'mental health consultation', 'psychology therapy',
    'mindfulness meditation', 'brain mental wellness', 'psychiatric care',
    'cognitive behavioral therapy', 'stress relief wellness', 'group therapy session',
  ],
  pedijatrija: [
    'pediatric doctor child', 'baby health checkup', 'child vaccination',
    'children hospital playroom', 'pediatrician examination', 'newborn baby care',
    'child development therapy', 'adolescent health check', 'kids medical care',
  ],
  'infektivni-bolesti': [
    'virus microbiology lab', 'bacteria culture petri dish', 'infectious disease research',
    'vaccine development laboratory', 'pandemic prevention', 'antibiotic resistance research',
    'epidemiology tracking', 'pathogen microscope', 'hospital infection control',
  ],
  ishrana: [
    'healthy food nutrition', 'fresh vegetables fruits', 'balanced diet meal',
    'superfoods healthy eating', 'nutritionist consultation', 'organic produce market',
    'meal prep healthy cooking', 'vitamin supplements', 'Mediterranean diet food',
  ],
  stomatologija: [
    'dental examination treatment', 'teeth cleaning dentist', 'oral hygiene care',
    'dental surgery operation', 'orthodontic braces treatment', 'dental X-ray imaging',
    'pediatric dentistry child', 'tooth implant procedure', 'dental laboratory',
  ],
  farmacija: [
    'pharmacy prescription drugs', 'pharmacist consultation', 'medication pills',
    'pharmacy counter store', 'clinical pharmacy', 'herbal medicine natural',
    'prescription dispensing', 'pharmaceutical care', 'over counter medicines',
  ],
  'medicinski-tehnologii': [
    'medical technology equipment', 'MRI scanner machine', 'CT scan diagnostic',
    'robotic surgery operating room', 'ultrasound diagnostic imaging', 'digital health technology',
    'laboratory analysis equipment', 'patient monitoring ICU', 'wearable health technology',
  ],
  'medicina-na-trud': [
    'occupational health safety', 'workplace ergonomics', 'industrial safety worker',
    'employee health screening', 'protective equipment worker', 'office ergonomics posture',
    'occupational therapy rehabilitation', 'workplace wellness program', 'safety inspection industry',
  ],
  'opsta-medicina': [
    'general practice doctor', 'family medicine consultation', 'primary care clinic',
    'medical examination checkup', 'stethoscope doctor patient', 'diagnostic tests laboratory',
    'preventive healthcare screening', 'telemedicine virtual consultation', 'patient doctor communication',
  ],
  imunologija: [
    'immune system cells', 'antibody research laboratory', 'vaccine immunology',
    'lymphocyte T cell microscope', 'autoimmune disease research', 'allergy testing skin',
    'immunotherapy treatment', 'immune response cells', 'cytokine molecular biology',
  ],
  endokrinologija: [
    'thyroid gland anatomy', 'diabetes glucose testing', 'hormone therapy treatment',
    'pancreas insulin medical', 'endocrine system anatomy', 'blood sugar monitoring',
    'metabolic health nutrition', 'adrenal gland medical', 'diabetic patient care',
  ],
  'fitnes-i-prevencija': [
    'fitness exercise workout', 'preventive healthcare screening', 'healthy lifestyle active',
    'gym strength training', 'cardio exercise running', 'yoga flexibility wellness',
    'sports medicine rehabilitation', 'health prevention checkup', 'personal trainer fitness',
  ],
  genetika: [
    'DNA helix genetics', 'genetic research laboratory', 'genome sequencing DNA',
    'CRISPR gene editing', 'chromosome molecular biology', 'genetic testing counseling',
    'gene therapy research', 'DNA analysis laboratory', 'epigenetics molecular research',
  ],
  farmakologija: [
    'pharmaceutical research laboratory', 'drug development medicine', 'clinical trials research',
    'medication pills capsules', 'pharmacology science laboratory', 'prescription drugs pharmacy',
    'drug discovery research', 'natural remedies alternative', 'medicine capsules tablets',
  ],
  'javno-zdravje': [
    'public health community', 'epidemiology research map', 'healthcare system hospital',
    'health education community', 'vaccination campaign program', 'health statistics data',
    'global health WHO', 'health policy government', 'environmental health protection',
  ],
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function searchPhotos(query, perPage = 20) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({ query, per_page: String(perPage), orientation: 'landscape' });
    const options = {
      hostname: API_BASE,
      path: `/search/photos?${params}`,
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.errors) return reject(new Error(parsed.errors.join(', ')));
          resolve(parsed.results || parsed);
        } catch (e) {
          reject(new Error('Failed to parse response: ' + e.message));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

function loadManifest() {
  try {
    if (fs.existsSync(MANIFEST_PATH)) {
      return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    }
  } catch (e) { }
  return { photos: [], categories: {} };
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
}

async function downloadCategoryPhotos(categorySlug, queries, maxPerCategory = 30) {
  const manifest = loadManifest();
  let downloaded = manifest.categories[categorySlug]?.length || 0;
  if (downloaded >= maxPerCategory) {
    console.log(`  Already have ${downloaded} photos for ${categorySlug}, skipping`);
    return downloaded;
  }

  const seenIds = new Set(manifest.photos.map(p => p.id));

  for (const query of queries) {
    if (downloaded >= maxPerCategory) break;
    console.log(`  Searching "${query}"...`);
    try {
      const results = await searchPhotos(query, Math.min(20, maxPerCategory - downloaded));
      if (!results || results.length === 0) continue;

      for (const photo of results) {
        if (downloaded >= maxPerCategory) break;
        if (seenIds.has(photo.id)) continue;
        seenIds.add(photo.id);

        const idx = downloaded + 1;
        const filename = `unsplash-${categorySlug}-${String(idx).padStart(2, '0')}.jpg`;
        const destPath = path.join(UPLOADS_DIR, filename);

        try {
          console.log(`    Downloading ${filename}...`);
          await downloadImage(photo.urls.regular, destPath);

          const photoInfo = {
            id: photo.id,
            filename,
            category: categorySlug,
            unsplashId: photo.id,
            photographer: photo.user.name,
            photographerUsername: photo.user.username,
            photographerUrl: photo.user.links.html,
            unsplashUrl: photo.links.html,
            altDescription: photo.alt_description || '',
            width: photo.width,
            height: photo.height,
            blurHash: photo.blur_hash || '',
          };

          manifest.photos.push(photoInfo);
          if (!manifest.categories[categorySlug]) manifest.categories[categorySlug] = [];
          manifest.categories[categorySlug].push(photoInfo);
          downloaded++;
          saveManifest(manifest);

          await sleep(150);
        } catch (err) {
          console.error(`    Failed to download ${filename}: ${err.message}`);
          continue;
        }
      }
    } catch (err) {
      console.error(`  Search failed for "${query}": ${err.message}`);
      await sleep(1000);
      continue;
    }
    await sleep(500);
  }

  console.log(`  Total for ${categorySlug}: ${downloaded} photos`);
  return downloaded;
}

async function downloadAll() {
  console.log('=== Unsplash Photo Downloader ===\n');
  console.log(`Access Key: ${ACCESS_KEY.substring(0, 8)}...\n`);

  let total = 0;
  for (const [slug, queries] of Object.entries(CATEGORY_SEARCH_QUERIES)) {
    console.log(`\n--- ${slug} ---`);
    const count = await downloadCategoryPhotos(slug, queries);
    total += count;
    await sleep(1000);
  }

  console.log(`\n=== Done! Downloaded ${total} photos total ===`);
  return total;
}

function getPhotosForCategory(slug) {
  const manifest = loadManifest();
  return manifest.categories[slug] || [];
}

function getAllPhotos() {
  const manifest = loadManifest();
  return manifest.photos;
}

module.exports = { downloadAll, downloadCategoryPhotos, getPhotosForCategory, getAllPhotos, CATEGORY_SEARCH_QUERIES };
