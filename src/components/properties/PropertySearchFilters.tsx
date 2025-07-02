import React, { useState } from 'react';
import { Search, X, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Operation Type */}
          <div>
            <label htmlFor="operacion" className="block text-sm font-medium text-neutral-700 mb-1">
              Operación
            </label>
            <select
              id="operacion"
              name="operacion"
              value={filters.operacion}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="">Todas</option>
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>
          
          {/* Property Type */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-neutral-700 mb-1">
              Tipo de propiedad
            </label>
            <select
              id="tipo"
              name="tipo"
              value={filters.tipo}
              onChange={handleInputChange}
              className="select-field"
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
          <div>
            <label htmlFor="precio_min" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio mínimo
            </label>
            <input
              type="number"
              id="precio_min"
              name="precio_min"
              placeholder="Desde"
              value={filters.precio_min || ''}
              onChange={handleInputChange}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="precio_max" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio máximo
            </label>
            <input
              type="number"
              id="precio_max"
              name="precio_max"
              placeholder="Hasta"
              value={filters.precio_max || ''}
              onChange={handleInputChange}
              className="input-field"
              min="0"
            />
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isAdvancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pt-4 border-t border-neutral-200">
            {/* Bedrooms */}
            <div>
              <label htmlFor="recamaras" className="block text-sm font-medium text-neutral-700 mb-1">
                Recámaras
              </label>
              <select
                id="recamaras"
                name="recamaras"
                value={filters.recamaras || ''}
                onChange={handleInputChange}
                className="select-field"
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
            <div>
              <label htmlFor="banos" className="block text-sm font-medium text-neutral-700 mb-1">
                Baños
              </label>
              <select
                id="banos"
                name="banos"
                value={filters.banos || ''}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            {/* Parking */}
            <div>
              <label htmlFor="estacionamientos" className="block text-sm font-medium text-neutral-700 mb-1">
                Estacionamientos
              </label>
              <select
                id="estacionamientos"
                name="estacionamientos"
                value={filters.estacionamientos || ''}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            
            {/* Furnished */}
            <div>
              <label htmlFor="amueblado" className="block text-sm font-medium text-neutral-700 mb-1">
                Amueblado
              </label>
              <select
                id="amueblado"
                name="amueblado"
                value={filters.amueblado === null ? '' : filters.amueblado.toString()}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="">Cualquiera</option>
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="ubicacion" className="block text-sm font-medium text-neutral-700 mb-1">
                Ubicación
              </label>
              <input
                type="text"
                id="ubicacion"
                name="ubicacion"
                placeholder="Ciudad o zona"
                value={filters.ubicacion}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            
            {/* Construction Area Range */}
            <div>
              <label htmlFor="metros_construccion_min" className="block text-sm font-medium text-neutral-700 mb-1">
                M² mínimos
              </label>
              <input
                type="number"
                id="metros_construccion_min"
                name="metros_construccion_min"
                placeholder="Desde"
                value={filters.metros_construccion_min || ''}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>
            
            <div>
              <label htmlFor="metros_construccion_max" className="block text-sm font-medium text-neutral-700 mb-1">
                M² máximos
              </label>
              <input
                type="number"
                id="metros_construccion_max"
                name="metros_construccion_max"
                placeholder="Hasta"
                value={filters.metros_construccion_max || ''}
                onChange={handleInputChange}
                className="input-field"
                min="0"
              />
            </div>
          </div>
        </div>
        
        {/* Advanced Filters Toggle & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={toggleAdvanced}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center mb-3 sm:mb-0 transition-colors duration-200 group"
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
                  <span className="ml-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
              className="btn btn-outline flex-1 sm:flex-auto transition-all duration-200 hover:scale-105"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1 sm:flex-auto transition-all duration-200 hover:scale-105"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertySearchFilters;