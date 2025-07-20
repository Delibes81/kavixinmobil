import { useState, useEffect, useCallback } from 'react';

interface PlaceResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

interface AddressComponents {
  street_number?: string;
  route?: string;
  neighborhood?: string;
  locality?: string;
  administrative_area_level_1?: string;
  postal_code?: string;
}

export const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('Google Maps API key not configured');
      return;
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es&region=MX`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const geocodeAddress = useCallback(async (address: string): Promise<{
    lat: number;
    lng: number;
    formatted_address: string;
    components: AddressComponents;
  } | null> => {
    if (!isLoaded || !window.google) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode(
        { 
          address: address,
          region: 'MX',
          componentRestrictions: { country: 'MX' }
        },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const components: AddressComponents = {};
            
            // Parse address components
            result.address_components.forEach(component => {
              const types = component.types;
              if (types.includes('street_number')) {
                components.street_number = component.long_name;
              } else if (types.includes('route')) {
                components.route = component.long_name;
              } else if (types.includes('neighborhood') || types.includes('sublocality')) {
                components.neighborhood = component.long_name;
              } else if (types.includes('locality')) {
                components.locality = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                components.administrative_area_level_1 = component.long_name;
              } else if (types.includes('postal_code')) {
                components.postal_code = component.long_name;
              }
            });

            resolve({
              lat: result.geometry.location.lat(),
              lng: result.geometry.location.lng(),
              formatted_address: result.formatted_address,
              components
            });
          } else {
            reject(new Error(`Geocoding failed: ${status}`));
          }
        }
      );
    });
  }, [isLoaded]);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<{
    formatted_address: string;
    components: AddressComponents;
  } | null> => {
    if (!isLoaded || !window.google) {
      throw new Error('Google Maps not loaded');
    }

    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode(
        { 
          location: { lat, lng },
          region: 'MX'
        },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const components: AddressComponents = {};
            
            // Parse address components
            result.address_components.forEach(component => {
              const types = component.types;
              if (types.includes('street_number')) {
                components.street_number = component.long_name;
              } else if (types.includes('route')) {
                components.route = component.long_name;
              } else if (types.includes('neighborhood') || types.includes('sublocality')) {
                components.neighborhood = component.long_name;
              } else if (types.includes('locality')) {
                components.locality = component.long_name;
              } else if (types.includes('administrative_area_level_1')) {
                components.administrative_area_level_1 = component.long_name;
              } else if (types.includes('postal_code')) {
                components.postal_code = component.long_name;
              }
            });

            resolve({
              formatted_address: result.formatted_address,
              components
            });
          } else {
            reject(new Error(`Reverse geocoding failed: ${status}`));
          }
        }
      );
    });
  }, [isLoaded]);

  return {
    isLoaded,
    error,
    geocodeAddress,
    reverseGeocode
  };
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}