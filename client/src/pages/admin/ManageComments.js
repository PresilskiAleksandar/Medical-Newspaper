import React, { useState, useEffect } from 'react';
import { commentsAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const load = () => {
    setLoading(true);
    commentsAPI.getAll()
      .then((res) => setComments(res.data.comments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await commentsAPI.approve(id);
      addNotification('Коментарот е одобрен.', 'success');
      load();
    } catch (err) {
      addNotification('Грешка.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Дали сте сигурни?')) return;
    try {
      await commentsAPI.delete(id);
      addNotification('Коментарот е избришан.', 'success');
      load();
    } catch (err) {
      addNotification('Грешка при бришење.', 'error');
    }
  };

  return (
    <div className="admin-manage-comments fade-in">
      <h1 className="admin-page-title">Управување со Коментари</h1>
      <p className="admin-page-subtitle">Модерирајте ги коментарите</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Корисник</th><th>Статија</th><th>Коментар</th><th>Статус</th><th>Датум</th><th>Акции</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="table-loading">Вчитување...</td></tr>
            ) : comments.length === 0 ? (
              <tr><td colSpan="7" className="table-empty">Нема коментари.</td></tr>
            ) : (
              comments.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.user_name || '-'}</td>
                  <td className="td-title">{c.article_title || '-'}</td>
                  <td className="td-comment">{c.content}</td>
                  <td>{c.approved ? <span className="badge badge-success">Одобрен</span> : <span className="badge badge-warning">На чекање</span>}</td>
                  <td>{new Date(c.created_at).toLocaleDateString('mk-MK')}</td>
                  <td className="td-actions">
                    {!c.approved && <button className="btn btn-sm btn-success" onClick={() => handleApprove(c.id)}>Одобри</button>}
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>Избриши</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComments;
