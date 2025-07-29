import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, ExternalLink, Navigation } from 'lucide-react';

interface ContactMapProps {
  address: string;
  latitude: number;
  longitude: number;
  className?: string;
}

const ContactMap: React.FC<ContactMapProps> = ({
  address,
  latitude,
  longitude,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Mapbox access token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: 16,
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
      
      // Create custom marker element for Nova Hestia office
      const markerElement = document.createElement('div');
      markerElement.className = 'nova-hestia-marker';
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      markerElement.style.borderRadius = '50% 50% 50% 0';
      markerElement.style.backgroundColor = '#0052a3';
      markerElement.style.border = '4px solid #ffffff';
      markerElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
      markerElement.style.transform = 'rotate(-45deg)';
      markerElement.style.cursor = 'pointer';
      markerElement.style.position = 'relative';

      // Add Nova Hestia logo/icon inside
      const innerIcon = document.createElement('div');
      innerIcon.style.width = '16px';
      innerIcon.style.height = '16px';
      innerIcon.style.backgroundColor = '#e6b325';
      innerIcon.style.borderRadius = '50%';
      innerIcon.style.position = 'absolute';
      innerIcon.style.top = '50%';
      innerIcon.style.left = '50%';
      innerIcon.style.transform = 'translate(-50%, -50%) rotate(45deg)';
      innerIcon.style.boxShadow = '0 0 4px rgba(0, 0, 0, 0.3)';
      markerElement.appendChild(innerIcon);

      // Create marker
      marker.current = new mapboxgl.Marker({
        element: markerElement,
        anchor: 'bottom'
      })
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      // Add popup with office information
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      })
        .setLngLat([longitude, latitude])
        .setHTML(`
          <div class="p-3 text-center">
            <h3 class="font-semibold text-primary-800 mb-1">Nova Hestia</h3>
            <p class="text-sm text-neutral-600 mb-2">${address}</p>
            <p class="text-xs text-neutral-500">Oficinas principales</p>
          </div>
        `);

      // Show popup on marker hover
      markerElement.addEventListener('mouseenter', () => {
        popup.addTo(map.current!);
      });

      markerElement.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [latitude, longitude, address]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const centerMap = () => {
    if (map.current) {
      map.current.flyTo({
        center: [longitude, latitude],
        zoom: 16,
        duration: 1000
      });
    }
  };

  const openDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
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
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <p className="text-xs text-neutral-700 font-medium">
              Oficinas Nova Hestia
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button
            onClick={centerMap}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
            title="Centrar mapa"
          >
            <Navigation className="h-5 w-5 text-primary-600" />
          </button>
          <button
            onClick={openDirections}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
            title="Obtener direcciones"
          >
            <MapPin className="h-5 w-5 text-primary-600" />
          </button>
          <button
            onClick={openInGoogleMaps}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-md hover:bg-white transition-colors"
            title="Abrir en Google Maps"
          >
            <ExternalLink className="h-5 w-5 text-primary-600" />
          </button>
        </div>
      </div>

      {/* Office Info */}
      <div className="bg-white rounded-lg p-4 border border-neutral-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-neutral-800 mb-2 flex items-center">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              Ubicación de Nuestras Oficinas
            </h4>
            <p className="text-neutral-600 mb-3">{address}</p>
            
            <div className="text-sm text-neutral-500">
              <p><strong>Coordenadas:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 ml-4">
            <button
              onClick={openDirections}
              className="btn btn-primary text-sm"
            >
              <MapPin className="h-4 w-4 mr-1" />
              Cómo llegar
            </button>
            <button
              onClick={openInGoogleMaps}
              className="btn btn-outline text-sm"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Ver en Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactMap;