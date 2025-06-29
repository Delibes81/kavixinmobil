import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, LogOut, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminNavbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-primary-800 shadow-lg">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/admin" className="flex items-center">
            <Building2 className="h-8 w-8 text-white mr-2" />
            <span className="text-white text-xl font-bold">Nova Hestia Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin') && location.pathname === '/admin'
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:text-white hover:bg-primary-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/propiedades"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/admin/propiedades')
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:text-white hover:bg-primary-700'
              }`}
            >
              Propiedades
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-primary-600">
              <div className="flex items-center text-primary-100">
                <User className="h-5 w-5 mr-2" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-primary-100 hover:text-white hover:bg-primary-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-100 hover:text-white p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-primary-600">
              <Link
                to="/admin"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/admin') && location.pathname === '/admin'
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:text-white hover:bg-primary-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/propiedades"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/admin/propiedades')
                    ? 'bg-primary-700 text-white'
                    : 'text-primary-100 hover:text-white hover:bg-primary-700'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Propiedades
              </Link>
              
              <div className="border-t border-primary-600 pt-4 mt-4">
                <div className="flex items-center px-3 py-2 text-primary-100">
                  <User className="h-5 w-5 mr-2" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-primary-100 hover:text-white hover:bg-primary-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;