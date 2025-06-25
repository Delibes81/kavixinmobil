/*
  # Create Properties Database Schema

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `price` (numeric, not null)
      - `operation` (text, not null) - 'venta' or 'renta'
      - `type` (text, not null) - 'casa', 'departamento', 'local', 'terreno'
      - `area` (numeric, not null)
      - `bedrooms` (integer, not null, default 0)
      - `bathrooms` (integer, not null, default 0)
      - `parking` (integer, not null, default 0)
      - `is_furnished` (boolean, default false)
      - `address` (text, not null)
      - `city` (text, not null)
      - `state` (text, not null)
      - `latitude` (numeric, not null)
      - `longitude` (numeric, not null)
      - `images` (text array)
      - `features` (text array)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `properties` table
    - Add policies for public read access
    - Add policies for authenticated users to manage properties

  3. Indexes
    - Add indexes for common query patterns
    - Add spatial index for location-based searches
*/

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price > 0),
  operation text NOT NULL CHECK (operation IN ('venta', 'renta')),
  type text NOT NULL CHECK (type IN ('casa', 'departamento', 'local', 'terreno')),
  area numeric NOT NULL CHECK (area > 0),
  bedrooms integer NOT NULL DEFAULT 0 CHECK (bedrooms >= 0),
  bathrooms integer NOT NULL DEFAULT 0 CHECK (bathrooms >= 0),
  parking integer NOT NULL DEFAULT 0 CHECK (parking >= 0),
  is_furnished boolean DEFAULT false,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude numeric NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude numeric NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to insert properties
CREATE POLICY "Authenticated users can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for authenticated users to update properties
CREATE POLICY "Authenticated users can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for authenticated users to delete properties
CREATE POLICY "Authenticated users can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- Create a spatial index for location-based queries (using PostGIS if available)
-- This will help with proximity searches
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data from the mock properties
INSERT INTO properties (
  id,
  title,
  description,
  price,
  operation,
  type,
  area,
  bedrooms,
  bathrooms,
  parking,
  is_furnished,
  address,
  city,
  state,
  latitude,
  longitude,
  images,
  features,
  created_at,
  updated_at
) VALUES 
(
  '1',
  'Exclusivo Departamento en Polanco',
  'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad. Cuenta con amplios espacios, iluminación natural, y vistas panorámicas impresionantes. La cocina está equipada con electrodomésticos de alta gama y el baño principal incluye una bañera de hidromasaje. El edificio ofrece seguridad 24/7, gimnasio, alberca y área de BBQ.',
  8500000,
  'venta',
  'departamento',
  120,
  2,
  2,
  1,
  false,
  'Calle Emilio Castelar 135',
  'Ciudad de México',
  'CDMX',
  19.4324,
  -99.1962,
  ARRAY[
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
  ],
  ARRAY[
    'Elevador',
    'Seguridad 24/7',
    'Gimnasio',
    'Alberca',
    'Terraza',
    'Cocina integral',
    'Área de lavado'
  ],
  '2025-03-15'::timestamptz,
  '2025-03-20'::timestamptz
),
(
  '2',
  'Casa con jardín en Coyoacán',
  'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán. Perfecta para familias que buscan espacio y comodidad. Cuenta con sala de estar, comedor amplio, cocina renovada y un hermoso jardín trasero ideal para reuniones familiares.',
  12500000,
  'venta',
  'casa',
  280,
  4,
  3,
  2,
  false,
  'Francisco Sosa 205',
  'Ciudad de México',
  'CDMX',
  19.3434,
  -99.1663,
  ARRAY[
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
    'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
    'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
    'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
  ],
  ARRAY[
    'Jardín',
    'Estudio',
    'Cuarto de servicio',
    'Bodega',
    'Terraza',
    'Seguridad',
    'Cisterna'
  ],
  '2025-01-10'::timestamptz,
  '2025-03-18'::timestamptz
),
(
  '3',
  'Moderno Loft en Condesa',
  'Espectacular loft completamente amueblado en el corazón de la Condesa. Ideal para ejecutivos o parejas. Diseño contemporáneo, espacios abiertos y excelente ubicación a pasos de restaurantes, cafés y parques.',
  18000,
  'renta',
  'departamento',
  75,
  1,
  1,
  1,
  true,
  'Av. Tamaulipas 66',
  'Ciudad de México',
  'CDMX',
  19.4134,
  -99.1763,
  ARRAY[
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
    'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg'
  ],
  ARRAY[
    'Amueblado',
    'Internet incluido',
    'Vigilancia',
    'Roof garden',
    'Pet friendly',
    'Cocina equipada',
    'Closets amplios'
  ],
  '2025-02-25'::timestamptz,
  '2025-03-15'::timestamptz
);