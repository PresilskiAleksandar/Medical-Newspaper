import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import Pagination from '../../components/Pagination';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { addNotification } = useNotification();

  const load = () => {
    setLoading(true);
    articlesAPI.getAll({ page, limit: 10 })
      .then((res) => {
        setArticles(res.data.articles);
        setTotalPages(res.data.pagination.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Дали сте сигурни дека сакате да ја избришете оваа статија?')) return;
    try {
      await articlesAPI.delete(id);
      addNotification('Статијата е избришана.', 'success');
      load();
    } catch (err) {
      addNotification('Грешка при бришење.', 'error');
    }
  };

  return (
    <div className="admin-manage-articles fade-in">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page-title">Управување со Вести</h1>
          <p className="admin-page-subtitle">Сите објавени статии</p>
        </div>
        <Link to="/admin/vesti/nova" className="btn btn-primary">+ Додај Вест</Link>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Наслов</th>
              <th>Категорија</th>
              <th>Автор</th>
              <th>Датум</th>
              <th>Акции</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="table-loading">Вчитување...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan="6" className="table-empty">Нема статии.</td></tr>
            ) : (
              articles.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td className="td-title">{a.title}</td>
                  <td>{a.category_name || '-'}</td>
                  <td>{a.author_name || '-'}</td>
                  <td>{new Date(a.created_at).toLocaleDateString('mk-MK')}</td>
                  <td className="td-actions">
                    <Link to={`/admin/vesti/${a.id}`} className="btn btn-sm btn-outline">Измени</Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Избриши</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default ManageArticles;
