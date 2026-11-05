import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router';
import { useInitialLoading } from './hooks/useInitialLoading';
import ErrorBoundary from './components/ui/ErrorBoundary';
import InitialLoadingScreen from './components/ui/InitialLoadingScreen';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Layout from './components/layout/Layout';

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
const AuthOutlet = React.lazy(() => import('./components/auth/AuthOutlet'));
const ProtectedAdminLayout = React.lazy(() => import('./components/auth/ProtectedAdminLayout'));

// Redirige rutas antiguas (/property/:id, /properties/:id) conservando el id
const LegacyPropertyRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/propiedades/${id ?? ''}`} replace />;
};

function App() {
  const { showInitialLoading, completeInitialLoading } = useInitialLoading();

  return (
    <ErrorBoundary>
      {/* Animación de bienvenida en la primera visita: se superpone mientras la web carga por debajo */}
      {showInitialLoading && <InitialLoadingScreen onComplete={completeInitialLoading} />}
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
              
              {/* Redirect old routes */}
              <Route path="property/:id" element={<LegacyPropertyRedirect />} />
              <Route path="properties/:id" element={<LegacyPropertyRedirect />} />
            </Route>
            
            {/* Login y admin: únicas rutas que necesitan autenticación (Supabase Auth) */}
            <Route element={<AuthOutlet />}>
            {/* Login route - standalone without main navbar */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected admin routes with AdminLayout */}
            <Route path="/admin" element={<ProtectedAdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="propiedades" element={<AdminProperties />} />
              <Route path="propiedades/:id" element={<AdminPropertyEdit />} />
              <Route path="propiedades/nueva" element={<AdminPropertyCreate />} />
            </Route>
            </Route>
            
            {/* 404 route - standalone */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
    </ErrorBoundary>
  );
}

export default App;