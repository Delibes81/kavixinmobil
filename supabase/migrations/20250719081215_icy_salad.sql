/*
  # Actualizar funciones RPC para manejar id_interno

  Esta migración actualiza las funciones de administración de propiedades para incluir
  el campo id_interno que fue agregado manualmente a la tabla properties.

  ## Cambios incluidos:
  1. Eliminar funciones existentes para evitar conflictos de tipo
  2. Recrear admin_create_property con soporte para id_interno
  3. Recrear admin_update_property con soporte para id_interno
  4. Recrear admin_delete_property mejorada
  5. Recrear admin_set_property_amenities
  6. Otorgar permisos necesarios

  ## Funciones actualizadas:
  - admin_create_property: Incluye id_interno en la creación
  - admin_update_property: Incluye id_interno en la actualización
  - admin_delete_property: Función mejorada para eliminación
  - admin_set_property_amenities: Gestión de amenidades
*/

-- Drop existing functions first to avoid type conflicts
DROP FUNCTION IF EXISTS public.admin_create_property(jsonb);
DROP FUNCTION IF EXISTS public.admin_update_property(uuid, jsonb);
DROP FUNCTION IF EXISTS public.admin_delete_property(uuid);
DROP FUNCTION IF EXISTS public.admin_set_property_amenities(uuid, uuid[]);

-- Create admin_create_property function with id_interno support
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
        CASE 
            WHEN property_data->>'id_interno' = '' THEN NULL 
            ELSE property_data->>'id_interno' 
        END
    )
    RETURNING id INTO new_property_id;

    RETURN QUERY SELECT * FROM public.properties WHERE id = new_property_id;
END;
$$;

-- Create admin_update_property function with id_interno support
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
        id_interno = CASE 
            WHEN property_data->>'id_interno' = '' THEN NULL 
            ELSE property_data->>'id_interno' 
        END,
        fecha_actualizacion = now()
    WHERE id = property_id;

    RETURN QUERY SELECT * FROM public.properties WHERE id = property_id;
END;
$$;

-- Create admin_delete_property function
CREATE OR REPLACE FUNCTION public.admin_delete_property(property_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete property amenities first (due to foreign key constraint)
    DELETE FROM public.property_amenities WHERE property_id = admin_delete_property.property_id;
    
    -- Delete the property
    DELETE FROM public.properties WHERE id = admin_delete_property.property_id;
END;
$$;

-- Create admin_set_property_amenities function
CREATE OR REPLACE FUNCTION public.admin_set_property_amenities(property_id uuid, amenity_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Delete existing amenities for the property
    DELETE FROM public.property_amenities
    WHERE property_amenities.property_id = admin_set_property_amenities.property_id;

    -- Insert new amenities if any are provided
    IF array_length(amenity_ids, 1) > 0 THEN
        INSERT INTO public.property_amenities (property_id, amenity_id)
        SELECT admin_set_property_amenities.property_id, unnest(amenity_ids);
    END IF;
END;
$$;

-- Grant execution privileges to authenticated users
GRANT EXECUTE ON FUNCTION public.admin_create_property(jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_property(uuid, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_property(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_property_amenities(uuid, uuid[]) TO authenticated;