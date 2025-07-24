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
          titulo: string
          descripcion: string | null
          precio: number
          operacion: 'venta' | 'renta'
          tipo: 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina'
          recamaras: number | null
          banos: number | null
          estacionamientos: number | null
          metros_construccion: number | null
          metros_terreno: number | null
          antiguedad: number | null
          amueblado: boolean | null
          direccion: string | null
          colonia: string | null
          ciudad: string | null
          estado: string | null
          codigo_postal: string | null
          latitud: number | null
          longitud: number | null
          imagenes: string[] | null
          disponible: boolean | null
          destacado: boolean | null
          id_interno: string | null
          map_mode: 'pin' | 'area'
          area_radius: number
          fecha_creacion: string | null
          fecha_actualizacion: string | null
        }
        Insert: {
          id?: string
          titulo: string
          descripcion?: string | null
          precio: number
          operacion?: 'venta' | 'renta'
          tipo?: 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina'
          recamaras?: number | null
          banos?: number | null
          estacionamientos?: number | null
          metros_construccion?: number | null
          metros_terreno?: number | null
          antiguedad?: number | null
          amueblado?: boolean | null
          direccion?: string | null
          colonia?: string | null
          ciudad?: string | null
          estado?: string | null
          codigo_postal?: string | null
          latitud?: number | null
          longitud?: number | null
          imagenes?: string[] | null
          disponible?: boolean | null
          destacado?: boolean | null
          id_interno?: string | null
          map_mode?: 'pin' | 'area'
          area_radius?: number
          fecha_creacion?: string | null
          fecha_actualizacion?: string | null
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string | null
          precio?: number
          operacion?: 'venta' | 'renta'
          tipo?: 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina'
          recamaras?: number | null
          banos?: number | null
          estacionamientos?: number | null
          metros_construccion?: number | null
          metros_terreno?: number | null
          antiguedad?: number | null
          amueblado?: boolean | null
          direccion?: string | null
          colonia?: string | null
          ciudad?: string | null
          estado?: string | null
          codigo_postal?: string | null
          latitud?: number | null
          longitud?: number | null
          imagenes?: string[] | null
          disponible?: boolean | null
          destacado?: boolean | null
          id_interno?: string | null
          map_mode?: 'pin' | 'area'
          area_radius?: number
          fecha_creacion?: string | null
          fecha_actualizacion?: string | null
        }
      }
      amenities: {
        Row: {
          id: string
          nombre: string
          descripcion: string | null
          icono: string | null
          categoria: string | null
          activo: boolean | null
          fecha_creacion: string | null
        }
        Insert: {
          id?: string
          nombre: string
          descripcion?: string | null
          icono?: string | null
          categoria?: string | null
          activo?: boolean | null
          fecha_creacion?: string | null
        }
        Update: {
          id?: string
          nombre?: string
          descripcion?: string | null
          icono?: string | null
          categoria?: string | null
          activo?: boolean | null
          fecha_creacion?: string | null
        }
      }
      property_amenities: {
        Row: {
          id: string
          property_id: string | null
          amenity_id: string | null
          fecha_creacion: string | null
        }
        Insert: {
          id?: string
          property_id?: string | null
          amenity_id?: string | null
          fecha_creacion?: string | null
        }
        Update: {
          id?: string
          property_id?: string | null
          amenity_id?: string | null
          fecha_creacion?: string | null
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