import React from 'react';
import { Link } from 'react-router-dom';

const ArticleCard = ({ article }) => {
  const date = new Date(article.created_at).toLocaleDateString('mk-MK', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <article className="article-card">
      <Link to={`/vest/${article.slug || article.id}`} className="card-image-link">
        <div className="card-image">
          {article.image ? (
            <img src={`http://localhost:5000${article.image}`} alt={article.title} loading="lazy" />
          ) : (
            <div className="card-image-placeholder">
              <span className="placeholder-icon">+</span>
            </div>
          )}
        </div>
      </Link>
      <div className="card-body">
        {article.category_name && (
          <span className="card-category">{article.category_name}</span>
        )}
        <Link to={`/vest/${article.slug || article.id}`} className="card-title-link">
          <h3 className="card-title">{article.title}</h3>
        </Link>
        <p className="card-excerpt">{article.excerpt}</p>
        <div className="card-footer">
          <span className="card-date">{date}</span>
          {article.author_name && <span className="card-author">{article.author_name}</span>}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
