import React from 'react';
import { Bed, Bath, Car, Move, CheckCircle2, Calendar, Home } from 'lucide-react';
import { Property } from '../../types';

interface PropertyFeaturesProps {
  property: Property;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Características</h3>
      
      {/* Main specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
          <Move className="h-6 w-6 text-primary-600 mb-2" />
          <span className="text-sm text-neutral-600">Construcción</span>
          <span className="font-semibold text-lg">{property.metros_construccion} m²</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
          <Bed className="h-6 w-6 text-primary-600 mb-2" />
          <span className="text-sm text-neutral-600">Recámaras</span>
          <span className="font-semibold text-lg">{property.recamaras}</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
          <Bath className="h-6 w-6 text-primary-600 mb-2" />
          <span className="text-sm text-neutral-600">Baños</span>
          <span className="font-semibold text-lg">{property.banos}</span>
        </div>
        <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
          <Car className="h-6 w-6 text-primary-600 mb-2" />
          <span className="text-sm text-neutral-600">Estacionamiento</span>
          <span className="font-semibold text-lg">{property.estacionamientos}</span>
        </div>
      </div>

      {/* Additional specs */}
      {(property.metros_terreno > 0 || property.antiguedad > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {property.metros_terreno > 0 && (
            <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
              <Home className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm text-neutral-600">Terreno</span>
              <span className="font-semibold text-lg">{property.metros_terreno} m²</span>
            </div>
          )}
          {property.antiguedad > 0 && (
            <div className="flex flex-col items-center p-4 rounded-md bg-neutral-50">
              <Calendar className="h-6 w-6 text-primary-600 mb-2" />
              <span className="text-sm text-neutral-600">Antigüedad</span>
              <span className="font-semibold text-lg">{property.antiguedad} años</span>
            </div>
          )}
        </div>
      )}
      
      {/* Additional features */}
      <div>
        <h4 className="text-lg font-medium mb-3">Amenidades</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {property.amenidades && property.amenidades.length > 0 ? (
            property.amenidades.map((amenity, index) => (
              <div key={index} className="flex items-center py-1">
                <CheckCircle2 className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0" />
                <span>{amenity.nombre}</span>
              </div>
            ))
          ) : (
            <p className="text-neutral-500 italic">No hay amenidades especificadas</p>
          )}
          {property.amueblado && (
            <div className="flex items-center py-1">
              <CheckCircle2 className="h-5 w-5 text-secondary-500 mr-2 flex-shrink-0" />
              <span>Amueblado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyFeatures;