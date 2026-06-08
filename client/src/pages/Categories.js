import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';
import { IMAGE_BASE } from '../config';

const FALLBACK = '/uploads/medical-fallback.svg';

const CategoryCard = ({ cat }) => {
  const [imgError, setImgError] = useState(false);
  const src = cat.image
    ? (imgError ? `${IMAGE_BASE}${FALLBACK}` : `${IMAGE_BASE}${cat.image}`)
    : `${IMAGE_BASE}${FALLBACK}`;
  return (
    <Link to={`/kategorii/${cat.slug}`} className="category-card">
      <div className="category-image-wrapper">
        <img src={src} alt={cat.name} className="category-image" loading="lazy" onError={() => setImgError(true)} />
        <div className="category-icon"><span>+</span></div>
      </div>
      <h3 className="category-name">{cat.name}</h3>
      <span className="category-count">{cat.article_count} статии</span>
    </Link>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="categories-page fade-in">
      <div className="container">
        <h1 className="page-title">Категории</h1>
        <p className="page-subtitle">Прегледајте вести по категории</p>

        {loading ? (
          <div className="categories-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-category"><div className="skeleton-title"></div></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="no-results">Нема достапни категории.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
