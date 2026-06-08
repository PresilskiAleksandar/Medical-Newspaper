require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const { getArticleImage, getCategoryImage, resetUsedImages } = require('../services/imageService');
const { getAllPhotos } = require('../services/unsplashDownloader');

async function main() {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log('=== Image Assignment Report ===\n');

  const photos = getAllPhotos();
  console.log(`Unsplash photos available: ${photos.length}`);

  for (const p of photos.slice(0, 5)) {
    console.log(`  ${p.filename} - ${p.altDescription || 'no description'} (${p.photographer})`);
  }
  if (photos.length > 5) console.log(`  ... and ${photos.length - 5} more`);

  const categories = await db.query('SELECT slug FROM categories ORDER BY id');
  console.log(`\n=== Step 1: Category images ===`);
  for (const cat of categories.rows) {
    const img = getCategoryImage(cat.slug);
    await db.query('UPDATE categories SET image = $1 WHERE slug = $2', [img, cat.slug]);
    const type = img.includes('unsplash') ? 'UNSPLASH' : img.includes('svg') ? 'SVG' : 'JPG';
    console.log(`  ${cat.slug}: ${type} - ${img}`);
  }

  console.log(`\n=== Step 2: Article images ===`);
  const articles = await db.query(`
    SELECT a.id, a.title, a.excerpt, a.content, c.slug AS category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.id
  `);
  console.log(`Total articles: ${articles.rows.length}`);

  resetUsedImages();
  let updated = 0;
  let unsplashCount = 0;
  let svgCount = 0;

  for (const article of articles.rows) {
    const contentForAnalysis = (article.excerpt || '') + ' ' + (article.content || '');
    const img = getArticleImage(article.title, contentForAnalysis, article.category_slug, '');
    await db.query('UPDATE articles SET image = $1 WHERE id = $2', [img, article.id]);
    updated++;
    if (img.includes('unsplash')) unsplashCount++;
    else if (img.includes('.svg')) svgCount++;
    if (updated % 50 === 0) console.log(`  Processed ${updated}/${articles.rows.length}`);
  }

  console.log(`\n=== Results ===`);
  console.log(`Updated: ${updated} articles`);
  console.log(`Unsplash photos: ${unsplashCount}`);
  console.log(`SVG fallbacks: ${svgCount}`);

  await db.end();
}

main().catch(err => { console.error(err); process.exit(1); });
