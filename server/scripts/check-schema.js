require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Pool } = require('pg');
const PROD = 'postgresql://user:password@neon-host/neondb?sslmode=require';
const pool = new Pool({ connectionString: PROD });

async function main() {
  const {rows} = await pool.query(`
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = 'articles'
    ORDER BY ordinal_position
  `);
  console.log('articles table columns:');
  rows.forEach(r => console.log(`  ${r.column_name} (${r.data_type}, nullable=${r.is_nullable})`));
  await pool.end();
}
main().catch(e => { console.error(e); process.exit(1); });
