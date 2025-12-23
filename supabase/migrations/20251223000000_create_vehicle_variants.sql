-- Create vehicle_variants table
-- This migration adds the vehicle_variants table for storing vehicle trim/variant information

CREATE TABLE IF NOT EXISTS public.vehicle_variants (
    id TEXT PRIMARY KEY,
    vehicle_id TEXT REFERENCES public.oem_vehicles(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    year_start INTEGER,
    year_end INTEGER,
    engine_summary TEXT,
    power_summary TEXT,
    body_type TEXT,
    search_term TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on vehicle_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_variants_vehicle_id ON public.vehicle_variants(vehicle_id);

-- Enable RLS
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'vehicle_variants' 
        AND policyname = 'vehicle_variants_select'
    ) THEN
        CREATE POLICY vehicle_variants_select ON public.vehicle_variants 
            FOR SELECT TO anon, authenticated USING (true);
    END IF;
END $$;
