import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-20 min-h-screen bg-neutral-50 flex items-center">
      <div className="container-custom py-16 text-center">
        <h1 className="text-9xl font-bold text-primary-800 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-neutral-600 max-w-lg mx-auto mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
          Por favor, regresa al inicio o busca propiedades disponibles.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="btn btn-primary">
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          <Link to="/propiedades" className="btn btn-outline">
            <Search className="h-5 w-5 mr-2" />
            Buscar propiedades
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;