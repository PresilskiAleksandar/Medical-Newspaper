import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Input from '../../components/Input';
import RichEditor from '../../components/RichEditor';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotification();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', category_id: '', featured: false,
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [existingImage, setExistingImage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [articleRes, catRes] = await Promise.all([
          articlesAPI.getById(id),
          categoriesAPI.getAll(),
        ]);
        const a = articleRes.data;
        setForm({
          title: a.title, excerpt: a.excerpt || '', content: a.content,
          category_id: a.category_id || '', featured: a.featured,
        });
        setExistingImage(a.image);
        setCategories(catRes.data);
      } catch (err) {
        addNotification('Грешка при вчитување.', 'error');
        navigate('/admin/vesti');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('excerpt', form.excerpt);
      data.append('content', form.content);
      data.append('category_id', form.category_id);
      data.append('featured', form.featured);
      if (image) data.append('image', image);

      await articlesAPI.update(id, data);
      addNotification('Статијата е ажурирана!', 'success');
      navigate('/admin/vesti');
    } catch (err) {
      addNotification(err.response?.data?.error || 'Грешка при ажурирање.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loader"><div className="spinner"></div></div>;

  return (
    <div className="admin-article-form fade-in">
      <h1 className="admin-page-title">Измени Вест</h1>
      <form onSubmit={handleSubmit} className="article-form">
        <Input label="Наслов" name="title" value={form.title} onChange={handleChange} required />
        <Input label="Краток опис" name="excerpt" value={form.excerpt} onChange={handleChange} />
        <div className="form-group">
          <label className="form-label">Содржина *</label>
          <RichEditor value={form.content} onChange={handleChange} placeholder="Содржина на статијата..." />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Категорија</label>
            <select name="category_id" value={form.category_id} onChange={handleChange} className="form-input">
              <option value="">Избери категорија</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} />
              <span>Истакни како избрана вест</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Слика</label>
          <input type="file" accept="image/*" onChange={handleImage} className="form-input" />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
          {!preview && existingImage && (
            <img src={`http://localhost:5000${existingImage}`} alt="Current" className="image-preview" />
          )}
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
            {submitting ? 'Зачувување...' : 'Зачувај промени'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditArticle;
