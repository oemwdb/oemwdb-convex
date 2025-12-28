-- Create nemiga_source table for raw wheel data scraped from Nemigaparts.com ETKA catalog
-- This serves as a staging table for data before it gets curated into oem_wheels

CREATE TABLE IF NOT EXISTS public.nemiga_source (
    id SERIAL PRIMARY KEY,
    -- Core identification
    part_number TEXT NOT NULL,
    wheel_title TEXT,  -- Generated or scraped name
    
    -- Source tracking
    brand TEXT NOT NULL,       -- 'audi', 'bmw', 'mercedes', etc.
    vehicle TEXT,              -- 'Audi A4/Avant'
    years TEXT,                -- '2016 - 2017'
    source_url TEXT,           -- URL where data was scraped from
    
    -- Specifications (extracted from ETKA)
    width TEXT,                -- '7J', '8J', etc.
    diameter TEXT,             -- '16"', '17"', '18"', etc.
    wheel_offset TEXT,         -- 'ET35', 'ET45', etc.
    bolt_pattern TEXT,         -- '5x112', '5x120', etc.
    center_bore TEXT,          -- '66.5', '72.6', etc.
    color TEXT,                -- 'Brilliant Silver', etc.
    color_code TEXT,           -- '8Z8', '03C', etc.
    
    -- Pricing
    price_usd NUMERIC(10, 2),  -- Price in USD
    
    -- Raw data storage
    specs_raw JSONB,           -- Full specs object from scraper
    raw_data JSONB,            -- Any additional raw data
    
    -- Workflow flags
    imported_to_oem BOOLEAN DEFAULT false,  -- Has this been reviewed and added to oem_wheels?
    oem_wheel_id TEXT,                      -- Reference to created oem_wheels record
    needs_review BOOLEAN DEFAULT true,      -- Flagged for manual review
    review_notes TEXT,                      -- Notes from review process
    
    -- Metadata
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint on part_number + brand combination
    UNIQUE(part_number, brand)
);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_nemiga_source_brand ON public.nemiga_source(brand);
CREATE INDEX IF NOT EXISTS idx_nemiga_source_part_number ON public.nemiga_source(part_number);
CREATE INDEX IF NOT EXISTS idx_nemiga_source_imported ON public.nemiga_source(imported_to_oem);
CREATE INDEX IF NOT EXISTS idx_nemiga_source_vehicle ON public.nemiga_source(vehicle);

-- Add comments
COMMENT ON TABLE public.nemiga_source IS 'Raw wheel data scraped from Nemigaparts.com ETKA catalog. Serves as staging before curation into oem_wheels.';
COMMENT ON COLUMN public.nemiga_source.part_number IS 'OEM part number from ETKA (e.g., 8W0 601 025 A)';
COMMENT ON COLUMN public.nemiga_source.color_code IS 'VAG color code (e.g., 8Z8 = Brilliant Silver)';
COMMENT ON COLUMN public.nemiga_source.imported_to_oem IS 'Whether this record has been reviewed and imported to oem_wheels';
COMMENT ON COLUMN public.nemiga_source.oem_wheel_id IS 'Foreign key to the created oem_wheels record after import';

-- Enable RLS
ALTER TABLE public.nemiga_source ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to nemiga_source" 
ON public.nemiga_source FOR SELECT 
USING (true);

-- Create policy for authenticated users to insert/update
CREATE POLICY "Allow authenticated users to modify nemiga_source" 
ON public.nemiga_source FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
