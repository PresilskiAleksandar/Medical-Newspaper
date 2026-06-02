import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page fade-in">
      <div className="not-found-content">
        <span className="not-found-icon">+</span>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-text">Страницата не е пронајдена.</p>
        <Link to="/" className="btn btn-primary">Врати се на почетна</Link>
      </div>
    </div>
  );
};

export default NotFound;
