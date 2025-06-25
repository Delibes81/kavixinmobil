import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, PropertyFormData, SearchFilters } from '../types';

// Mock data for when Supabase is not configured
const mockProperties: Property[] = [
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    title: 'Exclusivo Departamento en Polanco',
    description: 'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad. Cuenta con amplios espacios, iluminación natural, y vistas panorámicas impresionantes. La cocina está equipada con electrodomésticos de alta gama y el baño principal incluye una bañera de hidromasaje. El edificio ofrece seguridad 24/7, gimnasio, alberca y área de BBQ.',
    price: 8500000,
    operation: 'venta',
    type: 'departamento',
    area: 120,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    is_furnished: false,
    address: 'Calle Emilio Castelar 135',
    city: 'Ciudad de México',
    state: 'CDMX',
    latitude: 19.4324,
    longitude: -99.1962,
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
    ],
    features: [
      'Elevador',
      'Seguridad 24/7',
      'Gimnasio',
      'Alberca',
      'Terraza',
      'Cocina integral',
      'Área de lavado'
    ],
    created_at: '2025-03-15T00:00:00Z',
    updated_at: '2025-03-20T00:00:00Z'
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    title: 'Casa con jardín en Coyoacán',
    description: 'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán. Perfecta para familias que buscan espacio y comodidad. Cuenta con sala de estar, comedor amplio, cocina renovada y un hermoso jardín trasero ideal para reuniones familiares.',
    price: 12500000,
    operation: 'venta',
    type: 'casa',
    area: 280,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    is_furnished: false,
    address: 'Francisco Sosa 205',
    city: 'Ciudad de México',
    state: 'CDMX',
    latitude: 19.3434,
    longitude: -99.1663,
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
    ],
    features: [
      'Jardín',
      'Estudio',
      'Cuarto de servicio',
      'Bodega',
      'Terraza',
      'Seguridad',
      'Cisterna'
    ],
    created_at: '2025-01-10T00:00:00Z',
    updated_at: '2025-03-18T00:00:00Z'
  },
  {
    id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
    title: 'Moderno Loft en Condesa',
    description: 'Espectacular loft completamente amueblado en el corazón de la Condesa. Ideal para ejecutivos o parejas. Diseño contemporáneo, espacios abiertos y excelente ubicación a pasos de restaurantes, cafés y parques.',
    price: 18000,
    operation: 'renta',
    type: 'departamento',
    area: 75,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    is_furnished: true,
    address: 'Av. Tamaulipas 66',
    city: 'Ciudad de México',
    state: 'CDMX',
    latitude: 19.4134,
    longitude: -99.1763,
    images: [
      'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
      'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
      'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg'
    ],
    features: [
      'Amueblado',
      'Internet incluido',
      'Vigilancia',
      'Roof garden',
      'Pet friendly',
      'Cocina equipada',
      'Closets amplios'
    ],
    created_at: '2025-02-25T00:00:00Z',
    updated_at: '2025-03-15T00:00:00Z'
  }
];

