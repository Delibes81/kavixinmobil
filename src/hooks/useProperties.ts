import { useState, useEffect } from 'react';
import { supabase, supabaseConfig } from '../lib/supabase';
import { Property, Amenity } from '../types';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is properly configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        console.warn('Supabase not configured, using mock data');
        // Use mock data when Supabase is not configured
        const mockProperties: Property[] = [
          {
            id: '1',
            titulo: 'Exclusivo Departamento en Polanco',
            descripcion: 'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad.',
            precio: 8500000,
            operacion: 'venta',
            tipo: 'departamento',
            recamaras: 2,
            banos: 2,
            estacionamientos: 1,
            metros_construccion: 120,
            metros_terreno: 0,
            antiguedad: 5,
            amueblado: false,
            direccion: 'Emilio Castelar 135',
            colonia: 'Polanco V Sección',
            ciudad: 'Ciudad de México',
            estado: 'Ciudad de México',
            codigo_postal: '11560',
            latitud: 19.4324,
            longitud: -99.1962,
            imagenes: [
              'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            disponible: true,
            destacado: true,
            fecha_creacion: '2025-01-15T00:00:00Z',
            fecha_actualizacion: '2025-01-15T00:00:00Z',
            amenidades: []
          },
          {
            id: '2',
            titulo: 'Casa con jardín en Coyoacán',
            descripcion: 'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán.',
            precio: 12500000,
            operacion: 'venta',
            tipo: 'casa',
            recamaras: 4,
            banos: 3,
            estacionamientos: 2,
            metros_construccion: 280,
            metros_terreno: 350,
            antiguedad: 15,
            amueblado: false,
            direccion: 'Francisco Sosa 205',
            colonia: 'Del Carmen',
            ciudad: 'Ciudad de México',
            estado: 'Ciudad de México',
            codigo_postal: '04100',
            latitud: 19.3434,
            longitud: -99.1663,
            imagenes: [
              'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            disponible: true,
            destacado: true,
            fecha_creacion: '2025-01-10T00:00:00Z',
            fecha_actualizacion: '2025-01-10T00:00:00Z',
            amenidades: []
          },
          {
            id: '3',
            titulo: 'Moderno Loft en Condesa',
            descripcion: 'Espectacular loft completamente amueblado en el corazón de la Condesa.',
            precio: 18000,
            operacion: 'renta',
            tipo: 'departamento',
            recamaras: 1,
            banos: 1,
            estacionamientos: 1,
            metros_construccion: 75,
            metros_terreno: 0,
            antiguedad: 2,
            amueblado: true,
            direccion: 'Tamaulipas 66',
            colonia: 'Condesa',
            ciudad: 'Ciudad de México',
            estado: 'Ciudad de México',
            codigo_postal: '06140',
            latitud: 19.4134,
            longitud: -99.1763,
            imagenes: [
              'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
              'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
            ],
            disponible: true,
            destacado: false,
            fecha_creacion: '2025-02-25T00:00:00Z',
            fecha_actualizacion: '2025-02-25T00:00:00Z',
            amenidades: []
          }
        ];
        
        setProperties(mockProperties);
        setLoading(false);
        return;
      }
      
      // First, try to fetch properties without amenities to avoid complex joins
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (propertiesError) throw propertiesError;

      // If we have properties, fetch amenities separately
      let amenitiesData: any[] = [];
      if (propertiesData && propertiesData.length > 0) {
        try {
          const { data: amenitiesResult, error: amenitiesError } = await supabase
            .from('property_amenities')
            .select(`
              property_id,
              amenities (*)
            `);
          
          if (!amenitiesError) {
            amenitiesData = amenitiesResult || [];
          }
        } catch (amenitiesErr) {
          console.warn('Could not fetch amenities:', amenitiesErr);
          // Continue without amenities
        }
      }

      // Transform database data to match our Property interface
      const transformedProperties: Property[] = (propertiesData || []).map(item => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: item.descripcion || '',
        precio: item.precio,
        operacion: item.operacion as 'venta' | 'renta',
        tipo: item.tipo as 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina',
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
        imagenes: (item.imagenes || []).map((img: string) => 
          img.includes('?') ? img : `${img}?auto=compress&cs=tinysrgb&w=800`
        ),
        disponible: item.disponible ?? true,
        destacado: item.destacado || false,
        id_interno: item.id_interno || null,
        map_mode: (item.map_mode as 'pin' | 'area') || 'pin',
        area_radius: item.area_radius || 500,
        fecha_creacion: item.fecha_creacion || new Date().toISOString(),
        fecha_actualizacion: item.fecha_actualizacion || new Date().toISOString(),
        amenidades: amenitiesData
          .filter((pa: any) => pa.property_id === item.id)
          .map((pa: any) => pa.amenities)
          .filter(Boolean) || [],
      }));

      console.log('Properties loaded:', transformedProperties.length);
      console.log('Properties with map modes:', transformedProperties.map(p => ({
        id: p.id,
        titulo: p.titulo,
        map_mode: p.map_mode,
        area_radius: p.area_radius
      })));
      setProperties(transformedProperties);
    } catch (err) {
      console.error('Error fetching properties:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar propiedades';
      setError(errorMessage);
      
      // Fallback to mock data if there's an error
      console.warn('Falling back to mock data due to error');
      const mockProperties: Property[] = [
        {
          id: '1',
          titulo: 'Exclusivo Departamento en Polanco',
          descripcion: 'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad.',
          precio: 8500000,
          operacion: 'venta',
          tipo: 'departamento',
          recamaras: 2,
          banos: 2,
          estacionamientos: 1,
          metros_construccion: 120,
          metros_terreno: 0,
          antiguedad: 5,
          amueblado: false,
          direccion: 'Emilio Castelar 135',
          colonia: 'Polanco V Sección',
          ciudad: 'Ciudad de México',
          estado: 'Ciudad de México',
          codigo_postal: '11560',
          latitud: 19.4324,
          longitud: -99.1962,
          imagenes: [
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          disponible: true,
          destacado: true,
          map_mode: 'pin' as const,
          area_radius: 500,
          fecha_creacion: '2025-01-15T00:00:00Z',
          fecha_actualizacion: '2025-01-15T00:00:00Z',
          amenidades: []
        },
        {
          id: '2',
          titulo: 'Casa con jardín en Coyoacán',
          descripcion: 'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán.',
          precio: 12500000,
          operacion: 'venta',
          tipo: 'casa',
          recamaras: 4,
          banos: 3,
          estacionamientos: 2,
          metros_construccion: 280,
          metros_terreno: 350,
          antiguedad: 15,
          amueblado: false,
          direccion: 'Francisco Sosa 205',
          colonia: 'Del Carmen',
          ciudad: 'Ciudad de México',
          estado: 'Ciudad de México',
          codigo_postal: '04100',
          latitud: 19.3434,
          longitud: -99.1663,
          imagenes: [
            'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          disponible: true,
          destacado: true,
          map_mode: 'pin' as const,
          area_radius: 500,
          fecha_creacion: '2025-01-10T00:00:00Z',
          fecha_actualizacion: '2025-01-10T00:00:00Z',
          amenidades: []
        },
        {
          id: '3',
          titulo: 'Moderno Loft en Condesa',
          descripcion: 'Espectacular loft completamente amueblado en el corazón de la Condesa.',
          precio: 18000,
          operacion: 'renta',
          tipo: 'departamento',
          recamaras: 1,
          banos: 1,
          estacionamientos: 1,
          metros_construccion: 75,
          metros_terreno: 0,
          antiguedad: 2,
          amueblado: true,
          direccion: 'Tamaulipas 66',
          colonia: 'Condesa',
          ciudad: 'Ciudad de México',
          estado: 'Ciudad de México',
          codigo_postal: '06140',
          latitud: 19.4134,
          longitud: -99.1763,
          imagenes: [
            'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          disponible: true,
          destacado: false,
          map_mode: 'pin' as const,
          area_radius: 500,
          fecha_creacion: '2025-02-25T00:00:00Z',
          fecha_actualizacion: '2025-02-25T00:00:00Z',
          amenidades: []
        }
      ];
      setProperties(mockProperties);
    } finally {
      setLoading(false);
    }
  };

  const createProperty = async (propertyData: Partial<Property>, amenityIds: string[] = []) => {
    try {
      console.log('Creating property with data:', propertyData);
      console.log('Amenity IDs:', amenityIds);

      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
      }

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
        id_interno: propertyData.id_interno?.trim() || null,
        map_mode: propertyData.map_mode || 'pin',
        area_radius: Number(propertyData.area_radius) || 500,
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

      // Use RPC function to bypass RLS for admin operations
      const { data, error } = await supabase.rpc('admin_create_property', {
        property_data: insertData
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }

      console.log('Property created successfully:', data);

      // Insert amenities relationships using RPC
      if (amenityIds.length > 0 && data && data.length > 0) {
        const propertyId = data[0].id;
        
        const { error: amenitiesError } = await supabase.rpc('admin_set_property_amenities', {
          property_id: propertyId,
          amenity_ids: amenityIds
        });

        if (amenitiesError) {
          console.error('Error inserting amenities:', amenitiesError);
          throw amenitiesError;
        }
      }

      // Refresh the properties list
      await fetchProperties();
      return data && data.length > 0 ? data[0] : null;
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

      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
      }

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
        id_interno: propertyData.id_interno?.trim() || null,
        map_mode: propertyData.map_mode || 'pin',
        area_radius: Number(propertyData.area_radius) || 500,
      };

      console.log('Formatted update data:', updateData);

      // Use RPC function to bypass RLS for admin operations
      const { data, error } = await supabase.rpc('admin_update_property', {
        property_id: id,
        property_data: updateData
      });

      if (error) {
        console.error('Supabase RPC error:', error);
        throw error;
      }

      console.log('Property updated successfully:', data);

      // Update amenities relationships using RPC
      const { error: amenitiesError } = await supabase.rpc('admin_set_property_amenities', {
        property_id: id,
        amenity_ids: amenityIds
      });

      if (amenitiesError) {
        console.error('Error updating amenities:', amenitiesError);
        throw amenitiesError;
      }

      // Refresh the properties list
      await fetchProperties();
      return data && data.length > 0 ? data[0] : null;
    } catch (err) {
      console.error('Update property error:', err);
      throw new Error(err instanceof Error ? err.message : 'Error updating property');
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        throw new Error('Supabase no está configurado. Por favor, configura las variables de entorno.');
      }

      // Use RPC function to bypass RLS for admin operations
      const { error } = await supabase.rpc('admin_delete_property', {
        property_id: id
      });

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

      // Check if Supabase is configured
      if (!supabaseConfig.hasUrl || !supabaseConfig.hasKey) {
        console.warn('Supabase not configured, using mock amenities');
        setAmenities([]);
        setLoading(false);
        return;
      }

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
      console.error('Error fetching amenities:', err);
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