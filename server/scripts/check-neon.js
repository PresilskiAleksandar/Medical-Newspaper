const { Pool } = require('pg');
const p = new Pool({connectionString: 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'});

(async () => {
  const {rows: s} = await p.query('SELECT MIN(LENGTH(content)) as mi, MAX(LENGTH(content)) as mx, ROUND(AVG(LENGTH(content))) as av, COUNT(*) as total FROM articles');
  const {rows: d} = await p.query("SELECT COUNT(*) as c FROM (SELECT content FROM articles GROUP BY content HAVING COUNT(*)>1) x");
  const {rows: w} = await p.query("SELECT COUNT(*) as c FROM articles WHERE LENGTH(content) < 3000");
  const {rows: ids} = await p.query('SELECT id, LEFT(title,80) as t, LENGTH(content) as len FROM articles ORDER BY id LIMIT 10');
  
  console.log('=== PRODUCTION DB (Neon) ===');
  console.log('Total:', s[0].total);
  console.log('Chars - Min:', s[0].mi, 'Max:', s[0].mx, 'Avg:', s[0].av);
  console.log('Words ~ Min:', Math.round(s[0].mi/6), 'Max:', Math.round(s[0].mx/6), 'Avg:', Math.round(s[0].av/6));
  console.log('Duplicates:', d[0].c);
  console.log('Under 3000ch:', w[0].c);
  
  if (s[0].total === 90 && w[0].c > 0) {
    console.log('\nNeed to expand', w[0].c, 'articles');
  }
  
  if (ids.length > 0) {
    console.log('\nSample articles:');
    ids.forEach(r => console.log('  ID', r.id + ':', r.len + 'ch -', r.t));
  }
  
  await p.end();
})();
