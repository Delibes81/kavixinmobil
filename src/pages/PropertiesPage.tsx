import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import PropertySearchFilters from '../components/properties/PropertySearchFilters';
import PropertyCard from '../components/properties/PropertyCard';
import { Property, SearchFilters } from '../types';
import { useProperties } from '../hooks/useProperties';

const PropertiesPage: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    operation: '',
    type: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    parking: null,
    location: '',
  });

  const { properties, loading, error } = useProperties(activeFilters);

  useEffect(() => {
    document.title = 'Propiedades | Nova Hestia';
  }, []);

  const applyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
  };

  if (error) {
    return (
      <div className="pt-20">
        <div className="container-custom py-16 text-center">
          <p className="text-red-600 mb-4">Error al cargar las propiedades</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Page Header */}
      <div className="bg-primary-800 text-white py-12">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Building2 className="h-8 w-8 text-secondary-400 mr-3" />
            <h1 className="text-white">Propiedades</h1>
          </div>
          <p className="text-white/80 max-w-3xl">
            Encuentra la propiedad perfecta para ti entre nuestra selección de casas, departamentos, locales y terrenos disponibles.
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Search Filters */}
        <PropertySearchFilters onApplyFilters={applyFilters} />
        
        {/* Results Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {loading ? 'Cargando...' : (
                <>
                  {properties.length} 
                  {properties.length === 1 ? ' propiedad encontrada' : ' propiedades encontradas'}
                </>
              )}
            </h2>
            <div>
              <select className="select-field w-auto">
                <option value="recent">Más recientes</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
                <option value="area_asc">Área: menor a mayor</option>
                <option value="area_desc">Área: mayor a menor</option>
              </select>
            </div>
          </div>
          
          {/* Active Filters */}
          {Object.values(activeFilters).some(value => value !== '' && value !== null) && (
            <div className="flex flex-wrap gap-2 mb-6 bg-neutral-50 p-4 rounded-lg">
              <span className="text-neutral-700 font-medium">Filtros activos:</span>
              
              {activeFilters.operation && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.operation === 'venta' ? 'Venta' : 'Renta'}
                </span>
              )}
              
              {activeFilters.type && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.type === 'casa' ? 'Casa' : 
                   activeFilters.type === 'departamento' ? 'Departamento' : 
                   activeFilters.type === 'local' ? 'Local' : 'Terreno'}
                </span>
              )}
              
              {activeFilters.minPrice && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Desde ${activeFilters.minPrice.toLocaleString()}
                </span>
              )}
              
              {activeFilters.maxPrice && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Hasta ${activeFilters.maxPrice.toLocaleString()}
                </span>
              )}
              
              {activeFilters.bedrooms && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.bedrooms}+ Recámaras
                </span>
              )}
              
              {activeFilters.bathrooms && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.bathrooms}+ Baños
                </span>
              )}
              
              {activeFilters.parking && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.parking}+ Estacionamientos
                </span>
              )}
              
              {activeFilters.location && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Ubicación: {activeFilters.location}
                </span>
              )}
            </div>
          )}
          
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
          
          {/* Property Grid */}
          {!loading && properties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!loading && properties.length === 0 && (
            <div className="text-center py-16">
              <Building2 className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-2">No se encontraron propiedades</h3>
              <p className="text-neutral-600 mb-6">
                No hay propiedades que coincidan con los filtros seleccionados. 
                Intenta modificar los criterios de búsqueda.
              </p>
              <button
                onClick={() => applyFilters({
                  operation: '',
                  type: '',
                  minPrice: null,
                  maxPrice: null,
                  bedrooms: null,
                  bathrooms: null,
                  parking: null,
                  location: '',
                })}
                className="btn btn-primary"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;