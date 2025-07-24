/*
  # Add Mapbox Support for Property Locations

  1. Database Changes
    - Verify map_mode and area_radius columns exist in properties table
    - Add indexes for better location-based queries
    - Update RLS policies if needed

  2. Functions
    - Add helper functions for location operations
    - Update admin functions to handle map data

  3. Security
    - Ensure location data is properly validated
    - Maintain existing RLS policies
*/

-- Verify that map_mode and area_radius columns exist (they should already exist based on schema)
DO $$
BEGIN
  -- Check if map_mode column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'map_mode'
  ) THEN
    ALTER TABLE properties ADD COLUMN map_mode text DEFAULT 'pin' NOT NULL;
    ALTER TABLE properties ADD CONSTRAINT properties_map_mode_check 
      CHECK (map_mode = ANY (ARRAY['pin'::text, 'area'::text]));
  END IF;

  -- Check if area_radius column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'area_radius'
  ) THEN
    ALTER TABLE properties ADD COLUMN area_radius integer DEFAULT 500 NOT NULL;
    ALTER TABLE properties ADD CONSTRAINT properties_area_radius_check 
      CHECK (area_radius >= 50 AND area_radius <= 5000);
  END IF;
END $$;

-- Add spatial index for location-based queries if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'properties' AND indexname = 'idx_properties_coordinates'
  ) THEN
    CREATE INDEX idx_properties_coordinates ON properties USING btree (latitud, longitud);
  END IF;
END $$;

