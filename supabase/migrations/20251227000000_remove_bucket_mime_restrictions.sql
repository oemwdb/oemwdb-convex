-- Update oemwdb images bucket to allow all MIME types
-- This removes MIME type restrictions that cause upload failures

-- Drop and recreate the bucket with no MIME restrictions
-- Note: This preserves existing files

-- Update the bucket's allowed_mime_types to null (allow all)
UPDATE storage.buckets 
SET allowed_mime_types = NULL
WHERE id = 'oemwdb images';

-- If that doesn't work, we'll also ensure the bucket exists with correct settings
INSERT INTO storage.buckets (id, name, public, avif_autodetection, allowed_mime_types)
VALUES ('oemwdb images', 'oemwdb images', true, false, NULL)
ON CONFLICT (id) DO UPDATE 
SET allowed_mime_types = NULL,
    public = true;
