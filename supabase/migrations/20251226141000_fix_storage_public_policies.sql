-- Add full access policies for storage.objects on public buckets
-- This enables file move, rename, delete etc. for all users on public buckets

-- ============================================================================
-- GENERIC POLICIES FOR ALL PUBLIC BUCKETS (for buckets like oemwdb images)
-- These allow ANY user (including anon) full access to public storage buckets
-- ============================================================================

-- Allow public SELECT on public buckets (anyone can view)
DROP POLICY IF EXISTS "Allow public SELECT on public buckets" ON storage.objects;
CREATE POLICY "Allow public SELECT on public buckets"
ON storage.objects FOR SELECT
TO public
USING (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
);

-- Allow public INSERT on public buckets (anyone can upload)
DROP POLICY IF EXISTS "Allow public INSERT on public buckets" ON storage.objects;
CREATE POLICY "Allow public INSERT on public buckets"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
);

-- Allow public UPDATE on public buckets (anyone can move/rename)
DROP POLICY IF EXISTS "Allow public UPDATE on public buckets" ON storage.objects;
CREATE POLICY "Allow public UPDATE on public buckets"
ON storage.objects FOR UPDATE
TO public
USING (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
)
WITH CHECK (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
);

-- Allow public DELETE on public buckets (anyone can delete)
DROP POLICY IF EXISTS "Allow public DELETE on public buckets" ON storage.objects;
CREATE POLICY "Allow public DELETE on public buckets"
ON storage.objects FOR DELETE
TO public
USING (
  bucket_id IN (SELECT id FROM storage.buckets WHERE public = true)
);
