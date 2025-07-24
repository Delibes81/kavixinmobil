import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { MapPin, Crosshair, RotateCcw } from 'lucide-react';

interface MapboxLocationPickerProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  address?: string;
  onMapModeChange?: (mode: 'pin' | 'area') => void;
  onAreaRadiusChange?: (radius: number) => void;
  initialMode?: 'pin' | 'area';
  initialRadius?: number;
  className?: string;
}

const MapboxLocationPicker: React.FC<MapboxLocationPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
  address = '',
  onMapModeChange,
  onAreaRadiusChange,
  initialMode = 'pin',
  initialRadius = 500,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const circle = useRef<any>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapMode, setMapMode] = useState<'pin' | 'area'>(initialMode);
  const [areaRadius, setAreaRadius] = useState(initialRadius);
  const [currentCoords, setCurrentCoords] = useState({ lat: latitude, lng: longitude });

  // Mapbox access token - you'll need to set this in your environment
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  // Function to ensure coordinates are within map bounds
  const constrainToBounds = (lat: number, lng: number) => {
    if (!map.current) return { lat, lng };
    
    const bounds = map.current.getBounds();
    const constrainedLat = Math.max(bounds.getSouth(), Math.min(bounds.getNorth(), lat));
    const constrainedLng = Math.max(bounds.getWest(), Math.min(bounds.getEast(), lng));
    
    return { lat: constrainedLat, lng: constrainedLng };
  };
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    const initialLat = latitude || 19.4326; // Default to Mexico City
    const initialLng = longitude || -99.1332;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLng, initialLat],
      zoom: 15,
      attributionControl: false
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add attribution
    map.current.addControl(new mapboxgl.AttributionControl({
      compact: true
    }), 'bottom-right');

    map.current.on('load', () => {
      setIsMapLoaded(true);
      updateMapDisplay(initialLat, initialLng, mapMode, areaRadius);
    });

    // Handle map clicks
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      // Ensure the clicked location is within bounds
      const constrainedCoords = constrainToBounds(lat, lng);
      setCurrentCoords(constrainedCoords);
      onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
      updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mapMode, areaRadius);
    });

    // Handle map move to constrain marker when map bounds change
    map.current.on('moveend', () => {
      if (mapMode === 'pin' && marker.current) {
        const markerLngLat = marker.current.getLngLat();
        const constrainedCoords = constrainToBounds(markerLngLat.lat, markerLngLat.lng);
        
        // Only update if coordinates actually changed
        if (constrainedCoords.lat !== markerLngLat.lat || constrainedCoords.lng !== markerLngLat.lng) {
          setCurrentCoords(constrainedCoords);
          onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
          updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mapMode, areaRadius);
        }
      }
    });
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update map when coordinates change externally
  useEffect(() => {
    if (isMapLoaded && (latitude !== currentCoords.lat || longitude !== currentCoords.lng)) {
      const newLat = latitude || 19.4326;
      const newLng = longitude || -99.1332;
      const constrainedCoords = constrainToBounds(newLat, newLng);
      setCurrentCoords(constrainedCoords);
      updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mapMode, areaRadius);
      
      // Center map on new coordinates
      if (map.current) {
        map.current.flyTo({
          center: [constrainedCoords.lng, constrainedCoords.lat],
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [latitude, longitude, isMapLoaded]);

  const updateMapDisplay = (lat: number, lng: number, mode: 'pin' | 'area', radius: number) => {
    if (!map.current || !isMapLoaded) return;

    // Ensure coordinates are within current map bounds
    const constrainedCoords = constrainToBounds(lat, lng);
    const finalLat = constrainedCoords.lat;
    const finalLng = constrainedCoords.lng;
    // Remove existing marker and circle
    if (marker.current) {
      marker.current.remove();
    }
    if (circle.current) {
      if (map.current.getSource('circle-source')) {
        map.current.removeLayer('circle-layer');
        map.current.removeSource('circle-source');
      }
      circle.current = null;
    }

    if (mode === 'pin') {
      // Add marker for pin mode
      marker.current = new mapboxgl.Marker({
        color: '#0052a3',
        draggable: true
      })
        .setLngLat([finalLng, finalLat])
        .addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          const constrainedCoords = constrainToBounds(lngLat.lat, lngLat.lng);
          
          // Update marker position to constrained coordinates
          marker.current.setLngLat([constrainedCoords.lng, constrainedCoords.lat]);
          
          setCurrentCoords(constrainedCoords);
          onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
        }
      });
    } else {
      // Add circle for area mode
      const circleGeoJSON = {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [finalLng, finalLat]
        },
        properties: {}
      };

      map.current.addSource('circle-source', {
        type: 'geojson',
        data: circleGeoJSON
      });

      map.current.addLayer({
        id: 'circle-layer',
        type: 'circle',
        source: 'circle-source',
        paint: {
          'circle-radius': {
            stops: [
              [0, 0],
              [20, radius / 5] // Approximate pixel radius based on zoom
            ],
            base: 2
          },
          'circle-color': '#0052a3',
          'circle-opacity': 0.3,
          'circle-stroke-color': '#0052a3',
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.8
        }
      });

      // Add center marker
      marker.current = new mapboxgl.Marker({
        color: '#e6b325',
        draggable: true,
        scale: 0.8
      })
        .setLngLat([finalLng, finalLat])
        .addTo(map.current);

      // Handle marker drag for area mode
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          const constrainedCoords = constrainToBounds(lngLat.lat, lngLat.lng);
          
          // Update marker position to constrained coordinates
          marker.current.setLngLat([constrainedCoords.lng, constrainedCoords.lat]);
          
          setCurrentCoords(constrainedCoords);
          onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
          updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mode, radius);
        }
      });

      circle.current = true;
    }
  };

  const handleModeChange = (mode: 'pin' | 'area') => {
    setMapMode(mode);
    onMapModeChange?.(mode);
    updateMapDisplay(currentCoords.lat, currentCoords.lng, mode, areaRadius);
  };

  const handleRadiusChange = (radius: number) => {
    setAreaRadius(radius);
    onAreaRadiusChange?.(radius);
    updateMapDisplay(currentCoords.lat, currentCoords.lng, mapMode, radius);
  };

  const centerOnLocation = () => {
    if (map.current && currentCoords.lat && currentCoords.lng) {
      map.current.flyTo({
        center: [currentCoords.lng, currentCoords.lat],
        zoom: 16,
        duration: 1000
      });
    }
  };

  const resetToMexicoCity = () => {
    const mexicoCityLat = 19.4326;
    const mexicoCityLng = -99.1332;
    
    setCurrentCoords({ lat: mexicoCityLat, lng: mexicoCityLng });
    onLocationChange(mexicoCityLat, mexicoCityLng);
    
    if (map.current) {
      map.current.flyTo({
        center: [mexicoCityLng, mexicoCityLat],
        zoom: 12,
        duration: 1000
      });
    }
    
    updateMapDisplay(mexicoCityLat, mexicoCityLng, mapMode, areaRadius);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Mode Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex bg-neutral-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => handleModeChange('pin')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              mapMode === 'pin'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <MapPin className="h-4 w-4 mr-2 inline" />
            Ubicación Exacta
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('area')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              mapMode === 'area'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-800'
            }`}
          >
            <Crosshair className="h-4 w-4 mr-2 inline" />
            Área de Influencia
          </button>
        </div>

        <button
          type="button"
          onClick={centerOnLocation}
          className="btn btn-outline text-sm"
          disabled={!currentCoords.lat || !currentCoords.lng}
        >
          <Crosshair className="h-4 w-4 mr-1" />
          Centrar
        </button>

        <button
          type="button"
          onClick={resetToMexicoCity}
          className="btn btn-outline text-sm"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          CDMX
        </button>
      </div>

      {/* Area Radius Control */}
      {mapMode === 'area' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-blue-800">
              Radio del área (metros):
            </label>
            <span className="text-sm text-blue-600 font-medium">{areaRadius}m</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={areaRadius}
            onChange={(e) => handleRadiusChange(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-blue-600 mt-1">
            <span>50m</span>
            <span>2km</span>
          </div>
        </div>
      )}

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

        {/* Instructions Overlay */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
          <p className="text-xs text-neutral-700 font-medium mb-1">
            {mapMode === 'pin' ? 'Ubicación Exacta' : 'Área de Influencia'}
          </p>
          <p className="text-xs text-neutral-600">
            {mapMode === 'pin' 
              ? 'Haz clic en el mapa o arrastra el marcador. El pin se mantendrá dentro del área visible.'
              : 'Haz clic en el mapa o arrastra el marcador para establecer el centro del área'
            }
          </p>
        </div>
      </div>

      {/* Coordinates Display */}
      <div className="bg-white rounded-lg p-4 border border-neutral-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Latitud:</label>
            <input
              type="number"
              value={currentCoords.lat || 0}
              onChange={(e) => {
                const newLat = Number(e.target.value);
                const constrainedCoords = constrainToBounds(newLat, currentCoords.lng);
                setCurrentCoords(constrainedCoords);
                onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
                updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mapMode, areaRadius);
              }}
              step="0.000001"
              className="input-field text-sm"
              placeholder="19.4326"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Longitud:</label>
            <input
              type="number"
              value={currentCoords.lng || 0}
              onChange={(e) => {
                const newLng = Number(e.target.value);
                const constrainedCoords = constrainToBounds(currentCoords.lat, newLng);
                setCurrentCoords(constrainedCoords);
                onLocationChange(constrainedCoords.lat, constrainedCoords.lng);
                updateMapDisplay(constrainedCoords.lat, constrainedCoords.lng, mapMode, areaRadius);
              }}
              step="0.000001"
              className="input-field text-sm"
              placeholder="-99.1332"
            />
          </div>
        </div>
        
        {address && (
          <div className="mt-3 p-2 bg-neutral-50 rounded-md">
            <p className="text-xs text-neutral-600">
              <strong>Dirección:</strong> {address}
            </p>
          </div>
        )}

        {currentCoords.lat !== 0 && currentCoords.lng !== 0 && (
          <div className="mt-3 p-2 bg-green-50 rounded-md">
            <p className="text-xs text-green-700">
              ✓ Coordenadas establecidas: {currentCoords.lat.toFixed(6)}, {currentCoords.lng.toFixed(6)}
            </p>
          </div>
        )}
        
        {mapMode === 'pin' && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-700">
              💡 El marcador se mantiene automáticamente dentro del área visible del mapa
            </p>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Consejos para usar el mapa:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Ubicación Exacta:</strong> El pin se mantiene dentro del mapa visible automáticamente</li>
              <li><strong>Área de Influencia:</strong> Usa cuando quieras mostrar una zona general (ideal para privacidad)</li>
              <li>Puedes hacer zoom con la rueda del mouse o los controles</li>
              <li>Arrastra el marcador para ajustar la posición</li>
              <li>Si el pin sale del área visible, se reposicionará automáticamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxLocationPicker;