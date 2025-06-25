/*
  # Complete Nova Hestia Real Estate Database Schema

  1. New Tables
    - `properties` - Main properties table with all property details
    - `contacts` - Contact form submissions and inquiries
    - `user_profiles` - Extended user profile information
    - `property_views` - Analytics tracking for property views

  2. Security
    - Enable RLS on all tables
    - Add policies for public property viewing
    - Add policies for authenticated user management
    - Add policies for contact form submissions

  3. Performance
    - Add indexes for common queries (price, location, type, etc.)
    - Add full-text search index for Spanish language
    - Add composite indexes for complex queries

  4. Advanced Features
    - Search function with full-text search capabilities
    - Nearby properties function using geospatial calculations
    - Property recommendations based on similarity scoring
    - Analytics views for property statistics
    - Auto-update triggers for timestamps
    - Auto-create user profiles on signup

  5. Sample Data
    - Insert 3 sample properties from mock data
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
  is_furnished boolean NOT NULL DEFAULT false,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  latitude numeric NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude numeric NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  images text[] NOT NULL DEFAULT '{}',
  features text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'admin')),
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_views table for analytics
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Properties are viewable by everyone"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Contacts policies
CREATE POLICY "Anyone can submit contact forms"
  ON contacts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true);

-- User profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Property views policies
CREATE POLICY "Anyone can insert property views"
  ON property_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view property analytics"
  ON property_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_operation ON properties(operation);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_bedrooms ON properties(bedrooms);
CREATE INDEX IF NOT EXISTS idx_properties_bathrooms ON properties(bathrooms);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_properties_location ON properties(latitude, longitude);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_properties_operation_type ON properties(operation, type);
CREATE INDEX IF NOT EXISTS idx_properties_city_operation ON properties(city, operation);
CREATE INDEX IF NOT EXISTS idx_properties_price_operation ON properties(price, operation);

-- Contacts indexes
CREATE INDEX IF NOT EXISTS idx_contacts_property_id ON contacts(property_id);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at);

-- Property views indexes
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_properties_search 
ON properties 
USING gin(to_tsvector('spanish', title || ' ' || description || ' ' || address || ' ' || city));

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create user profile on signup
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Function for advanced property search
CREATE OR REPLACE FUNCTION search_properties(
  search_query text DEFAULT NULL,
  operation_filter text DEFAULT NULL,
  type_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  min_bedrooms integer DEFAULT NULL,
  min_bathrooms integer DEFAULT NULL,
  min_parking integer DEFAULT NULL,
  city_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
  operation text,
  type text,
  area numeric,
  bedrooms integer,
  bathrooms integer,
  parking integer,
  is_furnished boolean,
  address text,
  city text,
  state text,
  latitude numeric,
  longitude numeric,
  images text[],
  features text[],
  created_at timestamptz,
  updated_at timestamptz,
  search_rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.operation,
    p.type,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.parking,
    p.is_furnished,
    p.address,
    p.city,
    p.state,
    p.latitude,
    p.longitude,
    p.images,
    p.features,
    p.created_at,
    p.updated_at,
    CASE 
      WHEN search_query IS NOT NULL THEN
        ts_rank(to_tsvector('spanish', p.title || ' ' || p.description || ' ' || p.address || ' ' || p.city), 
                plainto_tsquery('spanish', search_query))
      ELSE 0
    END as search_rank
  FROM properties p
  WHERE 
    (search_query IS NULL OR 
     to_tsvector('spanish', p.title || ' ' || p.description || ' ' || p.address || ' ' || p.city) @@ 
     plainto_tsquery('spanish', search_query))
    AND (operation_filter IS NULL OR p.operation = operation_filter)
    AND (type_filter IS NULL OR p.type = type_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
    AND (min_bathrooms IS NULL OR p.bathrooms >= min_bathrooms)
    AND (min_parking IS NULL OR p.parking >= min_parking)
    AND (city_filter IS NULL OR p.city ILIKE '%' || city_filter || '%')
  ORDER BY 
    CASE WHEN search_query IS NOT NULL THEN search_rank END DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby properties (within radius in kilometers)
CREATE OR REPLACE FUNCTION get_nearby_properties(
  center_lat numeric,
  center_lng numeric,
  radius_km numeric DEFAULT 5,
  exclude_property_id uuid DEFAULT NULL,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  operation text,
  type text,
  address text,
  city text,
  latitude numeric,
  longitude numeric,
  distance_km numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.operation,
    p.type,
    p.address,
    p.city,
    p.latitude,
    p.longitude,
    -- Calculate distance using Haversine formula (approximate)
    (6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(p.latitude)) * 
      cos(radians(p.longitude) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(p.latitude))
    )) as distance_km
  FROM properties p
  WHERE 
    (exclude_property_id IS NULL OR p.id != exclude_property_id)
    AND (6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(p.latitude)) * 
      cos(radians(p.longitude) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(p.latitude))
    )) <= radius_km
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get property recommendations based on similar properties
CREATE OR REPLACE FUNCTION get_property_recommendations(
  property_id_input uuid,
  limit_count integer DEFAULT 6
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  operation text,
  type text,
  area numeric,
  bedrooms integer,
  bathrooms integer,
  address text,
  city text,
  images text[],
  similarity_score numeric
) AS $$
DECLARE
  base_property RECORD;
BEGIN
  -- Get the base property details
  SELECT * INTO base_property FROM properties WHERE id = property_id_input;
  
  IF base_property IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.operation,
    p.type,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.address,
    p.city,
    p.images,
    -- Calculate similarity score based on multiple factors
    (
      CASE WHEN p.type = base_property.type THEN 30 ELSE 0 END +
      CASE WHEN p.operation = base_property.operation THEN 20 ELSE 0 END +
      CASE WHEN p.city = base_property.city THEN 15 ELSE 0 END +
      CASE WHEN p.bedrooms = base_property.bedrooms THEN 10 ELSE 0 END +
      CASE WHEN p.bathrooms = base_property.bathrooms THEN 5 ELSE 0 END +
      CASE 
        WHEN ABS(p.price - base_property.price) / base_property.price <= 0.2 THEN 15
        WHEN ABS(p.price - base_property.price) / base_property.price <= 0.5 THEN 10
        ELSE 0 
      END +
      CASE 
        WHEN ABS(p.area - base_property.area) / base_property.area <= 0.2 THEN 5
        ELSE 0 
      END
    ) as similarity_score
  FROM properties p
  WHERE 
    p.id != property_id_input
  ORDER BY similarity_score DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create analytics views
CREATE OR REPLACE VIEW property_analytics AS
SELECT 
  p.id,
  p.title,
  p.city,
  p.operation,
  p.type,
  p.price,
  COUNT(pv.id) as total_views,
  COUNT(DISTINCT pv.user_id) as unique_users,
  COUNT(DISTINCT pv.ip_address) as unique_visitors,
  MAX(pv.viewed_at) as last_viewed,
  p.created_at
FROM properties p
LEFT JOIN property_views pv ON p.id = pv.property_id
GROUP BY p.id, p.title, p.city, p.operation, p.type, p.price, p.created_at;

CREATE OR REPLACE VIEW popular_properties AS
SELECT 
  p.*,
  COALESCE(view_counts.total_views, 0) as total_views
FROM properties p
LEFT JOIN (
  SELECT 
    property_id,
    COUNT(*) as total_views
  FROM property_views
  WHERE viewed_at >= NOW() - INTERVAL '30 days'
  GROUP BY property_id
) view_counts ON p.id = view_counts.property_id
ORDER BY total_views DESC, p.created_at DESC;

-- Insert sample data from mock properties
-- First, let's create specific UUIDs for our sample properties
DO $$
DECLARE
  property_1_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  property_2_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12';
  property_3_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13';
BEGIN
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
    property_1_id,
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
    property_2_id,
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
    property_3_id,
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
END $$;