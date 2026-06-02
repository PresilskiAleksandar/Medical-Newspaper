import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoriesAPI } from '../services/api';

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
            {categories.map((cat) => (
              <Link to={`/kategorii/${cat.slug}`} key={cat.id} className="category-card">
                <div className="category-icon">
                  <span>+</span>
                </div>
                <h3 className="category-name">{cat.name}</h3>
                <span className="category-count">{cat.article_count} статии</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
