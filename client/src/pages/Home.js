import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNews } from '../context/NewsContext';
import ArticleCard from '../components/ArticleCard';
import SkeletonCard from '../components/SkeletonCard';
import { IMAGE_BASE } from '../config';

const Home = () => {
  const { articles, featured, loading, fetchArticles, fetchFeatured } = useNews();

  useEffect(() => {
    fetchArticles({ limit: 6 });
    fetchFeatured();
  }, []);

  return (
    <div className="home-page fade-in">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Добредојдовте на МедИнфо</h1>
          <p className="hero-subtitle">Вашиот доверлив извор за медицински вести и здравствени информации</p>
          <div className="hero-actions">
            <Link to="/vesti" className="btn btn-primary btn-lg">Сите Вести</Link>
            <Link to="/kategorii" className="btn btn-outline btn-lg">Категории</Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-circle"></div>
          <div className="hero-circle hero-circle-2"></div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Избрани Вести</h2>
          </div>
          <div className="featured-grid">
            {featured.slice(0, 2).map((article) => (
              <div key={article.id} className="featured-card">
                <Link to={`/vest/${article.slug || article.id}`} className="featured-image-link">
                  <div className="featured-image">
                    {article.image ? (
                      <img src={`${IMAGE_BASE}${article.image}`} alt={article.title} />
                    ) : (
                      <div className="featured-placeholder">
                        <svg viewBox="0 0 600 280" className="placeholder-svg">
                          <rect width="600" height="280" fill="url(#fg)" />
                          <defs><linearGradient id="fg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#e0f2fe"/><stop offset="100%" stopColor="#ccfbf1"/></linearGradient></defs>
                          <circle cx="300" cy="110" r="40" fill="rgba(255,255,255,0.35)" />
                          <text x="300" y="122" textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="36" fontWeight="300">+</text>
                          <rect x="200" y="180" width="200" height="10" rx="5" fill="rgba(255,255,255,0.4)" />
                          <rect x="230" y="200" width="140" height="8" rx="4" fill="rgba(255,255,255,0.25)" />
                        </svg>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="featured-body">
                  {article.category_name && <span className="card-category">{article.category_name}</span>}
                  <Link to={`/vest/${article.slug || article.id}`} className="card-title-link">
                    <h3>{article.title}</h3>
                  </Link>
                  <p>{article.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="latest-section">
        <div className="section-header">
          <h2 className="section-title">Најнови Вести</h2>
          <Link to="/vesti" className="btn btn-outline btn-sm">Види повеќе</Link>
        </div>
        <div className="articles-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : articles.map((article) => <ArticleCard key={article.id} article={article} />)
          }
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-card">
          <h2 className="newsletter-title">Зачленете се за новости</h2>
          <p className="newsletter-text">Примајте ги најновите медицински вести директно во вашето сандаче.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Вашата емаил адреса" className="newsletter-input" />
            <button type="submit" className="btn btn-primary">Зачленете се</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
