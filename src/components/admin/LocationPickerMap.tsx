import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader, AlertTriangle, Target, RotateCcw, Circle } from 'lucide-react';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  address?: string;
  className?: string;
  showAreaCircle?: boolean;
  circleRadius?: number;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  address = '',
  className = '',
  showAreaCircle = false,
  circleRadius = 500
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCircle, setShowCircle] = useState(showAreaCircle);
  const [radius, setRadius] = useState(circleRadius);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const marker = useRef<any>(null);
  const circle = useRef<any>(null);
  
  const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

  // Default to Mexico City center if no coordinates provided
  const defaultLat = latitude || 19.4326;
  const defaultLng = longitude || -99.1332;

  useEffect(() => {
    if (!accessToken) {
      setError('Token de Mapbox no configurado');
      setIsLoading(false);
      return;
    }

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
          center: [defaultLng, defaultLat],
          zoom: latitude && longitude ? 15 : 10,
          attributionControl: false
        });

        // Create draggable marker
        marker.current = new mapboxgl.default.Marker({
          color: '#0052a3',
          draggable: true,
          scale: 1.2
        })
          .setLngLat([defaultLng, defaultLat])
          .addTo(map.current);

        // Add area circle if enabled
        if (showCircle) {
          addAreaCircle(defaultLng, defaultLat);
        }

        // Handle marker drag
        marker.current.on('dragstart', () => {
          setIsDragging(true);
        });

        marker.current.on('dragend', () => {
          const lngLat = marker.current.getLngLat();
          onLocationChange(lngLat.lat, lngLat.lng);
          if (showCircle) {
            updateAreaCircle(lngLat.lng, lngLat.lat);
          }
          setIsDragging(false);
        });

        // Handle map click to move marker
        map.current.on('click', (e: any) => {
          const { lng, lat } = e.lngLat;
          marker.current.setLngLat([lng, lat]);
          onLocationChange(lat, lng);
          if (showCircle) {
            updateAreaCircle(lng, lat);
          }
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

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
  }, [accessToken]);

  // Function to add area circle
  const addAreaCircle = (lng: number, lat: number) => {
    if (!map.current) return;

    // Create circle data
    const circleData = createCircleGeoJSON(lng, lat, radius);

    // Add circle source and layer
    map.current.addSource('area-circle', {
      type: 'geojson',
      data: circleData
    });

    map.current.addLayer({
      id: 'area-circle-fill',
      type: 'fill',
      source: 'area-circle',
      paint: {
        'fill-color': '#0052a3',
        'fill-opacity': 0.2
      }
    });

    map.current.addLayer({
      id: 'area-circle-stroke',
      type: 'line',
      source: 'area-circle',
      paint: {
        'line-color': '#0052a3',
        'line-width': 2,
        'line-opacity': 0.8
      }
    });
  };

  // Function to update area circle
  const updateAreaCircle = (lng: number, lat: number) => {
    if (!map.current || !showCircle) return;

    const circleData = createCircleGeoJSON(lng, lat, radius);
    
    if (map.current.getSource('area-circle')) {
      map.current.getSource('area-circle').setData(circleData);
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

  // Function to toggle circle visibility
  const toggleCircle = () => {
    if (!map.current) return;

    const newShowCircle = !showCircle;
    setShowCircle(newShowCircle);

    if (newShowCircle) {
      if (marker.current) {
        const lngLat = marker.current.getLngLat();
        addAreaCircle(lngLat.lng, lngLat.lat);
      }
    } else {
      // Remove circle layers
      if (map.current.getLayer('area-circle-fill')) {
        map.current.removeLayer('area-circle-fill');
      }
      if (map.current.getLayer('area-circle-stroke')) {
        map.current.removeLayer('area-circle-stroke');
      }
      if (map.current.getSource('area-circle')) {
        map.current.removeSource('area-circle');
      }
    }
  };

  // Function to update circle radius
  const updateRadius = (newRadius: number) => {
    setRadius(newRadius);
    if (showCircle && marker.current) {
      const lngLat = marker.current.getLngLat();
      updateAreaCircle(lngLat.lng, lngLat.lat);
    }
  };

  // Update marker position when coordinates change externally
  useEffect(() => {
    if (marker.current && latitude && longitude) {
      marker.current.setLngLat([longitude, latitude]);
      if (map.current) {
        map.current.setCenter([longitude, latitude]);
        map.current.setZoom(15);
      }
      if (showCircle) {
        updateAreaCircle(longitude, latitude);
      }
    }
  }, [latitude, longitude]);

  const handleCenterOnAddress = async () => {
    if (!address.trim() || !map.current) return;

    try {
      setIsLoading(true);
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&country=mx&language=es&limit=1`
      );

      if (!response.ok) {
        throw new Error(`Error en la geocodificación: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        // Update map and marker
        map.current.setCenter([lng, lat]);
        map.current.setZoom(16);
        marker.current.setLngLat([lng, lat]);
        
        // Update coordinates
        onLocationChange(lat, lng);
        
        // Update circle if visible
        if (showCircle) {
          updateAreaCircle(lng, lat);
        }
      } else {
        throw new Error('No se encontraron coordenadas para esta dirección');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setError(error instanceof Error ? error.message : 'Error al buscar la dirección');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefault = () => {
    if (map.current && marker.current) {
      const defaultCenter = [-99.1332, 19.4326]; // Mexico City
      map.current.setCenter(defaultCenter);
      map.current.setZoom(10);
      marker.current.setLngLat(defaultCenter);
      onLocationChange(19.4326, -99.1332);
      if (showCircle) {
        updateAreaCircle(-99.1332, 19.4326);
      }
    }
  };

  if (!accessToken) {
    return (
      <div className={`h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-neutral-600">Token de Mapbox no configurado</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
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
        
        {/* Instructions Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md max-w-xs">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-neutral-800">
              <p className="font-medium mb-1">Seleccionar ubicación:</p>
              <p>• Haz clic en el mapa para mover el pin</p>
              <p>• Arrastra el pin para ajustar la posición</p>
              {showCircle && <p>• El círculo muestra el área aproximada</p>}
            </div>
          </div>
        </div>

        {/* Dragging Indicator */}
        {isDragging && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Moviendo ubicación...
          </div>
        )}

        {/* Coordinates Display */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
          <div className="text-xs text-neutral-700">
            <p className="font-medium">Coordenadas:</p>
            <p>Lat: {latitude ? latitude.toFixed(6) : 'No establecida'}</p>
            <p>Lng: {longitude ? longitude.toFixed(6) : 'No establecida'}</p>
            {showCircle && <p>Radio: {radius}m</p>}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="mt-4 flex flex-wrap gap-3">
        {address && (
          <button
            type="button"
            onClick={handleCenterOnAddress}
            disabled={isLoading}
            className="btn btn-outline flex-1 sm:flex-none"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 mr-2 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Centrar en dirección
              </>
            )}
          </button>
        )}
        
        <button
          type="button"
          onClick={handleResetToDefault}
          className="btn btn-outline flex-1 sm:flex-none"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Centrar en CDMX
        </button>
        
        <button
          type="button"
          onClick={toggleCircle}
          className={`btn flex-1 sm:flex-none ${showCircle ? 'btn-primary' : 'btn-outline'}`}
        >
          <Circle className="h-4 w-4 mr-2" />
          {showCircle ? 'Ocultar área' : 'Mostrar área'}
        </button>
      </div>

      {/* Circle Controls */}
      {showCircle && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-blue-800">
              Radio del área (metros):
            </label>
            <span className="text-sm text-blue-600 font-medium">{radius}m</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={radius}
            onChange={(e) => updateRadius(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-blue-600 mt-1">
            <span>100m</span>
            <span>2km</span>
          </div>
          <p className="text-xs text-blue-700 mt-2">
            El círculo azul muestra el área aproximada de influencia de la propiedad
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm flex items-start">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start">
          <MapPin className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Cómo usar el mapa:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Haz clic en cualquier punto del mapa para colocar el pin</li>
              <li>Arrastra el pin azul para ajustar la ubicación exacta</li>
              <li>Usa "Centrar en dirección" para buscar automáticamente</li>
              <li>Las coordenadas se actualizan automáticamente</li>
              <li>Activa "Mostrar área" para visualizar la zona de influencia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerMap;