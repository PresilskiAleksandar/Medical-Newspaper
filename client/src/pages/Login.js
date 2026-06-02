import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      addNotification('Успешно најавување!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Грешка при најавување.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">+</div>
          <h1 className="auth-title">Најава</h1>
          <p className="auth-subtitle">Добредојде назад!</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Емаил"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Лозинка"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Вчитување...' : 'Најави се'}
          </Button>
        </form>

        <p className="auth-footer-text">
          Немате профил? <Link to="/register">Регистрирајте се</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
