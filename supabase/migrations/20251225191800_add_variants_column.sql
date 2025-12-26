-- Run this in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jnzfebtczqxxnvwgypgk/sql

ALTER TABLE oem_wheels ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
