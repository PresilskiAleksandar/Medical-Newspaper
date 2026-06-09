require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL});

(async () => {
  const {rows: c} = await p.query('SELECT COUNT(*) as c FROM articles');
  console.log('Total articles:', c[0].c);
  
  const {rows: imgs} = await p.query("SELECT COUNT(*) as c FROM articles WHERE image IS NOT NULL AND image != ''");
  console.log('With images:', imgs[0].c);
  
  const {rows: sample} = await p.query('SELECT id, LEFT(image,100) as img FROM articles ORDER BY id LIMIT 10');
  console.log('\nSample images:');
  sample.forEach(r => console.log('  ID', r.id, '->', r.img));
  
  const {rows: cats} = await p.query("SELECT c.name, COUNT(a.id) as cnt FROM categories c LEFT JOIN articles a ON a.category_id = c.id GROUP BY c.name, c.id ORDER BY c.id");
  console.log('\nPer category:');
  cats.forEach(r => console.log('  ' + r.name + ': ' + r.cnt));
  
  await p.end();
})();
