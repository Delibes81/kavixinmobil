import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus } from 'lucide-react';
import AdminPropertyForm from '../../components/admin/AdminPropertyForm';
import { useProperties } from '../../hooks/useProperties';
import { Property } from '../../types';

const AdminPropertyCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createProperty } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    document.title = 'Agregar Nueva Propiedad | Nova Hestia';
  }, []);

  const handleSubmit = async (formData: Partial<Property>, amenityIds: string[]) => {
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    
    try {
      console.log('Creating new property...');
      console.log('Form data:', formData);
      console.log('Amenity IDs:', amenityIds);
      
      const result = await createProperty(formData, amenityIds);
      console.log('Property created:', result);
      alert('Propiedad creada correctamente');
      
      // Redirect to properties list
      navigate('/admin/propiedades');
    } catch (err) {
      console.error('Error creating property:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      alert('Error al crear la propiedad: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link to="/admin/propiedades" className="flex items-center text-primary-600 hover:text-primary-700 transition-colors mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Volver
          </Link>
          <h1 className="text-3xl font-bold text-primary-800">Agregar Nueva Propiedad</h1>
        </div>
        <p className="text-neutral-600">
          Crea una nueva propiedad para tu inventario inmobiliario
        </p>
      </div>

      {/* Action Buttons - Top */}
      <div className="mb-6 flex justify-between">
        <div></div> {/* Empty div for spacing */}
        
        <div className="flex items-center space-x-3">
          <Link to="/admin/propiedades" className="btn btn-outline">
            Cancelar
          </Link>
          <button 
            type="submit"
            form="property-form"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Plus className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Creando...' : 'Agregar Propiedad'}
          </button>
        </div>
      </div>
      
      {/* Property Form */}
      <AdminPropertyForm 
        onSubmit={handleSubmit} 
      />

      {/* Action Buttons - Bottom */}
      <div className="mt-8 flex justify-between">
        <div></div> {/* Empty div for spacing */}
        
        <div className="flex items-center space-x-3">
          <Link to="/admin/propiedades" className="btn btn-outline">
            Cancelar
          </Link>
          <button 
            type="submit"
            form="property-form"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <Plus className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Creando...' : 'Agregar Propiedad'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPropertyCreate;