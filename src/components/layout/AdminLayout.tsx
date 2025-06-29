import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;