/*
  # Agregar campo ID para control interno

  1. Cambios en la tabla properties
    - Agregar campo `id_interno` (text) - ID personalizable para control interno
    - Campo opcional, único cuando se especifica
    - Índice para búsquedas rápidas

  2. Funciones actualizadas
    - Actualizar funciones admin para incluir el nuevo campo
    - Mantener compatibilidad con datos existentes
*/

-- Agregar campo id_interno a la tabla properties
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'properties' AND column_name = 'id_interno'
  ) THEN
    ALTER TABLE properties ADD COLUMN id_interno VARCHAR(50);
  END IF;
END $$;

-- Crear índice único para id_interno (permitiendo valores NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_properties_id_interno 
ON properties (id_interno) 
WHERE id_interno IS NOT NULL;

-- Actualizar función admin_create_property para incluir id_interno
CREATE OR REPLACE FUNCTION admin_create_property(property_data jsonb)
RETURNS TABLE(
  id uuid,
  titulo varchar(200),
  descripcion text,
  precio numeric(12,2),
  operacion varchar(10),
  tipo varchar(20),
  recamaras integer,
  banos integer,
  estacionamientos integer,
  metros_construccion numeric(8,2),
  metros_terreno numeric(8,2),
  antiguedad integer,
  amueblado boolean,
  direccion text,
  colonia varchar(100),
  ciudad varchar(100),
  estado varchar(100),
  codigo_postal varchar(10),
  latitud double precision,
  longitud double precision,
  imagenes text[],
  disponible boolean,
  destacado boolean,
  id_interno varchar(50),
  fecha_creacion timestamp without time zone,
  fecha_actualizacion timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated admin
  IF NOT is_admin_authenticated() THEN
    RAISE EXCEPTION 'Access denied. Admin authentication required.';
  END IF;

  -- Insert the property and return the result
  RETURN QUERY
  INSERT INTO properties (
    titulo, descripcion, precio, operacion, tipo, recamaras, banos, 
    estacionamientos, metros_construccion, metros_terreno, antiguedad, 
    amueblado, direccion, colonia, ciudad, estado, codigo_postal, 
    latitud, longitud, imagenes, disponible, destacado, id_interno
  )
  VALUES (
    (property_data->>'titulo')::varchar(200),
    (property_data->>'descripcion')::text,
    (property_data->>'precio')::numeric(12,2),
    (property_data->>'operacion')::varchar(10),
    (property_data->>'tipo')::varchar(20),
    (property_data->>'recamaras')::integer,
    (property_data->>'banos')::integer,
    (property_data->>'estacionamientos')::integer,
    (property_data->>'metros_construccion')::numeric(8,2),
    (property_data->>'metros_terreno')::numeric(8,2),
    (property_data->>'antiguedad')::integer,
    (property_data->>'amueblado')::boolean,
    (property_data->>'direccion')::text,
    (property_data->>'colonia')::varchar(100),
    (property_data->>'ciudad')::varchar(100),
    (property_data->>'estado')::varchar(100),
    (property_data->>'codigo_postal')::varchar(10),
    (property_data->>'latitud')::double precision,
    (property_data->>'longitud')::double precision,
    CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE '{}'::text[]
    END,
    (property_data->>'disponible')::boolean,
    (property_data->>'destacado')::boolean,
    NULLIF(trim(property_data->>'id_interno'), '')::varchar(50)
  )
  RETURNING 
    properties.id, properties.titulo, properties.descripcion, properties.precio, 
    properties.operacion, properties.tipo, properties.recamaras, properties.banos, 
    properties.estacionamientos, properties.metros_construccion, properties.metros_terreno, 
    properties.antiguedad, properties.amueblado, properties.direccion, properties.colonia, 
    properties.ciudad, properties.estado, properties.codigo_postal, properties.latitud, 
    properties.longitud, properties.imagenes, properties.disponible, properties.destacado, 
    properties.id_interno, properties.fecha_creacion, properties.fecha_actualizacion;
END;
$$;

-- Actualizar función admin_update_property para incluir id_interno
CREATE OR REPLACE FUNCTION admin_update_property(property_id uuid, property_data jsonb)
RETURNS TABLE(
  id uuid,
  titulo varchar(200),
  descripcion text,
  precio numeric(12,2),
  operacion varchar(10),
  tipo varchar(20),
  recamaras integer,
  banos integer,
  estacionamientos integer,
  metros_construccion numeric(8,2),
  metros_terreno numeric(8,2),
  antiguedad integer,
  amueblado boolean,
  direccion text,
  colonia varchar(100),
  ciudad varchar(100),
  estado varchar(100),
  codigo_postal varchar(10),
  latitud double precision,
  longitud double precision,
  imagenes text[],
  disponible boolean,
  destacado boolean,
  id_interno varchar(50),
  fecha_creacion timestamp without time zone,
  fecha_actualizacion timestamp without time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is authenticated admin
  IF NOT is_admin_authenticated() THEN
    RAISE EXCEPTION 'Access denied. Admin authentication required.';
  END IF;

  -- Update the property and return the result
  RETURN QUERY
  UPDATE properties SET
    titulo = (property_data->>'titulo')::varchar(200),
    descripcion = (property_data->>'descripcion')::text,
    precio = (property_data->>'precio')::numeric(12,2),
    operacion = (property_data->>'operacion')::varchar(10),
    tipo = (property_data->>'tipo')::varchar(20),
    recamaras = (property_data->>'recamaras')::integer,
    banos = (property_data->>'banos')::integer,
    estacionamientos = (property_data->>'estacionamientos')::integer,
    metros_construccion = (property_data->>'metros_construccion')::numeric(8,2),
    metros_terreno = (property_data->>'metros_terreno')::numeric(8,2),
    antiguedad = (property_data->>'antiguedad')::integer,
    amueblado = (property_data->>'amueblado')::boolean,
    direccion = (property_data->>'direccion')::text,
    colonia = (property_data->>'colonia')::varchar(100),
    ciudad = (property_data->>'ciudad')::varchar(100),
    estado = (property_data->>'estado')::varchar(100),
    codigo_postal = (property_data->>'codigo_postal')::varchar(10),
    latitud = (property_data->>'latitud')::double precision,
    longitud = (property_data->>'longitud')::double precision,
    imagenes = CASE 
      WHEN property_data->'imagenes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))
      ELSE '{}'::text[]
    END,
    disponible = (property_data->>'disponible')::boolean,
    destacado = (property_data->>'destacado')::boolean,
    id_interno = NULLIF(trim(property_data->>'id_interno'), '')::varchar(50),
    fecha_actualizacion = now()
  WHERE properties.id = property_id
  RETURNING 
    properties.id, properties.titulo, properties.descripcion, properties.precio, 
    properties.operacion, properties.tipo, properties.recamaras, properties.banos, 
    properties.estacionamientos, properties.metros_construccion, properties.metros_terreno, 
    properties.antiguedad, properties.amueblado, properties.direccion, properties.colonia, 
    properties.ciudad, properties.estado, properties.codigo_postal, properties.latitud, 
    properties.longitud, properties.imagenes, properties.disponible, properties.destacado, 
    properties.id_interno, properties.fecha_creacion, properties.fecha_actualizacion;
END;
$$;