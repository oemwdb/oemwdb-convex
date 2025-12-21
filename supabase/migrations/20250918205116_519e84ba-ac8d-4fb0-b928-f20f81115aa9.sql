-- Make the existing user an admin
-- Commented out: User does not exist yet in fresh local setup
/*
-- First, check if the user already has a role entry
INSERT INTO public.user_roles (user_id, role)
VALUES ('f002f89d-b27b-41da-b5cc-058b5eee8d48', 'admin')
ON CONFLICT (user_id, role)
DO UPDATE SET role = 'admin';

-- If they have a 'user' role, update it to 'admin'
UPDATE public.user_roles
SET role = 'admin'
WHERE user_id = 'f002f89d-b27b-41da-b5cc-058b5eee8d48'
AND role = 'user';
*/