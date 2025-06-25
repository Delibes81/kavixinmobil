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

  return (
    <div className="card group overflow-hidden transition-all duration-300">
      {/* Image container with overlay */}
      <div className="relative overflow-hidden h-64">
        <img
          src={property.images[0] || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full text-white ${
            property.operation === 'venta' ? 'bg-primary-600' : 'bg-secondary-500'
          }`}>
            {property.operation === 'venta' ? 'Venta' : 'Renta'}
          </span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-800 text-white">
            {property.type === 'casa' ? 'Casa' : 
             property.type === 'departamento' ? 'Departamento' : 
             property.type === 'local' ? 'Local' : 'Terreno'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-medium text-primary-800 line-clamp-1">{property.title}</h3>
          <div className="flex items-center">
            <Tag className="h-4 w-4 text-secondary-500 mr-1" />
            <span className="font-bold text-primary-700">
              {formatPrice(property.price)}
              {property.operation === 'renta' && <span className="text-sm font-normal text-neutral-600">/mes</span>}
            </span>
          </div>
        </div>

        <div className="flex items-center text-neutral-600 mb-4">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{property.address}, {property.city}</span>
        </div>

        <p className="text-neutral-600 mb-4 line-clamp-2">{property.description}</p>

        {/* Features */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Move className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.area} m²</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Bed className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Bath className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-md bg-neutral-50">
            <Car className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-neutral-600">{property.parking}</span>
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