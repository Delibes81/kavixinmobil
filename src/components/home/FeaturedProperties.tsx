import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PropertyCard from '../properties/PropertyCard';
import { PropertyService } from '../../services/propertyService';
import { Property } from '../../types';

const FeaturedProperties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PropertyService.getFeaturedProperties(3);
        setProperties(data);
      } catch (error: any) {
        console.error('Error fetching featured properties:', error);
        setError(error.message || 'Error al cargar las propiedades destacadas');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <section className="section bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center py-16">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <div>
            <h2 className="mb-2">Propiedades destacadas</h2>
            <p className="text-neutral-600 max-w-2xl">
              Descubre nuestras propiedades más exclusivas seleccionadas por nuestros expertos inmobiliarios.
            </p>
          </div>
          <Link 
            to="/propiedades" 
            className="mt-4 md:mt-0 flex items-center text-primary-600 font-medium hover:text-primary-700 transition-colors"
          >
            Ver todas las propiedades
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>

        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-neutral-600 mb-4">No hay propiedades destacadas disponibles en este momento.</p>
            <Link to="/admin/propiedades/nueva" className="btn btn-primary">
              Agregar primera propiedad
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;