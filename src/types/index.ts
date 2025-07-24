export interface Property {
  id: string;
  titulo: string;
  descripcion: string;
  precio: number;
  operacion: 'venta' | 'renta';
  tipo: 'casa' | 'departamento' | 'local' | 'terreno' | 'oficina';
  recamaras: number;
  banos: number;
  estacionamientos: number;
  metros_construccion: number;
  metros_terreno: number;
  antiguedad: number;
  amueblado: boolean;
  direccion: string;
  colonia: string;
  ciudad: string;
  estado: string;
  codigo_postal: string;
  latitud: number;
  longitud: number;
  imagenes: string[];
  disponible: boolean;
  destacado: boolean;
  id_interno?: string;
  map_mode: 'pin' | 'area';
  area_radius: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  amenidades?: Amenity[];
}

export interface Amenity {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  categoria: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_id: string;
  fecha_creacion: string;
}

export interface SearchFilters {
  operacion: string;
  tipo: string;
  precio_min: number | null;
  precio_max: number | null;
  recamaras: number | null;
  banos: number | null;
  estacionamientos: number | null;
  ubicacion: string;
  metros_construccion_min: number | null;
  metros_construccion_max: number | null;
  amueblado?: boolean | null;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  imageUrl: string;
  tags: string[];
  readTime: number; // in minutes
}