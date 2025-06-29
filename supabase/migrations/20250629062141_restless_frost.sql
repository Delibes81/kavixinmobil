/*
  # Create admin users for Nova Hestia

  1. New Users
    - Create admin users in auth.users table
    - Create corresponding identities in auth.identities table
    - Set up proper authentication structure

  2. Security
    - Users are created with encrypted passwords
    - Email confirmation is set to confirmed
    - Proper metadata is included
*/

-- Create admin users with proper auth structure
DO $$
DECLARE
    admin_user_id uuid;
    carlos_user_id uuid;
BEGIN
    -- Generate UUIDs for the users
    admin_user_id := gen_random_uuid();
    carlos_user_id := gen_random_uuid();

    -- Insert first admin user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        admin_user_id,
        'authenticated',
        'authenticated',
        'admin@novahestia.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Admin Nova Hestia", "role": "admin"}'
    );

    -- Insert identity for first admin user (without email column since it's generated)
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        admin_user_id,
        format('{"sub":"%s","email":"%s","name":"Admin Nova Hestia"}', 
            admin_user_id::text, 
            'admin@novahestia.com'
        )::jsonb,
        'email',
        'admin@novahestia.com',
        NOW(),
        NOW()
    );

    -- Insert second admin user
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token,
        raw_app_meta_data,
        raw_user_meta_data
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        carlos_user_id,
        'authenticated',
        'authenticated',
        'carlos.rodriguez@novahestia.com',
        crypt('admin123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Carlos Rodriguez", "role": "admin"}'
    );

    -- Insert identity for second admin user (without email column since it's generated)
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        created_at,
        updated_at
    ) VALUES (
        gen_random_uuid(),
        carlos_user_id,
        format('{"sub":"%s","email":"%s","name":"Carlos Rodriguez"}', 
            carlos_user_id::text, 
            'carlos.rodriguez@novahestia.com'
        )::jsonb,
        'email',
        'carlos.rodriguez@novahestia.com',
        NOW(),
        NOW()
    );

END $$;