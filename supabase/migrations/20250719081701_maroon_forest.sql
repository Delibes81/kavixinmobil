/*
  # Actualizar funciones RPC para manejar id_interno

  1. Funciones actualizadas
    - `admin_create_property` - Incluye id_interno en INSERT
    - `admin_update_property` - Incluye id_interno en UPDATE

  2. Cambios
    - Agrega soporte para el campo id_interno en ambas funciones
    - Mantiene todas las funcionalidades existentes
*/

-- Drop existing functions to avoid conflicts
DROP FUNCTION IF EXISTS public.admin_create_property(jsonb);
DROP FUNCTION IF EXISTS public.admin_update_property(uuid, jsonb);

-- Recreate admin_create_property with id_interno support
CREATE OR REPLACE FUNCTION public.admin_create_property(property_data jsonb)
RETURNS SETOF public.properties
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_property_id uuid;
BEGIN
    INSERT INTO public.properties (
        titulo, descripcion, precio, operacion, tipo, recamaras, banos, estacionamientos,
        metros_construccion, metros_terreno, antiguedad, amueblado, direccion, colonia,
        ciudad, estado, codigo_postal, latitud, longitud, imagenes, disponible, destacado, id_interno
    ) VALUES (
        property_data->>'titulo',
        property_data->>'descripcion',
        (property_data->>'precio')::numeric,
        property_data->>'operacion',
        property_data->>'tipo',
        (property_data->>'recamaras')::integer,
        (property_data->>'banos')::integer,
        (property_data->>'estacionamientos')::integer,
        (property_data->>'metros_construccion')::numeric,
        (property_data->>'metros_terreno')::numeric,
        (property_data->>'antiguedad')::integer,
        (property_data->>'amueblado')::boolean,
        property_data->>'direccion',
        property_data->>'colonia',
        property_data->>'ciudad',
        property_data->>'estado',
        property_data->>'codigo_postal',
        (property_data->>'latitud')::double precision,
        (property_data->>'longitud')::double precision,
        (SELECT ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))),
        (property_data->>'disponible')::boolean,
        (property_data->>'destacado')::boolean,
        NULLIF(property_data->>'id_interno', '')
    )
    RETURNING id INTO new_property_id;

    RETURN QUERY SELECT * FROM public.properties WHERE id = new_property_id;
END;
$$;

-- Recreate admin_update_property with id_interno support
CREATE OR REPLACE FUNCTION public.admin_update_property(property_id uuid, property_data jsonb)
RETURNS SETOF public.properties
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.properties
    SET
        titulo = property_data->>'titulo',
        descripcion = property_data->>'descripcion',
        precio = (property_data->>'precio')::numeric,
        operacion = property_data->>'operacion',
        tipo = property_data->>'tipo',
        recamaras = (property_data->>'recamaras')::integer,
        banos = (property_data->>'banos')::integer,
        estacionamientos = (property_data->>'estacionamientos')::integer,
        metros_construccion = (property_data->>'metros_construccion')::numeric,
        metros_terreno = (property_data->>'metros_terreno')::numeric,
        antiguedad = (property_data->>'antiguedad')::integer,
        amueblado = (property_data->>'amueblado')::boolean,
        direccion = property_data->>'direccion',
        colonia = property_data->>'colonia',
        ciudad = property_data->>'ciudad',
        estado = property_data->>'estado',
        codigo_postal = property_data->>'codigo_postal',
        latitud = (property_data->>'latitud')::double precision,
        longitud = (property_data->>'longitud')::double precision,
        imagenes = (SELECT ARRAY(SELECT jsonb_array_elements_text(property_data->'imagenes'))),
        disponible = (property_data->>'disponible')::boolean,
        destacado = (property_data->>'destacado')::boolean,
        id_interno = NULLIF(property_data->>'id_interno', ''),
        fecha_actualizacion = now()
    WHERE id = property_id;

    RETURN QUERY SELECT * FROM public.properties WHERE id = property_id;
END;
$$;

-- Grant execution privileges
GRANT EXECUTE ON FUNCTION public.admin_create_property(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_property(uuid, jsonb) TO authenticated;