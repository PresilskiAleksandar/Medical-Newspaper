import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    if (menuOpen || searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen, searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/pretraga?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">+</div>
          <span className="brand-text">МедИнфо</span>
        </Link>

        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>}
        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Почетна</Link>
          <Link to="/vesti" className="nav-link" onClick={() => setMenuOpen(false)}>Вести</Link>
          <Link to="/kategorii" className="nav-link" onClick={() => setMenuOpen(false)}>Категории</Link>
          {user ? (
            <>
              <Link to="/omileni" className="nav-link" onClick={() => setMenuOpen(false)}>Омилени</Link>
              {isAdmin && <Link to="/admin" className="nav-link admin-link" onClick={() => setMenuOpen(false)}>Админ</Link>}
              <button className="nav-link btn-link" onClick={() => { logout(); setMenuOpen(false); }}>Одјава</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Најава</Link>
              <Link to="/register" className="nav-link register-link" onClick={() => setMenuOpen(false)}>Регистрација</Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Пребарувај">
            &#128269;
          </button>
          <button className="icon-btn theme-btn" onClick={toggleTheme} aria-label="Тема">
            {darkMode ? '\u2600' : '\u263E'}
          </button>
          <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Мени">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="search-overlay" onClick={() => setSearchOpen(false)}>
          <form onSubmit={handleSearch} className="search-form" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Пребарувај вести..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-btn">Пребарај</button>
            <button type="button" className="search-close" onClick={() => setSearchOpen(false)}>Затвори</button>
          </form>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
