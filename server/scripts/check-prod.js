const { Pool } = require('pg');
const p = new Pool({connectionString: 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require'});
(async () => {
  const r = await p.query("SELECT COUNT(*) as tot FROM articles");
  console.log('Production DB total:', r.rows[0].tot);
  const r2 = await p.query("SELECT COUNT(*) as c FROM articles WHERE image IS NOT NULL AND image != ''");
  console.log('With images:', r2.rows[0].c);
  await p.end();
})();
