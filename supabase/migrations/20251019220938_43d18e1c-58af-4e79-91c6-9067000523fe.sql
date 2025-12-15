-- Add image_source column to oem_wheels table
ALTER TABLE public.oem_wheels 
ADD COLUMN IF NOT EXISTS image_source text;

COMMENT ON COLUMN public.oem_wheels.image_source IS 'Source or attribution for the wheel image';