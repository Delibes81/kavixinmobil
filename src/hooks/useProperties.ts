import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property, Amenity } from '../types';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      // Fetch properties with their amenities
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          *,
          property_amenities (
            amenities (*)
          )
        `)
        .order('fecha_creacion', { ascending: false });

      if (propertiesError) throw propertiesError;

      // Transform database data to match our Property interface
      const transformedProperties: Property[] = (propertiesData || []).map(item => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: item.descripcion || '',
        precio: item.precio,
        operacion: item.operacion,
        tipo: item.tipo,
        recamaras: item.recamaras || 0,
        banos: item.banos || 0,
        estacionamientos: item.estacionamientos || 0,
        metros_construccion: item.metros_construccion || 0,
        metros_terreno: item.metros_terreno || 0,
        antiguedad: item.antiguedad || 0,
        amueblado: item.amueblado || false,
        direccion: item.direccion || '',
        colonia: item.colonia || '',
        ciudad: item.ciudad || '',
        estado: item.estado || '',
        codigo_postal: item.codigo_postal || '',
        latitud: item.latitud || 0,
        longitud: item.longitud || 0,
        imagenes: item.imagenes || [],
        disponible: item.disponible ?? true,
        destacado: item.destacado || false,
        fecha_creacion: item.fecha_creacion || new Date().toISOString(),
        fecha_actualizacion: item.fecha_actualizacion || new Date().toISOString(),
        amenidades: item.property_amenities?.map((pa: any) => pa.amenities).filter(Boolean) || [],
      }));

      setProperties(transformedProperties);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching properties');
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Partial<Property>, amenityIds: string[] = []) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert([{
          titulo: propertyData.titulo || '',
          descripcion: propertyData.descripcion || '',
          precio: propertyData.precio || 0,
          operacion: propertyData.operacion || 'venta',
          tipo: propertyData.tipo || 'casa',
          recamaras: propertyData.recamaras || 0,
          banos: propertyData.banos || 0,
          estacionamientos: propertyData.estacionamientos || 0,
          metros_construccion: propertyData.metros_construccion || 0,
          metros_terreno: propertyData.metros_terreno || 0,
          antiguedad: propertyData.antiguedad || 0,
          amueblado: propertyData.amueblado || false,
          direccion: propertyData.direccion || '',
          colonia: propertyData.colonia || '',
          ciudad: propertyData.ciudad || 'Ciudad de México',
          estado: propertyData.estado || 'Ciudad de México',
          codigo_postal: propertyData.codigo_postal || '',
          latitud: propertyData.latitud || 0,
          longitud: propertyData.longitud || 0,
          imagenes: propertyData.imagenes || [],
          disponible: propertyData.disponible ?? true,
          destacado: propertyData.destacado || false,
        }])
        .select()
        .single();

      if (error) throw error;

      // Insert amenities relationships
      if (amenityIds.length > 0 && data) {
        const amenityRelations = amenityIds.map(amenityId => ({
          property_id: data.id,
          amenity_id: amenityId,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRelations);

        if (amenitiesError) throw amenitiesError;
      }

      // Refresh the properties list
      await fetchProperties();
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error creating property');
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>, amenityIds: string[] = []) => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .update({
          titulo: propertyData.titulo,
          descripcion: propertyData.descripcion,
          precio: propertyData.precio,
          operacion: propertyData.operacion,
          tipo: propertyData.tipo,
          recamaras: propertyData.recamaras,
          banos: propertyData.banos,
          estacionamientos: propertyData.estacionamientos,
          metros_construccion: propertyData.metros_construccion,
          metros_terreno: propertyData.metros_terreno,
          antiguedad: propertyData.antiguedad,
          amueblado: propertyData.amueblado,
          direccion: propertyData.direccion,
          colonia: propertyData.colonia,
          ciudad: propertyData.ciudad,
          estado: propertyData.estado,
          codigo_postal: propertyData.codigo_postal,
          latitud: propertyData.latitud,
          longitud: propertyData.longitud,
          imagenes: propertyData.imagenes,
          disponible: propertyData.disponible,
          destacado: propertyData.destacado,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Update amenities relationships
      // First, delete existing relationships
      await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', id);

      // Then, insert new relationships
      if (amenityIds.length > 0) {
        const amenityRelations = amenityIds.map(amenityId => ({
          property_id: id,
          amenity_id: amenityId,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRelations);

        if (amenitiesError) throw amenitiesError;
      }

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

export const useAmenities = () => {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .eq('activo', true)
        .order('categoria', { ascending: true })
        .order('nombre', { ascending: true });

      if (error) throw error;

      const transformedAmenities: Amenity[] = (data || []).map(item => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion || '',
        icono: item.icono || '',
        categoria: item.categoria || '',
        activo: item.activo ?? true,
        fecha_creacion: item.fecha_creacion || new Date().toISOString(),
      }));

      setAmenities(transformedAmenities);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching amenities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  return {
    amenities,
    loading,
    error,
    fetchAmenities,
  };
};