-- Function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 double precision,
  lon1 double precision,
  lat2 double precision,
  lon2 double precision
) RETURNS double precision AS $$
DECLARE
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
  r double precision := 6371000; -- Earth's radius in meters
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  RETURN r * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find properties within a certain radius
CREATE OR REPLACE FUNCTION find_properties_near_location(
  search_lat double precision,
  search_lon double precision,
  radius_meters integer DEFAULT 1000
) RETURNS TABLE (
  property_id uuid,
  titulo text,
  distance_meters double precision
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.titulo,
    calculate_distance(search_lat, search_lon, p.latitud, p.longitud) as distance
  FROM properties p
  WHERE p.latitud IS NOT NULL 
    AND p.longitud IS NOT NULL
    AND p.disponible = true
    AND calculate_distance(search_lat, search_lon, p.latitud, p.longitud) <= radius_meters
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the admin_create_property function to handle map data
CREATE OR REPLACE FUNCTION admin_create_property(property_data jsonb)
RETURNS TABLE(id uuid, titulo text) AS $$
DECLARE
  new_property_id uuid;
  new_property_titulo text;
BEGIN
  -- Validate map_mode
  IF (property_data->>'map_mode') NOT IN ('pin', 'area') THEN
    RAISE EXCEPTION 'Invalid map_mode. Must be pin or area.';
  END IF;

  -- Validate area_radius
  IF (property_data->>'area_radius')::integer < 50 OR (property_data->>'area_radius')::integer > 5000 THEN
    RAISE EXCEPTION 'Invalid area_radius. Must be between 50 and 5000 meters.';
  END IF;

  -- Insert the property
  INSERT INTO properties (
    titulo, descripcion, precio, operacion, tipo,
    recamaras, banos, estacionamientos, metros_construccion, metros_terreno,
    antiguedad, amueblado, direccion, colonia, ciudad, estado, codigo_postal,
    latitud, longitud, imagenes, disponible, destacado, id_interno,
    map_mode, area_radius
  ) VALUES (
    property_data->>'titulo',
    property_data->>'descripcion',
    (property_data->>'precio')::numeric,
    property_data->>'operacion',
    property_data->>'tipo',
    (property_data->>'recamaras')::integer,
    (property_data->>'banos')::integer,
    (property_data->>'estacionamientos')::integer,
    (property_data->>'metros_construccion')::numeric,
    (property_data->>'metros_terreno')::numeric,
    (property_data->>'antiguedad')::integer,
    (property_data->>'amueblado')::boolean,
    property_data->>'direccion',
    property_data->>'colonia',
    property_data->>'ciudad',
    property_data->>'estado',
    property_data->>'codigo_postal',
    (property_data->>'latitud')::double precision,
    (property_data->>'longitud')::double precision,
    COALESCE((property_data->>'imagenes')::text[], ARRAY[]::text[]),
    COALESCE((property_data->>'disponible')::boolean, true),
    COALESCE((property_data->>'destacado')::boolean, false),
    NULLIF(property_data->>'id_interno', ''),
    COALESCE(property_data->>'map_mode', 'pin'),
    COALESCE((property_data->>'area_radius')::integer, 500)
  )
  RETURNING properties.id, properties.titulo INTO new_property_id, new_property_titulo;

  RETURN QUERY SELECT new_property_id, new_property_titulo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the admin_update_property function to handle map data
CREATE OR REPLACE FUNCTION admin_update_property(
  property_id uuid,
  property_data jsonb
)
RETURNS TABLE(id uuid, titulo text) AS $$
DECLARE
  updated_property_id uuid;
  updated_property_titulo text;
BEGIN
  -- Validate map_mode
  IF (property_data->>'map_mode') NOT IN ('pin', 'area') THEN
    RAISE EXCEPTION 'Invalid map_mode. Must be pin or area.';
  END IF;

  -- Validate area_radius
  IF (property_data->>'area_radius')::integer < 50 OR (property_data->>'area_radius')::integer > 5000 THEN
    RAISE EXCEPTION 'Invalid area_radius. Must be between 50 and 5000 meters.';
  END IF;

  -- Update the property
  UPDATE properties SET
    titulo = property_data->>'titulo',
    descripcion = property_data->>'descripcion',
    precio = (property_data->>'precio')::numeric,
    operacion = property_data->>'operacion',
    tipo = property_data->>'tipo',
    recamaras = (property_data->>'recamaras')::integer,
    banos = (property_data->>'banos')::integer,
    estacionamientos = (property_data->>'estacionamientos')::integer,
    metros_construccion = (property_data->>'metros_construccion')::numeric,
    metros_terreno = (property_data->>'metros_terreno')::numeric,
    antiguedad = (property_data->>'antiguedad')::integer,
    amueblado = (property_data->>'amueblado')::boolean,
    direccion = property_data->>'direccion',
    colonia = property_data->>'colonia',
    ciudad = property_data->>'ciudad',
    estado = property_data->>'estado',
    codigo_postal = property_data->>'codigo_postal',
    latitud = (property_data->>'latitud')::double precision,
    longitud = (property_data->>'longitud')::double precision,
    imagenes = COALESCE((property_data->>'imagenes')::text[], ARRAY[]::text[]),
    disponible = COALESCE((property_data->>'disponible')::boolean, true),
    destacado = COALESCE((property_data->>'destacado')::boolean, false),
    id_interno = NULLIF(property_data->>'id_interno', ''),
    map_mode = COALESCE(property_data->>'map_mode', 'pin'),
    area_radius = COALESCE((property_data->>'area_radius')::integer, 500),
    fecha_actualizacion = now()
  WHERE properties.id = property_id
  RETURNING properties.id, properties.titulo INTO updated_property_id, updated_property_titulo;

  IF updated_property_id IS NULL THEN
    RAISE EXCEPTION 'Property not found or access denied';
  END IF;

  RETURN QUERY SELECT updated_property_id, updated_property_titulo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate coordinates
CREATE OR REPLACE FUNCTION validate_coordinates(
  lat double precision,
  lng double precision
) RETURNS boolean AS $$
BEGIN
  -- Check if coordinates are within valid ranges
  IF lat IS NULL OR lng IS NULL THEN
    RETURN false;
  END IF;
  
  IF lat < -90 OR lat > 90 THEN
    RETURN false;
  END IF;
  
  IF lng < -180 OR lng > 180 THEN
    RETURN false;
  END IF;
  
  -- Check if coordinates are not at 0,0 (likely invalid)
  IF lat = 0 AND lng = 0 THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add comment to document the location features
COMMENT ON COLUMN properties.map_mode IS 'Display mode for property location: pin for exact location, area for general area';
COMMENT ON COLUMN properties.area_radius IS 'Radius in meters for area mode display (50-5000m)';
COMMENT ON FUNCTION calculate_distance IS 'Calculate distance between two geographic points using Haversine formula';
COMMENT ON FUNCTION find_properties_near_location IS 'Find properties within specified radius of a location';
COMMENT ON FUNCTION validate_coordinates IS 'Validate that coordinates are within valid geographic ranges';