import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <span></span><span></span><span></span>
      </button>
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`admin-sidebar-wrapper ${sidebarOpen ? 'active' : ''}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      <main className="admin-content"><Outlet /></main>
      <Toast />
    </div>
  );
};

export default AdminLayout;
