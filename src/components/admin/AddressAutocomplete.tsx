import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Loader } from 'lucide-react';
import { useGoogleMaps } from '../../hooks/useGoogleMaps';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (addressData: {
    formatted_address: string;
    lat: number;
    lng: number;
    components: {
      street_number?: string;
      route?: string;
      neighborhood?: string;
      locality?: string;
      administrative_area_level_1?: string;
      postal_code?: string;
    };
  }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Ingresa la dirección",
  className = "",
  disabled = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const { isLoaded, error } = useGoogleMaps();
  const [isLoadingGeocode, setIsLoadingGeocode] = useState(false);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    // Initialize autocomplete
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['address'],
        componentRestrictions: { country: 'mx' },
        fields: ['formatted_address', 'geometry', 'address_components']
      }
    );

    // Add place changed listener
    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        setIsLoadingGeocode(true);
        
        // Parse address components
        const components: any = {};
        if (place.address_components) {
          place.address_components.forEach((component: any) => {
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
        }

        const addressData = {
          formatted_address: place.formatted_address || value,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          components
        };

        onChange(place.formatted_address || value);
        onAddressSelect?.(addressData);
        setIsLoadingGeocode(false);
      }
    });

    return () => {
      if (listener) {
        window.google.maps.event.removeListener(listener);
      }
    };
  }, [isLoaded, onChange, onAddressSelect, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  if (error) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`input-field pl-10 ${className}`}
          disabled={disabled}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-xs text-red-500" title="Google Maps no disponible">
            ⚠️
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`input-field pl-10 pr-10 ${className}`}
        disabled={disabled || !isLoaded}
      />
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {!isLoaded ? (
          <Loader className="h-4 w-4 text-neutral-400 animate-spin" />
        ) : isLoadingGeocode ? (
          <Loader className="h-4 w-4 text-primary-600 animate-spin" />
        ) : null}
      </div>
      
      {!isLoaded && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-neutral-500 bg-neutral-50 p-2 rounded border">
          Cargando Google Maps...
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;