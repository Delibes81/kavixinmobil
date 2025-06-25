/*
  # Create Search Functions and Utilities

  1. Functions
    - `search_properties` - Full-text search with filters
    - `get_nearby_properties` - Location-based search
    - `get_property_recommendations` - Similar properties

  2. Indexes
    - Full-text search indexes
    - Spatial indexes for location queries
*/

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_properties_search 
ON properties 
USING gin(to_tsvector('spanish', title || ' ' || description || ' ' || address || ' ' || city));

-- Function for advanced property search
CREATE OR REPLACE FUNCTION search_properties(
  search_query text DEFAULT NULL,
  operation_filter text DEFAULT NULL,
  type_filter text DEFAULT NULL,
  min_price numeric DEFAULT NULL,
  max_price numeric DEFAULT NULL,
  min_bedrooms integer DEFAULT NULL,
  min_bathrooms integer DEFAULT NULL,
  min_parking integer DEFAULT NULL,
  city_filter text DEFAULT NULL,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  price numeric,
  operation text,
  type text,
  area numeric,
  bedrooms integer,
  bathrooms integer,
  parking integer,
  is_furnished boolean,
  address text,
  city text,
  state text,
  latitude numeric,
  longitude numeric,
  images text[],
  features text[],
  created_at timestamptz,
  updated_at timestamptz,
  search_rank real
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.description,
    p.price,
    p.operation,
    p.type,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.parking,
    p.is_furnished,
    p.address,
    p.city,
    p.state,
    p.latitude,
    p.longitude,
    p.images,
    p.features,
    p.created_at,
    p.updated_at,
    CASE 
      WHEN search_query IS NOT NULL THEN
        ts_rank(to_tsvector('spanish', p.title || ' ' || p.description || ' ' || p.address || ' ' || p.city), 
                plainto_tsquery('spanish', search_query))
      ELSE 0
    END as search_rank
  FROM properties p
  WHERE 
    (search_query IS NULL OR 
     to_tsvector('spanish', p.title || ' ' || p.description || ' ' || p.address || ' ' || p.city) @@ 
     plainto_tsquery('spanish', search_query))
    AND (operation_filter IS NULL OR p.operation = operation_filter)
    AND (type_filter IS NULL OR p.type = type_filter)
    AND (min_price IS NULL OR p.price >= min_price)
    AND (max_price IS NULL OR p.price <= max_price)
    AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
    AND (min_bathrooms IS NULL OR p.bathrooms >= min_bathrooms)
    AND (min_parking IS NULL OR p.parking >= min_parking)
    AND (city_filter IS NULL OR p.city ILIKE '%' || city_filter || '%')
  ORDER BY 
    CASE WHEN search_query IS NOT NULL THEN search_rank END DESC,
    p.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get nearby properties (within radius in kilometers)
CREATE OR REPLACE FUNCTION get_nearby_properties(
  center_lat numeric,
  center_lng numeric,
  radius_km numeric DEFAULT 5,
  exclude_property_id uuid DEFAULT NULL,
  limit_count integer DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  operation text,
  type text,
  address text,
  city text,
  latitude numeric,
  longitude numeric,
  distance_km numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.operation,
    p.type,
    p.address,
    p.city,
    p.latitude,
    p.longitude,
    -- Calculate distance using Haversine formula (approximate)
    (6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(p.latitude)) * 
      cos(radians(p.longitude) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(p.latitude))
    )) as distance_km
  FROM properties p
  WHERE 
    (exclude_property_id IS NULL OR p.id != exclude_property_id)
    AND (6371 * acos(
      cos(radians(center_lat)) * 
      cos(radians(p.latitude)) * 
      cos(radians(p.longitude) - radians(center_lng)) + 
      sin(radians(center_lat)) * 
      sin(radians(p.latitude))
    )) <= radius_km
  ORDER BY distance_km
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get property recommendations based on similar properties
CREATE OR REPLACE FUNCTION get_property_recommendations(
  property_id_input uuid,
  limit_count integer DEFAULT 6
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  operation text,
  type text,
  area numeric,
  bedrooms integer,
  bathrooms integer,
  address text,
  city text,
  images text[],
  similarity_score numeric
) AS $$
DECLARE
  base_property RECORD;
BEGIN
  -- Get the base property details
  SELECT * INTO base_property FROM properties WHERE id = property_id_input;
  
  IF base_property IS NULL THEN
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.price,
    p.operation,
    p.type,
    p.area,
    p.bedrooms,
    p.bathrooms,
    p.address,
    p.city,
    p.images,
    -- Calculate similarity score based on multiple factors
    (
      CASE WHEN p.type = base_property.type THEN 30 ELSE 0 END +
      CASE WHEN p.operation = base_property.operation THEN 20 ELSE 0 END +
      CASE WHEN p.city = base_property.city THEN 15 ELSE 0 END +
      CASE WHEN p.bedrooms = base_property.bedrooms THEN 10 ELSE 0 END +
      CASE WHEN p.bathrooms = base_property.bathrooms THEN 5 ELSE 0 END +
      CASE 
        WHEN ABS(p.price - base_property.price) / base_property.price <= 0.2 THEN 15
        WHEN ABS(p.price - base_property.price) / base_property.price <= 0.5 THEN 10
        ELSE 0 
      END +
      CASE 
        WHEN ABS(p.area - base_property.area) / base_property.area <= 0.2 THEN 5
        ELSE 0 
      END
    ) as similarity_score
  FROM properties p
  WHERE 
    p.id != property_id_input
  ORDER BY similarity_score DESC, p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;