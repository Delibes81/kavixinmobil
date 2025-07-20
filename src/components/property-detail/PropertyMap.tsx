import React, { useState } from 'react';
import Map, { Marker, NavigationControl, FullscreenControl } from 'react-map-gl';
import { MapPin, Loader } from 'lucide-react';
import 'mapbox-gl/dist/mapbox-gl.css';

interface PropertyMapProps {
  position: [number, number];
  address: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ position, address }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  if (!accessToken) {
    return (
      <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-600">Token de Mapbox no configurado</p>
      </div>
    );
  }

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  const handleMapError = (evt: any) => {
    console.error('Map error:', evt);
    setError('Error al cargar el mapa');
    setIsLoading(false);
  };

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md relative">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-2" />
            <p className="text-neutral-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
          <p className="text-neutral-600">{error}</p>
        </div>
      )}

      <Map
        mapboxAccessToken={accessToken}
        initialViewState={{
          longitude: position[1],
          latitude: position[0],
          zoom: 15
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={handleMapLoad}
        onError={handleMapError}
        attributionControl={false}
      >
        <Marker
          longitude={position[1]}
          latitude={position[0]}
          anchor="bottom"
        >
          <div className="bg-primary-600 text-white p-2 rounded-full shadow-lg">
            <MapPin className="h-6 w-6" />
          </div>
        </Marker>

        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-left" />
      </Map>
      
      {/* Address Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
        <p className="text-sm font-medium text-neutral-800 line-clamp-2">
          {address}
        </p>
      </div>
    </div>
  );
};

export default PropertyMap;