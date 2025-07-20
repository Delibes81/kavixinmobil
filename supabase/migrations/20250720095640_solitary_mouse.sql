/*
  # Update coordinates precision for properties table

  1. Changes
    - Modify latitud column to support higher precision (double precision)
    - Modify longitud column to support higher precision (double precision)
    - These changes allow storing coordinates with up to 15 decimal places

  2. Notes
    - Double precision in PostgreSQL can store coordinates with sufficient precision
    - No data loss as we're expanding precision, not reducing it
*/

-- Update the latitud column to ensure it can handle high precision coordinates
DO $$
BEGIN
  -- Check if the column needs to be updated (it should already be double precision, but ensuring it)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'latitud' 
    AND data_type != 'double precision'
  ) THEN
    ALTER TABLE properties ALTER COLUMN latitud TYPE double precision;
  END IF;
END $$;

-- Update the longitud column to ensure it can handle high precision coordinates
DO $$
BEGIN
  -- Check if the column needs to be updated (it should already be double precision, but ensuring it)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' 
    AND column_name = 'longitud' 
    AND data_type != 'double precision'
  ) THEN
    ALTER TABLE properties ALTER COLUMN longitud TYPE double precision;
  END IF;
END $$;

-- Add index for better performance on coordinate queries if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'properties' 
    AND indexname = 'idx_properties_coordinates'
  ) THEN
    CREATE INDEX idx_properties_coordinates ON properties (latitud, longitud);
  END IF;
END $$;