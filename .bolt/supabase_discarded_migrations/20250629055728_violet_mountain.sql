/*
  # Create complete properties table

  1. New Tables
    - `properties`
      - `id` (uuid, primary key, auto-generated)
      - `title` (text, required)
      - `description` (text, optional, default empty string)
      - `price` (numeric, required, default 0)
      - `operation` (text, required, default 'venta', constrained to 'venta'|'renta')
      - `type` (text, required, default 'casa', constrained to 'casa'|'departamento'|'local'|'terreno')
      - `area` (numeric, optional, default 0)
      - `bedrooms` (integer, optional, default 0)
      - `bathrooms` (integer, optional, default 0)
      - `parking` (integer, optional, default 0)
      - `is_furnished` (boolean, optional, default false)
      - `location` (jsonb, optional, default empty object - includes numero_interior)
      - `images` (text array, optional, default empty array)
      - `features` (text array, optional, default empty array)
      - `created_at` (timestamptz, auto-generated)
      - `updated_at` (timestamptz, auto-generated, auto-updated)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for public read access
    - Add policies for authenticated users to insert, update, and delete

  3. Triggers
    - Add trigger to automatically update updated_at column

  4. Sample Data
    - Insert sample properties with complete address information including numero_interior
*/

-- Create properties table with complete schema
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  operation text NOT NULL DEFAULT 'venta' CHECK (operation IN ('venta', 'renta')),
  type text NOT NULL DEFAULT 'casa' CHECK (type IN ('casa', 'departamento', 'local', 'terreno')),
  area numeric DEFAULT 0,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  parking integer DEFAULT 0,
  is_furnished boolean DEFAULT false,
  location jsonb DEFAULT '{}',
  images text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can view properties)
CREATE POLICY "Properties are publicly readable"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert properties
CREATE POLICY "Authenticated users can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update properties
CREATE POLICY "Authenticated users can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to delete properties
CREATE POLICY "Authenticated users can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at column
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with complete address information including numero_interior
INSERT INTO properties (
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
  location,
  images,
  features
) VALUES 
(
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
  '{
    "calle": "Emilio Castelar",
    "numero": "135",
    "numero_interior": "301",
    "colonia": "Polanco V Sección",
    "alcaldia": "Miguel Hidalgo",
    "codigoPostal": "11560",
    "estado": "Ciudad de México",
    "lat": 19.4324,
    "lng": -99.1962
  }',
  ARRAY[
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
  ],
  ARRAY['Elevador', 'Seguridad 24/7', 'Gimnasio', 'Alberca', 'Terraza', 'Cocina integral', 'Área de lavado']
),
(
  'Casa con jardín en Coyoacán',
  'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán. Perfecta para familias que buscan espacio y comodidad. Cuenta con sala de estar, comedor amplio, cocina renovada y un hermoso jardín trasero ideal para reuniones familiares. La propiedad incluye cuarto de servicio, bodega y dos lugares de estacionamiento.',
  12500000,
  'venta',
  'casa',
  280,
  4,
  3,
  2,
  false,
  '{
    "calle": "Francisco Sosa",
    "numero": "205",
    "numero_interior": "",
    "colonia": "Del Carmen",
    "alcaldia": "Coyoacán",
    "codigoPostal": "04100",
    "estado": "Ciudad de México",
    "lat": 19.3434,
    "lng": -99.1663
  }',
  ARRAY[
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
    'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
    'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
    'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
  ],
  ARRAY['Jardín', 'Estudio', 'Cuarto de servicio', 'Bodega', 'Terraza', 'Seguridad', 'Cisterna']
),
(
  'Moderno Loft en Condesa',
  'Espectacular loft completamente amueblado en el corazón de la Condesa. Ideal para ejecutivos o parejas. Diseño contemporáneo, espacios abiertos y excelente ubicación a pasos de restaurantes, cafés y parques. Incluye todos los muebles, electrodomésticos y servicios. Perfecto para mudarse inmediatamente.',
  18000,
  'renta',
  'departamento',
  75,
  1,
  1,
  1,
  true,
  '{
    "calle": "Tamaulipas",
    "numero": "66",
    "numero_interior": "PH-A",
    "colonia": "Condesa",
    "alcaldia": "Cuauhtémoc",
    "codigoPostal": "06140",
    "estado": "Ciudad de México",
    "lat": 19.4134,
    "lng": -99.1763
  }',
  ARRAY[
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
    'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg'
  ],
  ARRAY['Amueblado', 'Internet incluido', 'Vigilancia', 'Roof garden', 'Pet friendly', 'Cocina equipada', 'Closets amplios']
),
(
  'Oficina en Santa Fe',
  'Moderna oficina en torre corporativa de Santa Fe. Espacio completamente acondicionado con divisiones de cristal, sistema de aire acondicionado, cableado estructurado y acceso controlado. Incluye 3 lugares de estacionamiento y acceso a amenidades del edificio.',
  45000,
  'renta',
  'local',
  150,
  0,
  2,
  3,
  false,
  '{
    "calle": "Av. Vasco de Quiroga",
    "numero": "3900",
    "numero_interior": "Piso 15, Oficina 1501",
    "colonia": "Santa Fe",
    "alcaldia": "Álvaro Obregón",
    "codigoPostal": "01210",
    "estado": "Ciudad de México",
    "lat": 19.3598,
    "lng": -99.2576
  }',
  ARRAY[
    'https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg',
    'https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg',
    'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg'
  ],
  ARRAY['Aire acondicionado', 'Elevador', 'Seguridad 24/7', 'Recepción', 'Sala de juntas', 'Internet de alta velocidad', 'Estacionamiento techado']
),
(
  'Terreno en Xochimilco',
  'Excelente terreno plano en zona residencial de Xochimilco. Ideal para desarrollo habitacional o comercial. Cuenta con todos los servicios: agua, luz, drenaje y gas natural. Frente de 20 metros y fondo de 40 metros. Excelente ubicación cerca de vías principales.',
  3500000,
  'venta',
  'terreno',
  800,
  0,
  0,
  0,
  false,
  '{
    "calle": "Prolongación División del Norte",
    "numero": "1250",
    "numero_interior": "",
    "colonia": "San Lorenzo Atemoaya",
    "alcaldia": "Xochimilco",
    "codigoPostal": "16030",
    "estado": "Ciudad de México",
    "lat": 19.2647,
    "lng": -99.1031
  }',
  ARRAY[
    'https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg',
    'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg'
  ],
  ARRAY['Servicios completos', 'Terreno plano', 'Uso de suelo mixto', 'Frente amplio', 'Cerca de transporte público']
);