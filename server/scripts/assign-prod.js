const { Pool } = require('pg');
const { getArticleImage, getCategoryImage, resetUsedImages } = require('../services/imageService');
const { getAllPhotos } = require('../services/unsplashDownloader');

const pool = new Pool({connectionString: 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'});

async function main() {
  const photos = getAllPhotos();
  console.log(`Unsplash photos available: ${photos.length}`);

  // Step 1: Category images
  const categories = await pool.query("SELECT slug FROM categories ORDER BY id");
  console.log(`\n=== Step 1: Category images ===`);
  for (const cat of categories.rows) {
    const img = getCategoryImage(cat.slug);
    await pool.query('UPDATE categories SET image = $1 WHERE slug = $2', [img, cat.slug]);
    console.log(`  ${cat.slug}: ${img.startsWith('/uploads/unsplash') ? 'UNSPLASH' : 'SVG'} - ${img}`);
  }

  // Step 2: Article images
  console.log(`\n=== Step 2: Article images ===`);
  const articles = await pool.query(`
    SELECT a.id, a.title, a.excerpt, a.content, c.slug AS category_slug
    FROM articles a LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.id
  `);
  console.log(`Total articles: ${articles.rows.length}`);

  resetUsedImages();
  let unsplashCount = 0, svgCount = 0;
  for (const article of articles.rows) {
    const contentForAnalysis = (article.excerpt || '') + ' ' + (article.content || '');
    const img = getArticleImage(article.title, contentForAnalysis, article.category_slug, '');
    await pool.query('UPDATE articles SET image = $1 WHERE id = $2', [img, article.id]);
    if (img.includes('unsplash')) unsplashCount++;
    else if (img.includes('.svg')) svgCount++;
  }

  console.log(`\n=== Results ===`);
  console.log(`Updated: ${articles.rows.length} articles`);
  console.log(`Unsplash photos: ${unsplashCount}`);
  console.log(`SVG fallbacks: ${svgCount}`);

  const {rows: check} = await pool.query("SELECT COUNT(*) as c FROM articles WHERE image IS NOT NULL AND image != ''");
  console.log(`Articles with images in DB: ${check[0].c}`);
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
