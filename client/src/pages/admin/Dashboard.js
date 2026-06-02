import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  const cards = [
    { title: 'Вкупно статии', value: stats?.totalArticles || 0, icon: '📰', color: '#0ea5e9', link: '/admin/vesti' },
    { title: 'Корисници', value: stats?.totalUsers || 0, icon: '👥', color: '#10b981', link: '/admin/korisnici' },
    { title: 'Коментари на чекање', value: stats?.pendingComments || 0, icon: '💬', color: '#f59e0b', link: '/admin/komentari' },
    { title: 'Категории', value: stats?.totalCategories || 0, icon: '📁', color: '#8b5cf6', link: '/admin/kategorii' },
  ];

  return (
    <div className="admin-dashboard fade-in">
      <h1 className="admin-page-title">Контролна Табла</h1>
      <p className="admin-page-subtitle">Преглед на системот</p>

      <div className="stats-grid">
        {cards.map((card, i) => (
          <Link to={card.link} key={i} className="stat-card" style={{ '--card-color': card.color }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <span className="stat-value">{card.value}</span>
              <span className="stat-title">{card.title}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-quick-actions">
        <h2 className="admin-section-title">Брзи Акции</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/vesti/nova" className="quick-action-card">
            <span className="qa-icon">+</span>
            <span className="qa-text">Додај вест</span>
          </Link>
          <Link to="/admin/kategorii" className="quick-action-card">
            <span className="qa-icon">📁</span>
            <span className="qa-text">Управувај категории</span>
          </Link>
          <Link to="/admin/komentari" className="quick-action-card">
            <span className="qa-icon">💬</span>
            <span className="qa-text">Модерирај коментари</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
