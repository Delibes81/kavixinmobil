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
  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    const [lat, lng] = position;
    
    // If we have valid coordinates, use them with the address for better accuracy
    if (lat && lng && lat !== 0 && lng !== 0) {
      return `https://www.google.com/maps/search/${encodeURIComponent(address)}/@${lat},${lng},17z`;
    }
    
    // Fallback to address search only
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
  };

  const googleMapsUrl = getGoogleMapsUrl();

  return (
    <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center border border-neutral-200">
      <div className="text-center p-8">
        <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">Ver ubicación</h3>
        <p className="text-neutral-600 mb-4 text-sm">
          {address}
        </p>
        {mapMode === 'area' && (
          <p className="text-sm text-blue-600 mb-4">
            Área de influencia: {areaRadius}m
          </p>
        )}
        <div className="bg-white rounded-lg p-4 border border-neutral-200 mb-4">
          <p className="text-sm font-medium text-neutral-700 mb-2">Coordenadas:</p>
          <div className="text-sm text-neutral-600">
            <p>Lat: {position[0]?.toFixed(6) || 'No establecida'}</p>
            <p>Lng: {position[1]?.toFixed(6) || 'No establecida'}</p>
          </div>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Abrir en Google Maps
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;