import React, { useState } from 'react';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import FadeInSection from '../ui/FadeInSection';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    operacion: '',
    tipo: '',
    ubicacion: '',
    recamaras: '',
    banos: '',
    precio_min: '',
    precio_max: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdvancedFiltersToggle = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const handleSearch = () => {
    // Create URL params from filters with proper encoding
    const params = new URLSearchParams();
    
    console.log('Current search filters:', searchFilters);
    
    // Add filters to URL params
    if (searchFilters.operacion) params.set('operacion', searchFilters.operacion);
    if (searchFilters.tipo) params.set('tipo', searchFilters.tipo);
    if (searchFilters.ubicacion.trim()) params.set('ubicacion', searchFilters.ubicacion.trim());
    if (searchFilters.recamaras) params.set('recamaras', searchFilters.recamaras);
    if (searchFilters.banos) params.set('banos', searchFilters.banos);
    if (searchFilters.precio_min) params.set('precio_min', searchFilters.precio_min);
    if (searchFilters.precio_max) params.set('precio_max', searchFilters.precio_max);

    console.log('URL params:', params.toString());
    
    // Navigate to properties page with filters
    const queryString = params.toString();
    const targetUrl = `/propiedades${queryString ? `?${queryString}` : ''}`;
    console.log('Navigating to:', targetUrl);
    navigate(targetUrl);
  };

  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden hero-section">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/80 to-primary-800/70 z-10"></div>
        <img
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Luxury Home"
          className="w-full h-full object-cover animate-ken-burns"
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Content - FIXED: Padding top adecuado para móvil */}
      <div className="container-custom relative z-20 pt-24 md:pt-20">
        <div className="max-w-3xl">
          <FadeInSection delay={200}>
            <h1 className="text-white font-bold mb-4 leading-tight animate-fade-in-up text-3xl md:text-4xl lg:text-5xl">
              Encuentra tu hogar ideal
            </h1>
          </FadeInSection>
          
          <FadeInSection delay={400}>
            <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in-up">
              Las mejores propiedades en venta y renta seleccionadas para ti en las zonas más exclusivas de la ciudad.
            </p>
          </FadeInSection>

          {/* Search Bar */}
          <FadeInSection delay={600}>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg mb-8 animate-slide-up">
              {/* FIXED: Grid con padding extra para evitar recorte en hover */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                {/* Operation Type */}
                <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                  <label htmlFor="operation" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                    Operación
                  </label>
                  <select 
                    id="operation" 
                    name="operacion"
                    value={searchFilters.operacion}
                    onChange={handleInputChange}
                    className="select-field"
                  >
                    <option value="">Todas</option>
                    <option value="venta">Venta</option>
                    <option value="renta">Renta</option>
                  </select>
                </div>
                
                {/* Property Type */}
                <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                  <label htmlFor="propertyType" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                    Tipo de propiedad
                  </label>
                  <select 
                    id="propertyType" 
                    name="tipo"
                    value={searchFilters.tipo}
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
                
                {/* Location */}
                <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                  <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                    Ubicación
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="location"
                      name="ubicacion"
                      placeholder="Ciudad o zona"
                      value={searchFilters.ubicacion}
                      onChange={handleInputChange}
                      className="input-field pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                  </div>
                </div>
              </div>

              {/* Advanced Filters */}
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showAdvancedFilters ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
                <div className="pt-4 border-t border-neutral-200">
                  {/* FIXED: Grid con padding extra para evitar recorte */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-2">
                    {/* Bedrooms */}
                    <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                        Recámaras
                      </label>
                      <select 
                        id="bedrooms" 
                        name="recamaras"
                        value={searchFilters.recamaras}
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
                    <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                        Baños
                      </label>
                      <select 
                        id="bathrooms" 
                        name="banos"
                        value={searchFilters.banos}
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

                    {/* Price Min */}
                    <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                      <label htmlFor="priceMin" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                        Precio mínimo
                      </label>
                      <input
                        type="number"
                        id="priceMin"
                        name="precio_min"
                        placeholder="Desde $"
                        value={searchFilters.precio_min}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                      />
                    </div>

                    {/* Price Max */}
                    <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
                      <label htmlFor="priceMax" className="block text-sm font-medium text-neutral-700 mb-2 px-1">
                        Precio máximo
                      </label>
                      <input
                        type="number"
                        id="priceMax"
                        name="precio_max"
                        placeholder="Hasta $"
                        value={searchFilters.precio_max}
                        onChange={handleInputChange}
                        className="input-field"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Advanced Filters Toggle & Search Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 px-2">
                <button 
                  type="button" 
                  onClick={handleAdvancedFiltersToggle}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center mb-3 sm:mb-0 transition-all duration-200 group transform hover:scale-105 px-3 py-2 rounded-md hover:bg-primary-50"
                >
                  <Home className="h-4 w-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
                  {showAdvancedFilters ? 'Ocultar filtros avanzados' : 'Filtros avanzados'}
                  <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${
                    showAdvancedFilters ? 'rotate-180' : ''
                  }`} />
                </button>
                <button 
                  type="button"
                  onClick={handleSearch}
                  className="btn btn-primary w-full sm:w-auto transform transition-all duration-200 hover:scale-105"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar propiedades
                </button>
              </div>
            </div>
          </FadeInSection>

          {/* Social Proof */}
          <FadeInSection delay={800}>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-white animate-fade-in-up">
              <div className="flex items-center transform transition-all duration-300 hover:scale-110">
                <span className="text-2xl md:text-3xl font-bold text-secondary-400 animate-counter">500+</span>
                <span className="ml-2 text-white/80 text-sm md:text-base">Propiedades</span>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/20"></div>
              <div className="flex items-center transform transition-all duration-300 hover:scale-110">
                <span className="text-2xl md:text-3xl font-bold text-secondary-400 animate-counter">300+</span>
                <span className="ml-2 text-white/80 text-sm md:text-base">Clientes satisfechos</span>
              </div>
              <div className="w-px h-6 md:h-8 bg-white/20"></div>
              <div className="flex items-center transform transition-all duration-300 hover:scale-110">
                <span className="text-2xl md:text-3xl font-bold text-secondary-400 animate-counter">15+</span>
                <span className="ml-2 text-white/80 text-sm md:text-base">Años de experiencia</span>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;