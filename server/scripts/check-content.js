require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL});

(async () => {
  const {rows: stats} = await p.query('SELECT MIN(LENGTH(content)) as mi, MAX(LENGTH(content)) as mx, ROUND(AVG(LENGTH(content))) as av FROM articles');
  console.log('Chars - Min:', stats[0].mi, 'Max:', stats[0].mx, 'Avg:', stats[0].av);
  
  const {rows: dupContent} = await p.query('SELECT COUNT(*) as c FROM (SELECT content FROM articles GROUP BY content HAVING COUNT(*) > 1) x');
  console.log('Duplicate content:', dupContent[0].c);
  
  // Check if IDs 91-95 have same content
  const {rows: same} = await p.query('SELECT content FROM articles WHERE id = 91');
  const {rows: same2} = await p.query('SELECT content FROM articles WHERE id = 92');
  console.log('\nID 91 == ID 92 content:', same[0].content === same2[0].content);
  console.log('ID 91 length:', same[0].content.length, 'ID 92 length:', same2[0].content.length);
  
  await p.end();
})();
