import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-brand">
              <span className="brand-icon">+</span> МедИнфо
            </h3>
            <p className="footer-desc">
              Вашиот доверлив извор за медицински вести и информации во Северна Македонија.
            </p>
          </div>

          <div className="footer-section">
            <h4>Брзи Линкови</h4>
            <Link to="/">Почетна</Link>
            <Link to="/vesti">Вести</Link>
            <Link to="/kategorii">Категории</Link>
            <Link to="/pretraga">Пребарување</Link>
          </div>

          <div className="footer-section">
            <h4>Категории</h4>
            <Link to="/kategorii/opsta-medicina">Општа медицина</Link>
            <Link to="/kategorii/kardiologija">Кардиологија</Link>
            <Link to="/kategorii/pedijatrija">Педијатрија</Link>
            <Link to="/kategorii/onkologija">Онкологија</Link>
          </div>

          <div className="footer-section">
            <h4>Контакт</h4>
            <p>ул. Македонија 123, Скопје</p>
            <p>info@medinfo.mk</p>
            <p>+389 2 123 4567</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} МедИнфо. Сите права се задржани.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
