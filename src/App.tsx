import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { usePageLoader } from './hooks/usePageLoader';
import ErrorBoundary from './components/ui/ErrorBoundary';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PropertiesPage = React.lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailPage = React.lazy(() => import('./pages/PropertyDetailPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProperties = React.lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = React.lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminPropertyCreate = React.lazy(() => import('./pages/admin/AdminPropertyCreate'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { showLoader, handleLoadingComplete } = usePageLoader();

  // Solo mostrar el loader inicial de la aplicación
  if (showLoader) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* Removido el Suspense fallback para evitar el efecto de "salto" */}
        <Suspense fallback={null}>
          <Routes>
            {/* Public routes with Layout (includes Navbar) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="propiedades" element={<PropertiesPage />} />
              <Route path="propiedades/:id" element={<PropertyDetailPage />} />
              <Route path="nosotros" element={<AboutPage />} />
              <Route path="contacto" element={<ContactPage />} />
            </Route>
            
            {/* Login route - standalone without main navbar */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected admin routes with AdminLayout */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="propiedades" element={<AdminProperties />} />
              <Route path="propiedades/:id" element={<AdminPropertyEdit />} />
              <Route path="propiedades/nueva" element={<AdminPropertyCreate />} />
            </Route>
            
            {/* 404 route - standalone */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;