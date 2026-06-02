const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [articles, users, comments, categories] = await Promise.all([
      db.query('SELECT COUNT(*) FROM articles'),
      db.query("SELECT COUNT(*) FROM users WHERE role = 'reader'"),
      db.query('SELECT COUNT(*) FROM comments WHERE approved = FALSE'),
      db.query('SELECT COUNT(*) FROM categories'),
    ]);

    res.json({
      totalArticles: parseInt(articles.rows[0].count),
      totalUsers: parseInt(users.rows[0].count),
      pendingComments: parseInt(comments.rows[0].count),
      totalCategories: parseInt(categories.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT u.id, u.full_name, u.email, u.role, u.created_at,
              COUNT(a.id) as articles_count
       FROM users u
       LEFT JOIN articles a ON u.id = a.author_id
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.toggleUserRole = async (req, res) => {
  try {
    const user = await db.query('SELECT id, role FROM users WHERE id = $1', [req.params.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'Корисникот не е пронајден.' });
    }

    const newRole = user.rows[0].role === 'admin' ? 'reader' : 'admin';
    const result = await db.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, full_name, email, role',
      [newRole, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
