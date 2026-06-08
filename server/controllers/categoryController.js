const db = require('../config/db');
const { slugify } = require('../utils/helpers');
const { getCategoryImage } = require('../services/imageService');

exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*, COUNT(a.id) as article_count
       FROM categories c
       LEFT JOIN articles a ON c.id = a.category_id
       GROUP BY c.id
       ORDER BY c.name ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Името на категоријата е задолжително.' });
    }

    const slug = slugify(name);
    const existing = await db.query('SELECT id FROM categories WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Категоријата веќе постои.' });
    }

    let image = getCategoryImage(slug);
    if (image && !image.includes('svg')) {
      await db.query('UPDATE categories SET image = $1 WHERE slug = $2', [image, slug]);
    } else {
      image = null;
    }

    const result = await db.query(
      'INSERT INTO categories (name, slug, image) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, image]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await db.query('DELETE FROM categories WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Категоријата не е пронајдена.' });
    }
    res.json({ message: 'Категоријата е успешно избришана.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Внатрешна грешка на серверот.' });
  }
};
