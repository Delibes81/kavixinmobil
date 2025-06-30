/*
  # Crear tabla de propiedades

  1. Nueva Tabla
    - `properties`
      - `id` (uuid, primary key)
      - `title` (text, título de la propiedad)
      - `description` (text, descripción detallada)
      - `price` (numeric, precio de la propiedad)
      - `operation` (text, 'venta' o 'renta')
      - `type` (text, tipo de propiedad)
      - `area` (numeric, superficie en m²)
      - `bedrooms` (integer, número de recámaras)
      - `bathrooms` (integer, número de baños)
      - `parking` (integer, espacios de estacionamiento)
      - `is_furnished` (boolean, si está amueblada)
      - `location` (jsonb, información de ubicación)
      - `images` (text[], array de URLs de imágenes)
      - `features` (text[], array de amenidades)
      - `created_at` (timestamptz, fecha de creación)
      - `updated_at` (timestamptz, fecha de actualización)

  2. Seguridad
    - Habilitar RLS en la tabla `properties`
    - Agregar políticas para lectura pública
    - Agregar políticas para escritura autenticada
*/

-- Crear tabla de propiedades
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

-- Habilitar RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (cualquiera puede ver las propiedades)
CREATE POLICY "Propiedades son públicamente visibles"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Política para inserción (solo usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden insertar propiedades"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Política para actualización (solo usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden actualizar propiedades"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para eliminación (solo usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden eliminar propiedades"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
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
  'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad. Cuenta con amplios espacios, iluminación natural, y vistas panorámicas impresionantes.',
  8500000,
  'venta',
  'departamento',
  120,
  2,
  2,
  1,
  false,
  '{"calle": "Emilio Castelar", "numero": "135", "colonia": "Polanco V Sección", "alcaldia": "Miguel Hidalgo", "codigoPostal": "11560", "estado": "Ciudad de México", "lat": 19.4324, "lng": -99.1962}',
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
  'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán. Perfecta para familias que buscan espacio y comodidad.',
  12500000,
  'venta',
  'casa',
  280,
  4,
  3,
  2,
  false,
  '{"calle": "Francisco Sosa", "numero": "205", "colonia": "Del Carmen", "alcaldia": "Coyoacán", "codigoPostal": "04100", "estado": "Ciudad de México", "lat": 19.3434, "lng": -99.1663}',
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
  'Espectacular loft completamente amueblado en el corazón de la Condesa. Ideal para ejecutivos o parejas. Diseño contemporáneo, espacios abiertos y excelente ubicación.',
  18000,
  'renta',
  'departamento',
  75,
  1,
  1,
  1,
  true,
  '{"calle": "Tamaulipas", "numero": "66", "colonia": "Condesa", "alcaldia": "Cuauhtémoc", "codigoPostal": "06140", "estado": "Ciudad de México", "lat": 19.4134, "lng": -99.1763}',
  ARRAY[
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
    'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg'
  ],
  ARRAY['Amueblado', 'Internet incluido', 'Vigilancia', 'Roof garden', 'Pet friendly', 'Cocina equipada', 'Closets amplios']
);