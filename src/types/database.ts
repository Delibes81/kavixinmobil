export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          title: string
          description: string
          price: number
          operation: 'venta' | 'renta'
          type: 'casa' | 'departamento' | 'local' | 'terreno'
          area: number
          bedrooms: number
          bathrooms: number
          parking: number
          is_furnished: boolean
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          images: string[]
          features: string[]
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          price: number
          operation: 'venta' | 'renta'
          type: 'casa' | 'departamento' | 'local' | 'terreno'
          area: number
          bedrooms?: number
          bathrooms?: number
          parking?: number
          is_furnished?: boolean
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          images?: string[]
          features?: string[]
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          price?: number
          operation?: 'venta' | 'renta'
          type?: 'casa' | 'departamento' | 'local' | 'terreno'
          area?: number
          bedrooms?: number
          bathrooms?: number
          parking?: number
          is_furnished?: boolean
          address?: string
          city?: string
          state?: string
          latitude?: number
          longitude?: number
          images?: string[]
          features?: string[]
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          subject: string
          message: string
          property_id: string | null
          status: 'pending' | 'contacted' | 'resolved' | 'closed'
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          subject: string
          message: string
          property_id?: string | null
          status?: 'pending' | 'contacted' | 'resolved' | 'closed'
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          subject?: string
          message?: string
          property_id?: string | null
          status?: 'pending' | 'contacted' | 'resolved' | 'closed'
          created_at?: string | null
          updated_at?: string | null
        }
      }
      property_views: {
        Row: {
          id: string
          property_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          property_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string | null
        }
      }
    }
    Views: {
      property_analytics: {
        Row: {
          id: string | null
          title: string | null
          city: string | null
          operation: string | null
          type: string | null
          price: number | null
          total_views: number | null
          unique_users: number | null
          unique_visitors: number | null
          last_viewed: string | null
          created_at: string | null
        }
      }
      popular_properties: {
        Row: {
          id: string | null
          title: string | null
          description: string | null
          price: number | null
          operation: string | null
          type: string | null
          area: number | null
          bedrooms: number | null
          bathrooms: number | null
          parking: number | null
          is_furnished: boolean | null
          address: string | null
          city: string | null
          state: string | null
          latitude: number | null
          longitude: number | null
          images: string[] | null
          features: string[] | null
          created_at: string | null
          updated_at: string | null
          total_views: number | null
        }
      }
    }
    Functions: {
      search_properties: {
        Args: {
          search_query?: string
          operation_filter?: string
          type_filter?: string
          min_price?: number
          max_price?: number
          min_bedrooms?: number
          min_bathrooms?: number
          min_parking?: number
          city_filter?: string
          limit_count?: number
          offset_count?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          price: number
          operation: string
          type: string
          area: number
          bedrooms: number
          bathrooms: number
          parking: number
          is_furnished: boolean
          address: string
          city: string
          state: string
          latitude: number
          longitude: number
          images: string[]
          features: string[]
          created_at: string
          updated_at: string
          search_rank: number
        }[]
      }
    }
  }
}