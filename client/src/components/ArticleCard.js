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
              <svg viewBox="0 0 400 200" className="placeholder-svg">
                <rect width="400" height="200" fill="url(#grad)" />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'var(--primary-light)',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'var(--teal-light)',stopOpacity:1}} />
                  </linearGradient>
                </defs>
                <circle cx="200" cy="80" r="30" fill="rgba(255,255,255,0.3)" />
                <rect x="140" y="130" width="120" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
                <rect x="160" y="148" width="80" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
                <text x="200" y="88" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="28" fontWeight="300">+</text>
              </svg>
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
