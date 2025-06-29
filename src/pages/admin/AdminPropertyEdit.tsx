import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AdminPropertyForm from '../../components/admin/AdminPropertyForm';
import { useProperties } from '../../hooks/useProperties';
import { Property } from '../../types';

const AdminPropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, loading, createProperty, updateProperty, deleteProperty } = useProperties();
  const [property, setProperty] = useState<Property | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNewProperty = id === 'nueva';
  
  useEffect(() => {
    if (!isNewProperty && properties.length > 0 && id) {
      const foundProperty = properties.find(p => p.id === id);
      setProperty(foundProperty);
    }
    
    document.title = isNewProperty 
      ? 'Agregar Propiedad | Nova Hestia' 
      : 'Editar Propiedad | Nova Hestia';
  }, [id, isNewProperty, properties]);

  const handleSubmit = async (formData: Partial<Property>, amenityIds: string[]) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      console.log('Form submission started');
      console.log('Form data:', formData);
      console.log('Amenity IDs:', amenityIds);
      console.log('Is new property:', isNewProperty);
      
      if (isNewProperty) {
        console.log('Creating new property...');
        const result = await createProperty(formData, amenityIds);
        console.log('Property created:', result);
        alert('Propiedad creada correctamente');
      } else {
        if (!property) {
          throw new Error('No se encontró la propiedad a actualizar');
        }
        console.log('Updating existing property with ID:', property.id);
        const result = await updateProperty(property.id, formData, amenityIds);
        console.log('Property updated:', result);
        alert('Propiedad actualizada correctamente');
      }
      
      // Redirect to properties list
      navigate('/admin/propiedades');
    } catch (err) {
      console.error('Error saving property:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      alert('Error al guardar la propiedad: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!property) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      try {
        await deleteProperty(property.id);
        alert('Propiedad eliminada correctamente');
        navigate('/admin/propiedades');
      } catch (err) {
        alert('Error al eliminar la propiedad: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Cargando...</p>
      </div>
    );
  }

  // Only show "property not found" error if we're trying to edit a specific property that doesn't exist
  if (!isNewProperty && id && !property) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>No se encontró la propiedad con ID: {id}</p>
        </div>
        <Link to="/admin/propiedades" className="btn btn-primary">
          Volver a propiedades
        </Link>
      </div>
    );
  }

  const ActionButtons = () => (
    <div className="flex justify-between">
      {!isNewProperty && property && (
        <button 
          onClick={handleDelete}
          className="btn flex items-center bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
          disabled={isSubmitting}
        >
          <Trash2 className="h-5 w-5 mr-2" />
          Eliminar propiedad
        </button>
      )}
      
      <div className={`flex gap-3 ${isNewProperty ? 'w-full justify-end' : 'ml-auto'}`}>
        <Link to="/admin/propiedades" className="btn btn-outline">
          Cancelar
        </Link>
        <button 
          type="submit"
          form="property-form"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          <Save className="h-5 w-5 mr-2" />
          {isSubmitting 
            ? 'Guardando...' 
            : (isNewProperty ? 'Agregar propiedad' : 'Guardar cambios')
          }
        </button>
      </div>
    </div>
  );

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/admin/propiedades" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold text-primary-800">
            {isNewProperty ? 'Agregar Propiedad' : 'Editar Propiedad'}
          </h1>
        </div>
        <p className="text-neutral-600">
          {isNewProperty 
            ? 'Agrega una nueva propiedad a tu inventario' 
            : 'Actualiza la información de la propiedad'}
        </p>
      </div>

      {/* Action Buttons - Top */}
      <div className="mb-6">
        <ActionButtons />
      </div>
      
      {/* Property Form */}
      <AdminPropertyForm 
        property={isNewProperty ? undefined : property} 
        onSubmit={handleSubmit} 
      />

      {/* Action Buttons - Bottom */}
      <div className="mt-6">
        <ActionButtons />
      </div>
    </div>
  );
};

export default AdminPropertyEdit;