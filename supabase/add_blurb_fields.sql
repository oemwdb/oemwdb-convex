-- Add public_blurb and private_blurb fields to brands, vehicles, and wheels tables
-- public_blurb: visible description for public display
-- private_blurb: internal notes, not shown publicly

-- Add to oem_brands
ALTER TABLE oem_brands 
ADD COLUMN IF NOT EXISTS public_blurb TEXT,
ADD COLUMN IF NOT EXISTS private_blurb TEXT;

-- Add to oem_vehicles
ALTER TABLE oem_vehicles 
ADD COLUMN IF NOT EXISTS public_blurb TEXT,
ADD COLUMN IF NOT EXISTS private_blurb TEXT;

-- Add to oem_wheels
ALTER TABLE oem_wheels 
ADD COLUMN IF NOT EXISTS public_blurb TEXT,
ADD COLUMN IF NOT EXISTS private_blurb TEXT;

-- Add comments for documentation
COMMENT ON COLUMN oem_brands.public_blurb IS 'Public-facing description/blurb for this brand';
COMMENT ON COLUMN oem_brands.private_blurb IS 'Internal notes, not shown publicly';

COMMENT ON COLUMN oem_vehicles.public_blurb IS 'Public-facing description/blurb for this vehicle';
COMMENT ON COLUMN oem_vehicles.private_blurb IS 'Internal notes, not shown publicly';

COMMENT ON COLUMN oem_wheels.public_blurb IS 'Public-facing description/blurb for this wheel';
COMMENT ON COLUMN oem_wheels.private_blurb IS 'Internal notes, not shown publicly';
