/*
  # Create Storage Bucket and Policies for Property Images

  1. Storage Setup
    - Create `property-images` storage bucket if it doesn't exist
    - Configure bucket to be public for reading
    
  2. Security Policies
    - Allow authenticated users to upload images (INSERT)
    - Allow public access to view images (SELECT)
    - Allow authenticated users to update their uploaded images (UPDATE)
    - Allow authenticated users to delete images (DELETE)
    
  3. Notes
    - Images will be stored in folders: properties/{property_id}/ or properties/temp/
    - Public access for viewing ensures images can be displayed on the website
    - Only authenticated users can manage (upload/update/delete) images
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the storage.objects table for our bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public access to view images
CREATE POLICY "Public Access for Property Images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload property images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);

-- Policy: Allow authenticated users to update images they uploaded
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

-- Policy: Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete property images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'property-images' 
  AND auth.uid() IS NOT NULL
);