import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Home, Calendar, Tag } from 'lucide-react';
import PropertyGallery from '../components/property-detail/PropertyGallery';
import PropertyFeatures from '../components/property-detail/PropertyFeatures';
import PropertyMap from '../components/property-detail/PropertyMap';
import PropertyContact from '../components/property-detail/PropertyContact';
import { useProperty } from '../hooks/useProperties';
import NotFoundPage from './NotFoundPage';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { property, loading, error } = useProperty(id!);
  
  useEffect(() => {
    if (property) {
      document.title = `${property.title} | Nova Hestia`;
    } else {
      document.title = 'Propiedad no encontrada | Nova Hestia';
    }
  }, [property]);
  
  // Format price to Mexican Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !property) {
    return <NotFoundPage />;
  }

  return (
    <div className="pt-20">
      {/* Property Header */}
      <div className="bg-primary-800 text-white py-10">
        <div className="container-custom">
          <div className="flex items-center mb-4">
            <Link to="/propiedades" className="flex items-center text-white hover:text-secondary-400 transition-colors mr-4">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Volver
            </Link>
            <span className="text-neutral-300">|</span>
            <div className="flex items-center ml-4">
              <Home className="h-5 w-5 text-secondary-400 mr-2" />
              <span className="text-neutral-300 text-sm">
                {property.type === 'casa' ? 'Casa' : 
                 property.type === 'departamento' ? 'Departamento' : 
                 property.type === 'local' ? 'Local' : 'Terreno'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-white mb-2">{property.title}</h1>
              <p className="text-white/80 flex items-center mb-2">
                <Tag className="h-5 w-5 text-secondary-400 mr-2" />
                {formatPrice(property.price)}
                {property.operation === 'renta' && <span className="text-sm font-normal text-neutral-300">/mes</span>}
              </p>
              <p className="text-white/80">{property.address}, {property.city}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-neutral-300 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Publicado: {property.created_at ? new Date(property.created_at).toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : 'Fecha no disponible'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Gallery */}
            <PropertyGallery 
              images={property.images} 
              title={property.title} 
            />
            
            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-neutral-700 whitespace-pre-line">
                {property.description}
              </p>
            </div>
            
            {/* Property Features */}
            <PropertyFeatures property={property} />
            
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
              <p className="text-neutral-600 mb-4">
                {property.address}, {property.city}, {property.state}
              </p>
              <PropertyMap 
                position={[property.latitude, property.longitude]} 
                address={property.address}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Section */}
            <PropertyContact 
              propertyTitle={property.title} 
              propertyId={property.id} 
            />
            
            {/* Agency Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Nova Hestia Inmobiliaria</h3>
              <p className="text-neutral-600 mb-4">
                Somos expertos inmobiliarios con más de 15 años de experiencia en el mercado.
                Nuestro compromiso es encontrar la propiedad perfecta para ti.
              </p>
              <Link to="/nosotros" className="btn btn-outline w-full mb-3">
                Conoce más sobre nosotros
              </Link>
              <Link to="/propiedades" className="btn btn-white w-full">
                Ver más propiedades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;