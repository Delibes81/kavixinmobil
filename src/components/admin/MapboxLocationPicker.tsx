import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Crosshair, RotateCcw, Search } from 'lucide-react';
import AddressAutocomplete from './AddressAutocomplete';

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
  const [searchValue, setSearchValue] = useState('');

  // Usamos refs para tener los valores más actuales dentro de los listeners del mapa,
  // ya que estos se registran una sola vez
  // Mapbox access token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

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
      // Initialize marker after map loads - sin delay para respuesta inmediata
      updateMapDisplay(initialLat, initialLng, mapMode, areaRadius);
    });
    // Handle map clicks
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      console.log('Map clicked at:', lat, lng);
      setCurrentCoords({ lat, lng });
      onLocationChange(lat, lng);
      // Actualizar inmediatamente el display del mapa
      updateMapDisplay(lat, lng, mapMode, areaRadius);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
      // Actualizar inmediatamente el display del mapa
  // Update map when coordinates change externally
  useEffect(() => {
    if (isMapLoaded && (latitude !== currentCoords.lat || longitude !== currentCoords.lng)) {
      const newLat = latitude || 19.4326;
      const newLng = longitude || -99.1332;
      setCurrentCoords({ lat: newLat, lng: newLng });
      updateMapDisplay(newLat, newLng, mapMode, areaRadius);
      
      // Center map on new coordinates
      if (map.current) {
        map.current.flyTo({
          center: [newLng, newLat],
          zoom: 15,
          duration: 1000
        });
      }
    }
  }, [latitude, longitude, isMapLoaded]);

  const updateMapDisplay = (lat: number, lng: number, mode: 'pin' | 'area', radius: number) => {
    if (!map.current || !isMapLoaded) return;

    console.log('Updating map display:', { lat, lng, mode, radius });

    // Remove existing marker and circle
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    if (circle.current) {
      if (map.current.getSource('circle-source')) {
        map.current.removeLayer('circle-layer');
        map.current.removeSource('circle-source');
      }
      circle.current = null;
    }

    // Ensure we have valid coordinates
    if (!lat || !lng || lat === 0 || lng === 0) {
      console.log('Invalid coordinates, skipping marker creation');
      return;
    }
    if (mode === 'pin') {
      console.log('Creating pin marker at:', lat, lng);

      // Create marker element manually for better control
      const markerElement = document.createElement('div');
      markerElement.className = 'mapbox-marker-pin';
      markerElement.style.width = '30px';
      markerElement.style.height = '30px';
      markerElement.style.borderRadius = '50% 50% 50% 0';
      markerElement.style.backgroundColor = '#0052a3';
      markerElement.style.border = '3px solid #ffffff';
      markerElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      markerElement.style.transform = 'rotate(-45deg)';
      markerElement.style.cursor = 'pointer';
      markerElement.style.position = 'relative'; // <-- Agrega esto

      // Add inner dot
      const innerDot = document.createElement('div');
      innerDot.style.width = '10px'; // Más grande para mejor visibilidad
      innerDot.style.height = '10px';
      innerDot.style.backgroundColor = '#ffffff';
      innerDot.style.borderRadius = '50%';
      innerDot.style.position = 'absolute';
      innerDot.style.top = '50%';
      innerDot.style.left = '50%';
      innerDot.style.transform = 'translate(-50%, -50%) rotate(45deg)';
      innerDot.style.boxShadow = '0 0 4px #0052a3'; // Sombra azul para resaltar
      markerElement.appendChild(innerDot);

      marker.current = new mapboxgl.Marker({
        element: markerElement,
        draggable: true,
        anchor: 'bottom'
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Handle marker drag
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          console.log('Marker dragged to:', lngLat.lat, lngLat.lng);
          setCurrentCoords({ lat: lngLat.lat, lng: lngLat.lng });
          onLocationChange(lngLat.lat, lngLat.lng);
        }
      });
      
      console.log('Pin marker created successfully');
    } else {
      console.log('Creating area circle at:', lat, lng, 'with radius:', radius);
      // Add circle for area mode
      const circleGeoJSON = {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat]
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
              [8, radius / 8],   // Área más grande en todos los zooms
              [10, radius / 6],
              [12, radius / 4],
              [14, radius / 3],
              [16, radius / 2],
              [18, radius / 1.5],
              [20, radius]
            ],
            base: 2
          },
          'circle-color': '#0052a3',
          'circle-opacity': 0.25, // Más visible
          'circle-stroke-color': '#0052a3',
          'circle-stroke-width': 4, // Borde más grueso
          'circle-stroke-opacity': 1
        }
      });

      // Add center marker with custom element
      const centerElement = document.createElement('div');
      centerElement.style.width = '20px';
      centerElement.style.height = '20px';
      centerElement.style.borderRadius = '50%';
      centerElement.style.backgroundColor = '#e6b325';
      centerElement.style.border = '3px solid #ffffff';
      centerElement.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.3)';
      centerElement.style.cursor = 'pointer';
      
      marker.current = new mapboxgl.Marker({
        element: centerElement,
        draggable: true
      })
        .setLngLat([lng, lat])
        .addTo(map.current);

      // Handle marker drag for area mode
      marker.current.on('dragend', () => {
        if (marker.current) {
          const lngLat = marker.current.getLngLat();
          console.log('Area marker dragged to:', lngLat.lat, lngLat.lng);
          setCurrentCoords({ lat: lngLat.lat, lng: lngLat.lng });
          onLocationChange(lngLat.lat, lngLat.lng);
          updateMapDisplay(lngLat.lat, lngLat.lng, mode, radius);
        }
      });

      circle.current = true;
      console.log('Area circle and marker created successfully');
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

  const handleAddressSelect = (addressData: any) => {
    console.log('Address selected:', addressData);
    
    // Update coordinates
    setCurrentCoords({ lat: addressData.lat, lng: addressData.lng });
    onLocationChange(addressData.lat, addressData.lng);
    
    // Fly to location on map
    if (map.current) {
      map.current.flyTo({
        center: [addressData.lng, addressData.lat],
        zoom: 16,
        duration: 1500
      });
    }
    
    // Update map display
    updateMapDisplay(addressData.lat, addressData.lng, mapMode, areaRadius);
  };
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address Search */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          <Search className="h-4 w-4 inline mr-1" />
          Buscar Dirección
        </label>
        <AddressAutocomplete
          value={searchValue}
          onChange={setSearchValue}
          onAddressSelect={handleAddressSelect}
          placeholder="Busca una dirección, colonia o lugar..."
          className="w-full"
        />
      </div>

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
              ? 'Busca una dirección arriba o haz clic en el mapa para colocar el pin azul grande.'
              : 'Busca una dirección o haz clic en el mapa para establecer el centro del área.'
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
                setCurrentCoords({ lat: newLat, lng: currentCoords.lng });
                onLocationChange(newLat, currentCoords.lng);
                updateMapDisplay(newLat, currentCoords.lng, mapMode, areaRadius);
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
                setCurrentCoords({ lat: currentCoords.lat, lng: newLng });
                onLocationChange(currentCoords.lat, newLng);
                updateMapDisplay(currentCoords.lat, newLng, mapMode, areaRadius);
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
      </div>

      {/* Info Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Consejos para usar el mapa:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li><strong>Buscar:</strong> Usa el campo de búsqueda para encontrar direcciones rápidamente</li>
              <li><strong>Ubicación Exacta:</strong> Pin azul grande para direcciones precisas</li>
              <li><strong>Área de Influencia:</strong> Círculo azul grande con marcador dorado en el centro</li>
              <li>Puedes hacer zoom con la rueda del mouse o los controles</li>
              <li>Arrastra el marcador para ajustar la posición</li>
              <li>El área se escala automáticamente con el zoom para mejor visibilidad</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapboxLocationPicker;