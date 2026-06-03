const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const pool = new Pool({ host: 'localhost', port: 5433, user: 'postgres', password: 'Test12345!', database: 'medinfo' });

function esc(val) {
  if (val === null || val === undefined) return 'NULL';
  if (val instanceof Date) return `'${val.toISOString()}'`;
  if (typeof val === 'string' && val.match(/^[A-Z][a-z]{2} /)) {
    const d = new Date(val);
    if (!isNaN(d)) return `'${d.toISOString()}'`;
  }
  return `'${String(val).replace(/'/g, "''")}'`;
}

async function main() {
  const users = (await pool.query('SELECT * FROM users ORDER BY id')).rows;
  const categories = (await pool.query('SELECT * FROM categories ORDER BY id')).rows;
  const articles = (await pool.query('SELECT * FROM articles ORDER BY id')).rows;
  const comments = (await pool.query('SELECT * FROM comments ORDER BY id')).rows;
  const favorites = (await pool.query('SELECT * FROM favorites ORDER BY id')).rows;

  const cols = (t) => Object.keys(t[0] || {}).join(', ');
  const vals = (rows) => rows.map(r => '(' + Object.values(r).map(esc).join(', ') + ')').join(',\n');

  let sql = `-- Seed data for MedInfo on Supabase\n`;
  sql += `-- Generated ${new Date().toISOString()}\n\n`;
  sql += `TRUNCATE TABLE favorites, comments, articles, categories, users RESTART IDENTITY CASCADE;\n\n`;

  sql += `INSERT INTO users (${cols(users)}) VALUES\n${vals(users)};\n\n`;
  sql += `INSERT INTO categories (${cols(categories)}) VALUES\n${vals(categories)};\n\n`;
  sql += `INSERT INTO articles (${cols(articles)}) VALUES\n${vals(articles)};\n\n`;
  if (comments.length) {
    sql += `INSERT INTO comments (${cols(comments)}) VALUES\n${vals(comments)};\n\n`;
  }
  if (favorites.length) {
    sql += `INSERT INTO favorites (${cols(favorites)}) VALUES\n${vals(favorites)};\n\n`;
  }
  sql += `SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));\n`;
  sql += `SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));\n`;
  sql += `SELECT setval('articles_id_seq', (SELECT MAX(id) FROM articles));\n`;
  sql += `SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));\n`;
  sql += `SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));\n`;

  fs.writeFileSync(path.join(__dirname, '..', '..', 'database', 'seed-supabase.sql'), sql, 'utf8');
  console.log('Seed file written successfully with UTF-8 encoding');
  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });
