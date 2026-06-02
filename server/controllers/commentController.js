const db = require('../config/db');

exports.getByArticle = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT com.*, u.full_name as user_name
       FROM comments com
       LEFT JOIN users u ON com.user_id = u.id
       WHERE com.article_id = $1 AND com.approved = TRUE
       ORDER BY com.created_at DESC`,
      [req.params.articleId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const [result, countResult] = await Promise.all([
      db.query(
        `SELECT com.*, u.full_name as user_name, a.title as article_title
         FROM comments com
         LEFT JOIN users u ON com.user_id = u.id
         LEFT JOIN articles a ON com.article_id = a.id
         ORDER BY com.created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      db.query('SELECT COUNT(*) FROM comments'),
    ]);

    res.json({
      comments: result.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { article_id, content } = req.body;

    if (!article_id || !content) {
      return res.status(400).json({ error: 'Сите полиња се задолжителни.' });
    }

    const result = await db.query(
      'INSERT INTO comments (article_id, user_id, content, approved) VALUES ($1, $2, $3, $4) RETURNING *',
      [article_id, req.user.id, content, false]
    );

    res.status(201).json({ ...result.rows[0], message: 'Коментарот е додаден и чека одобрување.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.approve = async (req, res) => {
  try {
    const result = await db.query(
      'UPDATE comments SET approved = TRUE WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Коментарот не е пронајден.' });
    }
    res.json({ message: 'Коментарот е одобрен.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM comments WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Коментарот не е пронајден.' });
    }
    res.json({ message: 'Коментарот е избришан.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
