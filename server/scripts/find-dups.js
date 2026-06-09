require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const p = new Pool({connectionString: process.env.DATABASE_URL});

(async () => {
  // Find which content is duplicated and which IDs share it
  const {rows: dupGroups} = await p.query(`
    SELECT content, COUNT(*) as cnt, ARRAY_AGG(id ORDER BY id)::text as ids
    FROM articles 
    GROUP BY content 
    HAVING COUNT(*) > 1
    ORDER BY COUNT(*) DESC
  `);
  
  console.log('Duplicate content groups:');
  for (const g of dupGroups) {
    console.log(`  Content length: ${g.content.length}, Count: ${g.cnt}, IDs: ${g.ids}`);
  }
  
  await p.end();
})();
