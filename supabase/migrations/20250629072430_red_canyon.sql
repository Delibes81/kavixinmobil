/*
  # Sistema de usuarios administradores manuales

  1. Nueva tabla
    - `admin_users` - Tabla para usuarios administradores gestionados manualmente
      - `id` (uuid, primary key)
      - `username` (text, unique) - Nombre de usuario único
      - `password_hash` (text) - Hash de la contraseña
      - `name` (text) - Nombre completo del usuario
      - `role` (text) - Rol del usuario (admin, super_admin, etc.)
      - `active` (boolean) - Si el usuario está activo
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `last_login` (timestamp)

  2. Seguridad
    - Enable RLS en la tabla
    - Solo usuarios autenticados pueden leer sus propios datos
    - Solo super_admin puede gestionar usuarios

  3. Función para verificar contraseñas
    - Función para validar login con username/password
*/

-- Crear tabla de usuarios administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'admin',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Habilitar RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Super admin can manage all users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id::text = auth.uid()::text 
      AND role = 'super_admin' 
      AND active = true
    )
  );

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- Función para verificar login (sin usar auth de Supabase)
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username text,
  p_password text
)
RETURNS TABLE(
  user_id uuid,
  username text,
  name text,
  role text,
  success boolean
) AS $$
DECLARE
  user_record admin_users%ROWTYPE;
BEGIN
  -- Buscar usuario activo
  SELECT * INTO user_record
  FROM admin_users
  WHERE admin_users.username = p_username
    AND admin_users.active = true;

  -- Si no existe el usuario
  IF NOT FOUND THEN
    RETURN QUERY SELECT 
      NULL::uuid, 
      NULL::text, 
      NULL::text, 
      NULL::text, 
      false;
    RETURN;
  END IF;

  -- Verificar contraseña (usando crypt para comparar hash)
  IF crypt(p_password, user_record.password_hash) = user_record.password_hash THEN
    -- Actualizar último login
    UPDATE admin_users 
    SET last_login = now() 
    WHERE id = user_record.id;

    -- Retornar datos del usuario
    RETURN QUERY SELECT 
      user_record.id,
      user_record.username,
      user_record.name,
      user_record.role,
      true;
  ELSE
    -- Contraseña incorrecta
    RETURN QUERY SELECT 
      NULL::uuid, 
      NULL::text, 
      NULL::text, 
      NULL::text, 
      false;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear hash de contraseña
CREATE OR REPLACE FUNCTION create_admin_user(
  p_username text,
  p_password text,
  p_name text,
  p_role text DEFAULT 'admin'
)
RETURNS uuid AS $$
DECLARE
  new_user_id uuid;
BEGIN
  INSERT INTO admin_users (username, password_hash, name, role)
  VALUES (
    p_username,
    crypt(p_password, gen_salt('bf')),
    p_name,
    p_role
  )
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insertar usuario administrador por defecto
SELECT create_admin_user(
  'admin',
  'admin123',
  'Administrador Principal',
  'super_admin'
);

-- Insertar usuario de prueba
SELECT create_admin_user(
  'usuario1',
  'password123',
  'Usuario de Prueba',
  'admin'
);