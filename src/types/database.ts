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
          description: string | null
          price: number
          operation: 'venta' | 'renta'
          type: 'casa' | 'departamento' | 'local' | 'terreno'
          area: number | null
          bedrooms: number | null
          bathrooms: number | null
          parking: number | null
          is_furnished: boolean | null
          location: Json | null
          images: string[] | null
          features: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          price: number
          operation?: 'venta' | 'renta'
          type?: 'casa' | 'departamento' | 'local' | 'terreno'
          area?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          parking?: number | null
          is_furnished?: boolean | null
          location?: Json | null
          images?: string[] | null
          features?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          price?: number
          operation?: 'venta' | 'renta'
          type?: 'casa' | 'departamento' | 'local' | 'terreno'
          area?: number | null
          bedrooms?: number | null
          bathrooms?: number | null
          parking?: number | null
          is_furnished?: boolean | null
          location?: Json | null
          images?: string[] | null
          features?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}