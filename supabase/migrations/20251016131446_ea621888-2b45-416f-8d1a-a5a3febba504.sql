-- Create storage bucket for listing files
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-files', 'listing-files', true);

-- RLS Policy: Allow authenticated users to upload their own files
CREATE POLICY "Users can upload listing files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'listing-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS Policy: Allow users to view all public listing files
CREATE POLICY "Public listing files are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-files');

-- RLS Policy: Allow users to delete their own files
CREATE POLICY "Users can delete their own listing files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'listing-files' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add documents column to market_listings table
ALTER TABLE market_listings
ADD COLUMN IF NOT EXISTS documents text[];