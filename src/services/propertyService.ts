import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Property, PropertyFormData, SearchFilters } from '../types';

export class PropertyService {
  // Get all properties with optional filters
  static async getProperties(filters?: SearchFilters): Promise<Property[]> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se pueden cargar las propiedades.');
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
        throw new Error(`Error al cargar las propiedades: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProperties:', error);
      throw error;
    }
  }

  // Get a single property by ID
  static async getPropertyById(id: string): Promise<Property | null> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se puede cargar la propiedad.');
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
        throw new Error(`Error al cargar la propiedad: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error in getPropertyById:', error);
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

      console.log('Attempting to delete property with ID:', id);

      // First check if the property exists
      const { data: existingProperty, error: fetchError } = await supabase
        .from('properties')
        .select('id')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new Error('La propiedad no existe o ya fue eliminada');
        }
        console.error('Error checking property existence:', fetchError);
        throw new Error(`Error al verificar la propiedad: ${fetchError.message}`);
      }

      if (!existingProperty) {
        throw new Error('La propiedad no existe');
      }

      // Delete related property views first (due to foreign key constraint)
      const { error: viewsError } = await supabase
        .from('property_views')
        .delete()
        .eq('property_id', id);

      if (viewsError) {
        console.warn('Error deleting property views:', viewsError);
        // Continue with property deletion even if views deletion fails
      }

      // Delete related contacts (set property_id to null due to foreign key constraint)
      const { error: contactsError } = await supabase
        .from('contacts')
        .update({ property_id: null })
        .eq('property_id', id);

      if (contactsError) {
        console.warn('Error updating contacts:', contactsError);
        // Continue with property deletion even if contacts update fails
      }

      // Now delete the property
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting property:', deleteError);
        throw new Error(`Error al eliminar la propiedad: ${deleteError.message}`);
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
        throw new Error('Supabase no está configurado. No se pueden buscar propiedades.');
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
        throw new Error(`Error al buscar propiedades: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchProperties:', error);
      throw error;
    }
  }

  // Get featured properties (most recent)
  static async getFeaturedProperties(limit: number = 3): Promise<Property[]> {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Supabase no está configurado. No se pueden cargar las propiedades destacadas.');
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching featured properties:', error);
        throw new Error(`Error al cargar las propiedades destacadas: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getFeaturedProperties:', error);
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