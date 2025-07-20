import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader, AlertTriangle } from 'lucide-react';

interface PropertyMapProps {
  position: [number, number];
  address: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ position, address }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    if (!accessToken) {
      setError('Token de Mapbox no configurado');
      setIsLoading(false);
      return;
    }

    if (!position || position[0] === 0 || position[1] === 0) {
      setError('Coordenadas no disponibles para esta propiedad');
      setIsLoading(false);
      return;
    }

    // Dynamically import mapbox-gl
    const initializeMap = async () => {
      try {
        const mapboxgl = await import('mapbox-gl');
        
        if (!mapContainer.current) return;

        // Set access token
        mapboxgl.default.accessToken = accessToken;

        // Initialize map
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [position[1], position[0]], // [lng, lat]
          zoom: 15,
          attributionControl: false
        });

        // Add marker
        new mapboxgl.default.Marker({
          color: '#0052a3'
        })
          .setLngLat([position[1], position[0]])
          .addTo(map.current);

        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
        map.current.addControl(new mapboxgl.default.FullscreenControl(), 'top-left');

        // Handle map load
        map.current.on('load', () => {
          setIsLoading(false);
        });

        // Handle map errors
        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
          setError('Error al cargar el mapa');
          setIsLoading(false);
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Error al inicializar el mapa');
        setIsLoading(false);
      }
    };

    initializeMap();

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [accessToken, position]);

  if (!accessToken) {
    return (
      <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-neutral-600">Token de Mapbox no configurado</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-neutral-600">{error}</p>
          <p className="text-neutral-500 text-sm mt-1">
            Ubicación: {address}
          </p>
        </div>
      </div>
    );
  }

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
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Address Info */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium text-neutral-800 line-clamp-2">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;