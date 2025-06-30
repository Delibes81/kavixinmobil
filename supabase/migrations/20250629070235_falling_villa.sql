/*
  # Setup storage policies for property images

  1. Storage Bucket
    - Create property-images bucket if not exists
    - Set proper permissions and file limits

  2. Storage Policies
    - Allow public read access to images
    - Allow authenticated users to upload/manage images
    - Proper RLS policies for secure file management
*/

-- Create the storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types,
  updated_at = now();

-- Create storage policies
DO $$
BEGIN
  -- Policy: Allow public access to view images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Access for Property Images'
  ) THEN
    CREATE POLICY "Public Access for Property Images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'property-images');
  END IF;

  -- Policy: Allow authenticated users to upload images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can upload property images'
  ) THEN
    CREATE POLICY "Authenticated users can upload property images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'property-images' 
      AND auth.uid() IS NOT NULL
    );
  END IF;

  -- Policy: Allow authenticated users to update images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can update property images'
  ) THEN
    CREATE POLICY "Authenticated users can update property images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'property-images' 
      AND auth.uid() IS NOT NULL
    )
    WITH CHECK (
      bucket_id = 'property-images' 
      AND auth.uid() IS NOT NULL
    );
  END IF;

  -- Policy: Allow authenticated users to delete images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Authenticated users can delete property images'
  ) THEN
    CREATE POLICY "Authenticated users can delete property images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'property-images' 
      AND auth.uid() IS NOT NULL
    );
  END IF;

END $$;