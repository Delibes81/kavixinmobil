import React, { useState } from 'react';
import { Search, X, Sliders } from 'lucide-react';
import { SearchFilters } from '../../types';

interface PropertySearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
}

const PropertySearchFilters: React.FC<PropertySearchFiltersProps> = ({ onApplyFilters }) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    operation: '',
    type: '',
    minPrice: null,
    maxPrice: null,
    bedrooms: null,
    bathrooms: null,
    parking: null,
    location: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (['minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'parking'].includes(name)) {
      setFilters({
        ...filters,
        [name]: value === '' ? null : Number(value),
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
    setFilters({
      operation: '',
      type: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
      parking: null,
      location: '',
    });
    onApplyFilters({
      operation: '',
      type: '',
      minPrice: null,
      maxPrice: null,
      bedrooms: null,
      bathrooms: null,
      parking: null,
      location: '',
    });
  };

  const toggleAdvanced = () => {
    setIsAdvancedOpen(!isAdvancedOpen);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Operation Type */}
          <div>
            <label htmlFor="operation" className="block text-sm font-medium text-neutral-700 mb-1">
              Operación
            </label>
            <select
              id="operation"
              name="operation"
              value={filters.operation}
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
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
              Tipo de propiedad
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="">Todos</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          
          {/* Price Range */}
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio mínimo
            </label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              placeholder="Desde"
              value={filters.minPrice || ''}
              onChange={handleInputChange}
              className="input-field"
              min="0"
            />
          </div>
          
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio máximo
            </label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              placeholder="Hasta"
              value={filters.maxPrice || ''}
              onChange={handleInputChange}
              className="input-field"
              min="0"
            />
          </div>
        </div>
        
        {/* Advanced Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 ${isAdvancedOpen ? 'block' : 'hidden'}`}>
          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-neutral-700 mb-1">
              Recámaras
            </label>
            <select
              id="bedrooms"
              name="bedrooms"
              value={filters.bedrooms || ''}
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
            <label htmlFor="bathrooms" className="block text-sm font-medium text-neutral-700 mb-1">
              Baños
            </label>
            <select
              id="bathrooms"
              name="bathrooms"
              value={filters.bathrooms || ''}
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
            <label htmlFor="parking" className="block text-sm font-medium text-neutral-700 mb-1">
              Estacionamientos
            </label>
            <select
              id="parking"
              name="parking"
              value={filters.parking || ''}
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
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-1">
              Ubicación
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Ciudad o zona"
              value={filters.location}
              onChange={handleInputChange}
              className="input-field"
            />
          </div>
        </div>
        
        {/* Advanced Filters Toggle & Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button 
            type="button" 
            onClick={toggleAdvanced}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center order-3 sm:order-1"
          >
            {isAdvancedOpen ? (
              <>
                <X className="h-4 w-4 mr-1" />
                Ocultar filtros avanzados
              </>
            ) : (
              <>
                <Sliders className="h-4 w-4 mr-1" />
                Mostrar filtros avanzados
              </>
            )}
          </button>
          
          <div className="flex items-center gap-3 ml-auto order-1 sm:order-2 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={handleReset}
              className="btn btn-outline flex-1 sm:flex-auto"
            >
              Limpiar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary flex-1 sm:flex-auto"
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