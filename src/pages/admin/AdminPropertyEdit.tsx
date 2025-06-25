import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import AdminPropertyForm from '../../components/admin/AdminPropertyForm';
import { Property, PropertyFormData } from '../../types';
import { PropertyService } from '../../services/propertyService';

const AdminPropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | undefined>();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNewProperty = id === 'nueva';
  
  useEffect(() => {
    if (!isNewProperty && id) {
      fetchProperty();
    }
    
    document.title = isNewProperty 
      ? 'Nueva Propiedad | Nova Hestia' 
      : 'Editar Propiedad | Nova Hestia';
  }, [id, isNewProperty]);

  const fetchProperty = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await PropertyService.getPropertyById(id);
      setProperty(data || undefined);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Error al cargar la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: PropertyFormData) => {
    try {
      setSaving(true);
      setError(null);
      
      if (isNewProperty) {
        console.log('Creating new property with data:', formData);
        await PropertyService.createProperty(formData);
        alert('Propiedad creada correctamente');
      } else if (id) {
        console.log('Updating property with ID:', id, 'Data:', formData);
        await PropertyService.updateProperty(id, formData);
        alert('Propiedad actualizada correctamente');
      }
      
      navigate('/admin/propiedades');
    } catch (error: any) {
      console.error('Error saving property:', error);
      setError(error.message || 'Error al guardar la propiedad');
      alert(error.message || 'Error al guardar la propiedad');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!property || !window.confirm('¿Estás seguro de que deseas eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      setError(null);
      await PropertyService.deleteProperty(property.id);
      alert('Propiedad eliminada correctamente');
      navigate('/admin/propiedades');
    } catch (error: any) {
      console.error('Error deleting property:', error);
      setError(error.message || 'Error al eliminar la propiedad');
      alert(error.message || 'Error al eliminar la propiedad');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

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
            {isNewProperty ? 'Nueva Propiedad' : 'Editar Propiedad'}
          </h1>
        </div>
        <p className="text-neutral-600">
          {isNewProperty 
            ? 'Crea una nueva propiedad para tu inventario' 
            : 'Actualiza la información de la propiedad'}
        </p>
        
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
      </div>

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
            disabled={saving}
            className="btn btn-primary"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Guardando...' : (isNewProperty ? 'Crear propiedad' : 'Guardar cambios')}
          </button>
        </div>
      </div>
      
      <AdminPropertyForm 
        property={property} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default AdminPropertyEdit;