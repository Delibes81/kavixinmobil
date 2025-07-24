/*
  # Update properties table for map functionality

  1. Changes
    - Ensure map_mode column exists with proper constraints
    - Ensure area_radius column exists with proper constraints
    - Update existing records to have default values

  2. Security
    - No changes to RLS policies needed
*/

-- Ensure map_mode column exists with proper constraint
DO $$
BEGIN
  -- Check if map_mode column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'map_mode'
  ) THEN
    ALTER TABLE properties ADD COLUMN map_mode text DEFAULT 'pin';
  END IF;
  
  -- Update constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'properties' AND constraint_name = 'properties_map_mode_check'
  ) THEN
    ALTER TABLE properties DROP CONSTRAINT properties_map_mode_check;
  END IF;
  
  -- Add the constraint
  ALTER TABLE properties ADD CONSTRAINT properties_map_mode_check 
    CHECK (map_mode = ANY (ARRAY['pin'::text, 'area'::text]));
END $$;

-- Ensure area_radius column exists with proper constraint
DO $$
BEGIN
  -- Check if area_radius column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'area_radius'
  ) THEN
    ALTER TABLE properties ADD COLUMN area_radius integer DEFAULT 500;
  END IF;
  
  -- Update constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'properties' AND constraint_name = 'properties_area_radius_check'
  ) THEN
    ALTER TABLE properties DROP CONSTRAINT properties_area_radius_check;
  END IF;
  
  -- Add the constraint
  ALTER TABLE properties ADD CONSTRAINT properties_area_radius_check 
    CHECK (area_radius >= 50 AND area_radius <= 5000);
END $$;

-- Update existing records that might have null values
UPDATE properties 
SET 
  map_mode = 'pin',
  area_radius = 500
WHERE 
  map_mode IS NULL 
  OR area_radius IS NULL;