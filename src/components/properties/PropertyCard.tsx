import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, Move, Tag } from 'lucide-react';
import { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  // Format price to Mexican Pesos
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Format address
  const formatAddress = () => {
    const parts = [];
    if (property.direccion) parts.push(property.direccion);
    if (property.colonia) parts.push(property.colonia);
    if (property.ciudad) parts.push(property.ciudad);
    
    return parts.join(', ');
  };

  return (
    <div className="card group overflow-hidden transition-all duration-300">
      {/* Image container with overlay - Now clickable */}
      <Link to={`/propiedades/${property.id}`} className="block">
        <div className="relative overflow-hidden h-64">
          <img
            src={property.imagenes[0]}
            alt={property.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
              property.operacion === 'venta' ? 'bg-primary-600' : 'bg-secondary-500'
            }`}>
              {property.operacion === 'venta' ? 'Venta' : 'Renta'}
            </span>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-800 text-white">
              {property.tipo === 'casa' ? 'Casa' : 
               property.tipo === 'departamento' ? 'Departamento' : 
               property.tipo === 'local' ? 'Local' : 
               property.tipo === 'oficina' ? 'Oficina' : 'Terreno'}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/propiedades/${property.id}`} className="block flex-1">
            <h3 className="text-xl font-medium text-primary-800 line-clamp-1 hover:text-primary-600 transition-colors">
              {property.titulo}
            </h3>
          </Link>
          <div className="flex items-center ml-2">
            <Tag className="h-4 w-4 text-secondary-500 mr-1" />
            <span className="font-bold text-primary-700">
              {formatPrice(property.precio)}
              {property.operacion === 'renta' && <span className="text-sm font-normal text-neutral-600">/mes</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center text-neutral-600 mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{formatAddress()}</span>
        </div>

        <p className="text-neutral-600 mb-4 line-clamp-2">{property.descripcion}</p>

        {/* Features */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Move className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.metros_construccion} m²</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Bed className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.recamaras}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Bath className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.banos}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Car className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.estacionamientos}</span>
          </div>
        </div>

        <Link 
          to={`/propiedades/${property.id}`}
          className="btn btn-primary w-full"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default PropertyCard;