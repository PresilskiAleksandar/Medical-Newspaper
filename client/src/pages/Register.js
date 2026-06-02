import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Register = () => {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Лозинките не се совпаѓаат.');
      return;
    }

    setLoading(true);
    try {
      await register(form.full_name, form.email, form.password);
      addNotification('Успешна регистрација!', 'success');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Грешка при регистрација.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">+</div>
          <h1 className="auth-title">Регистрација</h1>
          <p className="auth-subtitle">Креирајте свој профил</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input label="Целосно име" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Име и презиме" required />
          <Input label="Емаил" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
          <Input label="Лозинка" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          <Input label="Потврди лозинка" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
          <Button type="submit" variant="primary" size="lg" disabled={loading}>
            {loading ? 'Вчитување...' : 'Регистрирај се'}
          </Button>
        </form>

        <p className="auth-footer-text">
          Веќе имате профил? <Link to="/login">Најавете се</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
