import React, { useState, useEffect } from 'react';
import { Property, Amenity } from '../../types';
import { Plus, X, Upload } from 'lucide-react';
import { useAmenities } from '../../hooks/useProperties';

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
    }
  );
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize selected amenities when property is loaded
  useEffect(() => {
    if (property?.amenidades) {
      setSelectedAmenities(property.amenidades.map(a => a.id));
    }
  }, [property]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(id => id !== amenityId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.titulo) validationErrors.titulo = 'El título es requerido';
    if (!formData.precio || formData.precio <= 0) validationErrors.precio = 'El precio debe ser mayor a cero';
    if (!formData.direccion) validationErrors.direccion = 'La dirección es requerida';
    if (!formData.colonia) validationErrors.colonia = 'La colonia es requerida';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData, selectedAmenities);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, this would upload files to a server
      const newImages = Array.from(files).map((_, index) => 
        `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg`
      );
      
      setFormData({
        ...formData,
        imagenes: [...(formData.imagenes || []), ...newImages],
      });
    }
  };

  const removeImage = (index: number) => {
    if (formData.imagenes) {
      const updatedImages = [...formData.imagenes];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        imagenes: updatedImages,
      });
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
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label htmlFor="titulo" className="block text-sm font-medium text-neutral-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className={`input-field ${errors.titulo ? 'border-red-500' : ''}`}
              placeholder="Ej. Casa moderna en Polanco"
            />
            {errors.titulo && <p className="mt-1 text-sm text-red-500">{errors.titulo}</p>}
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
              value={formData.precio}
              onChange={handleInputChange}
              className={`input-field ${errors.precio ? 'border-red-500' : ''}`}
              placeholder="Ej. 2500000"
              min="0"
              step="0.01"
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
              value={formData.operacion}
              onChange={handleInputChange}
              className="select-field"
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
              value={formData.tipo}
              onChange={handleInputChange}
              className="select-field"
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
                checked={formData.amueblado}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
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
                checked={formData.disponible}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
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
                checked={formData.destacado}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="destacado" className="ml-2 block text-neutral-700">
                Destacado
              </label>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="descripcion" className="block text-sm font-medium text-neutral-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={5}
              className="input-field"
              placeholder="Descripción detallada de la propiedad..."
            ></textarea>
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
              value={formData.recamaras}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 3"
              min="0"
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
              value={formData.banos}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 2"
              min="0"
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
              value={formData.estacionamientos}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 1"
              min="0"
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
              value={formData.metros_construccion}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 120"
              min="0"
              step="0.01"
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
              value={formData.metros_terreno}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 200"
              min="0"
              step="0.01"
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
              value={formData.antiguedad}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 5"
              min="0"
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
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={formData.direccion}
              onChange={handleInputChange}
              className={`input-field ${errors.direccion ? 'border-red-500' : ''}`}
              placeholder="Ej. Paseo de la Reforma 222, Depto 301"
            />
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
              value={formData.colonia}
              onChange={handleInputChange}
              className={`input-field ${errors.colonia ? 'border-red-500' : ''}`}
              placeholder="Ej. Juárez"
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
              value={formData.ciudad}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. Ciudad de México"
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
              value={formData.estado}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. Ciudad de México"
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
              value={formData.codigo_postal}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 06600"
            />
          </div>
          
          {/* Coordinates */}
          <div>
            <label htmlFor="latitud" className="block text-sm font-medium text-neutral-700 mb-1">
              Latitud
            </label>
            <input
              type="number"
              id="latitud"
              name="latitud"
              value={formData.latitud}
              onChange={handleInputChange}
              step="0.0001"
              className="input-field"
              placeholder="Ej. 19.4326"
            />
          </div>
          
          <div>
            <label htmlFor="longitud" className="block text-sm font-medium text-neutral-700 mb-1">
              Longitud
            </label>
            <input
              type="number"
              id="longitud"
              name="longitud"
              value={formData.longitud}
              onChange={handleInputChange}
              step="0.0001"
              className="input-field"
              placeholder="Ej. -99.1332"
            />
          </div>
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
        
        {/* Current Images */}
        <div className="mb-6">
          <p className="text-sm font-medium text-neutral-700 mb-2">Imágenes actuales</p>
          
          {formData.imagenes && formData.imagenes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.imagenes.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Propiedad ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 italic">No hay imágenes disponibles</p>
          )}
        </div>
        
        {/* Upload New Images */}
        <div>
          <p className="text-sm font-medium text-neutral-700 mb-2">Subir nuevas imágenes</p>
          
          <label className="block w-full border-2 border-neutral-300 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-neutral-400 mb-2" />
              <p className="text-neutral-600 mb-1">Arrastra y suelta las imágenes aquí o haz clic para buscar</p>
              <p className="text-xs text-neutral-500">PNG, JPG, WEBP hasta 5MB</p>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>
    </form>
  );
};

export default AdminPropertyForm;