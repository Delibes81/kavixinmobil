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
      console.log('Creating property with data:', propertyData);
      console.log('Amenity IDs:', amenityIds);

      // Prepare the insert data, ensuring all required fields are present
      const insertData = {
        titulo: propertyData.titulo?.trim() || '',
        descripcion: propertyData.descripcion?.trim() || '',
        precio: Number(propertyData.precio) || 0,
        operacion: propertyData.operacion || 'venta',
        tipo: propertyData.tipo || 'casa',
        recamaras: Number(propertyData.recamaras) || 0,
        banos: Number(propertyData.banos) || 0,
        estacionamientos: Number(propertyData.estacionamientos) || 0,
        metros_construccion: Number(propertyData.metros_construccion) || 0,
        metros_terreno: Number(propertyData.metros_terreno) || 0,
        antiguedad: Number(propertyData.antiguedad) || 0,
        amueblado: Boolean(propertyData.amueblado),
        direccion: propertyData.direccion?.trim() || '',
        colonia: propertyData.colonia?.trim() || '',
        ciudad: propertyData.ciudad?.trim() || 'Ciudad de México',
        estado: propertyData.estado?.trim() || 'Ciudad de México',
        codigo_postal: propertyData.codigo_postal?.trim() || '',
        latitud: Number(propertyData.latitud) || 0,
        longitud: Number(propertyData.longitud) || 0,
        imagenes: Array.isArray(propertyData.imagenes) ? propertyData.imagenes : [],
        disponible: propertyData.disponible ?? true,
        destacado: Boolean(propertyData.destacado),
      };

      // Validate required fields
      if (!insertData.titulo) {
        throw new Error('El título es requerido');
      }
      if (insertData.precio <= 0) {
        throw new Error('El precio debe ser mayor a cero');
      }
      if (!insertData.direccion) {
        throw new Error('La dirección es requerida');
      }
      if (!insertData.colonia) {
        throw new Error('La colonia es requerida');
      }

      console.log('Formatted insert data:', insertData);

      const { data, error } = await supabase
        .from('properties')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw error;
      }

      console.log('Property created successfully:', data);

      // Insert amenities relationships
      if (amenityIds.length > 0 && data) {
        const amenityRelations = amenityIds.map(amenityId => ({
          property_id: data.id,
          amenity_id: amenityId,
        }));

        console.log('Inserting amenity relations:', amenityRelations);

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRelations);

        if (amenitiesError) {
          console.error('Error inserting amenities:', amenitiesError);
          throw amenitiesError;
        }
      }

      // Refresh the properties list
      await fetchProperties();
      return data;
    } catch (err) {
      console.error('Create property error:', err);
      throw new Error(err instanceof Error ? err.message : 'Error creating property');
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>, amenityIds: string[] = []) => {
    try {
      console.log('Updating property with ID:', id);
      console.log('Property data:', propertyData);
      console.log('Amenity IDs:', amenityIds);

      // Prepare the update data, ensuring all fields are properly formatted
      const updateData = {
        titulo: propertyData.titulo?.trim() || '',
        descripcion: propertyData.descripcion?.trim() || '',
        precio: Number(propertyData.precio) || 0,
        operacion: propertyData.operacion || 'venta',
        tipo: propertyData.tipo || 'casa',
        recamaras: Number(propertyData.recamaras) || 0,
        banos: Number(propertyData.banos) || 0,
        estacionamientos: Number(propertyData.estacionamientos) || 0,
        metros_construccion: Number(propertyData.metros_construccion) || 0,
        metros_terreno: Number(propertyData.metros_terreno) || 0,
        antiguedad: Number(propertyData.antiguedad) || 0,
        amueblado: Boolean(propertyData.amueblado),
        direccion: propertyData.direccion?.trim() || '',
        colonia: propertyData.colonia?.trim() || '',
        ciudad: propertyData.ciudad?.trim() || 'Ciudad de México',
        estado: propertyData.estado?.trim() || 'Ciudad de México',
        codigo_postal: propertyData.codigo_postal?.trim() || '',
        latitud: Number(propertyData.latitud) || 0,
        longitud: Number(propertyData.longitud) || 0,
        imagenes: Array.isArray(propertyData.imagenes) ? propertyData.imagenes : [],
        disponible: propertyData.disponible ?? true,
        destacado: Boolean(propertyData.destacado),
      };

      console.log('Formatted update data:', updateData);

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Property updated successfully:', data);

      // Update amenities relationships
      // First, delete existing relationships
      const { error: deleteError } = await supabase
        .from('property_amenities')
        .delete()
        .eq('property_id', id);

      if (deleteError) {
        console.error('Error deleting existing amenities:', deleteError);
        throw deleteError;
      }

      // Then, insert new relationships
      if (amenityIds.length > 0) {
        const amenityRelations = amenityIds.map(amenityId => ({
          property_id: id,
          amenity_id: amenityId,
        }));

        const { error: amenitiesError } = await supabase
          .from('property_amenities')
          .insert(amenityRelations);

        if (amenitiesError) {
          console.error('Error inserting new amenities:', amenitiesError);
          throw amenitiesError;
        }
      }

      // Refresh the properties list
      await fetchProperties();
      return data;
    } catch (err) {
      console.error('Update property error:', err);
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