/*
  # Create Property Views and Analytics Schema

  1. New Tables
    - `property_views`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `user_id` (uuid, optional reference to auth.users)
      - `ip_address` (inet)
      - `user_agent` (text)
      - `viewed_at` (timestamptz, default now())

  2. Views
    - `property_analytics` - Aggregated view statistics
    - `popular_properties` - Most viewed properties

  3. Security
    - Enable RLS on `property_views` table
    - Add policies for tracking views
*/

-- Create property_views table for analytics
CREATE TABLE IF NOT EXISTS property_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address inet,
  user_agent text,
  viewed_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Create policies for anyone to insert views (tracking)
CREATE POLICY "Anyone can track property views"
  ON property_views
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for authenticated users to read analytics
CREATE POLICY "Authenticated users can read property views"
  ON property_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_user_id ON property_views(user_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_views_ip_address ON property_views(ip_address);

-- Create view for property analytics
CREATE OR REPLACE VIEW property_analytics AS
SELECT 
  p.id,
  p.title,
  p.price,
  p.operation,
  p.type,
  p.city,
  COUNT(pv.id) as total_views,
  COUNT(DISTINCT pv.ip_address) as unique_views,
  COUNT(DISTINCT pv.user_id) as registered_user_views,
  MAX(pv.viewed_at) as last_viewed,
  DATE_TRUNC('day', pv.viewed_at) as view_date,
  COUNT(pv.id) FILTER (WHERE pv.viewed_at >= NOW() - INTERVAL '7 days') as views_last_7_days,
  COUNT(pv.id) FILTER (WHERE pv.viewed_at >= NOW() - INTERVAL '30 days') as views_last_30_days
FROM properties p
LEFT JOIN property_views pv ON p.id = pv.property_id
GROUP BY p.id, p.title, p.price, p.operation, p.type, p.city, DATE_TRUNC('day', pv.viewed_at);

-- Create view for popular properties
CREATE OR REPLACE VIEW popular_properties AS
SELECT 
  p.*,
  COUNT(pv.id) as total_views,
  COUNT(DISTINCT pv.ip_address) as unique_views,
  COUNT(pv.id) FILTER (WHERE pv.viewed_at >= NOW() - INTERVAL '7 days') as recent_views
FROM properties p
LEFT JOIN property_views pv ON p.id = pv.property_id
GROUP BY p.id
ORDER BY recent_views DESC, total_views DESC;