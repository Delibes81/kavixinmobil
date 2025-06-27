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
  const isNewProperty = id === 'nueva';
  
  useEffect(() => {
    if (!isNewProperty && properties.length > 0) {
      const foundProperty = properties.find(p => p.id === id);
      setProperty(foundProperty);
    }
    
    document.title = isNewProperty 
      ? 'Nueva Propiedad | Nova Hestia' 
      : 'Editar Propiedad | Nova Hestia';
  }, [id, isNewProperty, properties]);

  const handleSubmit = async (formData: Partial<Property>) => {
    try {
      if (isNewProperty) {
        await createProperty(formData);
        alert('Propiedad creada correctamente');
      } else {
        await updateProperty(property!.id, formData);
        alert('Propiedad actualizada correctamente');
      }
      
      // Redirect to properties list
      navigate('/admin/propiedades');
    } catch (err) {
      alert('Error al guardar la propiedad: ' + (err instanceof Error ? err.message : 'Error desconocido'));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      try {
        await deleteProperty(property!.id);
        alert('Propiedad eliminada correctamente');
        navigate('/admin/propiedades');
      } catch (err) {
        alert('Error al eliminar la propiedad: ' + (err instanceof Error ? err.message : 'Error desconocido'));
      }
    }
  };

  if (loading) {
    return (
      <div className="pt-20">
        <div className="bg-primary-800 text-white py-8">
          <div className="container-custom">
            <div className="flex items-center mb-4">
              <Link to="/admin/propiedades" className="flex items-center text-white hover:text-secondary-400 transition-colors mr-4">
                <ArrowLeft className="h-5 w-5 mr-1" />
                Volver
              </Link>
              <h1 className="text-white">
                {isNewProperty ? 'Nueva Propiedad' : 'Editar Propiedad'}
              </h1>
            </div>
            <p className="text-white/80">
              {isNewProperty 
                ? 'Crea una nueva propiedad para tu inventario' 
                : 'Actualiza la información de la propiedad'}
            </p>
          </div>
        </div>
        <div className="container-custom py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="bg-primary-800 text-white py-8">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Link to="/admin/propiedades" className="flex items-center text-white hover:text-secondary-400 transition-colors mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Volver
            </Link>
            <h1 className="text-white">
              {isNewProperty ? 'Nueva Propiedad' : 'Editar Propiedad'}
            </h1>
          </div>
          <p className="text-white/80">
            {isNewProperty 
              ? 'Crea una nueva propiedad para tu inventario' 
              : 'Actualiza la información de la propiedad'}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="mb-6 flex justify-between">
          {!isNewProperty && property && (
            <button 
              onClick={handleDelete}
              className="btn flex items-center bg-red-500 hover:bg-red-600 text-white focus:ring-red-500"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Eliminar propiedad
            </button>
          )}
          
          <div className="ml-auto">
            <Link to="/admin/propiedades" className="btn btn-outline mr-3">
              Cancelar
            </Link>
            <button 
              type="submit"
              form="property-form"
              className="btn btn-primary"
            >
              <Save className="h-5 w-5 mr-2" />
              {isNewProperty ? 'Crear propiedad' : 'Guardar cambios'}
            </button>
          </div>
        </div>
        
        <AdminPropertyForm 
          property={property} 
          onSubmit={handleSubmit} 
        />
      </div>
    </div>
  );
};

export default AdminPropertyEdit;