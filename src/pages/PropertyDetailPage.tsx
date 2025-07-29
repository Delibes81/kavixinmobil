import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Home, Calendar, Tag } from 'lucide-react';
import PropertyGallery from '../components/property-detail/PropertyGallery';
import PropertyFeatures from '../components/property-detail/PropertyFeatures';
import PropertyMap from '../components/property-detail/PropertyMap';
import PropertyContact from '../components/property-detail/PropertyContact';
import { useProperties } from '../hooks/useProperties';
import { Property } from '../types';
import NotFoundPage from './NotFoundPage';

const PropertyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { properties, loading } = useProperties();
  const [property, setProperty] = useState<Property | undefined>();
  
  useEffect(() => {
    if (properties.length > 0 && id) {
      const foundProperty = properties.find(p => p.id === id);
      setProperty(foundProperty);
      
      // Update the page title
      if (foundProperty) {
        document.title = `${foundProperty.titulo} | Nova Hestia`;
      } else {
        document.title = 'Propiedad no encontrada | Nova Hestia';
      }
    }
  }, [id, properties]);
  
  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-neutral-50 flex items-center">
        <div className="container-custom py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Cargando propiedad...</p>
        </div>
      </div>
    );
  }
  
  if (!property) {
    return <NotFoundPage />;
  }

  // Format price to Mexican Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format full address
  const formatFullAddress = () => {
    const parts = [];
    if (property.direccion) parts.push(property.direccion);
    if (property.colonia) parts.push(`Col. ${property.colonia}`);
    if (property.ciudad) parts.push(property.ciudad);
    if (property.codigo_postal) parts.push(`C.P. ${property.codigo_postal}`);
    if (property.estado) parts.push(property.estado);
    
    return parts.join(', ');
  };

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
                {property.tipo === 'casa' ? 'Casa' : 
                 property.tipo === 'departamento' ? 'Departamento' : 
                 property.tipo === 'local' ? 'Local' : 
                 property.tipo === 'oficina' ? 'Oficina' : 'Terreno'}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between">
            <div>
              <h1 className="text-white mb-2">{property.titulo}</h1>
              {property.id_interno && (
                <p className="text-white/70 text-sm mb-2 flex items-center">
                  <Tag className="h-4 w-4 text-secondary-400 mr-1" />
                  ID: {property.id_interno}
                </p>
              )}
              <p className="text-white/80 flex items-center mb-2">
                <Tag className="h-5 w-5 text-secondary-400 mr-2" />
                {formatPrice(property.precio)}
                {property.operacion === 'renta' && <span className="text-sm font-normal text-neutral-300">/mes</span>}
              </p>
              <p className="text-white/80">{formatFullAddress()}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <span className="text-neutral-300 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Publicado: {new Date(property.fecha_creacion).toLocaleDateString('es-MX', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
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
              images={property.imagenes} 
              title={property.titulo} 
            />
            
            {/* Property Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-neutral-700 whitespace-pre-line">
                {property.descripcion}
              </p>
            </div>
            
            {/* Property Features */}
            <PropertyFeatures property={property} />
            
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Ubicación</h3>
              {/* <div className="mb-4">
                <p className="text-neutral-800 font-medium mb-2">Dirección completa:</p>
                <p className="text-neutral-600">{formatFullAddress()}</p>
                {property.map_mode === 'area' && (
                  <p className="text-sm text-blue-600 mt-1">
                    Área de influencia: {property.area_radius}m
                  </p>
                )}
              </div> */}
              <PropertyMap 
                position={[property.latitud, property.longitud]} 
                address={formatFullAddress()}
                mapMode={property.map_mode}
                areaRadius={property.area_radius}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Section */}
            <PropertyContact 
              propertyTitle={property.titulo} 
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