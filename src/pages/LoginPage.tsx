import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    document.title = 'Iniciar Sesión | Nova Hestia Admin';
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // If user is already logged in, redirect to admin
  if (user) {
    return <Navigate to="/admin" replace />;
  }

  return <LoginForm />;
};

export default LoginPage;