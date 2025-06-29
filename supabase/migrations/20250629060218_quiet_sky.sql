/*
  # Crear estructura actualizada de propiedades con tabla de amenidades

  1. Nuevas Tablas
    - `properties` - Tabla principal de propiedades con estructura mejorada
    - `amenities` - Catálogo de amenidades disponibles
    - `property_amenities` - Relación muchos a muchos entre propiedades y amenidades

  2. Campos de la tabla properties
    - Información básica: título, descripción, precio, operación, tipo
    - Características: recámaras, baños, estacionamientos, metros
    - Ubicación: dirección completa con coordenadas
    - Estado: disponible, destacado
    - Timestamps automáticos

  3. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para lectura pública y escritura autenticada
*/

-- Eliminar tabla anterior si existe
DROP TABLE IF EXISTS properties CASCADE;

-- Crear tabla de amenidades
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  icono VARCHAR(50), -- Para almacenar nombre del icono de Lucide
  categoria VARCHAR(50), -- ej: 'seguridad', 'recreacion', 'servicios'
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla principal de propiedades
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT DEFAULT '',
  precio NUMERIC(12,2) NOT NULL DEFAULT 0,
  operacion VARCHAR(10) NOT NULL DEFAULT 'venta' CHECK (operacion IN ('venta', 'renta')),
  tipo VARCHAR(20) NOT NULL DEFAULT 'casa' CHECK (tipo IN ('casa', 'departamento', 'local', 'terreno', 'oficina')),
  recamaras INTEGER DEFAULT 0,
  banos INTEGER DEFAULT 0,
  estacionamientos INTEGER DEFAULT 0,
  metros_construccion NUMERIC(8,2) DEFAULT 0,
  metros_terreno NUMERIC(8,2) DEFAULT 0,
  antiguedad INTEGER DEFAULT 0, -- en años
  amueblado BOOLEAN DEFAULT FALSE,
  direccion TEXT,
  colonia VARCHAR(100),
  ciudad VARCHAR(100) DEFAULT 'Ciudad de México',
  estado VARCHAR(100) DEFAULT 'Ciudad de México',
  codigo_postal VARCHAR(10),
  latitud DOUBLE PRECISION,
  longitud DOUBLE PRECISION,
  imagenes TEXT[] DEFAULT '{}',
  disponible BOOLEAN DEFAULT TRUE,
  destacado BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de relación propiedades-amenidades
CREATE TABLE IF NOT EXISTS property_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP DEFAULT NOW(),
  UNIQUE(property_id, amenity_id)
);

-- Habilitar RLS en todas las tablas
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;

-- Políticas para properties
CREATE POLICY "Propiedades son públicamente visibles"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Usuarios autenticados pueden insertar propiedades"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden actualizar propiedades"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Usuarios autenticados pueden eliminar propiedades"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Políticas para amenities
CREATE POLICY "Amenidades son públicamente visibles"
  ON amenities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar amenidades"
  ON amenities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para property_amenities
CREATE POLICY "Relaciones propiedad-amenidad son públicamente visibles"
  ON property_amenities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Usuarios autenticados pueden gestionar relaciones propiedad-amenidad"
  ON property_amenities
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Función para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION update_fecha_actualizacion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar fecha_actualizacion en properties
CREATE TRIGGER update_properties_fecha_actualizacion
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_fecha_actualizacion();

-- Insertar amenidades predefinidas
INSERT INTO amenities (nombre, descripcion, icono, categoria) VALUES
-- Seguridad
('Seguridad 24/7', 'Vigilancia las 24 horas del día', 'Shield', 'seguridad'),
('Cámaras de seguridad', 'Sistema de videovigilancia', 'Camera', 'seguridad'),
('Control de acceso', 'Sistema de acceso controlado', 'Key', 'seguridad'),
('Intercomunicador', 'Sistema de intercomunicación', 'Phone', 'seguridad'),

-- Recreación
('Alberca', 'Piscina para uso de residentes', 'Waves', 'recreacion'),
('Gimnasio', 'Área de ejercicio equipada', 'Dumbbell', 'recreacion'),
('Jardín', 'Áreas verdes y jardines', 'Trees', 'recreacion'),
('Terraza', 'Área de terraza', 'Home', 'recreacion'),
('Roof garden', 'Jardín en azotea', 'TreePine', 'recreacion'),
('Área de BBQ', 'Zona para asados', 'Flame', 'recreacion'),
('Cancha de tenis', 'Cancha de tenis', 'Circle', 'recreacion'),
('Área de juegos infantiles', 'Zona de juegos para niños', 'Baby', 'recreacion'),
('Spa', 'Área de spa y relajación', 'Heart', 'recreacion'),
('Sauna', 'Sauna disponible', 'Thermometer', 'recreacion'),
('Jacuzzi', 'Jacuzzi disponible', 'Waves', 'recreacion'),

-- Servicios
('Elevador', 'Acceso por elevador', 'ArrowUp', 'servicios'),
('Internet incluido', 'Servicio de internet incluido', 'Wifi', 'servicios'),
('Aire acondicionado', 'Sistema de aire acondicionado', 'Wind', 'servicios'),
('Calefacción', 'Sistema de calefacción', 'Thermometer', 'servicios'),
('Lavandería', 'Servicio de lavandería', 'Shirt', 'servicios'),
('Valet parking', 'Servicio de valet parking', 'Car', 'servicios'),
('Servicio de concierge', 'Servicio de conserjería', 'User', 'servicios'),
('Cisterna', 'Sistema de cisterna', 'Droplets', 'servicios'),

