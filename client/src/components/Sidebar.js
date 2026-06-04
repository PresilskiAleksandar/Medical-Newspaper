import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path || 
    (path !== '/admin' && location.pathname.startsWith(path)) ? 'active' : '';

  const goTo = (path) => (e) => {
    e.preventDefault();
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    if (onClose) onClose();
  };

  const links = [
    { to: '/admin', label: 'Контролна Табла' },
    { to: '/admin/vesti', label: 'Управување со Вести' },
    { to: '/admin/vesti/nova', label: 'Додај Вест' },
    { to: '/admin/kategorii', label: 'Категории' },
    { to: '/admin/komentari', label: 'Коментари' },
    { to: '/admin/korisnici', label: 'Корисници' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">МедИнфо</div>
        <span className="sidebar-subtitle">Админ Панел</span>
        <button type="button" className="sidebar-close" onClick={() => { if (onClose) onClose(); }} aria-label="Затвори">&times;</button>
      </div>

      <nav className="sidebar-nav">
        {links.map(link => (
          <a
            key={link.to}
            href={link.to}
            className={isActive(link.to)}
            onClick={goTo(link.to)}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="sidebar-footer">
        <a href="/" className="back-link" onClick={goTo('/')}>Врати се на страницата</a>
        <button type="button" onClick={handleLogout} className="logout-btn">Одјава</button>
      </div>
    </aside>
  );
};

export default Sidebar;
