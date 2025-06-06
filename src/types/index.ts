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
  isFurnished: boolean;
  location: {
    address: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  images: string[];
  features: string[];
  createdAt: string;
  updatedAt: string;
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