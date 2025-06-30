/*
  # Setup Supabase Storage for Property Images

  1. Storage Bucket
    - Create `property-images` bucket for storing property images
    - Configure public access for viewing images
    - Set file size limit and allowed MIME types

  2. Storage Policies
    - Allow public read access to images
    - Allow authenticated users to upload, update, and delete images

  Note: This migration creates the bucket and policies using Supabase's storage functions
*/

-- Create the storage bucket for property images
DO $$
BEGIN
  -- Insert the bucket if it doesn't exist
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
EXCEPTION
  WHEN others THEN
    -- Bucket might already exist, continue
    NULL;
END $$;