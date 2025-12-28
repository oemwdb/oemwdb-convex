-- Fix RLS policy for nemiga_source to allow inserts via service role or anon key during import

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Allow authenticated users to modify nemiga_source" ON public.nemiga_source;

-- Create a more permissive policy for inserts (can be tightened later)
CREATE POLICY "Allow all inserts to nemiga_source" 
ON public.nemiga_source FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all updates to nemiga_source" 
ON public.nemiga_source FOR UPDATE
USING (true)
WITH CHECK (true);
