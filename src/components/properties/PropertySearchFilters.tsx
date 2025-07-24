import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, X, Sliders, ChevronDown, ChevronUp, Filter, MapPin } from 'lucide-react';
import AddressAutocomplete from '../admin/AddressAutocomplete';
import { SearchFilters } from '../../types';

interface PropertySearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

const PropertySearchFilters: React.FC<PropertySearchFiltersProps> = ({ onApplyFilters }) => {
  const location = useLocation();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Initialize filters from URL parameters immediately
    const urlParams = new URLSearchParams(location.search);
    return {
      operacion: urlParams.get('operacion') || '',
      tipo: urlParams.get('tipo') || '',
      precio_min: urlParams.get('precio_min') ? Number(urlParams.get('precio_min')) : null,
      precio_max: urlParams.get('precio_max') ? Number(urlParams.get('precio_max')) : null,
      recamaras: urlParams.get('recamaras') ? Number(urlParams.get('recamaras')) : null,
      banos: urlParams.get('banos') ? Number(urlParams.get('banos')) : null,
      estacionamientos: null,
      ubicacion: urlParams.get('ubicacion') || '',
      metros_construccion_min: null,
      metros_construccion_max: null,
      amueblado: null,
    };
  });

  const [initialFiltersApplied, setInitialFiltersApplied] = useState(false);

  // Apply initial filters from URL immediately when component mounts
  React.useEffect(() => {
    if (!initialFiltersApplied) {
      const urlParams = new URLSearchParams(location.search);
      const hasFilters = Array.from(urlParams.entries()).length > 0;
      
      if (hasFilters) {
        console.log('Applying initial filters from URL:', filters);
        onApplyFilters(filters);
        
        // Open advanced filters if advanced parameters are present
        if (filters.recamaras || filters.banos || filters.ubicacion) {
          setIsAdvancedOpen(true);
        }
      }
      
      setInitialFiltersApplied(true);
    }
  }, [filters, onApplyFilters, initialFiltersApplied, location.search]);

  // Update filters when URL changes (for navigation between pages)
  React.useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const filtersFromUrl: SearchFilters = {
      operacion: urlParams.get('operacion') || '',
      tipo: urlParams.get('tipo') || '',
      precio_min: urlParams.get('precio_min') ? Number(urlParams.get('precio_min')) : null,
      precio_max: urlParams.get('precio_max') ? Number(urlParams.get('precio_max')) : null,
      recamaras: urlParams.get('recamaras') ? Number(urlParams.get('recamaras')) : null,
      banos: urlParams.get('banos') ? Number(urlParams.get('banos')) : null,
      estacionamientos: null,
      ubicacion: urlParams.get('ubicacion') || '',
      metros_construccion_min: null,
      metros_construccion_max: null,
      amueblado: null,
    };

    // Only update if filters actually changed
    const filtersChanged = JSON.stringify(filters) !== JSON.stringify(filtersFromUrl);
    if (filtersChanged && initialFiltersApplied) {
      console.log('URL changed, updating filters:', filtersFromUrl);
      setFilters(filtersFromUrl);
      onApplyFilters(filtersFromUrl);
    }
  }, [location.search, initialFiltersApplied]);

  // Remove the old useEffect that was causing conflicts
  /*
  React.useEffect(() => {
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
  */

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('Filter input change:', { name, value });
    
    if (['precio_min', 'precio_max', 'recamaras', 'banos', 'estacionamientos', 'metros_construccion_min', 'metros_construccion_max'].includes(name)) {
      setFilters({
        ...filters,
        [name]: value === '' ? null : Number(value),
      });
    } else if (name === 'amueblado') {
      setFilters({
        ...filters,
        [name]: value === '' ? null : value === 'true',
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with filters:', filters);
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
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
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    setIsAdvancedOpen(false); // Close advanced filters when resetting
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  // Count active advanced filters
  const activeAdvancedFilters = [
    filters.recamaras,
    filters.banos,
    filters.estacionamientos,
    filters.amueblado,
    filters.ubicacion,
    filters.metros_construccion_min,
    filters.metros_construccion_max
  ].filter(filter => filter !== null && filter !== '').length;

  // Count all active filters
  const totalActiveFilters = Object.values(filters).filter(filter => filter !== null && filter !== '').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300">
      <form onSubmit={handleSubmit}>
        {/* Header with filter count */}
        {totalActiveFilters > 0 && (
          <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-primary-600 mr-2" />
                <span className="text-sm font-medium text-primary-800">
                  {totalActiveFilters} filtro{totalActiveFilters !== 1 ? 's' : ''} activo{totalActiveFilters !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                Limpiar todos
              </button>
            </div>
          </div>
        )}

        {/* Basic Filters - FIXED: Padding extra para evitar recorte en hover */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 p-2">
          {/* Operation Type */}
          <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="operacion" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
              Operación
            </label>
            <select
              id="operacion"
              name="operacion"
              value={filters.operacion}
              onChange={handleInputChange}
              className={`select-field transition-all duration-200 ${
                filters.operacion ? 'border-primary-500 bg-primary-50' : ''
              }`}
            >
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>
          
          {/* Property Type */}
          <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="tipo" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
              Tipo de propiedad
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filters.tipo}
              onChange={handleInputChange}
              className={`select-field transition-all duration-200 ${
                filters.tipo ? 'border-primary-500 bg-primary-50' : ''
              }`}
            >
              <option value="">Todos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
              <option value="oficina">Oficina</option>
            </select>
          </div>
          
          {/* Price Range */}
          <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="precio_min" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
              Precio mínimo
            </label>
            <input
              type="number"
              id="precio_min"
              name="precio_min"
              placeholder="Desde $"
              value={filters.precio_min || ''}
              onChange={handleInputChange}
              className={`input-field transition-all duration-200 ${
                filters.precio_min ? 'border-primary-500 bg-primary-50' : ''
              }`}
              min="0"
            />
          </div>
          
          <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="precio_max" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
              Precio máximo
            </label>
            <input
              type="number"
              id="precio_max"
              name="precio_max"
              placeholder="Hasta $"
              value={filters.precio_max || ''}
              onChange={handleInputChange}
              className={`input-field transition-all duration-200 ${
                filters.precio_max ? 'border-primary-500 bg-primary-50' : ''
              }`}
              min="0"
            />
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isAdvancedOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="pt-4 border-t border-neutral-200">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-neutral-800 mb-3 flex items-center px-2">
                <Sliders className="h-5 w-5 mr-2 text-primary-600" />
                Filtros Avanzados
              </h4>
            </div>
            
            {/* FIXED: Grid con padding extra para evitar recorte */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 p-2">
              {/* Bedrooms */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="recamaras" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  Recámaras
                </label>
                <select
                  id="recamaras"
                  name="recamaras"
                  value={filters.recamaras || ''}
                  onChange={handleInputChange}
                  className={`select-field transition-all duration-200 ${
                    filters.recamaras ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>
              
              {/* Bathrooms */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="banos" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  Baños
                </label>
                <select
                  id="banos"
                  name="banos"
                  value={filters.banos || ''}
                  onChange={handleInputChange}
                  className={`select-field transition-all duration-200 ${
                    filters.banos ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              {/* Parking */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="estacionamientos" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  Estacionamientos
                </label>
                <select
                  id="estacionamientos"
                  name="estacionamientos"
                  value={filters.estacionamientos || ''}
                  onChange={handleInputChange}
                  className={`select-field transition-all duration-200 ${
                    filters.estacionamientos ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <option value="">Cualquiera</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
              
              {/* Furnished */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="amueblado" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  Amueblado
                </label>
                <select
                  id="amueblado"
                  name="amueblado"
                  value={filters.amueblado === null ? '' : filters.amueblado.toString()}
                  onChange={handleInputChange}
                  className={`select-field transition-all duration-200 ${
                    filters.amueblado !== null ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <option value="">Cualquiera</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            {/* Second row of advanced filters - FIXED: Padding extra */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 p-2">
              {/* Location */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="ubicacion" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={filters.ubicacion}
                  onChange={handleInputChange}
                  placeholder="Ciudad, colonia o zona"
                  className={`transition-all duration-200 ${
                    filters.ubicacion ? 'border-primary-500 bg-primary-50' : ''
                  } input-field`}
                />
              </div>
              
              {/* Construction Area Range */}
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="metros_construccion_min" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  M² mínimos
                </label>
                <input
                  type="number"
                  id="metros_construccion_min"
                  name="metros_construccion_min"
                  placeholder="Desde m²"
                  value={filters.metros_construccion_min || ''}
                  onChange={handleInputChange}
                  className={`input-field transition-all duration-200 ${
                    filters.metros_construccion_min ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                  min="0"
                />
              </div>
              
              <div className="transform transition-all duration-200 hover:scale-[1.02] hover:z-10 relative">
                <label htmlFor="metros_construccion_max" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                  M² máximos
                </label>
                <input
                  type="number"
                  id="metros_construccion_max"
                  name="metros_construccion_max"
                  placeholder="Hasta m²"
                  value={filters.metros_construccion_max || ''}
                  onChange={handleInputChange}
                  className={`input-field transition-all duration-200 ${
                    filters.metros_construccion_max ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                  min="0"
                />
              </div>
            </div>

            {/* Quick filter presets - FIXED: Padding para botones */}
            <div className="mb-4 px-2">
              <h5 className="text-sm font-medium text-neutral-700 mb-3 px-1">Filtros rápidos:</h5>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      operacion: 'venta',
                      tipo: 'casa',
                      recamaras: 3,
                      banos: 2
                    });
                  }}
                  className="px-4 py-2 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Casa familiar (3+ rec, 2+ baños)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      operacion: 'renta',
                      tipo: 'departamento',
                      amueblado: true
                    });
                  }}
                  className="px-4 py-2 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Depto amueblado
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      precio_max: 5000000,
                      operacion: 'venta'
                    });
                  }}
                  className="px-4 py-2 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Hasta $5M
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      ...filters,
                      metros_construccion_min: 100,
                      tipo: 'casa'
                    });
                  }}
                  className="px-4 py-2 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105 hover:shadow-md"
                >
                  Casa grande (100+ m²)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Filters Toggle & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2">
          <button 
            type="button" 
            onClick={toggleAdvanced}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center mb-3 sm:mb-0 transition-all duration-200 group transform hover:scale-105 px-2 py-1 rounded-md hover:bg-primary-50"
          >
            {isAdvancedOpen ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                Ocultar filtros avanzados
              </>
            ) : (
              <>
                <Sliders className="h-4 w-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                Mostrar filtros avanzados
                {activeAdvancedFilters > 0 && (
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                    {activeAdvancedFilters}
                  </span>
                )}
              </>
            )}
          </button>
          
          <div className="flex items-center gap-3 ml-auto order-1 sm:order-2 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={handleReset}
              className="btn btn-outline flex-1 sm:flex-auto transition-all duration-200 hover:scale-105 group"
              disabled={totalActiveFilters === 0}
            >
              <X className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:rotate-90" />
              Limpiar
              {totalActiveFilters > 0 && (
                <span className="ml-1 text-xs">({totalActiveFilters})</span>
              )}
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1 sm:flex-auto transition-all duration-200 hover:scale-105 group"
            >
              <Search className="h-4 w-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
              Buscar
              {totalActiveFilters > 0 && (
                <span className="ml-1 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                  {totalActiveFilters}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchFilters;