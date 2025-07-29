import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [lat, lng] = position;

  // Mapbox access token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  useEffect(() => {
    if (!mapContainer.current || !lat || !lng || lat === 0 || lng === 0) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15,
      attributionControl: false,
      interactive: true // Allow user interaction
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      updateMapDisplay();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lat, lng]);

  // Update map display when mode or radius changes
  useEffect(() => {
    if (isMapLoaded) {
      updateMapDisplay();
    }
  }, [mapMode, areaRadius, isMapLoaded]);

  const updateMapDisplay = () => {
    if (!map.current || !isMapLoaded || !lat || !lng) return;

    console.log('Updating property map display:', { lat, lng, mapMode, areaRadius });

    // Remove existing marker and circle
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    
    // Remove existing circle layer
    if (map.current.getSource('property-circle-source')) {
      map.current.removeLayer('property-circle-layer');
      map.current.removeSource('property-circle-source');
    }

    if (mapMode === 'pin') {
      console.log('Creating property pin marker at:', lat, lng);

      // Create custom pin marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'property-map-pin';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50% 50% 50% 0';
      markerElement.style.backgroundColor = '#0052a3';
      markerElement.style.border = '4px solid #ffffff';
      markerElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      markerElement.style.transform = 'rotate(-45deg)';
      markerElement.style.cursor = 'pointer';
      markerElement.style.position = 'relative';
      markerElement.style.zIndex = '1000';

      // Add inner dot
      const innerDot = document.createElement('div');
      innerDot.style.width = '8px';
      innerDot.style.height = '8px';
      innerDot.style.backgroundColor = '#ffffff';
      innerDot.style.borderRadius = '50%';
      innerDot.style.position = 'absolute';
      innerDot.style.top = '50%';
      innerDot.style.left = '50%';
      innerDot.style.transform = 'translate(-50%, -50%)';
      innerDot.style.zIndex = '1001';
      markerElement.appendChild(innerDot);

      marker.current = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      console.log('Property pin marker created successfully');
    } else {
      console.log('Creating property area circle at:', lat, lng, 'with radius:', areaRadius);
      
      // Add circle for area mode
      const circleGeoJSON = {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat]
        },
        properties: {}
      };

      map.current.addSource('property-circle-source', {
        type: 'geojson',
        data: circleGeoJSON
      });

      map.current.addLayer({
        id: 'property-circle-layer',
        type: 'circle',
        source: 'property-circle-source',
        paint: {
          'circle-radius': {
            stops: [
              [10, areaRadius / 15],
              [12, areaRadius / 10],
              [14, areaRadius / 6],
              [16, areaRadius / 4],
              [18, areaRadius / 2],
              [20, areaRadius]
            ],
            base: 2
          },
          'circle-color': '#0052a3',
          'circle-opacity': 0.3,
          'circle-stroke-color': '#0052a3',
          'circle-stroke-width': 4,
          'circle-stroke-opacity': 1
        }
      });

      // Add center marker
      const centerElement = document.createElement('div');
      centerElement.style.width = '20px';
      centerElement.style.height = '20px';
      centerElement.style.borderRadius = '50%';
      centerElement.style.backgroundColor = 'none';
      centerElement.style.border = 'none';
      centerElement.style.boxShadow = 'none';
      centerElement.style.position = 'relative';
      centerElement.style.zIndex = '1000';
      
      marker.current = new mapboxgl.Marker({
        element: centerElement
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      console.log('Property area circle and marker created successfully');
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const centerMap = () => {
    if (map.current && lat && lng) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 16,
        duration: 1000
      });
    }
  };

  // Show fallback if no coordinates
  if (!lat || !lng || lat === 0 || lng === 0) {
    return (
      <div className="bg-neutral-50 rounded-lg p-8 text-center border border-neutral-200">
        <MapPin className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-neutral-600 mb-2">Ubicación no disponible</h3>
        <p className="text-neutral-500 mb-4">
          Las coordenadas de esta propiedad no están disponibles.
        </p>
        <p className="text-sm text-neutral-400">
          {address}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative">
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-neutral-300 bg-neutral-100 overflow-hidden"
          style={{ minHeight: '400px' }}
        />
        
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-neutral-600">Cargando mapa...</p>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${mapMode === 'pin' ? 'bg-blue-600' : 'bg-yellow-500'}`}></div>
            <p className="text-xs text-neutral-700 font-medium">
              {mapMode === 'pin' ? 'Ubicación Exacta' : `Área de ${areaRadius}m`}
            </p>
          </div>
        </div>
      </div>

      {/* Property Info */}
      <div className="bg-white rounded-lg p-4 border border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-neutral-800 mb-2 flex items-center">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              Dirección de la Propiedad
            </h4>
            <p className="text-neutral-600 mb-3">{address}</p>
            
            {mapMode === 'area' && (
              <div className="mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                  Área de influencia: {areaRadius}m
                </span>
              </div>
            )}
            
            <div className="text-sm text-neutral-500">
              {/* <p><strong>Coordenadas:</strong> {lat.toFixed(6)}, {lng.toFixed(6)}</p> */}
            </div>
          </div>
          
          <button
            onClick={openInGoogleMaps}
            className="btn btn-outline text-sm ml-4"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ver en Google Maps
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;