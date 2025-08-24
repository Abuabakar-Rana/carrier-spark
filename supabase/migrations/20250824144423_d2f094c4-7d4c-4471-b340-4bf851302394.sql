-- First, let's create the admin user in auth.users
-- Note: This creates a user with email as username for Supabase auth compatibility
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'nestnic@admin.com', -- Using email format for Supabase auth
  crypt('Mv@{;($3CoEBCU2z*Q6j', gen_salt('bf')), -- Encrypt the password
  NOW(),
  NOW(),
  NOW(),
  '{"username": "Nestnic Solutions"}',
  false,
  'authenticated'
);

-- Create the profile for this admin user
INSERT INTO public.profiles (
  user_id,
  username,
  full_name,
  role
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'nestnic@admin.com'),
  'Nestnic Solutions',
  'Nestnic Solutions Admin',
  'admin'
);