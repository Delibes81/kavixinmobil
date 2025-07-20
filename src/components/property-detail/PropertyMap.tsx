import React from 'react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';
import { Loader } from 'lucide-react';

interface PropertyMapProps {
  position: [number, number];
  address: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ position, address }) => {
  const { isLoaded, error } = useGoogleMaps();
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;

    // Initialize map
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: position[0], lng: position[1] },
      zoom: 15,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    // Add marker
    const marker = new window.google.maps.Marker({
      position: { lat: position[0], lng: position[1] },
      map: map,
      title: address,
      animation: window.google.maps.Animation.DROP
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div style="padding: 8px; max-width: 200px;"><strong>${address}</strong></div>`
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded, position, address]);

  if (error) {
    return (
      <div className="h-[400px] rounded-lg bg-neutral-100 flex items-center justify-center">
        <p className="text-neutral-600">Error al cargar el mapa</p>
      </div>
    );
  }

  return (
    <div className="h-[400px] rounded-lg overflow-hidden shadow-md relative">
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center z-10">
          <div className="text-center">
            <Loader className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-2" />
            <p className="text-neutral-600">Cargando mapa...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default PropertyMap;