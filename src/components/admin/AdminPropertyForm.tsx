import React, { useState } from 'react';
import { Property, PropertyFormData } from '../../types';
import { Plus, X, Upload } from 'lucide-react';

interface AdminPropertyFormProps {
  property?: Property;
  onSubmit: (property: PropertyFormData) => void;
}

const AdminPropertyForm: React.FC<AdminPropertyFormProps> = ({ property, onSubmit }) => {
  const [formData, setFormData] = useState<PropertyFormData>(
    property ? {
      title: property.title,
      description: property.description,
      price: property.price,
      operation: property.operation,
      type: property.type,
      area: property.area,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      parking: property.parking,
      is_furnished: property.is_furnished,
      address: property.address,
      city: property.city,
      state: property.state,
      latitude: property.latitude,
      longitude: property.longitude,
      images: property.images,
      features: property.features,
    } : {
      title: '',
      description: '',
      price: 0,
      operation: 'venta',
      type: 'casa',
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      is_furnished: false,
      address: '',
      city: '',
      state: '',
      latitude: 0,
      longitude: 0,
      images: [],
      features: [],
    }
  );
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const addFeature = () => {
    if (newFeature.trim() && formData.features) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    if (formData.features) {
      const updatedFeatures = [...formData.features];
      updatedFeatures.splice(index, 1);
      setFormData({
        ...formData,
        features: updatedFeatures,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.title) validationErrors.title = 'El título es requerido';
    if (!formData.description) validationErrors.description = 'La descripción es requerida';
    if (!formData.price || formData.price <= 0) validationErrors.price = 'El precio debe ser mayor a cero';
    if (!formData.area || formData.area <= 0) validationErrors.area = 'La superficie debe ser mayor a cero';
    if (!formData.address) validationErrors.address = 'La dirección es requerida';
    if (!formData.city) validationErrors.city = 'La ciudad es requerida';
    if (!formData.state) validationErrors.state = 'El estado es requerido';
    if (!formData.latitude) validationErrors.latitude = 'La latitud es requerida';
    if (!formData.longitude) validationErrors.longitude = 'La longitud es requerida';
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
  };

  // Mock function for image upload (in a real app, this would handle actual uploads)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // In a real app, this would upload files to a server
      // For this demo, we'll just use placeholder URLs
      const newImages = Array.from(files).map((_, index) => 
        `https://images.pexels.com/photos/${1000000 + Math.floor(Math.random() * 1000000)}/pexels-photo.jpeg`
      );
      
      setFormData({
        ...formData,
        images: [...(formData.images || []), ...newImages],
      });
    }
  };

  const removeImage = (index: number) => {
    if (formData.images) {
      const updatedImages = [...formData.images];
      updatedImages.splice(index, 1);
      setFormData({
        ...formData,
        images: updatedImages,
      });
    }
  };

  return (
    <form id="property-form" onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Ej. Casa moderna en Polanco"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          {/* Price & Operation */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">
              Precio <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`input-field ${errors.price ? 'border-red-500' : ''}`}
              placeholder="Ej. 2500000"
              min="0"
            />
            {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
          </div>
          
          <div>
            <label htmlFor="operation" className="block text-sm font-medium text-neutral-700 mb-1">
              Operación <span className="text-red-500">*</span>
            </label>
            <select
              id="operation"
              name="operation"
              value={formData.operation}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="venta">Venta</option>
              <option value="renta">Renta</option>
            </select>
          </div>
          
          {/* Property Type & Furnished */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-neutral-700 mb-1">
              Tipo de propiedad <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="terreno">Terreno</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center h-full pt-6">
              <input
                type="checkbox"
                id="is_furnished"
                name="is_furnished"
                checked={formData.is_furnished}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              />
              <label htmlFor="is_furnished" className="ml-2 block text-neutral-700">
                Amueblado
              </label>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Descripción detallada de la propiedad..."
            ></textarea>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
          </div>
        </div>
      </div>
      
      {/* Characteristics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Características</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Area */}
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-neutral-700 mb-1">
              Superficie (m²) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleInputChange}
              className={`input-field ${errors.area ? 'border-red-500' : ''}`}
              placeholder="Ej. 120"
              min="0"
            />
            {errors.area && <p className="mt-1 text-sm text-red-500">{errors.area}</p>}
          </div>
          
          {/* Bedrooms */}
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-neutral-700 mb-1">
              Recámaras <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 3"
              min="0"
            />
          </div>
          
          {/* Bathrooms */}
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-neutral-700 mb-1">
              Baños <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 2"
              min="0"
            />
          </div>
          
          {/* Parking */}
          <div>
            <label htmlFor="parking" className="block text-sm font-medium text-neutral-700 mb-1">
              Estacionamientos <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="parking"
              name="parking"
              value={formData.parking}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ej. 1"
              min="0"
            />
          </div>
        </div>
        
        {/* Features */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Amenidades
          </label>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.features?.map((feature, index) => (
              <div key={index} className="bg-neutral-100 rounded-full px-3 py-1 flex items-center">
                <span className="text-neutral-800">{feature}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="ml-2 text-neutral-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="input-field rounded-r-none"
              placeholder="Agregar nueva amenidad..."
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md focus:outline-none"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Location */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address */}
          <div className="col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1">
              Dirección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`input-field ${errors.address ? 'border-red-500' : ''}`}
              placeholder="Ej. Av. Paseo de la Reforma 222"
            />
            {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
          </div>
          
          {/* City & State */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-700 mb-1">
              Ciudad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`input-field ${errors.city ? 'border-red-500' : ''}`}
              placeholder="Ej. Ciudad de México"
            />
            {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">
              Estado <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`input-field ${errors.state ? 'border-red-500' : ''}`}
              placeholder="Ej. CDMX"
            />
            {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state}</p>}
          </div>
          
          {/* Coordinates */}
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-neutral-700 mb-1">
              Latitud <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="0.0001"
              className={`input-field ${errors.latitude ? 'border-red-500' : ''}`}
              placeholder="Ej. 19.4326"
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>}
          </div>
          
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-neutral-700 mb-1">
              Longitud <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="0.0001"
              className={`input-field ${errors.longitude ? 'border-red-500' : ''}`}
              placeholder="Ej. -99.1332"
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>}
          </div>
        </div>
      </div>
      
      {/* Images */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Imágenes</h3>
        
        {/* Current Images */}
        <div className="mb-6">
          <p className="text-sm font-medium text-neutral-700 mb-2">Imágenes actuales</p>
          
          {formData.images && formData.images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
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