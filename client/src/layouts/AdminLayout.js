import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = () => setSidebarOpen(false);

  return (
    <div className="admin-layout">
      <button type="button" className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
        <span></span><span></span><span></span>
      </button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={close}></div>
      <div className={`admin-sidebar-wrapper ${sidebarOpen ? 'active' : ''}`}>
        <Sidebar onClose={close} />
      </div>
      <main className="admin-content"><Outlet /></main>
      <Toast />
    </div>
  );
};

export default AdminLayout;
