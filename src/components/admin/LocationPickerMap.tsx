import React from 'react';
import { MapPin } from 'lucide-react';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onLocationChange: (lat: number, lng: number) => void;
  address?: string;
  onMapModeChange?: (mode: 'pin' | 'area') => void;
  onAreaRadiusChange?: (radius: number) => void;
  initialMode?: 'pin' | 'area';
  initialRadius?: number;
}

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onLocationChange,
  address = '',
  onMapModeChange,
  onAreaRadiusChange,
  initialMode = 'pin',
  initialRadius = 500
}) => {
  return (
    <div className="space-y-4">
      {/* Coordinates Input */}
      <div className="bg-white rounded-lg p-6 border border-neutral-200">
        <div className="flex items-center mb-4">
          <MapPin className="h-6 w-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-neutral-800">Coordenadas de la Propiedad</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Latitud:</label>
            <input
              type="number"
              value={latitude || 0}
              onChange={(e) => onLocationChange(Number(e.target.value), longitude)}
              step="0.000001"
              className="input-field"
              placeholder="19.4326"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Longitud:</label>
            <input
              type="number"
              value={longitude || 0}
              onChange={(e) => onLocationChange(latitude, Number(e.target.value))}
              step="0.000001"
              className="input-field"
              placeholder="-99.1332"
            />
          </div>
        </div>
        
        {address && (
          <div className="mt-4 p-3 bg-neutral-50 rounded-md">
            <p className="text-sm text-neutral-600">
              <strong>Dirección:</strong> {address}
            </p>
          </div>
        )}
      </div>

      {/* Map Mode Controls */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onMapModeChange?.('pin')}
          className={`btn flex-1 sm:flex-none ${initialMode === 'pin' ? 'btn-primary' : 'btn-outline'}`}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Modo Pin
        </button>
        
        <button
          type="button"
          onClick={() => onMapModeChange?.('area')}
          className={`btn flex-1 sm:flex-none ${initialMode === 'area' ? 'btn-primary' : 'btn-outline'}`}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Modo Área
        </button>
      </div>

      {/* Area Radius Controls */}
      {initialMode === 'area' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-blue-800">
              Radio del área (metros):
            </label>
            <span className="text-sm text-blue-600 font-medium">{initialRadius}m</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={initialRadius}
            onChange={(e) => onAreaRadiusChange?.(Number(e.target.value))}
            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-blue-600 mt-1">
            <span>100m</span>
            <span>2km</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPickerMap;