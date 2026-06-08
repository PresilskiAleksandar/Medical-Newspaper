import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_BASE } from '../config';

const FALLBACK = '/uploads/medical-fallback.svg';

const ArticleCard = ({ article }) => {
  const [imgError, setImgError] = useState(false);
  const date = new Date(article.created_at).toLocaleDateString('mk-MK', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const imgSrc = article.image
    ? (imgError ? `${IMAGE_BASE}${FALLBACK}` : `${IMAGE_BASE}${article.image}`)
    : `${IMAGE_BASE}${FALLBACK}`;

  return (
    <article className="article-card">
      <Link to={`/vest/${article.slug || article.id}`} className="card-image-link">
        <div className="card-image">
          <img src={imgSrc} alt={article.title} loading="lazy" onError={() => setImgError(true)}
            className="card-img" />
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
