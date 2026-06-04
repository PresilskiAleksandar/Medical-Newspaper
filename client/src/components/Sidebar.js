import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ onClose }) => {
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">МедИнфо</div>
        <span className="sidebar-subtitle">Админ Панел</span>
        <button className="sidebar-close" onClick={onClose} aria-label="Затвори">&times;</button>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Контролна Табла
        </NavLink>
        <NavLink to="/admin/vesti" onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Управување со Вести
        </NavLink>
        <NavLink to="/admin/vesti/nova" onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Додај Вест
        </NavLink>
        <NavLink to="/admin/kategorii" onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Категории
        </NavLink>
        <NavLink to="/admin/komentari" onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Коментари
        </NavLink>
        <NavLink to="/admin/korisnici" onClick={onClose} className={({ isActive }) => isActive ? 'active' : ''}>
          Корисници
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/" className="back-link">Врати се на страницата</NavLink>
        <button onClick={logout} className="logout-btn">Одјава</button>
      </div>
    </aside>
  );
};

export default Sidebar;
