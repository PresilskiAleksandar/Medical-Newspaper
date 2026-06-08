require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const PROD = 'postgresql://neondb_owner:npg_lZTFJVIW34cD@ep-blue-sound-agmpejdk-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';
const pool = new Pool({ connectionString: PROD });

async function main() {
  const {rows} = await pool.query(
    'SELECT c.id, c.slug, c.name, COUNT(a.id) as articles FROM categories c LEFT JOIN articles a ON a.category_id=c.id GROUP BY c.id, c.slug, c.name ORDER BY c.id'
  );
  console.log('ID|slug|name|articles');
  rows.forEach(r => console.log(r.id + '|' + r.slug + '|' + r.name + '|' + r.articles));
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
