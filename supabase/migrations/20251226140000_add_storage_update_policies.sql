-- Add UPDATE policy for storage.objects to enable file move operations
-- This is needed because Supabase storage.move() requires UPDATE permission

-- ============================================================================
-- SAFE APPROACH: Only add UPDATE policies that are currently missing
-- We use DROP POLICY IF EXISTS before creating to avoid conflicts
-- ============================================================================

-- UPDATE policy for listing-files bucket
DROP POLICY IF EXISTS "Users can move files in listing-files" ON storage.objects;
CREATE POLICY "Users can move files in listing-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'listing-files')
WITH CHECK (bucket_id = 'listing-files');

-- UPDATE policy for registered-vehicles bucket (only own files)
DROP POLICY IF EXISTS "Users can move own registered-vehicle files" ON storage.objects;
CREATE POLICY "Users can move own registered-vehicle files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'registered-vehicles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'registered-vehicles' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============================================================================
-- GENERIC POLICIES FOR ALL PUBLIC BUCKETS (for buckets like oem-wheels)
-- These allow any authenticated user full access to public storage buckets
-- ============================================================================

-- NOTE: We only add policies if they don't already exist for specific buckets
-- The bucket_id subquery dynamically checks which buckets are public

DROP POLICY IF EXISTS "Allow authenticated CRUD on public buckets" ON storage.objects;
CREATE POLICY "Allow authenticated CRUD on public buckets"
ON storage.objects
TO authenticated
USING (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
)
WITH CHECK (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
);
