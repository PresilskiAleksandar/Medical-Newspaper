import React, { useState, useEffect } from 'react';
import { categoriesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const load = () => {
    setLoading(true);
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await categoriesAPI.create({ name });
      addNotification('Категоријата е креирана!', 'success');
      setName('');
      load();
    } catch (err) {
      addNotification(err.response?.data?.error || 'Грешка.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Дали сте сигурни?')) return;
    try {
      await categoriesAPI.delete(id);
      addNotification('Категоријата е избришана.', 'success');
      load();
    } catch (err) {
      addNotification('Грешка при бришење.', 'error');
    }
  };

  return (
    <div className="admin-manage-categories fade-in">
      <h1 className="admin-page-title">Управување со Категории</h1>
      <p className="admin-page-subtitle">Додавајте и управувајте со категориите</p>

      <form onSubmit={handleCreate} className="inline-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Име на категорија"
          className="form-input"
          required
        />
        <button type="submit" className="btn btn-primary">Додај</button>
      </form>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Име</th><th>Slug</th><th>Статии</th><th>Акции</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="table-loading">Вчитување...</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>{cat.name}</td>
                <td>{cat.slug}</td>
                <td>{cat.article_count}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(cat.id)}>Избриши</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCategories;
