const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'images.json');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));

async function downloadImage(url, destPath) {
  const actualDest = destPath.replace(/\.svg$/, '.jpg');

  return new Promise((resolve) => {
    https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        console.log('  FAIL [' + res.statusCode + '] ' + url.slice(-40));
        resolve(false);
        return;
      }
      const fileStream = fs.createWriteStream(actualDest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        const kb = fs.statSync(actualDest).size / 1024;
        console.log('  OK ' + actualDest.split(/[/\\]/).pop() + ' (' + kb.toFixed(0) + ' KB)');
        resolve(true);
      });
      fileStream.on('error', () => { try { fs.unlinkSync(actualDest); } catch(e) {} resolve(false); });
    }).on('error', () => resolve(false));
  });
}

async function getUnsplashDownloadUrl(photoId) {
  return new Promise((resolve) => {
    // If photoId is already a numeric ID or URL, use it directly
    if (photoId.startsWith('http')) { resolve(photoId); return; }
    if (/^\d/.test(photoId)) {
      resolve('https://images.unsplash.com/photo-' + photoId + '?w=1200&h=675&fit=crop&q=85');
      return;
    }
    // For string photo IDs, try the download page (may require specific headers)
    const url = 'https://unsplash.com/photos/' + photoId + '/download?force=true';
    const opts = {
      hostname: 'unsplash.com',
      path: '/photos/' + photoId + '/download?force=true',
      method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    };
    const req = https.request(opts, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(res.headers.location.split('?')[0] + '?w=1200&h=675&fit=crop&q=85');
      } else {
        resolve(null);
      }
    });
    req.on('error', () => resolve(null));
    req.end();
  });
}

async function main() {
  console.log('Downloading Unsplash images...\n');

  // Download category images
  for (const [slug, cat] of Object.entries(config.categories)) {
    if (!cat.unsplashPhotoId) {
      console.log('[' + slug + '] no photo ID, skipping');
      continue;
    }
    const destPath = path.join(UPLOADS_DIR, 'cat-' + slug + '.svg');
    console.log('[' + slug + '] resolving photo ID...');
    const imgUrl = await getUnsplashDownloadUrl(cat.unsplashPhotoId);
    if (imgUrl) {
      await downloadImage(imgUrl, destPath);
    } else {
      console.log('  FAILED to resolve photo ID: ' + cat.unsplashPhotoId);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
