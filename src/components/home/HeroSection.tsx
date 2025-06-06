import React from 'react';
import { Search, MapPin, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/70"></div>
        <img
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
          alt="Luxury Home"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-3xl">
          <h1 className="text-white font-bold mb-4 leading-tight">
            Encuentra tu hogar ideal
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Las mejores propiedades en venta y renta seleccionadas para ti en las zonas más exclusivas de la ciudad.
          </p>

          {/* Search Bar */}
          <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Operation Type */}
              <div>
                <label htmlFor="operation" className="block text-sm font-medium text-neutral-700 mb-1">
                  Operación
                </label>
                <select id="operation" className="select-field">
                  <option value="">Todas</option>
                  <option value="venta">Venta</option>
                  <option value="renta">Renta</option>
                </select>
              </div>
              
              {/* Property Type */}
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-neutral-700 mb-1">
                  Tipo de propiedad
                </label>
                <select id="propertyType" className="select-field">
                  <option value="">Todos</option>
                  <option value="casa">Casa</option>
                  <option value="departamento">Departamento</option>
                  <option value="local">Local</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
                  Ubicación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    placeholder="Ciudad o zona"
                    className="input-field pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                </div>
              </div>
            </div>
            
            {/* Advanced Filters Toggle & Search Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
              <button 
                type="button" 
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center mb-3 sm:mb-0"
              >
                <Home className="h-4 w-4 mr-1" />
                Filtros avanzados
              </button>
              <Link to="/propiedades" className="btn btn-primary w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                Buscar propiedades
              </Link>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-6 text-white">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-secondary-400">500+</span>
              <span className="ml-2 text-white/80">Propiedades</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-secondary-400">300+</span>
              <span className="ml-2 text-white/80">Clientes satisfechos</span>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="flex items-center">
              <span className="text-3xl font-bold text-secondary-400">15+</span>
              <span className="ml-2 text-white/80">Años de experiencia</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;