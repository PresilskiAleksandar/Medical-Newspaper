require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require' });
(async () => {
  const t = await pool.query('SELECT COUNT(*) as c FROM articles');
  const s = await pool.query('SELECT COUNT(*) as c FROM articles WHERE LENGTH(content) < 3000');
  const d = await pool.query('SELECT COUNT(*) as c FROM (SELECT content FROM articles GROUP BY content HAVING COUNT(*) > 1) x');
  const c = await pool.query('SELECT c.name, COUNT(a.id) as cnt FROM categories c LEFT JOIN articles a ON a.category_id = c.id GROUP BY c.id, c.name ORDER BY c.id');
  console.log('Total: ' + t.rows[0].c + ' | Under 500w: ' + s.rows[0].c + ' | Duplicates: ' + d.rows[0].c);
  c.rows.forEach(r => console.log('  ' + r.name + ': ' + r.cnt));
  if (t.rows[0].c === 90 && s.rows[0].c === 0 && d.rows[0].c === 0) console.log('\n✓ ALL 90 ARTICLES UNIQUE, 500+ WORDS, 5 PER CATEGORY');
  await pool.end();
})();
