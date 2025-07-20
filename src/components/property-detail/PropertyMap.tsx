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

    // Dynamically import mapbox-gl with better error handling
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if container exists
        if (!mapContainer.current) {
          throw new Error('Map container not found');
        }

        // Dynamic import with timeout
        const mapboxgl = await Promise.race([
          import('mapbox-gl'),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Map loading timeout')), 10000)
          )
        ]) as typeof import('mapbox-gl');
        
        // Validate mapbox-gl loaded correctly
        if (!mapboxgl || !mapboxgl.default) {
          throw new Error('Mapbox GL failed to load');
        }

        // Set access token
        mapboxgl.default.accessToken = accessToken;

        // Initialize map with error handling options
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [position[1], position[0]], // [lng, lat]
          zoom: 15,
          attributionControl: false,
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: true,
          antialias: false
        });

        // Handle map load event
        map.current.on('load', () => {
          try {
            // Add marker after map loads
            new mapboxgl.default.Marker({
              color: '#0052a3',
              scale: 1.2
            })
              .setLngLat([position[1], position[0]])
              .addTo(map.current);

            // Add navigation controls
            map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
            map.current.addControl(new mapboxgl.default.FullscreenControl(), 'top-left');
            
            setIsLoading(false);
          } catch (err) {
            console.error('Error adding map controls:', err);
            setError('Error al configurar el mapa');
            setIsLoading(false);
          }
        });

        // Handle map errors
        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
          setError('Error al cargar el mapa');
          setIsLoading(false);
        });

        // Handle style errors
        map.current.on('styleimagemissing', (e: any) => {
          console.warn('Style image missing:', e);
        });

        // Timeout fallback
        setTimeout(() => {
          if (isLoading) {
            setError('Tiempo de espera agotado al cargar el mapa');
            setIsLoading(false);
          }
        }, 15000);

      } catch (err) {
        console.error('Error initializing map:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(`Error al inicializar el mapa: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    // Add delay before initializing to ensure DOM is ready
    const timer = setTimeout(initializeMap, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (map.current) {
        try {
          map.current.remove();
        } catch (err) {
          console.warn('Error removing map:', err);
        }
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
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-md text-sm hover:bg-primary-700 transition-colors"
          >
            Reintentar
          </button>
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