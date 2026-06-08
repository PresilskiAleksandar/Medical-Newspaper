require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const { getArticleImage, getCategoryImage, resetUsedImages } = require('../services/imageService');

async function main() {
  const db = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log('=== Step 1: Assigning category images ===');
  const categories = await db.query('SELECT slug FROM categories ORDER BY id');
  for (const cat of categories.rows) {
    const img = getCategoryImage(cat.slug);
    if (img && !img.includes('svg')) {
      await db.query('UPDATE categories SET image = $1 WHERE slug = $2', [img, cat.slug]);
      console.log('  ' + cat.slug + ' -> ' + img);
    }
  }

  console.log('\n=== Step 2: Assigning article images ===');
  const articles = await db.query(`
    SELECT a.id, a.title, a.content, c.slug AS category_slug
    FROM articles a
    LEFT JOIN categories c ON a.category_id = c.id
    ORDER BY a.id
  `);
  console.log('Total articles: ' + articles.rows.length);

  resetUsedImages();
  let updated = 0, jpgAssigned = 0, svgAssigned = 0;

  for (const article of articles.rows) {
    const img = getArticleImage(article.title, article.content, article.category_slug);
    await db.query('UPDATE articles SET image = $1 WHERE id = $2', [img, article.id]);
    updated++;
    if (img.includes('.jpg')) jpgAssigned++;
    else svgAssigned++;
  }

  console.log('\n=== Results ===');
  console.log('Updated: ' + updated + ' articles');
  console.log('JPG assigned: ' + jpgAssigned);
  console.log('SVG assigned: ' + svgAssigned);

  const stats = await db.query("SELECT COUNT(*) as total, SUM(CASE WHEN image LIKE '%.jpg%' THEN 1 ELSE 0 END) as jpg, SUM(CASE WHEN image LIKE '%.svg%' THEN 1 ELSE 0 END) as svg FROM articles");
  console.log('\nDatabase final:');
  console.log('  Total: ' + stats.rows[0].total);
  console.log('  JPG: ' + stats.rows[0].jpg);
  console.log('  SVG: ' + stats.rows[0].svg);

  await db.end();
}

main().catch(err => { console.error(err); process.exit(1); });
