import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { usePageLoader } from './hooks/usePageLoader';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import PageTransition from './components/ui/PageTransition';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyEdit from './pages/admin/AdminPropertyEdit';
import AdminPropertyCreate from './pages/admin/AdminPropertyCreate';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { showLoader, handleLoadingComplete } = usePageLoader();

  if (showLoader) {
    return <PageLoader onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <AuthProvider>
      <PageTransition>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="propiedades" element={<PropertiesPage />} />
            <Route path="propiedades/:id" element={<PropertyDetailPage />} />
            <Route path="nosotros" element={<AboutPage />} />
            <Route path="contacto" element={<ContactPage />} />
          </Route>
          
          {/* Login route */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected admin routes */}
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
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </AuthProvider>
  );
}

export default App;