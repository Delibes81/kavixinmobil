import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader, AlertTriangle, ExternalLink } from 'lucide-react';

interface PropertyMapProps {
  position: [number, number];
  address: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ position, address }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useStaticMap, setUseStaticMap] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Generate static map URL as fallback
  const getStaticMapUrl = () => {
    if (!accessToken || !position || position[0] === 0 || position[1] === 0) {
      return null;
    }
    
    const [lat, lng] = position;
    const zoom = 15;
    const width = 800;
    const height = 400;
    
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+0052a3(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${accessToken}`;
  };

  // Generate Google Maps URL as ultimate fallback
  const getGoogleMapsUrl = () => {
    if (!position || position[0] === 0 || position[1] === 0) {
      return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
    }
    
    const [lat, lng] = position;
    return `https://www.google.com/maps/@${lat},${lng},15z`;
  };

  useEffect(() => {
    if (!accessToken) {
      setError('Token de Mapbox no configurado');
      setIsLoading(false);
      setUseStaticMap(true);
      return;
    }

    if (!position || position[0] === 0 || position[1] === 0) {
      setError('Coordenadas no disponibles para esta propiedad');
      setIsLoading(false);
      setUseStaticMap(true);
      return;
    }

    // Try to load interactive map first
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
            setTimeout(() => reject(new Error('Map loading timeout')), 8000)
          )
        ]) as typeof import('mapbox-gl');
        
        // Validate mapbox-gl loaded correctly
        if (!mapboxgl || !mapboxgl.default) {
          throw new Error('Mapbox GL failed to load');
        }

        // Set access token
        mapboxgl.default.accessToken = accessToken;

        // Initialize map with minimal options for better compatibility
        map.current = new mapboxgl.default.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [position[1], position[0]], // [lng, lat]
          zoom: 15,
          attributionControl: false,
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: true,
          antialias: false,
          interactive: true
        });

        // Handle map load event
        map.current.on('load', () => {
          try {
            // Add marker after map loads
            new mapboxgl.default.Marker({
              color: '#0052a3',
              scale: 1.5
            })
              .setLngLat([position[1], position[0]])
              .addTo(map.current);

            // Add navigation controls
            map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');
            
            setIsLoading(false);
          } catch (err) {
            console.error('Error adding map controls:', err);
            // Fallback to static map
            setUseStaticMap(true);
            setIsLoading(false);
          }
        });

        // Handle map errors - fallback to static map
        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
          setUseStaticMap(true);
          setIsLoading(false);
        });

        // Timeout fallback
        setTimeout(() => {
          if (isLoading) {
            console.warn('Map loading timeout, switching to static map');
            setUseStaticMap(true);
            setIsLoading(false);
          }
        }, 10000);

      } catch (err) {
        console.error('Error initializing map:', err);
        // Fallback to static map
        setUseStaticMap(true);
        setIsLoading(false);
      }
    };

    // Add delay before initializing to ensure DOM is ready
    const timer = setTimeout(initializeMap, 200);

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

  // If using static map or interactive map failed
  if (useStaticMap) {
    const staticMapUrl = getStaticMapUrl();
    const googleMapsUrl = getGoogleMapsUrl();
    
    return (
      <div className="h-[400px] rounded-lg overflow-hidden shadow-md relative border border-neutral-200">
        {staticMapUrl ? (
          <div className="relative w-full h-full">
            <img
              src={staticMapUrl}
              alt={`Mapa de ${address}`}
              className="w-full h-full object-cover"
              onError={() => {
                // If static map also fails, show Google Maps link
                setError('Error al cargar el mapa');
              }}
            />
            
            {/* Address Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-sm font-medium text-neutral-800 line-clamp-2">
                  {address}
                </p>
              </div>
            </div>
            
            {/* Open in Google Maps */}
            <div className="absolute top-4 right-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors flex items-center text-sm font-medium text-primary-600"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Ver en Google Maps
              </a>
            </div>
          </div>
        ) : (
          // Ultimate fallback - Google Maps link
          <div className="h-full bg-neutral-100 flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Ver ubicación</h3>
              <p className="text-neutral-600 mb-4 text-sm">
                {address}
              </p>
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
        )}
      </div>
    );
  }

  // Show error state
  if (error) {
    const googleMapsUrl = getGoogleMapsUrl();
    
    return (
      <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-neutral-600 mb-4">{error}</p>
          <p className="text-neutral-500 text-sm mb-4">
            Ubicación: {address}
          </p>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver en Google Maps
          </a>
        </div>
      </div>
    );
  }

  // Show loading or interactive map
  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md relative border border-neutral-200">
      {isLoading && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-2" />
            <p className="text-neutral-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Address Info - only show when map is loaded */}
      {!isLoading && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-neutral-800 line-clamp-2">
              {address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;