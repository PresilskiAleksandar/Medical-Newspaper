const db = require('./config/db');
require('dotenv').config();

(async () => {
  try {
    console.log('Testing article detail query...');
    const result = await db.query(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, u.full_name as author_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.id = $1 OR a.slug = $1`,
      ['1']
    );
    console.log('Rows:', result.rows.length);
    if (result.rows.length > 0) {
      const r = result.rows[0];
      console.log('Title:', r.title);
      console.log('Keys:', Object.keys(r).join(', '));
    } else {
      console.log('No results found');
    }
  } catch (err) {
    console.error('Query error:', err.message);
  }
  process.exit(0);
})();
