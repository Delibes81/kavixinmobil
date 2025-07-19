/*
  # Create admin user and authentication setup

  1. Create admin user in auth.users table
  2. Set up user profile if needed
  3. Configure admin permissions

  Note: This creates a demo admin user for testing purposes
*/

-- Insert admin user into auth.users table
-- Password: admin123 (hashed)
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
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
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
  ''
);

-- Insert identity for the admin user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@novahestia.com'),
  format('{"sub":"%s","email":"%s"}', 
    (SELECT id FROM auth.users WHERE email = 'admin@novahestia.com')::text, 
    'admin@novahestia.com'
  )::jsonb,
  'email',
  NOW(),
  NOW()
);

-- Create a second admin user for demonstration
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
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
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
  ''
);

-- Insert identity for the second admin user
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'carlos.rodriguez@novahestia.com'),
  format('{"sub":"%s","email":"%s"}', 
    (SELECT id FROM auth.users WHERE email = 'carlos.rodriguez@novahestia.com')::text, 
    'carlos.rodriguez@novahestia.com'
  )::jsonb,
  'email',
  NOW(),
  NOW()
);