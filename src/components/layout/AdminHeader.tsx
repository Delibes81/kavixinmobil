import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     'Administrador';

  return (
    <>
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
              <div className="flex items-center text-neutral-700 bg-neutral-50 rounded-lg px-3 py-2">
                <Shield className="h-5 w-5 mr-2 text-primary-600" />
                <div>
                  <span className="text-sm font-medium block">{displayName}</span>
                  <span className="text-xs text-neutral-500">Administrador</span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center text-neutral-600 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">Confirmar cierre de sesión</h3>
            <p className="text-neutral-600 mb-6">¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="btn btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;