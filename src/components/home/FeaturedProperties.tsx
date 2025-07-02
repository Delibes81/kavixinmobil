import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PropertyCard from '../properties/PropertyCard';
import FadeInSection from '../ui/FadeInSection';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useProperties } from '../../hooks/useProperties';

const FeaturedProperties: React.FC = () => {
  const { properties, loading } = useProperties();
  
  // Get 3 featured properties (destacado = true) or first 3 if none are featured
  const featuredProperties = properties.filter(p => p.destacado).slice(0, 3);
  const displayProperties = featuredProperties.length > 0 ? featuredProperties : properties.slice(0, 3);

  if (loading) {
    return (
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center py-16">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-neutral-600">Cargando propiedades destacadas...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section bg-white">
      <div className="container-custom">
        <FadeInSection>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h2 className="mb-2">Propiedades destacadas</h2>
              <p className="text-neutral-600 max-w-2xl">
                Descubre nuestras propiedades más exclusivas seleccionadas por nuestros expertos inmobiliarios.
              </p>
            </div>
            <Link 
              to="/propiedades" 
              className="mt-4 md:mt-0 flex items-center text-primary-600 font-medium hover:text-primary-700 transition-all duration-200 hover:translate-x-1"
            >
              Ver todas las propiedades
              <ChevronRight className="h-5 w-5 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProperties.map((property, index) => (
            <FadeInSection key={property.id} delay={index * 200}>
              <div className="property-card">
                <PropertyCard property={property} />
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;