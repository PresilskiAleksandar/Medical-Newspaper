require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Running category migration v2...');
  const sqlPath = path.join(__dirname, '..', '..', 'database', 'update-categories-v2.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await db.query(sql);
  console.log('Migration completed successfully.');

  const cats = await db.query('SELECT * FROM categories ORDER BY id');
  console.log('\nCurrent categories:');
  for (const c of cats.rows) {
    console.log(`  ID ${c.id}: ${c.name} (${c.slug})`);
  }

  process.exit(0);
}

run().catch(e => {
  console.error('Migration failed:', e);
  process.exit(1);
});
