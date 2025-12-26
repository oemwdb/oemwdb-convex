-- Update storage policies for private oemwdb images bucket
-- Authenticated users get full access to the oemwdb images bucket

-- Drop old public policies
DROP POLICY IF EXISTS "Allow public SELECT on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public INSERT on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public UPDATE on public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public DELETE on public buckets" ON storage.objects;

-- Create policies for authenticated users on oemwdb images bucket
CREATE POLICY "Authenticated users can view oemwdb images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'oemwdb images');

CREATE POLICY "Authenticated users can upload to oemwdb images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'oemwdb images');

CREATE POLICY "Authenticated users can update oemwdb images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'oemwdb images')
WITH CHECK (bucket_id = 'oemwdb images');

CREATE POLICY "Authenticated users can delete from oemwdb images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'oemwdb images');
