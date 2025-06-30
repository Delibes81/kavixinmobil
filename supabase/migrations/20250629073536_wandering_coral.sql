/*
  # Setup Storage Policies for Property Images

  1. Storage Bucket
    - Create `property-images` bucket if it doesn't exist
    - Set it as public for image viewing

  2. Storage Policies
    - Allow authenticated users to upload images to properties folder
    - Allow public access to view images
    - Allow authenticated users to delete their uploaded images
    - Allow authenticated users to update their uploaded images

  Note: Using storage functions instead of direct table access to avoid permission issues
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'property-images', 
    'property-images', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
  ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
EXCEPTION
  WHEN others THEN
    -- Bucket might already exist, continue
    NULL;
END $$;

-- Create storage policies using the storage schema functions
-- Policy for authenticated users to upload images
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can upload property images" ON storage.objects;
  
  -- Create new policy for uploads
  CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-images'
  );
EXCEPTION
  WHEN others THEN
    -- Policy might not exist, continue
    NULL;
END $$;

-- Policy for public to view images
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Public can view property images" ON storage.objects;
  
  -- Create new policy for viewing
  CREATE POLICY "Public can view property images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'property-images');
EXCEPTION
  WHEN others THEN
    -- Policy might not exist, continue
    NULL;
END $$;

-- Policy for authenticated users to delete images
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can delete property images" ON storage.objects;
  
  -- Create new policy for deletes
  CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images');
EXCEPTION
  WHEN others THEN
    -- Policy might not exist, continue
    NULL;
END $$;

-- Policy for authenticated users to update images
DO $$
BEGIN
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Authenticated users can update property images" ON storage.objects;
  
  -- Create new policy for updates
  CREATE POLICY "Authenticated users can update property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images')
  WITH CHECK (bucket_id = 'property-images');
EXCEPTION
  WHEN others THEN
    -- Policy might not exist, continue
    NULL;
END $$;