-- Add offset_ref column to oem_wheels table
ALTER TABLE oem_wheels ADD COLUMN IF NOT EXISTS offset_ref jsonb;
