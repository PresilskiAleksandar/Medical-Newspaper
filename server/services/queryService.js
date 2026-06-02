const db = require('../config/db');

const getRelatedArticles = async (articleId, categoryId, limit = 3) => {
  const result = await db.query(
    `SELECT a.id, a.title, a.slug, a.excerpt, a.image, a.created_at,
            c.name as category_name
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.category_id = $1 AND a.id != $2
     ORDER BY a.created_at DESC LIMIT $3`,
    [categoryId, articleId, limit]
  );
  return result.rows;
};

const searchArticles = async (query, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const searchPattern = `%${query}%`;

  const [result, countResult] = await Promise.all([
    db.query(
      `SELECT a.*, c.name as category_name, u.full_name as author_name
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE LOWER(a.title) LIKE LOWER($1) OR LOWER(a.excerpt) LIKE LOWER($1) OR LOWER(a.content) LIKE LOWER($1)
       ORDER BY a.created_at DESC LIMIT $2 OFFSET $3`,
      [searchPattern, limit, offset]
    ),
    db.query(
      `SELECT COUNT(*) FROM articles
       WHERE LOWER(title) LIKE LOWER($1) OR LOWER(excerpt) LIKE LOWER($1) OR LOWER(content) LIKE LOWER($1)`,
      [searchPattern]
    ),
  ]);

  return {
    articles: result.rows,
    pagination: {
      page,
      limit,
      total: parseInt(countResult.rows[0].count),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    },
  };
};

module.exports = { getRelatedArticles, searchArticles };
