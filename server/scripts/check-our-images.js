require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL});

(async () => {
  // Check specifically for articles 91-180 (our expanded set)
  const {rows: ours} = await p.query("SELECT id, LEFT(image,100) as img, LENGTH(content) as len FROM articles WHERE id BETWEEN 91 AND 180 ORDER BY id");
  console.log('Our 90 articles (IDs 91-180):');
  let withImg = 0;
  ours.forEach(r => {
    const has = r.img ? 'YES' : 'NO';
    if (r.img) withImg++;
    if (r.id <= 95 || r.id % 10 === 0) console.log('  ID', r.id, '- image:', has, '(' + r.len + 'ch)');
  });
  console.log('\nTotal with images:', withImg, 'of', ours.length);
  
  await p.end();
})();
