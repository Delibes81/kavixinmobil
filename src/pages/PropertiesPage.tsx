import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import PropertySearchFilters from '../components/properties/PropertySearchFilters';
import PropertyCard from '../components/properties/PropertyCard';
import { useProperties } from '../hooks/useProperties';
import { Property, SearchFilters } from '../types';

const PropertiesPage: React.FC = () => {
  const { properties, loading, error } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({
    operacion: '',
    tipo: '',
    precio_min: null,
    precio_max: null,
    recamaras: null,
    banos: null,
    estacionamientos: null,
    ubicacion: '',
    metros_construccion_min: null,
    metros_construccion_max: null,
    amueblado: null,
  });

  useEffect(() => {
    document.title = 'Propiedades | Nova Hestia';
  }, []);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  const applyFilters = (filters: SearchFilters) => {
    setActiveFilters(filters);
    
    let filtered = [...properties];
    
    // Apply filters
    if (filters.operacion) {
      filtered = filtered.filter(property => property.operacion === filters.operacion);
    }
    
    if (filters.tipo) {
      filtered = filtered.filter(property => property.tipo === filters.tipo);
    }
    
    if (filters.precio_min) {
      filtered = filtered.filter(property => property.precio >= filters.precio_min!);
    }
    
    if (filters.precio_max) {
      filtered = filtered.filter(property => property.precio <= filters.precio_max!);
    }
    
    if (filters.recamaras) {
      filtered = filtered.filter(property => property.recamaras >= filters.recamaras!);
    }
    
    if (filters.banos) {
      filtered = filtered.filter(property => property.banos >= filters.banos!);
    }
    
    if (filters.estacionamientos) {
      filtered = filtered.filter(property => property.estacionamientos >= filters.estacionamientos!);
    }

    if (filters.metros_construccion_min) {
      filtered = filtered.filter(property => property.metros_construccion >= filters.metros_construccion_min!);
    }

    if (filters.metros_construccion_max) {
      filtered = filtered.filter(property => property.metros_construccion <= filters.metros_construccion_max!);
    }

    if (filters.amueblado !== null) {
      filtered = filtered.filter(property => property.amueblado === filters.amueblado);
    }
    
    if (filters.ubicacion) {
      const searchTerm = filters.ubicacion.toLowerCase();
      filtered = filtered.filter(property => 
        property.direccion.toLowerCase().includes(searchTerm) ||
        property.colonia.toLowerCase().includes(searchTerm) ||
        property.ciudad.toLowerCase().includes(searchTerm) ||
        property.estado.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredProperties(filtered);
  };

  if (loading) {
    return (
      <div className="pt-20">
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
        <div className="container-custom py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20">
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
        <div className="container-custom py-16 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>Error al cargar las propiedades: {error}</p>
          </div>
          <p className="text-neutral-600">Por favor, intenta recargar la página.</p>
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
              
              {activeFilters.operacion && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.operacion === 'venta' ? 'Venta' : 'Renta'}
                </span>
              )}
              
              {activeFilters.tipo && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.tipo === 'casa' ? 'Casa' : 
                   activeFilters.tipo === 'departamento' ? 'Departamento' : 
                   activeFilters.tipo === 'local' ? 'Local' : 
                   activeFilters.tipo === 'oficina' ? 'Oficina' : 'Terreno'}
                </span>
              )}
              
              {activeFilters.precio_min && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Desde ${activeFilters.precio_min.toLocaleString()}
                </span>
              )}
              
              {activeFilters.precio_max && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Hasta ${activeFilters.precio_max.toLocaleString()}
                </span>
              )}
              
              {activeFilters.recamaras && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.recamaras}+ Recámaras
                </span>
              )}
              
              {activeFilters.banos && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.banos}+ Baños
                </span>
              )}
              
              {activeFilters.estacionamientos && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.estacionamientos}+ Estacionamientos
                </span>
              )}

              {activeFilters.amueblado !== null && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  {activeFilters.amueblado ? 'Amueblado' : 'Sin amueblar'}
                </span>
              )}
              
              {activeFilters.ubicacion && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                  Ubicación: {activeFilters.ubicacion}
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
                  operacion: '',
                  tipo: '',
                  precio_min: null,
                  precio_max: null,
                  recamaras: null,
                  banos: null,
                  estacionamientos: null,
                  ubicacion: '',
                  metros_construccion_min: null,
                  metros_construccion_max: null,
                  amueblado: null,
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