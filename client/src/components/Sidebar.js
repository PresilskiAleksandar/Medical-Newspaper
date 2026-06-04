import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/admin', label: 'Контролна Табла' },
  { path: '/admin/vesti', label: 'Управување со Вести' },
  { path: '/admin/vesti/nova', label: 'Додај Вест' },
  { path: '/admin/kategorii', label: 'Категории' },
  { path: '/admin/komentari', label: 'Коментари' },
  { path: '/admin/korisnici', label: 'Корисници' },
];

const Sidebar = ({ onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = useCallback((path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleNav = useCallback((path) => {
    navigate(path);
    if (onClose) onClose();
  }, [navigate, onClose]);

  const handleLogout = useCallback(() => {
    logout();
    if (onClose) onClose();
  }, [logout, onClose]);

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">МедИнфо</div>
        <span className="sidebar-subtitle">Админ Панел</span>
        <button type="button" className="sidebar-close" onClick={() => onClose?.()} aria-label="Затвори">
          &times;
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            type="button"
            className={`sidebar-nav-item${isActive(item.path) ? ' active' : ''}`}
            onClick={() => handleNav(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button type="button" className="back-link" onClick={() => handleNav('/')}>
          Врати се на страницата
        </button>
        <button type="button" className="logout-btn" onClick={handleLogout}>
          Одјава
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
