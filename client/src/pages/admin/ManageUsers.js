import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  const load = () => {
    setLoading(true);
    adminAPI.getUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggleRole = async (id) => {
    try {
      const res = await adminAPI.toggleUserRole(id);
      addNotification(`Улогата на ${res.data.full_name} е сменета во ${res.data.role === 'admin' ? 'Администратор' : 'Читач'}.`, 'success');
      load();
    } catch (err) {
      addNotification('Грешка при промена на улога.', 'error');
    }
  };

  return (
    <div className="admin-manage-users fade-in">
      <h1 className="admin-page-title">Управување со Корисници</h1>
      <p className="admin-page-subtitle">Преглед на сите регистрирани корисници</p>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Име</th><th>Емаил</th><th>Улога</th><th>Статии</th><th>Регистриран</th><th>Акции</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="table-loading">Вчитување...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="7" className="table-empty">Нема корисници.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.full_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                      {u.role === 'admin' ? 'Админ' : 'Читач'}
                    </span>
                  </td>
                  <td>{u.articles_count}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('mk-MK')}</td>
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => handleToggleRole(u.id)}>
                      {u.role === 'admin' ? 'Направи читач' : 'Направи админ'}
                    </button>
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

export default ManageUsers;
