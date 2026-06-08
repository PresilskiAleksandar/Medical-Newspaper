require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const MANIFEST_PATH = path.join(UPLOADS_DIR, 'unsplash-manifest.json');

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

const https = require('https');
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const API_BASE = 'api.unsplash.com';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function searchPhotos(query, perPage = 5) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({ query, per_page: String(perPage), orientation: 'landscape' });
    const options = {
      hostname: API_BASE,
      path: `/search/photos?${params}`,
      method: 'GET',
      headers: { 'Authorization': `Client-ID ${ACCESS_KEY}`, 'Accept-Version': 'v1' },
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
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

const QUERIES = {
  'construction-safety': 'construction site safety equipment hard hat protection',
  'burnout-empty-office': 'stress desk burnout empty office chair',
  'chemical-laboratory': 'chemical laboratory glassware experiment flasks',
  'office-chair-back-ergonomics': 'office chair back support ergonomics design',
  'occupational-health': 'occupational health medical workplace assessment',
  'lungs-anatomy': 'lungs anatomy respiratory human organ medical',
  'chemical-hazard': 'chemical hazard warning sign safety dangerous',
  'hearing-test': 'audiometer hearing test equipment medical device',
  'scream-glass-box': 'frustration scream mouth open glass window stress emotion',
  'first-aid': 'first aid kit medical emergency supplies',
  'radiation-formula': 'radiation symbol formula physics nuclear atomic energy',
  'laboratory-testing': 'laboratory test tubes samples analysis scientific',
  'asbestos-warning': 'asbestos warning hazard sign industrial safety',
  'night-shift': 'night shift working office building at night people',
};

const ARTICLE_IMAGE_MAP = [
  { id: 30,  query: 'construction-safety',   title: 'Професионални заболувања кај градежните работници' },
  { id: 31,  query: 'burnout-empty-office',   title: 'Синдром на изгорување на работното место - Burnout' },
  { id: 32,  query: 'chemical-laboratory',    title: 'Изложеност на хемиски супстанции на работното место' },
  { id: 33,  query: 'office-chair-back-ergonomics', title: 'Ергономија на работното место' },
  { id: 254, query: 'occupational-health',    title: 'Медицина на труд и проценка на работна способност' },
  { id: 255, query: 'lungs-anatomy',          title: 'Превенција од професионални заболувања на бел дроб' },
  { id: 256, query: 'office-chair-back-ergonomics', title: 'Ергономија на работното место и превенција' },
  { id: 257, query: 'chemical-hazard',        title: 'Изложеност на хемиски агенси на работното место' },
  { id: 258, query: 'hearing-test',           title: 'Аудиометриски скрининг' },
  { id: 259, query: 'scream-glass-box',       title: 'Стрес на работното место и програми за превенција' },
  { id: 260, query: 'first-aid',              title: 'Менаџмент на професионални повреди' },
  { id: 261, query: 'radiation-formula',      title: 'Изложеност на јонизирачко зрачење кај здравствени работници' },
  { id: 262, query: 'laboratory-testing',     title: 'Биолошки мониторинг на изложеност на токсични супстанци' },
  { id: 263, query: 'asbestos-warning',       title: 'Здравствен надзор на работници изложени на азбест' },
  { id: 264, query: 'night-shift',            title: 'Ноќна работа и влијание врз здравјето' },
];

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) { console.error('DATABASE_URL not set'); process.exit(1); }
  const db = new Pool({ connectionString: dbUrl });
  const manifest = loadManifest();
  const seenIds = new Set(manifest.photos.map(p => p.id));
  const queryCache = {};

  console.log('=== Update Medicina na Trud Images ===\n');

  let success = 0;
  let skip = 0;

  for (const article of ARTICLE_IMAGE_MAP) {
    let photo = queryCache[article.query];

    if (!photo) {
      const results = await searchPhotos(QUERIES[article.query], 5);
      if (!results || results.length === 0) {
        console.log(`  FAIL id=${article.id} no results for "${article.query}"`);
        skip++;
        continue;
      }

      const newPhoto = results.find(p => !seenIds.has(p.id));
      if (!newPhoto) {
        console.log(`  FAIL id=${article.id} no unseen photos for "${article.query}"`);
        console.log(`  ${results.length} results, but all already in manifest`);
        skip++;
        continue;
      }

      const catSlug = 'medicina-na-trud';
      const existingCount = (manifest.categories[catSlug] || []).length;
      const idx = existingCount + 1;
      const filename = `unsplash-${catSlug}-${String(idx).padStart(2, '0')}.jpg`;
      const destPath = path.join(UPLOADS_DIR, filename);

      console.log(`  Downloading ${filename} for "${article.query}"...`);
      try {
        await downloadImage(newPhoto.urls.regular, destPath);
      } catch (err) {
        console.log(`  FAIL id=${article.id} download error: ${err.message}`);
        skip++;
        continue;
      }

      const photoInfo = {
        id: newPhoto.id,
        filename,
        category: catSlug,
        unsplashId: newPhoto.id,
        photographer: newPhoto.user.name,
        photographerUsername: newPhoto.user.username,
        photographerUrl: newPhoto.user.links.html,
        unsplashUrl: newPhoto.links.html,
        altDescription: newPhoto.alt_description || '',
        width: newPhoto.width,
        height: newPhoto.height,
        blurHash: newPhoto.blur_hash || '',
      };

      manifest.photos.push(photoInfo);
      if (!manifest.categories[catSlug]) manifest.categories[catSlug] = [];
      manifest.categories[catSlug].push(photoInfo);
      saveManifest(manifest);
      queryCache[article.query] = photoInfo;
      photo = photoInfo;

      await sleep(300);
    }

    await db.query('UPDATE articles SET image = $1 WHERE id = $2', [`/uploads/${photo.filename}`, article.id]);
    console.log(`  OK   id=${article.id} -> /uploads/${photo.filename} (${article.title.substring(0, 50)})`);
    success++;
  }

  console.log(`\n=== Results ===`);
  console.log(`  Updated: ${success}`);
  console.log(`  Skipped: ${skip}`);

  await db.end();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
