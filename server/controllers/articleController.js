const db = require('../config/db');
const { slugify } = require('../utils/helpers');

exports.getAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const category = req.query.category || '';

    let query = `
      SELECT a.*, c.name as category_name, u.full_name as author_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;
    let countQuery = `SELECT COUNT(*) FROM articles a WHERE 1=1`;
    const params = [];
    const countParams = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (LOWER(a.title) LIKE LOWER($${paramIndex}) OR LOWER(a.excerpt) LIKE LOWER($${paramIndex}))`;
      countQuery += ` AND (LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(excerpt) LIKE LOWER($${paramIndex}))`;
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      paramIndex++;
    }

    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      countQuery += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      countParams.push(category);
      paramIndex++;
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    const [result, countResult] = await Promise.all([
      db.query(query, params),
      db.query(countQuery, countParams),
    ]);

    const total = parseInt(countResult.rows[0].count);

    res.json({
      articles: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.getFeatured = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, c.name as category_name, u.full_name as author_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.featured = TRUE
       ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, u.full_name as author_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.id::text = $1 OR a.slug = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Статијата не е пронајдена.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, excerpt, content, category_id, featured } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Насловот и содржината се задолжителни.' });
    }

    let slug = slugify(title);
    const existingSlug = await db.query('SELECT id FROM articles WHERE slug = $1', [slug]);
    if (existingSlug.rows.length > 0) {
      slug = slug + '-' + Date.now();
    }

    const image = req.file ? '/uploads/' + req.file.filename : null;

    const result = await db.query(
      `INSERT INTO articles (title, slug, excerpt, content, image, category_id, author_id, featured)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, slug, excerpt, content, image, category_id || null, req.user.id, featured || false]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, excerpt, content, category_id, featured, image: bodyImage } = req.body;

    const existing = await db.query('SELECT * FROM articles WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Статијата не е пронајдена.' });
    }

    let slug = existing.rows[0].slug;
    if (title && title !== existing.rows[0].title) {
      slug = slugify(title);
      const existingSlug = await db.query('SELECT id FROM articles WHERE slug = $1 AND id != $2', [slug, req.params.id]);
      if (existingSlug.rows.length > 0) {
        slug = slug + '-' + Date.now();
      }
    }

    const image = req.file ? '/uploads/' + req.file.filename : (bodyImage !== undefined ? bodyImage : existing.rows[0].image);

    const result = await db.query(
      `UPDATE articles SET title = $1, slug = $2, excerpt = $3, content = $4, image = $5,
       category_id = $6, featured = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [
        title || existing.rows[0].title,
        slug,
        excerpt || existing.rows[0].excerpt,
        content || existing.rows[0].content,
        image,
        category_id !== undefined ? category_id : existing.rows[0].category_id,
        featured !== undefined ? featured : existing.rows[0].featured,
        req.params.id,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM articles WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Статијата не е пронајдена.' });
    }
    res.json({ message: 'Статијата е успешно избришана.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
