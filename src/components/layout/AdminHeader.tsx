import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      logout();
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/admin" className="flex items-center">
            <Building2 className="h-8 w-8 text-primary-600 mr-2" />
            <div>
              <span className="text-xl font-heading font-bold text-primary-800">Nova Hestia</span>
              <span className="block text-xs text-neutral-600">Panel de Administración</span>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-neutral-700">
              <User className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">{user?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center text-neutral-600 hover:text-red-600 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;