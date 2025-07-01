import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdminHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;