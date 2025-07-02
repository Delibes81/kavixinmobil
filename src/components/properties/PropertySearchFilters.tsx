import React, { useState } from 'react';
import { Search, X, Sliders, ChevronDown, ChevronUp, Filter, MapPin } from 'lucide-react';
import { SearchFilters } from '../../types';

interface PropertySearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

const PropertySearchFilters: React.FC<PropertySearchFiltersProps> = ({ onApplyFilters }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
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

        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Operation Type */}
          <div className="transform transition-all duration-200 hover:scale-[1.02]">
            <label htmlFor="operacion" className="block text-sm font-medium text-neutral-700 mb-1">
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
          <div className="transform transition-all duration-200 hover:scale-[1.02]">
            <label htmlFor="tipo" className="block text-sm font-medium text-neutral-700 mb-1">
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
          <div className="transform transition-all duration-200 hover:scale-[1.02]">
            <label htmlFor="precio_min" className="block text-sm font-medium text-neutral-700 mb-1">
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
          
          <div className="transform transition-all duration-200 hover:scale-[1.02]">
            <label htmlFor="precio_max" className="block text-sm font-medium text-neutral-700 mb-1">
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
              <h4 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                <Sliders className="h-5 w-5 mr-2 text-primary-600" />
                Filtros Avanzados
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Bedrooms */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="recamaras" className="block text-sm font-medium text-neutral-700 mb-1">
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
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="banos" className="block text-sm font-medium text-neutral-700 mb-1">
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
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="estacionamientos" className="block text-sm font-medium text-neutral-700 mb-1">
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
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="amueblado" className="block text-sm font-medium text-neutral-700 mb-1">
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

            {/* Second row of advanced filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Location */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="ubicacion" className="block text-sm font-medium text-neutral-700 mb-1">
                  Ubicación
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    placeholder="Ciudad, colonia o zona"
                    value={filters.ubicacion}
                    onChange={handleInputChange}
                    className={`input-field pl-10 transition-all duration-200 ${
                      filters.ubicacion ? 'border-primary-500 bg-primary-50' : ''
                    }`}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                </div>
              </div>
              
              {/* Construction Area Range */}
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="metros_construccion_min" className="block text-sm font-medium text-neutral-700 mb-1">
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
              
              <div className="transform transition-all duration-200 hover:scale-[1.02]">
                <label htmlFor="metros_construccion_max" className="block text-sm font-medium text-neutral-700 mb-1">
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

            {/* Quick filter presets */}
            <div className="mb-4">
              <h5 className="text-sm font-medium text-neutral-700 mb-2">Filtros rápidos:</h5>
              <div className="flex flex-wrap gap-2">
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
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105"
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
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105"
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
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105"
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
                  className="px-3 py-1 text-xs bg-neutral-100 hover:bg-primary-100 text-neutral-700 hover:text-primary-700 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  Casa grande (100+ m²)
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Advanced Filters Toggle & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <button 
            type="button" 
            onClick={toggleAdvanced}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center mb-3 sm:mb-0 transition-all duration-200 group transform hover:scale-105"
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