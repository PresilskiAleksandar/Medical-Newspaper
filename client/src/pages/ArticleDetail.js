import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articlesAPI, commentsAPI, favoritesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import CommentSection from '../components/CommentSection';

const ArticleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await articlesAPI.getById(id);
        setArticle(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (user && article) {
      favoritesAPI.check(article.id).then((res) => {
        setIsFavorite(res.data.isFavorite);
        setFavoriteId(res.data.favoriteId);
      }).catch(() => {});
    }
  }, [user, article]);

  const toggleFavorite = async () => {
    if (!user) {
      addNotification('Ве молиме најавете се за да додавате во омилени.', 'error');
      return;
    }
    try {
      if (isFavorite && favoriteId) {
        await favoritesAPI.remove(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        addNotification('Отстрането од омилени.', 'success');
      } else {
        const res = await favoritesAPI.add(article.id);
        setIsFavorite(true);
        setFavoriteId(res.data.id);
        addNotification('Додадено во омилени!', 'success');
      }
    } catch (err) {
      addNotification(err.response?.data?.error || 'Грешка.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="article-detail-page fade-in">
        <div className="container">
          <div className="skeleton-article">
            <div className="skeleton-image full"></div>
            <div className="skeleton-title large"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="container"><h2>Статијата не е пронајдена.</h2></div>;
  }

  const date = new Date(article.created_at).toLocaleDateString('mk-MK', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="article-detail-page fade-in">
      <div className="container">
        <div className="article-detail-header">
          {article.category_name && (
            <Link to={`/kategorii/${article.category_slug}`} className="article-category">
              {article.category_name}
            </Link>
          )}
          <h1 className="article-detail-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-date">{date}</span>
            {article.author_name && <span className="article-author">од {article.author_name}</span>}
            {user && (
              <button className={`btn-favorite ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
                {isFavorite ? '\u2764' : '\u2661'} {isFavorite ? 'Омилено' : 'Додај во омилени'}
              </button>
            )}
          </div>
        </div>

        {article.image && (
          <div className="article-detail-image">
            <img src={`http://localhost:5000${article.image}`} alt={article.title} />
          </div>
        )}

        <div className="article-detail-content" dangerouslySetInnerHTML={{ __html: article.content }} />

        <CommentSection articleId={article.id} />
      </div>
    </div>
  );
};

export default ArticleDetail;
