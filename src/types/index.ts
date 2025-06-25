export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  operation: 'venta' | 'renta';
  type: 'casa' | 'departamento' | 'local' | 'terreno';
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  is_furnished: boolean;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images: string[];
  features: string[];
  created_at: string | null;
  updated_at: string | null;
}

export interface SearchFilters {
  operation: string;
  type: string;
  minPrice: number | null;
  maxPrice: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  location: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  property_id: string | null;
  status: 'pending' | 'contacted' | 'resolved' | 'closed';
  created_at: string | null;
  updated_at: string | null;
}

export interface PropertyView {
  id: string;
  property_id: string;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  viewed_at: string | null;
}

// Form types for creating/updating
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  operation: 'venta' | 'renta';
  type: 'casa' | 'departamento' | 'local' | 'terreno';
  area: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  is_furnished: boolean;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  images: string[];
  features: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  property_id?: string | null;
}