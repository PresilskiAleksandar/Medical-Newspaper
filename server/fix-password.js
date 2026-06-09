const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5433/medinfo',
});

(async () => {
  try {
    const hash = await bcrypt.hash('admin123', 10);
    console.log('Generated hash:', hash);

    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hash, 'admin@medinfo.mk']);
    console.log('Password updated');

    const r = await pool.query('SELECT password FROM users WHERE email = $1', ['admin@medinfo.mk']);
    const match = await bcrypt.compare('admin123', r.rows[0].password);
    console.log('Verification:', match ? 'PASSWORD OK' : 'PASSWORD MISMATCH');

    await pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
})();
