/*
  # Create properties table for real estate application

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
      - `location` (jsonb, optional, default empty object)
      - `images` (text array, optional, default empty array)
      - `features` (text array, optional, default empty array)
      - `created_at` (timestamptz, auto-generated)
      - `updated_at` (timestamptz, auto-generated, auto-updated)

  2. Security
    - Enable RLS on `properties` table
    - Add policy for public read access
    - Add policies for authenticated users to insert, update, and delete

  3. Triggers
    - Add trigger to automatically update `updated_at` column
*/

-- Create the update_updated_at_column function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT ''::text,
  price numeric NOT NULL DEFAULT 0,
  operation text NOT NULL DEFAULT 'venta'::text,
  type text NOT NULL DEFAULT 'casa'::text,
  area numeric DEFAULT 0,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  parking integer DEFAULT 0,
  is_furnished boolean DEFAULT false,
  location jsonb DEFAULT '{}'::jsonb,
  images text[] DEFAULT '{}'::text[],
  features text[] DEFAULT '{}'::text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add constraints for operation and type fields
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'properties_operation_check' 
    AND table_name = 'properties'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT properties_operation_check 
    CHECK (operation = ANY (ARRAY['venta'::text, 'renta'::text]));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'properties_type_check' 
    AND table_name = 'properties'
  ) THEN
    ALTER TABLE properties ADD CONSTRAINT properties_type_check 
    CHECK (type = ANY (ARRAY['casa'::text, 'departamento'::text, 'local'::text, 'terreno'::text]));
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policies
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

-- Create trigger for updating updated_at column
DROP TRIGGER IF EXISTS update_properties_updated_at ON properties;
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();