export class PropertyService {
  // Get all properties with optional filters
  static async getProperties(filters?: SearchFilters): Promise<Property[]> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock data');
        return this.filterMockProperties(mockProperties, filters);
      }

      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.operation) {
        query = query.eq('operation', filters.operation);
      }
      
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      
      if (filters?.bedrooms) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      
      if (filters?.bathrooms) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
      
      if (filters?.parking) {
        query = query.gte('parking', filters.parking);
      }
      
      if (filters?.location) {
        query = query.or(`city.ilike.%${filters.location}%,address.ilike.%${filters.location}%,state.ilike.%${filters.location}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProperties:', error);
      // Only fallback to mock data if Supabase is not configured
      if (!isSupabaseConfigured) {
        return this.filterMockProperties(mockProperties, filters);
      }
      throw error;
    }
  }

  // Filter mock properties based on filters
  private static filterMockProperties(properties: Property[], filters?: SearchFilters): Property[] {
    if (!filters) return properties;

    return properties.filter(property => {
      if (filters.operation && property.operation !== filters.operation) return false;
      if (filters.type && property.type !== filters.type) return false;
      if (filters.minPrice && property.price < filters.minPrice) return false;
      if (filters.maxPrice && property.price > filters.maxPrice) return false;
      if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false;
      if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false;
      if (filters.parking && property.parking < filters.parking) return false;
      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        const searchableText = `${property.city} ${property.address} ${property.state}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) return false;
      }
      return true;
    });
  }

  // Get a single property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock data');
        return mockProperties.find(p => p.id === id) || null;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Property not found
        }
        console.error('Error fetching property:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getPropertyById:', error);
      // Only fallback to mock data if Supabase is not configured
      if (!isSupabaseConfigured) {
        return mockProperties.find(p => p.id === id) || null;
      }
      throw error;
    }
  }

  // Create a new property
  static async createProperty(propertyData: PropertyFormData): Promise<Property> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se pueden crear propiedades.');
      }

      console.log('Creating property with data:', propertyData);

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) {
        console.error('Error creating property:', error);
        throw new Error(`Error al crear la propiedad: ${error.message}`);
      }

      console.log('Property created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createProperty:', error);
      throw error;
    }
  }

  // Update an existing property
  static async updateProperty(id: string, propertyData: Partial<PropertyFormData>): Promise<Property> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se pueden actualizar propiedades.');
      }

      console.log('Updating property with ID:', id, 'Data:', propertyData);

      // Add updated_at timestamp
      const updateData = {
        ...propertyData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating property:', error);
        throw new Error(`Error al actualizar la propiedad: ${error.message}`);
      }

      if (!data) {
        throw new Error('No se encontró la propiedad para actualizar');
      }

      console.log('Property updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateProperty:', error);
      throw error;
    }
  }

  // Delete a property
  static async deleteProperty(id: string): Promise<void> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se pueden eliminar propiedades.');
      }

      console.log('Deleting property with ID:', id);

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting property:', error);
        throw new Error(`Error al eliminar la propiedad: ${error.message}`);
      }

      console.log('Property deleted successfully');
    } catch (error) {
      console.error('Error in deleteProperty:', error);
      throw error;
    }
  }

  // Search properties using the database function
  static async searchProperties(
    searchQuery?: string,
    filters?: SearchFilters,
    limit: number = 20,
    offset: number = 0
  ): Promise<Property[]> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock data');
        return this.filterMockProperties(mockProperties, filters);
      }

      const { data, error } = await supabase.rpc('search_properties', {
        search_query: searchQuery || null,
        operation_filter: filters?.operation || null,
        type_filter: filters?.type || null,
        min_price: filters?.minPrice || null,
        max_price: filters?.maxPrice || null,
        min_bedrooms: filters?.bedrooms || null,
        min_bathrooms: filters?.bathrooms || null,
        min_parking: filters?.parking || null,
        city_filter: filters?.location || null,
        limit_count: limit,
        offset_count: offset
      });

      if (error) {
        console.error('Error searching properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchProperties:', error);
      // Only fallback to mock data if Supabase is not configured
      if (!isSupabaseConfigured) {
        return this.filterMockProperties(mockProperties, filters);
      }
      throw error;
    }
  }

  // Get featured properties (most recent)
  static async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, using mock data');
        return mockProperties.slice(0, limit);
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured properties:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedProperties:', error);
      // Only fallback to mock data if Supabase is not configured
      if (!isSupabaseConfigured) {
        return mockProperties.slice(0, limit);
      }
      throw error;
    }
  }

  // Record a property view
  static async recordPropertyView(propertyId: string): Promise<void> {
    try {
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured, skipping view tracking');
        return;
      }

      const { error } = await supabase
        .from('property_views')
        .insert([{
          property_id: propertyId,
          ip_address: null, // Could be populated with actual IP
          user_agent: navigator.userAgent
        }]);

      if (error) {
        console.error('Error recording property view:', error);
        // Don't throw error for view tracking failures
      }
    } catch (error) {
      console.error('Error in recordPropertyView:', error);
      // Don't throw error for view tracking failures
    }
  }
}