/*
  # Agregar campo ID interno a propiedades

  1. Cambios en la tabla properties
     - Agregar campo `id_interno` (text) - ID personalizable para control interno
     - Campo opcional, único cuando se especifica
     - Índice para búsquedas rápidas

  2. Funciones actualizadas
     - Actualizar funciones admin para incluir el nuevo campo
     - Mantener compatibilidad con datos existentes

  3. Seguridad
     - Mantener políticas RLS existentes
     - El campo es accesible según las políticas actuales
*/

-- Agregar el campo id_interno a la tabla properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS id_interno text;

-- Crear índice único parcial (solo para valores no nulos)
-- Esto permite múltiples valores NULL pero garantiza unicidad cuando se especifica
CREATE UNIQUE INDEX IF NOT EXISTS properties_id_interno_unique_idx 
ON properties (id_interno) 
WHERE id_interno IS NOT NULL;

-- Crear índice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS properties_id_interno_search_idx 
ON properties (id_interno) 
WHERE id_interno IS NOT NULL;

-- Actualizar función admin_create_property para incluir id_interno
CREATE OR REPLACE FUNCTION admin_create_property(property_data jsonb)
RETURNS TABLE(
  id uuid,
  titulo text,
  descripcion text,
  precio numeric,
  operacion text,
  tipo text,
  recamaras integer,
  banos integer,
  estacionamientos integer,
  metros_construccion numeric,
  metros_terreno numeric,
  antiguedad integer,
  amueblado boolean,
  direccion text,
  colonia text,
  ciudad text,
  estado text,
  codigo_postal text,
  latitud double precision,
  longitud double precision,
  imagenes text[],
  disponible boolean,
  destacado boolean,
  id_interno text,
  fecha_creacion timestamptz,
  fecha_actualizacion timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO properties (
    titulo,
    descripcion,
    precio,
    operacion,
    tipo,
    recamaras,
    banos,
    estacionamientos,
    metros_construccion,
    metros_terreno,
    antiguedad,
    amueblado,
    direccion,
    colonia,
    ciudad,
    estado,
    codigo_postal,
    latitud,
    longitud,
    imagenes,
    disponible,
    destacado,
    id_interno
  ) VALUES (
    (property_data->>'titulo')::text,
    (property_data->>'descripcion')::text,
    (property_data->>'precio')::numeric,
    (property_data->>'operacion')::text,
    (property_data->>'tipo')::text,
    (property_data->>'recamaras')::integer,
    (property_data->>'banos')::integer,
    (property_data->>'estacionamientos')::integer,
    (property_data->>'metros_construccion')::numeric,
    (property_data->>'metros_terreno')::numeric,
    (property_data->>'antiguedad')::integer,
    (property_data->>'amueblado')::boolean,
    (property_data->>'direccion')::text,
    (property_data->>'colonia')::text,
    (property_data->>'ciudad')::text,
    (property_data->>'estado')::text,
    (property_data->>'codigo_postal')::text,
    (property_data->>'latitud')::double precision,
    (property_data->>'longitud')::double precision,
    CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE ARRAY[]::text[]
    END,
    COALESCE((property_data->>'disponible')::boolean, true),
    COALESCE((property_data->>'destacado')::boolean, false),
    NULLIF(trim(property_data->>'id_interno'), '')
  )
  RETURNING 
    properties.id,
    properties.titulo,
    properties.descripcion,
    properties.precio,
    properties.operacion,
    properties.tipo,
    properties.recamaras,
    properties.banos,
    properties.estacionamientos,
    properties.metros_construccion,
    properties.metros_terreno,
    properties.antiguedad,
    properties.amueblado,
    properties.direccion,
    properties.colonia,
    properties.ciudad,
    properties.estado,
    properties.codigo_postal,
    properties.latitud,
    properties.longitud,
    properties.imagenes,
    properties.disponible,
    properties.destacado,
    properties.id_interno,
    properties.fecha_creacion,
    properties.fecha_actualizacion;
END;
$$;

-- Actualizar función admin_update_property para incluir id_interno
CREATE OR REPLACE FUNCTION admin_update_property(property_id uuid, property_data jsonb)
RETURNS TABLE(
  id uuid,
  titulo text,
  descripcion text,
  precio numeric,
  operacion text,
  tipo text,
  recamaras integer,
  banos integer,
  estacionamientos integer,
  metros_construccion numeric,
  metros_terreno numeric,
  antiguedad integer,
  amueblado boolean,
  direccion text,
  colonia text,
  ciudad text,
  estado text,
  codigo_postal text,
  latitud double precision,
  longitud double precision,
  imagenes text[],
  disponible boolean,
  destacado boolean,
  id_interno text,
  fecha_creacion timestamptz,
  fecha_actualizacion timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE properties SET
    titulo = (property_data->>'titulo')::text,
    descripcion = (property_data->>'descripcion')::text,
    precio = (property_data->>'precio')::numeric,
    operacion = (property_data->>'operacion')::text,
    tipo = (property_data->>'tipo')::text,
    recamaras = (property_data->>'recamaras')::integer,
    banos = (property_data->>'banos')::integer,
    estacionamientos = (property_data->>'estacionamientos')::integer,
    metros_construccion = (property_data->>'metros_construccion')::numeric,
    metros_terreno = (property_data->>'metros_terreno')::numeric,
    antiguedad = (property_data->>'antiguedad')::integer,
    amueblado = (property_data->>'amueblado')::boolean,
    direccion = (property_data->>'direccion')::text,
    colonia = (property_data->>'colonia')::text,
    ciudad = (property_data->>'ciudad')::text,
    estado = (property_data->>'estado')::text,
    codigo_postal = (property_data->>'codigo_postal')::text,
    latitud = (property_data->>'latitud')::double precision,
    longitud = (property_data->>'longitud')::double precision,
    imagenes = CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE ARRAY[]::text[]
    END,
    disponible = COALESCE((property_data->>'disponible')::boolean, true),
    destacado = COALESCE((property_data->>'destacado')::boolean, false),
    id_interno = NULLIF(trim(property_data->>'id_interno'), ''),
    fecha_actualizacion = now()
  WHERE properties.id = property_id
  RETURNING 
    properties.id,
    properties.titulo,
    properties.descripcion,
    properties.precio,
    properties.operacion,
    properties.tipo,
    properties.recamaras,
    properties.banos,
    properties.estacionamientos,
    properties.metros_construccion,
    properties.metros_terreno,
    properties.antiguedad,
    properties.amueblado,
    properties.direccion,
    properties.colonia,
    properties.ciudad,
    properties.estado,
    properties.codigo_postal,
    properties.latitud,
    properties.longitud,
    properties.imagenes,
    properties.disponible,
    properties.destacado,
    properties.id_interno,
    properties.fecha_creacion,
    properties.fecha_actualizacion;
END;
$$;