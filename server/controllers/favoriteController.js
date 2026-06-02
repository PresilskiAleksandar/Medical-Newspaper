const db = require('../config/db');

exports.getUserFavorites = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT f.id as favorite_id, f.article_id, a.title, a.slug, a.excerpt, a.image, a.created_at,
              c.name as category_name
       FROM favorites f
       LEFT JOIN articles a ON f.article_id = a.id
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE f.user_id = $1
       ORDER BY f.id DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.add = async (req, res) => {
  try {
    const { article_id } = req.body;

    if (!article_id) {
      return res.status(400).json({ error: 'ID на статија е задолжително.' });
    }

    const existing = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND article_id = $2',
      [req.user.id, article_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Статијата е веќе во омилени.' });
    }

    const result = await db.query(
      'INSERT INTO favorites (user_id, article_id) VALUES ($1, $2) RETURNING *',
      [req.user.id, article_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await db.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Омилената статија не е пронајдена.' });
    }
    res.json({ message: 'Отстрането од омилени.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.check = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id FROM favorites WHERE user_id = $1 AND article_id = $2',
      [req.user.id, req.params.articleId]
    );
    res.json({ isFavorite: result.rows.length > 0, favoriteId: result.rows[0]?.id || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
