import { useState, useEffect } from 'react';
import { Property, SearchFilters } from '../types';
import { PropertyService } from '../services/propertyService';

export const useProperties = (filters?: SearchFilters) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await PropertyService.getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError('Error al cargar las propiedades');
      console.error('Error fetching properties:', err);
      // Set empty array on error to prevent white screen
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [JSON.stringify(filters)]);

  return {
    properties,
    loading,
    error,
    refetch: fetchProperties
  };
};

export const useProperty = (id: string) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await PropertyService.getPropertyById(id);
        setProperty(data);
        
        // Record property view
        if (data) {
          PropertyService.recordPropertyView(id);
        }
      } catch (err) {
        setError('Error al cargar la propiedad');
        console.error('Error fetching property:', err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return {
    property,
    loading,
    error
  };
};