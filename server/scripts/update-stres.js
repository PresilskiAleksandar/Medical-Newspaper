const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const PROD_DB = 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const newPhoto = {
  id: 'fru_EXsqsp4',
  filename: 'unsplash-medicina-na-trud-stres-01.jpg',
  category: 'medicina-na-trud',
  unsplashId: 'fru_EXsqsp4',
  photographer: 'Vitaly Gariev',
  photographerUsername: 'vitalygariev',
  photographerUrl: 'https://unsplash.com/@vitalygariev',
  unsplashUrl: 'https://unsplash.com/photos/a-man-sitting-at-a-desk-with-his-head-in-hands-fru_EXsqsp4',
  altDescription: 'a man sitting at a desk with his head in his hands',
  width: 3840,
  height: 2160,
  blurHash: 'LIF1r}9F%2%2~p%2D%xZ%MxZ%MxZ',
};

const manifestPath = path.join(__dirname, '..', 'uploads', 'unsplash-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

manifest.photos = manifest.photos.filter(p => p.filename !== newPhoto.filename);
manifest.photos.push(newPhoto);
manifest.categories['medicina-na-trud'] = (manifest.categories['medicina-na-trud'] || []).filter(p => p.filename !== newPhoto.filename);
manifest.categories['medicina-na-trud'].push(newPhoto);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('✓ Manifest updated');

const pool = new Pool({ connectionString: PROD_DB });
pool.query('UPDATE articles SET image = $1 WHERE id = $2', ['/uploads/unsplash-medicina-na-trud-stres-01.jpg', 286])
  .then(() => pool.query('SELECT id, image FROM articles WHERE id = $1', [286]))
  .then(r => { console.log('✓ Article 286:', r.rows[0].image); pool.end(); })
  .catch(err => { console.error('DB error:', err); pool.end(); });
