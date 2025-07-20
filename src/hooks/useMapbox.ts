import { useState, useEffect, useCallback } from 'react';

interface GeocodeResult {
  lat: number;
  lng: number;
  formatted_address: string;
  components: AddressComponents;
}

interface AddressComponents {
  street_number?: string;
  route?: string;
  neighborhood?: string;
  locality?: string;
  administrative_area_level_1?: string;
  postal_code?: string;
}

export const useMapbox = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken) {
      setError('Mapbox access token not configured');
      return;
    }

    // Mapbox GL JS is loaded via npm, so it's always available
    setIsLoaded(true);
  }, []);

  const geocodeAddress = useCallback(async (address: string): Promise<GeocodeResult | null> => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('Mapbox access token not configured');
    }

    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${accessToken}&country=mx&language=es&limit=1`
      );

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const [lng, lat] = feature.center;
        
        // Parse address components from Mapbox context
        const components: AddressComponents = {};
        
        if (feature.context) {
          feature.context.forEach((context: any) => {
            if (context.id.startsWith('postcode')) {
              components.postal_code = context.text;
            } else if (context.id.startsWith('place')) {
              components.locality = context.text;
            } else if (context.id.startsWith('region')) {
              components.administrative_area_level_1 = context.text;
            } else if (context.id.startsWith('neighborhood')) {
              components.neighborhood = context.text;
            }
          });
        }

        // Extract street info from place_name
        if (feature.properties?.address) {
          components.street_number = feature.properties.address;
        }
        
        // Extract route from text
        if (feature.text) {
          components.route = feature.text;
        }

        return {
          lat,
          lng,
          formatted_address: feature.place_name,
          components
        };
      }

      return null;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Geocoding failed');
    }
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<{
    formatted_address: string;
    components: AddressComponents;
  } | null> => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken) {
      throw new Error('Mapbox access token not configured');
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${accessToken}&language=es&limit=1`
      );

      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        
        // Parse address components from Mapbox context
        const components: AddressComponents = {};
        
        if (feature.context) {
          feature.context.forEach((context: any) => {
            if (context.id.startsWith('postcode')) {
              components.postal_code = context.text;
            } else if (context.id.startsWith('place')) {
              components.locality = context.text;
            } else if (context.id.startsWith('region')) {
              components.administrative_area_level_1 = context.text;
            } else if (context.id.startsWith('neighborhood')) {
              components.neighborhood = context.text;
            }
          });
        }

        // Extract street info
        if (feature.properties?.address) {
          components.street_number = feature.properties.address;
        }
        
        if (feature.text) {
          components.route = feature.text;
        }

        return {
          formatted_address: feature.place_name,
          components
        };
      }

      return null;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Reverse geocoding failed');
    }
  }, []);

  const searchPlaces = useCallback(async (query: string): Promise<Array<{
    id: string;
    place_name: string;
    center: [number, number];
    components: AddressComponents;
  }>> => {
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    if (!accessToken || !query.trim()) {
      return [];
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${accessToken}&country=mx&language=es&limit=5&types=address,poi`
      );

      if (!response.ok) {
        throw new Error(`Places search failed: ${response.status}`);
      }

      const data = await response.json();
      
      return (data.features || []).map((feature: any) => {
        const components: AddressComponents = {};
        
        if (feature.context) {
          feature.context.forEach((context: any) => {
            if (context.id.startsWith('postcode')) {
              components.postal_code = context.text;
            } else if (context.id.startsWith('place')) {
              components.locality = context.text;
            } else if (context.id.startsWith('region')) {
              components.administrative_area_level_1 = context.text;
            } else if (context.id.startsWith('neighborhood')) {
              components.neighborhood = context.text;
            }
          });
        }

        if (feature.properties?.address) {
          components.street_number = feature.properties.address;
        }
        
        if (feature.text) {
          components.route = feature.text;
        }

        return {
          id: feature.id,
          place_name: feature.place_name,
          center: feature.center,
          components
        };
      });
    } catch (err) {
      console.error('Places search error:', err);
      return [];
    }
  }, []);

  return {
    isLoaded,
    error,
    geocodeAddress,
    reverseGeocode,
    searchPlaces
  };
};