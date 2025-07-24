import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader, AlertTriangle, ExternalLink, Plus, Minus, Maximize2 } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useStaticMap, setUseStaticMap] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Generate static map URL as fallback
  const getStaticMapUrl = () => {
    const [lat, lng] = position;
    if (!accessToken || !lat || !lng || (lat === 0 && lng === 0)) {
      return null;
    }
    
    const zoom = 15;
    const width = 800;
    const height = 400;
    
    // For area mode, we'll still show a pin in static map (circles not supported in static API)
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l+0052a3(${lng},${lat})/${lng},${lat},${zoom}/${width}x${height}@2x?access_token=${accessToken}`;
  };

  // Generate Google Maps URL as ultimate fallback
  const getGoogleMapsUrl = () => {
    const [lat, lng] = position;
    
    // If we have valid coordinates, use them with the address for better accuracy
    if (lat && lng && lat !== 0 && lng !== 0) {
      return `https://www.google.com/maps/search/${encodeURIComponent(address)}/@${lat},${lng},17z`;
    }
    
    // Fallback to address search only
    return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
  };

  useEffect(() => {
    if (!accessToken) {
      console.warn('Mapbox token not configured, but continuing with interactive map attempt');
      // Don't set error or useStaticMap immediately - let the map try to load
      setIsLoading(true);
      return;
    }

    // Check if we have valid coordinates
    const [lat, lng] = position;
    if (!lat || !lng || (lat === 0 && lng === 0)) {
      console.warn('Invalid coordinates, but attempting to show map anyway');
      // Don't immediately fallback to static map
      return;
    }

    // Try to load interactive map first
    const initializeMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setMapInitialized(false);
        
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
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat], // [lng, lat]
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
            setMapInitialized(true);
            
            // Add marker after map loads with Nova Hestia blue
            marker.current = new mapboxgl.default.Marker({
              color: '#0052a3', // Nova Hestia blue
              scale: 1.8
            })
              .setLngLat([lng, lat])
              .addTo(map.current);

            // Add area circle if map mode is 'area'
            if (mapMode === 'area') {
             // Wait a bit for the style to be fully loaded
             setTimeout(() => {
               addAreaCircle(lng, lat, areaRadius);
             }, 500);
            }

            // Add navigation controls (includes zoom)
            map.current.addControl(new mapboxgl.default.NavigationControl({
              showCompass: true,
              showZoom: true,
              visualizePitch: true
            }), 'top-right');
            
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
          // Only fallback to static map after multiple errors
          setTimeout(() => {
            if (isLoading) {
              console.warn('Map failed to load after timeout, using static fallback');
              setUseStaticMap(true);
              setIsLoading(false);
            }
          }, 2000);
        });

       // Handle style load event specifically for area circles
       map.current.on('styledata', () => {
         if (mapMode === 'area' && mapInitialized) {
            console.warn('Map loading timeout, trying static map');
            setUseStaticMap(true);
            setIsLoading(false);
         }
        }, 10000); // Increased timeout

      } catch (err) {
        console.error('Error initializing map:', err);
        // Don't immediately fallback - give it more time
        setTimeout(() => {
          if (isLoading) {
            console.warn('Map initialization failed after timeout, using static fallback');
            setUseStaticMap(true);
            setIsLoading(false);
          }
        }, 3000);
      }
    };

    // Add delay before initializing to ensure DOM is ready
    const timer = setTimeout(initializeMap, 500); // Increased delay for Netlify

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
  }, [accessToken, position, mapMode, areaRadius]);

  // Function to add area circle
  const addAreaCircle = (lng: number, lat: number, radiusInMeters: number) => {
    if (!map.current || !mapInitialized) {
      console.log('Map not ready for area circle');
      return;
    }
    
    // Check if style is loaded with retry
    if (!map.current.isStyleLoaded()) {
      console.log('Map style not loaded, retrying...');
      setTimeout(() => addAreaCircle(lng, lat), 500);
      return;
    }
     console.log('Map not ready for area circle');
     return;
   }
   
   // Check if style is loaded
   if (!map.current.isStyleLoaded()) {
     console.log('Map style not loaded, waiting...');
     setTimeout(() => addAreaCircle(lng, lat, radiusInMeters), 200);
     return;
   }
   
   console.log('Adding area circle:', { lng, lat, radiusInMeters, mapMode });

    // Create circle data
    const circleData = createCircleGeoJSON(lng, lat, radiusInMeters);

    // Remove existing circle if it exists
    try {
      if (map.current.getSource('area-circle')) {
        if (map.current.getLayer('area-circle-fill')) {
          map.current.removeLayer('area-circle-fill');
        }
        if (map.current.getLayer('area-circle-stroke')) {
          map.current.removeLayer('area-circle-stroke');
        }
        map.current.removeSource('area-circle');
        if (map.current.getLayer('property-area-circle-stroke')) {
          map.current.removeLayer('property-area-circle-stroke');
    } catch (err) {
      console.warn('Error removing existing circle:', err);
    }
      }
    } catch (err) {
      console.warn('Error removing existing circle:', err);
    }
    try {
     console.log('Adding new circle source and layers');
      map.current.addSource('property-area-circle', {
        type: 'geojson',
        data: circleData
      });

      // Add fill layer with Nova Hestia blue
      map.current.addLayer({
        id: 'property-area-circle-fill',
        type: 'fill',
        source: 'property-area-circle',
        paint: {
          'fill-color': '#0052a3', // Nova Hestia blue
          'fill-opacity': 0.3
        }
      });

      // Add stroke layer
      map.current.addLayer({
        id: 'property-area-circle-stroke',
        type: 'line',
        source: 'property-area-circle',
        paint: {
          'line-color': '#0052a3', // Nova Hestia blue
          'line-width': 3,
          'line-opacity': 1
        }
      });
     
     console.log('Area circle added successfully');
    } catch (err) {
     console.error('Error adding area circle:', err);
    }
  };

  // Function to create circle GeoJSON
  const createCircleGeoJSON = (lng: number, lat: number, radiusInMeters: number) => {
    const points = 64;
    const coords = [];
    const distanceX = radiusInMeters / (111320 * Math.cos(lat * Math.PI / 180));
    const distanceY = radiusInMeters / 110540;

    for (let i = 0; i < points; i++) {
      const theta = (i / points) * (2 * Math.PI);
      const x = distanceX * Math.cos(theta);
      const y = distanceY * Math.sin(theta);
      coords.push([lng + x, lat + y]);
    }
    coords.push(coords[0]); // Close the polygon

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [coords]
      }
    };
  };

  // Zoom functions
  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn({ duration: 300 });
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut({ duration: 300 });
    }
  };

  const handleFitBounds = () => {
    if (map.current && position[0] && position[1]) {
      const [lat, lng] = position;
      
      if (mapMode === 'area' && areaRadius) {
        // Calculate bounds for the area circle
        const radiusInDegrees = areaRadius / 111320; // Approximate conversion
        const bounds = [
          [lng - radiusInDegrees, lat - radiusInDegrees], // Southwest
          [lng + radiusInDegrees, lat + radiusInDegrees]  // Northeast
        ];
        map.current.fitBounds(bounds, { 
          padding: 50,
          duration: 1000 
        });
      } else {
        // Center on pin with appropriate zoom
        map.current.flyTo({
          center: [lng, lat],
          zoom: 16,
          duration: 1000
        });
      }
    }
  };

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
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-sm">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-neutral-800 mb-1">
                    {address}
                  </p>
                  <p className="text-xs text-neutral-600">
                    Lat: {position[0]?.toFixed(6)}, Lng: {position[1]?.toFixed(6)}
                  </p>
                  {mapMode === 'area' && (
                    <p className="text-xs text-blue-600 mt-1">
                      Área de influencia: {areaRadius}m
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Open in Google Maps */}
            <div className="absolute top-4 right-4">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md hover:bg-white transition-colors flex items-center text-sm font-medium text-primary-600"
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
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-sm">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-neutral-800 mb-1">
                {address}
              </p>
              <p className="text-xs text-neutral-600">
                Lat: {position[0]?.toFixed(6)}, Lng: {position[1]?.toFixed(6)}
              </p>
              {mapMode === 'area' && (
                <p className="text-xs text-blue-600 mt-1">
                  Área de influencia: {areaRadius}m
                </p>
              )}
              {mapMode === 'area' && (
                <p className="text-xs text-blue-600 mt-1">
                  Área de influencia: {areaRadius}m
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Custom Zoom Controls - Left side */}
      {!isLoading && (
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors flex items-center justify-center"
            title="Acercar"
          >
            <Plus className="h-5 w-5 text-primary-600" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors flex items-center justify-center"
            title="Alejar"
          >
            <Minus className="h-5 w-5 text-primary-600" />
          </button>
          <button
            onClick={handleFitBounds}
            className="bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors flex items-center justify-center"
            title="Ajustar vista"
          >
            <Maximize2 className="h-4 w-4 text-primary-600" />
          </button>
        </div>
      )}
      
      {/* Google Maps Link - Always visible */}
      <div className="absolute top-4 right-4">
        <a
          href={getGoogleMapsUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md hover:bg-white transition-colors flex items-center text-sm font-medium text-primary-600"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Ver en Google Maps
        </a>
      </div>
    </div>
  );
};

export default PropertyMap;