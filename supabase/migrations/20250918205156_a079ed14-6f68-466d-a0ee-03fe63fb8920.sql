-- Update the existing user role from 'user' to 'admin'
UPDATE public.user_roles 
SET role = 'admin'
WHERE user_id = 'f002f89d-b27b-41da-b5cc-058b5eee8d48';