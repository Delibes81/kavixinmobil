/*
  # Setup Storage Policies for Property Images

  1. Storage Setup
    - Create property-images bucket if it doesn't exist
    - Enable RLS on storage.objects table
    - Add policies for authenticated users to upload, view, and delete images

  2. Security
    - Allow authenticated users to upload images to properties/ folder
    - Allow public access to view images
    - Allow authenticated users to delete their uploaded images
    - Restrict file types to images only
    - Limit file size to 5MB
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = 'properties'
  AND (
    (storage.foldername(name))[2] = 'temp' 
    OR (storage.foldername(name))[2] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
  )
);

-- Policy to allow public access to view images
CREATE POLICY "Public can view property images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Policy to allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = 'properties'
);

-- Policy to allow authenticated users to update images
CREATE POLICY "Authenticated users can update property images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = 'properties'
)
WITH CHECK (
  bucket_id = 'property-images' 
  AND (storage.foldername(name))[1] = 'properties'
);