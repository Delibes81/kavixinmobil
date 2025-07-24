import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface PropertyMapProps {
  position: [number, number];
  address: string;
  mapMode?: 'pin' | 'area';
  areaRadius?: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ 
  position, 
  address, 
  mapMode = 'pin', 
  areaRadius = 500 
}) => {
  const [lat, lng] = position;

  return (
    <div className="bg-neutral-50 rounded-lg p-8 text-center border border-neutral-200">
      <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
      
      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Ubicación de la Propiedad</h3>
      
      <p className="text-neutral-600 mb-4">
        {address}
      </p>
      
      {mapMode === 'area' && (
        <p className="text-sm text-blue-600 mb-4">
          Área de influencia: {areaRadius}m
        </p>
      )}
      
      <div className="bg-white rounded-lg p-4 border border-neutral-200 mb-6 max-w-sm mx-auto">
        <p className="text-sm font-medium text-neutral-700 mb-2">Coordenadas:</p>
        <div className="text-sm text-neutral-600 space-y-1">
          <p><strong>Latitud:</strong> {lat?.toFixed(6) || 'No establecida'}</p>
          <p><strong>Longitud:</strong> {lng?.toFixed(6) || 'No establecida'}</p>
        </div>
      </div>
      
      <p className="text-sm text-neutral-500 mb-4">
        Funcionalidad de mapas será implementada próximamente
      </p>
    </div>
  );
};

export default PropertyMap;