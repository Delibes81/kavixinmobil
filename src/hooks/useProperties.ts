import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database data to match our Property interface
      const transformedProperties: Property[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        price: item.price,
        operation: item.operation,
        type: item.type,
        area: item.area || 0,
        bedrooms: item.bedrooms || 0,
        bathrooms: item.bathrooms || 0,
        parking: item.parking || 0,
        isFurnished: item.is_furnished || false,
        location: item.location as Property['location'] || {
          calle: '',
          numero: '',
          colonia: '',
          alcaldia: '',
          codigoPostal: '',
          estado: '',
          lat: 0,
          lng: 0,
        },
        images: item.images || [],
        features: item.features || [],
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.updated_at || new Date().toISOString(),
      }));

      setProperties(transformedProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Partial<Property>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          title: propertyData.title || '',
          description: propertyData.description || '',
          price: propertyData.price || 0,
          operation: propertyData.operation || 'venta',
          type: propertyData.type || 'casa',
          area: propertyData.area || 0,
          bedrooms: propertyData.bedrooms || 0,
          bathrooms: propertyData.bathrooms || 0,
          parking: propertyData.parking || 0,
          is_furnished: propertyData.isFurnished || false,
          location: propertyData.location || {},
          images: propertyData.images || [],
          features: propertyData.features || [],
        }])
        .select()
        .single();

      if (error) throw error;

      // Refresh the properties list
      await fetchProperties();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating property');
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          title: propertyData.title,
          description: propertyData.description,
          price: propertyData.price,
          operation: propertyData.operation,
          type: propertyData.type,
          area: propertyData.area,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          parking: propertyData.parking,
          is_furnished: propertyData.isFurnished,
          location: propertyData.location,
          images: propertyData.images,
          features: propertyData.features,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Refresh the properties list
      await fetchProperties();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error updating property');
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh the properties list
      await fetchProperties();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error deleting property');
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    loading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};