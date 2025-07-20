/*
  # Add map display settings to properties

  1. New Columns
    - `map_mode` (text) - 'pin' or 'area' to indicate display mode
    - `area_radius` (integer) - radius in meters for area display mode
  
  2. Updates
    - Add columns to properties table
    - Set default values for existing properties
    - Update admin functions to handle new fields
  
  3. Security
    - Maintain existing RLS policies
    - Update admin functions for new fields
*/

-- Add new columns for map display settings
DO $$
BEGIN
  -- Add map_mode column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'map_mode'
  ) THEN
    ALTER TABLE properties ADD COLUMN map_mode TEXT DEFAULT 'pin';
    RAISE NOTICE 'Added map_mode column';
  END IF;

  -- Add area_radius column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'area_radius'
  ) THEN
    ALTER TABLE properties ADD COLUMN area_radius INTEGER DEFAULT 500;
    RAISE NOTICE 'Added area_radius column';
  END IF;
END $$;

-- Add check constraint for map_mode
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'properties_map_mode_check'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT properties_map_mode_check 
    CHECK (map_mode IN ('pin', 'area'));
    RAISE NOTICE 'Added map_mode check constraint';
  END IF;
END $$;

-- Add check constraint for area_radius
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'properties_area_radius_check'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT properties_area_radius_check 
    CHECK (area_radius >= 50 AND area_radius <= 5000);
    RAISE NOTICE 'Added area_radius check constraint';
  END IF;
END $$;

-- Drop and recreate admin functions to handle new fields
DROP FUNCTION IF EXISTS admin_create_property(jsonb);
DROP FUNCTION IF EXISTS admin_update_property(uuid, jsonb);

-- Function to create property (admin only) - Updated with map settings
CREATE OR REPLACE FUNCTION admin_create_property(property_data JSONB)
RETURNS TABLE(id UUID, titulo TEXT, created_at TIMESTAMPTZ) AS $$
DECLARE
  new_property_id UUID;
BEGIN
  -- Insert the property
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
    disponible,
    destacado,
    id_interno,
    map_mode,
    area_radius
  ) VALUES (
    (property_data->>'titulo')::TEXT,
    (property_data->>'descripcion')::TEXT,
    (property_data->>'precio')::NUMERIC,
    (property_data->>'operacion')::TEXT,
    (property_data->>'tipo')::TEXT,
    (property_data->>'recamaras')::INTEGER,
    (property_data->>'banos')::INTEGER,
    (property_data->>'estacionamientos')::INTEGER,
    (property_data->>'metros_construccion')::NUMERIC,
    (property_data->>'metros_terreno')::NUMERIC,
    (property_data->>'antiguedad')::INTEGER,
    (property_data->>'amueblado')::BOOLEAN,
    (property_data->>'direccion')::TEXT,
    (property_data->>'colonia')::TEXT,
    (property_data->>'ciudad')::TEXT,
    (property_data->>'estado')::TEXT,
    (property_data->>'codigo_postal')::TEXT,
    (property_data->>'latitud')::DOUBLE PRECISION,
    (property_data->>'longitud')::DOUBLE PRECISION,
    CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE ARRAY[]::TEXT[]
    END,
    COALESCE((property_data->>'disponible')::BOOLEAN, true),
    COALESCE((property_data->>'destacado')::BOOLEAN, false),
    NULLIF((property_data->>'id_interno')::TEXT, ''),
    COALESCE((property_data->>'map_mode')::TEXT, 'pin'),
    COALESCE((property_data->>'area_radius')::INTEGER, 500)
  ) RETURNING properties.id INTO new_property_id;

  -- Return the created property info
  RETURN QUERY
  SELECT 
    new_property_id,
    (property_data->>'titulo')::TEXT,
    NOW()::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update property (admin only) - Updated with map settings
CREATE OR REPLACE FUNCTION admin_update_property(property_id UUID, property_data JSONB)
RETURNS TABLE(id UUID, titulo TEXT, updated_at TIMESTAMPTZ) AS $$
BEGIN
  -- Update the property
  UPDATE properties SET
    titulo = (property_data->>'titulo')::TEXT,
    descripcion = (property_data->>'descripcion')::TEXT,
    precio = (property_data->>'precio')::NUMERIC,
    operacion = (property_data->>'operacion')::TEXT,
    tipo = (property_data->>'tipo')::TEXT,
    recamaras = (property_data->>'recamaras')::INTEGER,
    banos = (property_data->>'banos')::INTEGER,
    estacionamientos = (property_data->>'estacionamientos')::INTEGER,
    metros_construccion = (property_data->>'metros_construccion')::NUMERIC,
    metros_terreno = (property_data->>'metros_terreno')::NUMERIC,
    antiguedad = (property_data->>'antiguedad')::INTEGER,
    amueblado = (property_data->>'amueblado')::BOOLEAN,
    direccion = (property_data->>'direccion')::TEXT,
    colonia = (property_data->>'colonia')::TEXT,
    ciudad = (property_data->>'ciudad')::TEXT,
    estado = (property_data->>'estado')::TEXT,
    codigo_postal = (property_data->>'codigo_postal')::TEXT,
    latitud = (property_data->>'latitud')::DOUBLE PRECISION,
    longitud = (property_data->>'longitud')::DOUBLE PRECISION,
    imagenes = CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE ARRAY[]::TEXT[]
    END,
    disponible = COALESCE((property_data->>'disponible')::BOOLEAN, true),
    destacado = COALESCE((property_data->>'destacado')::BOOLEAN, false),
    id_interno = NULLIF((property_data->>'id_interno')::TEXT, ''),
    map_mode = COALESCE((property_data->>'map_mode')::TEXT, 'pin'),
    area_radius = COALESCE((property_data->>'area_radius')::INTEGER, 500),
    fecha_actualizacion = NOW()
  WHERE properties.id = property_id;

  -- Return the updated property info
  RETURN QUERY
  SELECT 
    property_id,
    (property_data->>'titulo')::TEXT,
    NOW()::TIMESTAMPTZ;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;