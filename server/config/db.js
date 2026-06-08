const { Pool } = require('pg');
require('dotenv').config();

const isLocal = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('localhost');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
});

pool.on('error', (err) => {
  console.error('Грешка во базата на податоци:', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
