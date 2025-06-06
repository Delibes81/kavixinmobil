import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import PropertySearchFilters from '../components/properties/PropertySearchFilters';
import PropertyCard from '../components/properties/PropertyCard';
import { properties } from '../data/properties';
import { Property, SearchFilters } from '../types';

const PropertiesPage: React.FC = () => {
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
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

  useEffect(() => {
    document.title = 'Propiedades | PropMax';
  }, []);

  const applyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
    
    let filtered = [...properties];
    
    // Apply filters
    if (filters.operation) {
      filtered = filtered.filter(property => property.operation === filters.operation);
    }
    
    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }
    
    if (filters.minPrice) {
      filtered = filtered.filter(property => property.price >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= filters.maxPrice!);
    }
    
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= filters.bedrooms!);
    }
    
    if (filters.bathrooms) {
      filtered = filtered.filter(property => property.bathrooms >= filters.bathrooms!);
    }
    
    if (filters.parking) {
      filtered = filtered.filter(property => property.parking >= filters.parking!);
    }
    
    if (filters.location) {
      const searchTerm = filters.location.toLowerCase();
      filtered = filtered.filter(property => 
        property.location.address.toLowerCase().includes(searchTerm) ||
        property.location.city.toLowerCase().includes(searchTerm) ||
        property.location.state.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredProperties(filtered);
  };

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
              {filteredProperties.length} 
              {filteredProperties.length === 1 ? ' propiedad encontrada' : ' propiedades encontradas'}
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
          
          {/* Property Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
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
          
          {/* Pagination (mockup) */}
          {filteredProperties.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex space-x-1">
                <button className="px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
                  Anterior
                </button>
                <button className="px-3 py-2 rounded-md bg-primary-600 text-white">
                  1
                </button>
                <button className="px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
                  2
                </button>
                <button className="px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
                  3
                </button>
                <button className="px-3 py-2 rounded-md text-neutral-600 hover:bg-neutral-100">
                  Siguiente
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;