-- Características
('Cocina integral', 'Cocina completamente equipada', 'ChefHat', 'caracteristicas'),
('Área de lavado', 'Zona dedicada para lavado', 'Shirt', 'caracteristicas'),
('Estudio', 'Área de estudio u oficina', 'BookOpen', 'caracteristicas'),
('Cuarto de servicio', 'Habitación de servicio', 'Home', 'caracteristicas'),
('Bodega', 'Espacio de almacenamiento', 'Package', 'caracteristicas'),
('Closets amplios', 'Espacios de almacenamiento amplios', 'Package', 'caracteristicas'),
('Balcón', 'Balcón disponible', 'Home', 'caracteristicas'),
('Vista panorámica', 'Vista panorámica desde la propiedad', 'Eye', 'caracteristicas'),
('Chimenea', 'Chimenea en la propiedad', 'Flame', 'caracteristicas'),
('Pet friendly', 'Se permiten mascotas', 'Heart', 'caracteristicas'),
('Acceso para discapacitados', 'Acceso adaptado para discapacitados', 'Accessibility', 'caracteristicas');

-- Insertar propiedades de ejemplo
INSERT INTO properties (
  titulo,
  descripcion,
  precio,
  operacion,
  tipo,
  recamaras,
  banos,
  estacionamientos,
  metros_construccion,
  metros_terreno,
  antiguedad,
  amueblado,
  direccion,
  colonia,
  ciudad,
  estado,
  codigo_postal,
  latitud,
  longitud,
  imagenes,
  destacado
) VALUES 
(
  'Exclusivo Departamento en Polanco',
  'Hermoso departamento con acabados de lujo, ubicado en una de las zonas más exclusivas de la ciudad. Cuenta con amplios espacios, iluminación natural, y vistas panorámicas impresionantes. La cocina está equipada con electrodomésticos de alta gama y el baño principal incluye una bañera de hidromasaje.',
  8500000,
  'venta',
  'departamento',
  2,
  2,
  1,
  120.00,
  0,
  5,
  false,
  'Emilio Castelar 135, Depto 301',
  'Polanco V Sección',
  'Ciudad de México',
  'Ciudad de México',
  '11560',
  19.4324,
  -99.1962,
  ARRAY[
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg',
    'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg'
  ],
  true
),
(
  'Casa con jardín en Coyoacán',
  'Encantadora casa estilo colonial con amplio jardín en una tranquila calle de Coyoacán. Perfecta para familias que buscan espacio y comodidad. Cuenta con sala de estar, comedor amplio, cocina renovada y un hermoso jardín trasero ideal para reuniones familiares.',
  12500000,
  'venta',
  'casa',
  4,
  3,
  2,
  280.00,
  350.00,
  15,
  false,
  'Francisco Sosa 205',
  'Del Carmen',
  'Ciudad de México',
  'Ciudad de México',
  '04100',
  19.3434,
  -99.1663,
  ARRAY[
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
    'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
    'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg',
    'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg',
    'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
  ],
  true
),
(
  'Moderno Loft en Condesa',
  'Espectacular loft completamente amueblado en el corazón de la Condesa. Ideal para ejecutivos o parejas. Diseño contemporáneo, espacios abiertos y excelente ubicación a pasos de restaurantes, cafés y parques.',
  18000,
  'renta',
  'departamento',
  1,
  1,
  1,
  75.00,
  0,
  2,
  true,
  'Tamaulipas 66, PH-A',
  'Condesa',
  'Ciudad de México',
  'Ciudad de México',
  '06140',
  19.4134,
  -99.1763,
  ARRAY[
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg',
    'https://images.pexels.com/photos/2598638/pexels-photo-2598638.jpeg'
  ],
  false
);

-- Insertar relaciones de amenidades para las propiedades de ejemplo
-- Departamento en Polanco (primera propiedad)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT 
  (SELECT id FROM properties WHERE titulo = 'Exclusivo Departamento en Polanco'),
  id
FROM amenities 
WHERE nombre IN ('Elevador', 'Seguridad 24/7', 'Gimnasio', 'Alberca', 'Terraza', 'Cocina integral', 'Área de lavado');

-- Casa en Coyoacán (segunda propiedad)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT 
  (SELECT id FROM properties WHERE titulo = 'Casa con jardín en Coyoacán'),
  id
FROM amenities 
WHERE nombre IN ('Jardín', 'Estudio', 'Cuarto de servicio', 'Bodega', 'Terraza', 'Seguridad 24/7', 'Cisterna');

-- Loft en Condesa (tercera propiedad)
INSERT INTO property_amenities (property_id, amenity_id)
SELECT 
  (SELECT id FROM properties WHERE titulo = 'Moderno Loft en Condesa'),
  id
FROM amenities 
WHERE nombre IN ('Internet incluido', 'Cámaras de seguridad', 'Roof garden', 'Pet friendly', 'Cocina integral', 'Closets amplios');