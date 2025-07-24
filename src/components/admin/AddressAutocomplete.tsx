import React from 'react';
import { MapPin, X, Search } from 'lucide-react';
import { useMapbox } from '../../hooks/useMapbox';

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
  const { searchPlaces } = useMapbox();
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const debounceRef = React.useRef<NodeJS.Timeout>();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Reset selection
    setSelectedIndex(-1);
    
    if (newValue.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    // Debounce search
    debounceRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);
        const results = await searchPlaces(newValue);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Error searching places:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: any) => {
    const [lng, lat] = suggestion.center;
    
    // Update input value
    onChange(suggestion.place_name);
    
    // Hide suggestions
    setShowSuggestions(false);
    setSuggestions([]);
    setSelectedIndex(-1);
    
    // Call the callback with address data
    if (onAddressSelect) {
      onAddressSelect({
        formatted_address: suggestion.place_name,
        lat,
        lng,
        components: suggestion.components || {}
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        placeholder={placeholder}
        className={`input-field pl-10 pr-10 ${className}`}
        disabled={disabled}
        autoComplete="off"
      />
      
      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
      
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
        {isLoading && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        )}
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
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-neutral-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors ${
                index === selectedIndex ? 'bg-primary-50 text-primary-700' : 'text-neutral-700'
              }`}
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-neutral-400 mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {suggestion.place_name}
                  </div>
                  {suggestion.components?.locality && (
                    <div className="text-xs text-neutral-500 mt-1">
                      {suggestion.components.locality}
                      {suggestion.components.administrative_area_level_1 && 
                        `, ${suggestion.components.administrative_area_level_1}`
                      }
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Helper text */}
      <div className="mt-2 text-xs text-neutral-500">
        Escribe al menos 3 caracteres para buscar direcciones
      </div>
    </div>
  );
};

export default AddressAutocomplete;