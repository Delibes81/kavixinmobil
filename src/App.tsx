import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useInitialLoading } from './hooks/useInitialLoading';
import ErrorBoundary from './components/ui/ErrorBoundary';
import InitialLoadingScreen from './components/ui/InitialLoadingScreen';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy load components for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const PropertiesPage = React.lazy(() => import('./pages/PropertiesPage'));
const PropertyDetailPage = React.lazy(() => import('./pages/PropertyDetailPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProperties = React.lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = React.lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminPropertyCreate = React.lazy(() => import('./pages/admin/AdminPropertyCreate'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  const { showInitialLoading, isInitialLoadComplete, completeInitialLoading } = useInitialLoading();

  // Show initial loading screen on first visit
  if (showInitialLoading) {
    return <InitialLoadingScreen onComplete={completeInitialLoading} />;
  }

  // Don't render anything until initial loading is complete
  if (!isInitialLoadComplete) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        {/* Simple spinner for subsequent loads */}
        <Suspense fallback={
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-neutral-600">Cargando...</p>
            </div>
          </div>
        }>
          <Routes>
            {/* Public routes with Layout (includes Navbar) */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="propiedades" element={<PropertiesPage />} />
              <Route path="propiedades/:id" element={<PropertyDetailPage />} />
              <Route path="blog" element={<BlogPage />} />
              <Route path="blog/:slug" element={<BlogPostPage />} />
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