import React, { useState } from 'react';
import { MapPin, X } from 'lucide-react';

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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`input-field pl-10 pr-10 ${className}`}
        disabled={disabled}
        autoComplete="off"
      />
      
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressAutocomplete;