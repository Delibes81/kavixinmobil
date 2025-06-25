import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AdminPropertyForm from '../../components/admin/AdminPropertyForm';
import { properties } from '../../data/properties';
import { Property } from '../../types';

const AdminPropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | undefined>();
  const isNewProperty = id === 'nueva';
  
  useEffect(() => {
    if (!isNewProperty) {
      const foundProperty = properties.find(p => p.id === id);
      setProperty(foundProperty);
    }
    
    document.title = isNewProperty 
      ? 'Nueva Propiedad | Nova Hestia' 
      : 'Editar Propiedad | Nova Hestia';
  }, [id, isNewProperty]);

  const handleSubmit = (formData: Partial<Property>) => {
    // In a real app, this would save to a database
    console.log('Property data submitted:', formData);
    
    // Show success message
    alert(isNewProperty 
      ? 'Propiedad creada correctamente' 
      : 'Propiedad actualizada correctamente');
    
    // Redirect to properties list
    navigate('/admin/propiedades');
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      // In a real app, this would delete from a database
      console.log('Property deleted:', property?.id);
      
      // Show success message
      alert('Propiedad eliminada correctamente');
      
      // Redirect to properties list
      navigate('/admin/propiedades');
    }
  };

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
          {!isNewProperty && (
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