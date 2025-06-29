/*
  # Create admin users for Nova Hestia

  1. New Users
    - Create admin users with username-based authentication
    - Use internal email format for Supabase compatibility
    - Set proper metadata for user identification

  2. Security
    - Users will authenticate with username/password
    - Email format: username@novahestia.internal
    - Proper user metadata for display names
*/

-- Create admin user with username 'admin'
DO $$
DECLARE
    admin_user_id uuid;
BEGIN
    -- Generate UUID for the user
    admin_user_id := gen_random_uuid();

    -- Insert admin user
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
        'admin@novahestia.internal',
        crypt('NovaHestia25**', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Administrador Nova Hestia", "username": "admin"}'
    );

    -- Insert identity for admin user
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
        format('{"sub":"%s","email":"%s","name":"Administrador Nova Hestia","username":"admin"}', 
            admin_user_id::text, 
            'admin@novahestia.internal'
        )::jsonb,
        'email',
        'admin@novahestia.internal',
        NOW(),
        NOW()
    );

EXCEPTION
    WHEN others THEN
        -- User might already exist, continue
        NULL;
END $$;