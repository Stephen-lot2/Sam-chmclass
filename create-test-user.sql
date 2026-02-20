-- Create a test user directly in Supabase
-- Run this in your Supabase SQL Editor

-- This creates a user with:
-- Email: test@example.com
-- Password: Test123456!

-- Note: You'll need to run this in Supabase dashboard > SQL Editor

INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
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
  'test@example.com',
  crypt('Test123456!', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Verify the user was created
SELECT email, raw_user_meta_data->>'full_name' as name, created_at 
FROM auth.users 
WHERE email = 'test@example.com';
