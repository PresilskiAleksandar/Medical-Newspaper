import React, { useState, useEffect } from 'react';
import { favoritesAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    favoritesAPI.getAll()
      .then((res) => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="favorites-page fade-in">
      <div className="container">
        <h1 className="page-title">Омилени Вести</h1>
        <p className="page-subtitle">Вашите зачувани статии</p>

        {loading ? (
          <p>Вчитување...</p>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">&#9825;</span>
            <h2>Сеуште немате омилени вести</h2>
            <p>Прегледувајте ги вестите и додавајте ги во омилени за да ги зачувате за подоцна.</p>
          </div>
        ) : (
          <div className="articles-grid">
            {favorites.map((fav) => (
              <ArticleCard key={fav.favorite_id} article={fav} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
