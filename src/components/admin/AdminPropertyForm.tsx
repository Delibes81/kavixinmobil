import React, { useState, useEffect } from 'react';
import { Property, Amenity } from '../../types';
import { Plus, X, AlertCircle, MapPin } from 'lucide-react';
import { useAmenities } from '../../hooks/useProperties';
import ImageUploadComponent from './ImageUploadComponent';
import AddressAutocomplete from './AddressAutocomplete';
import LocationPickerMap from './LocationPickerMap';
import { validatePropertyData, sanitizeInput } from '../../utils/security';

interface AdminPropertyFormProps {
  property?: Property;
  onSubmit: (property: Partial<Property>, amenityIds: string[]) => void;
}

const AdminPropertyForm: React.FC<AdminPropertyFormProps> = ({ property, onSubmit }) => {
  const { amenities } = useAmenities();
  const [formData, setFormData] = useState<Partial<Property>>(
    property || {
      titulo: '',
      descripcion: '',
      precio: 0,
      operacion: 'venta',
      tipo: 'casa',
      recamaras: 0,
      banos: 0,
      estacionamientos: 0,
      metros_construccion: 0,
      metros_terreno: 0,
      antiguedad: 0,
      amueblado: false,
      direccion: '',
      colonia: '',
      ciudad: 'Ciudad de México',
      estado: 'Ciudad de México',
      codigo_postal: '',
      latitud: 0,
      longitud: 0,
      imagenes: [],
      disponible: true,
      destacado: false,
      id_interno: '',
    }
  );
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeocodingAddress, setIsGeocodingAddress] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Initialize form data when property changes
  useEffect(() => {
    if (property) {
      console.log('Setting form data from property:', property);
      setFormData({
        titulo: property.titulo || '',
        descripcion: property.descripcion || '',
        precio: property.precio || 0,
        operacion: property.operacion || 'venta',
        tipo: property.tipo || 'casa',
        recamaras: property.recamaras || 0,
        banos: property.banos || 0,
        estacionamientos: property.estacionamientos || 0,
        metros_construccion: property.metros_construccion || 0,
        metros_terreno: property.metros_terreno || 0,
        antiguedad: property.antiguedad || 0,
        amueblado: property.amueblado || false,
        direccion: property.direccion || '',
        colonia: property.colonia || '',
        ciudad: property.ciudad || 'Ciudad de México',
        estado: property.estado || 'Ciudad de México',
        codigo_postal: property.codigo_postal || '',
        latitud: property.latitud || 0,
        longitud: property.longitud || 0,
        imagenes: property.imagenes || [],
        disponible: property.disponible ?? true,
        destacado: property.destacado || false,
        id_interno: property.id_interno || '',
      });
      
      // Set selected amenities
      if (property.amenidades) {
        setSelectedAmenities(property.amenidades.map(a => a.id));
      }
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    console.log('Input change:', { name, value, type });
    
    let processedValue: any = value;
    
    // Sanitize text inputs
    if (type === 'text' || type === 'textarea') {
      processedValue = sanitizeInput(value);
      // For id_interno, keep empty strings as empty strings (don't convert to null here)
      if (name === 'id_interno') {
        processedValue = value.trim();
      }
    } else if (type === 'number') {
      processedValue = value === '' ? 0 : parseFloat(value);
      // Validate numeric ranges
      if (name === 'precio' && processedValue < 0) processedValue = 0;
      if (name === 'recamaras' && processedValue < 0) processedValue = 0;
      if (name === 'banos' && processedValue < 0) processedValue = 0;
      if (name === 'estacionamientos' && processedValue < 0) processedValue = 0;
      if (name === 'metros_construccion' && processedValue < 0) processedValue = 0;
      if (name === 'metros_terreno' && processedValue < 0) processedValue = 0;
      if (name === 'antiguedad' && processedValue < 0) processedValue = 0;
      if (name === 'latitud' && (processedValue < -90 || processedValue > 90)) {
        processedValue = Math.max(-90, Math.min(90, processedValue));
      }
      if (name === 'longitud' && (processedValue < -180 || processedValue > 180)) {
        processedValue = Math.max(-180, Math.min(180, processedValue));
      }
    }
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: processedValue,
      };
      console.log('Updated form data:', newData);
      return newData;
    });

    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log('Checkbox change:', { name, checked });
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: checked,
      };
      console.log('Updated form data:', newData);
      return newData;
    });
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    console.log('Amenity change:', { amenityId, checked });
    
    setSelectedAmenities(prev => {
      const newAmenities = checked 
        ? [...prev, amenityId]
        : prev.filter(id => id !== amenityId);
      console.log('Updated amenities:', newAmenities);
      return newAmenities;
    });
  };

  const handleImagesChange = (images: string[]) => {
    console.log('Images change:', images);
    setFormData(prev => {
      const newData = {
        ...prev,
        imagenes: images,
      };
      console.log('Updated form data with images:', newData);
      return newData;
    });
  };

  const handleLocationChange = (lat: number, lng: number) => {
    console.log('Location changed:', { lat, lng });
    setFormData(prev => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
  };

  const handleAddressSelect = (addressData: any) => {
    console.log('Address selected:', addressData);
    
    setFormData(prev => ({
      ...prev,
      direccion: addressData.formatted_address,
      latitud: addressData.lat,
      longitud: addressData.lng,
      // Auto-fill other fields if available
      colonia: addressData.components.neighborhood || prev.colonia,
      ciudad: addressData.components.locality || prev.ciudad,
      estado: addressData.components.administrative_area_level_1 || prev.estado,
      codigo_postal: addressData.components.postal_code || prev.codigo_postal,
    }));
  };

  const handleGeocodeCurrentAddress = async () => {
    if (!formData.direccion?.trim()) {
      setErrors(prev => ({ ...prev, geocode: 'Ingresa una dirección para obtener coordenadas' }));
      return;
    }

    setIsGeocodingAddress(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.geocode;
      return newErrors;
    });

    try {
      // Build full address for geocoding
      const addressParts = [];
      if (formData.direccion) addressParts.push(formData.direccion);
      if (formData.colonia) addressParts.push(formData.colonia);
      if (formData.ciudad) addressParts.push(formData.ciudad);
      if (formData.estado) addressParts.push(formData.estado);
      
      const fullAddress = addressParts.join(', ');
      
      // Use Mapbox Geocoding API
      const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      if (!accessToken) {
        throw new Error('Token de Mapbox no configurado');
      }

      const encodedAddress = encodeURIComponent(fullAddress);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&country=mx&language=es&limit=1`
      );

      if (!response.ok) {
        throw new Error(`Error en la geocodificación: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        setFormData(prev => ({
          ...prev,
          latitud: lat,
          longitud: lng,
        }));
        
        alert(`Coordenadas actualizadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      } else {
        throw new Error('No se encontraron coordenadas para esta dirección');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setErrors(prev => ({ 
        ...prev, 
        geocode: error instanceof Error ? error.message : 'Error al obtener coordenadas' 
      }));
    } finally {
      setIsGeocodingAddress(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    console.log('Form submit triggered');
    console.log('Current form data:', formData);
    console.log('Selected amenities:', selectedAmenities);
    
    setIsSubmitting(true);
    
    try {
      // Validate using security utility
      const validation = validatePropertyData(formData);
      
      if (!validation.isValid) {
        const validationErrors: Record<string, string> = {};
        validation.errors.forEach((error, index) => {
          validationErrors[`error_${index}`] = error;
        });
        setErrors(validationErrors);
        return;
      }
      
      console.log('Validation passed, calling onSubmit');
      setErrors({});
      await onSubmit(formData, selectedAmenities);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Error al procesar el formulario. Por favor, intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group amenities by category
  const amenitiesByCategory = amenities.reduce((acc, amenity) => {
    const category = amenity.categoria || 'otros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  const categoryNames = {
    seguridad: 'Seguridad',
    recreacion: 'Recreación',
    servicios: 'Servicios',
    caracteristicas: 'Características',
    otros: 'Otros'
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="property-form">
      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Por favor, corrige los siguientes errores:</p>
              <ul className="list-disc list-inside text-sm">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internal ID */}
          <div>
            <label htmlFor="id_interno" className="block text-sm font-medium text-neutral-700 mb-1">
              ID Interno
              <span className="text-neutral-500 text-xs ml-1">(Opcional - Para control interno)</span>
            </label>
            <input
              type="text"
              id="id_interno"
              name="id_interno"
              value={formData.id_interno || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. PROP-2025-001"
              maxLength={50}
              disabled={isSubmitting}
            />
            <p className="text-xs text-neutral-500 mt-1">
              ID personalizable para identificación interna de la propiedad
            </p>
          </div>
          
          {/* Title */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium text-neutral-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo || ''}
              onChange={handleInputChange}
              className={`input-field ${errors.titulo ? 'border-red-500' : ''}`}
              placeholder="Ej. Casa moderna en Polanco"
              maxLength={200}
              disabled={isSubmitting}
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>}
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-neutral-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleInputChange}
              rows={4}
              className="input-field"
              placeholder="Descripción detallada de la propiedad..."
              maxLength={2000}
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          {/* Price & Operation */}
          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="precio"
              name="precio"
              value={formData.precio || ''}
              onChange={handleInputChange}
              className={`input-field ${errors.precio ? 'border-red-500' : ''}`}
              placeholder="Ej. 2500000"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
            {errors.precio && <p className="mt-1 text-sm text-red-500">{errors.precio}</p>}
          </div>
          
          <div>
            <label htmlFor="operacion" className="block text-sm font-medium text-neutral-700 mb-1">
              Operación
            </label>
            <select
              id="operacion"
              name="operacion"
              value={formData.operacion || 'venta'}
              onChange={handleInputChange}
              className="select-field"
              disabled={isSubmitting}
            >
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
              value={formData.tipo || 'casa'}
              onChange={handleInputChange}
              className="select-field"
              disabled={isSubmitting}
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
              <option value="oficina">Oficina</option>
            </select>
          </div>
          
          {/* Furnished & Available */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="amueblado"
                name="amueblado"
                checked={formData.amueblado || false}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="amueblado" className="ml-2 block text-neutral-700">
                Amueblado
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponible"
                name="disponible"
                checked={formData.disponible ?? true}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="disponible" className="ml-2 block text-neutral-700">
                Disponible
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="destacado"
                name="destacado"
                checked={formData.destacado || false}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="destacado" className="ml-2 block text-neutral-700">
                Destacado
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Characteristics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Características</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Bedrooms */}
          <div>
            <label htmlFor="recamaras" className="block text-sm font-medium text-neutral-700 mb-1">
              Recámaras
            </label>
            <input
              type="number"
              id="recamaras"
              name="recamaras"
              value={formData.recamaras || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 3"
              min="0"
              max="20"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Bathrooms */}
          <div>
            <label htmlFor="banos" className="block text-sm font-medium text-neutral-700 mb-1">
              Baños
            </label>
            <input
              type="number"
              id="banos"
              name="banos"
              value={formData.banos || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 2"
              min="0"
              max="20"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Parking */}
          <div>
            <label htmlFor="estacionamientos" className="block text-sm font-medium text-neutral-700 mb-1">
              Estacionamientos
            </label>
            <input
              type="number"
              id="estacionamientos"
              name="estacionamientos"
              value={formData.estacionamientos || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 1"
              min="0"
              max="20"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Construction Area */}
          <div>
            <label htmlFor="metros_construccion" className="block text-sm font-medium text-neutral-700 mb-1">
              M² Construcción
            </label>
            <input
              type="number"
              id="metros_construccion"
              name="metros_construccion"
              value={formData.metros_construccion || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 120"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Land Area */}
          <div>
            <label htmlFor="metros_terreno" className="block text-sm font-medium text-neutral-700 mb-1">
              M² Terreno
            </label>
            <input
              type="number"
              id="metros_terreno"
              name="metros_terreno"
              value={formData.metros_terreno || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 200"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Age */}
          <div className="md:col-span-3 lg:col-span-1">
            <label htmlFor="antiguedad" className="block text-sm font-medium text-neutral-700 mb-1">
              Antigüedad (años)
            </label>
            <input
              type="number"
              id="antiguedad"
              name="antiguedad"
              value={formData.antiguedad || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 5"
              min="0"
              max="200"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>
      
      {/* Location */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Address */}
          <div className="col-span-2">
            <label htmlFor="direccion" className="block text-sm font-medium text-neutral-700 mb-1">
              Dirección <span className="text-red-500">*</span>
            </label>
            <AddressAutocomplete
              value={formData.direccion || ''}
              onChange={(value) => handleInputChange({ target: { name: 'direccion', value, type: 'text' } } as any)}
              onAddressSelect={handleAddressSelect}
              placeholder="Ej. Paseo de la Reforma 222, Depto 301"
              className={errors.direccion ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {/* <input
              id="direccion"
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleInputChange}
              className={`input-field ${errors.direccion ? 'border-red-500' : ''}`}
              placeholder="Ej. Paseo de la Reforma 222, Depto 301"
              maxLength={200}
              disabled={isSubmitting}
            /> */}
            {errors.direccion && <p className="mt-1 text-sm text-red-500">{errors.direccion}</p>}
          </div>
          
          {/* Neighborhood */}
          <div>
            <label htmlFor="colonia" className="block text-sm font-medium text-neutral-700 mb-1">
              Colonia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="colonia"
              name="colonia"
              value={formData.colonia || ''}
              onChange={handleInputChange}
              className={`input-field ${errors.colonia ? 'border-red-500' : ''}`}
              placeholder="Ej. Juárez"
              maxLength={100}
              disabled={isSubmitting}
            />
            {errors.colonia && <p className="mt-1 text-sm text-red-500">{errors.colonia}</p>}
          </div>
          
          {/* City */}
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-neutral-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="ciudad"
              name="ciudad"
              value={formData.ciudad || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. Ciudad de México"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
          
          {/* State */}
          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-neutral-700 mb-1">
              Estado
            </label>
            <input
              type="text"
              id="estado"
              name="estado"
              value={formData.estado || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. Ciudad de México"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Postal Code */}
          <div>
            <label htmlFor="codigo_postal" className="block text-sm font-medium text-neutral-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              id="codigo_postal"
              name="codigo_postal"
              value={formData.codigo_postal || ''}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 06600"
              maxLength={10}
              disabled={isSubmitting}
            />
          </div>
          
          {/* Coordinates */}
          <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="latitud" className="block text-sm font-medium text-neutral-700 mb-1">
              Latitud
            </label>
            <input
              type="number"
              id="latitud"
              name="latitud"
              value={formData.latitud || 0}
              onChange={handleInputChange}
              step="0.0001"
              min="-90"
              max="90"
              className="input-field"
              placeholder="Ej. 19.4326"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="transform transition-all duration-300 hover:scale-[1.02] hover:z-10 relative">
            <label htmlFor="longitud" className="block text-sm font-medium text-neutral-700 mb-1">
              Longitud
            </label>
            <input
              type="number"
              id="longitud"
              name="longitud"
              value={formData.longitud || 0}
              onChange={handleInputChange}
              step="0.0001"
              min="-180"
              max="180"
              className="input-field"
              placeholder="Ej. -99.1332"
              disabled={isSubmitting}
            />
          </div>
          
          {/* Location Controls */}
          <div className="col-span-3">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleGeocodeCurrentAddress}
                  disabled={isGeocodingAddress || isSubmitting || !formData.direccion?.trim()}
                  className="btn btn-outline w-full sm:w-auto"
                >
                  {isGeocodingAddress ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Obteniendo coordenadas...
                    </>
                  ) : (
                    <>
                      <MapPin className="h-4 w-4 mr-2" />
                      Obtener coordenadas de la dirección
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex-1">
                <button
                  type="button"
                  onClick={() => setShowLocationPicker(!showLocationPicker)}
                  className="btn btn-primary w-full sm:w-auto"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showLocationPicker ? 'Ocultar mapa' : 'Seleccionar en mapa'}
                </button>
              </div>
            </div>
            {errors.geocode && <p className="mt-1 text-sm text-red-500">{errors.geocode}</p>}
            <p className="mt-1 text-xs text-neutral-500">
              Obtén coordenadas automáticamente desde la dirección o selecciona la ubicación en el mapa interactivo
            </p>
            {formData.latitud !== 0 && formData.longitud !== 0 && (
              <p className="mt-1 text-xs text-green-600">
                ✓ Coordenadas configuradas: {formData.latitud?.toFixed(6)}, {formData.longitud?.toFixed(6)}
              </p>
            )}
          </div>
          
          {/* Interactive Location Picker */}
          {showLocationPicker && (
            <div className="col-span-3">
              <div className="mt-4 p-4 border border-neutral-200 rounded-lg bg-neutral-50">
                <h4 className="text-lg font-medium text-neutral-800 mb-3 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                  Seleccionar Ubicación en el Mapa
                </h4>
                <LocationPickerMap
                  latitude={formData.latitud || 0}
                  longitude={formData.longitud || 0}
                  onLocationChange={handleLocationChange}
                  address={`${formData.direccion || ''} ${formData.colonia || ''} ${formData.ciudad || ''}`.trim()}
                  showAreaCircle={true}
                  circleRadius={300}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Amenities */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Amenidades</h3>
        
        {Object.entries(amenitiesByCategory).map(([category, categoryAmenities]) => (
          <div key={category} className="mb-6">
            <h4 className="text-lg font-medium mb-3 text-primary-700">
              {categoryNames[category as keyof typeof categoryNames] || category}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {categoryAmenities.map((amenity) => (
                <label key={amenity.id} className="flex items-center space-x-2 p-3 hover:bg-neutral-50 rounded cursor-pointer border border-neutral-200">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity.id)}
                    onChange={(e) => handleAmenityChange(amenity.id, e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-neutral-700">{amenity.nombre}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Imágenes</h3>
        <ImageUploadComponent
          images={formData.imagenes || []}
          onImagesChange={handleImagesChange}
          propertyId={property?.id}
          maxImages={50}
        />
      </div>
    </form>
  );
};

export default AdminPropertyForm;