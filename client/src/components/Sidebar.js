import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();

  const handleItemClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    if (onClose) onClose();
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">МедИнфо</div>
        <span className="sidebar-subtitle">Админ Панел</span>
        <button type="button" className="sidebar-close" onClick={handleItemClick} aria-label="Затвори">&times;</button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end onClick={handleItemClick}>Контролна Табла</NavLink>
        <NavLink to="/admin/vesti" onClick={handleItemClick}>Управување со Вести</NavLink>
        <NavLink to="/admin/vesti/nova" onClick={handleItemClick}>Додај Вест</NavLink>
        <NavLink to="/admin/kategorii" onClick={handleItemClick}>Категории</NavLink>
        <NavLink to="/admin/komentari" onClick={handleItemClick}>Коментари</NavLink>
        <NavLink to="/admin/korisnici" onClick={handleItemClick}>Корисници</NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="back-link">Врати се на страницата</NavLink>
        <button type="button" onClick={handleLogout} className="logout-btn">Одјава</button>
      </div>
    </aside>
  );
};

export default Sidebar;
