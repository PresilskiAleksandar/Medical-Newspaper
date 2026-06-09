require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL || 'postgresql://user:password@neon-host/neondb?sslmode=require'});

(async () => {
  const {rows: s} = await p.query('SELECT MIN(LENGTH(content)) as mi, MAX(LENGTH(content)) as mx, ROUND(AVG(LENGTH(content))) as av, COUNT(*) as total FROM articles');
  const {rows: d} = await p.query("SELECT COUNT(*) as c FROM (SELECT content FROM articles GROUP BY content HAVING COUNT(*)>1) x");
  const {rows: w} = await p.query("SELECT COUNT(*) as c FROM articles WHERE LENGTH(content) < 3000");
  const {rows: cat} = await p.query("SELECT c.name, COUNT(a.id) as cnt FROM categories c LEFT JOIN articles a ON a.category_id = c.id GROUP BY c.name, c.id ORDER BY c.id");
  
  console.log('Total:', s[0].total);
  console.log('Chars - Min:', s[0].mi, 'Max:', s[0].mx, 'Avg:', s[0].av);
  console.log('Words ~ Min:', Math.round(s[0].mi/6), 'Max:', Math.round(s[0].mx/6), 'Avg:', Math.round(s[0].av/6));
  console.log('Duplicates:', d[0].c);
  console.log('Under 3000ch:', w[0].c);
  console.log('');
  cat.forEach(r => console.log(r.name + ':', r.cnt));
  
  await p.end();
})();
