/*
  # Ensure map fields in properties table

  1. Schema Updates
    - Ensure `map_mode` column exists with proper constraints
    - Ensure `area_radius` column exists with proper constraints
    - Set default values for existing records

  2. Data Updates
    - Update existing records to have default values
    - Ensure all properties have valid map_mode and area_radius values

  3. Constraints
    - map_mode must be either 'pin' or 'area'
    - area_radius must be between 50 and 5000 meters
*/

-- Ensure map_mode column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'map_mode'
  ) THEN
    ALTER TABLE properties ADD COLUMN map_mode text DEFAULT 'pin';
  END IF;
END $$;

-- Ensure area_radius column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'area_radius'
  ) THEN
    ALTER TABLE properties ADD COLUMN area_radius integer DEFAULT 500;
  END IF;
END $$;

-- Update existing records that have NULL values
UPDATE properties 
SET map_mode = 'pin' 
WHERE map_mode IS NULL;

UPDATE properties 
SET area_radius = 500 
WHERE area_radius IS NULL;

-- Add constraints if they don't exist
DO $$
BEGIN
  -- Check if map_mode constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'properties_map_mode_check'
  ) THEN
    ALTER TABLE properties 
    ADD CONSTRAINT properties_map_mode_check 
    CHECK (map_mode = ANY (ARRAY['pin'::text, 'area'::text]));
  END IF;

  -- Check if area_radius constraint exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'properties_area_radius_check'
  ) THEN
    ALTER TABLE properties 
    ADD CONSTRAINT properties_area_radius_check 
    CHECK (area_radius >= 50 AND area_radius <= 5000);
  END IF;
END $$;

-- Set NOT NULL constraints
ALTER TABLE properties ALTER COLUMN map_mode SET NOT NULL;
ALTER TABLE properties ALTER COLUMN area_radius SET NOT NULL;

-- Set default values for future inserts
ALTER TABLE properties ALTER COLUMN map_mode SET DEFAULT 'pin';
ALTER TABLE properties ALTER COLUMN area_radius SET DEFAULT 500;