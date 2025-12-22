-- Fix Database Script
-- Created: 2025-12-22
-- Purpose: Create vehicle_variants table and fix bidirectional wheel_ref on vehicles

-- ============================================
-- 1. CREATE VEHICLE_VARIANTS TABLE
-- ============================================

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

-- Enable RLS
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY IF NOT EXISTS "Allow public read access on vehicle_variants"
    ON public.vehicle_variants
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ============================================
-- 2. INSERT VARIANT DATA
-- ============================================

INSERT INTO public.vehicle_variants (id, vehicle_id, model_name, year_start, year_end, engine_summary, power_summary, body_type, search_term)
VALUES
    ('rr01-phantom-vii-standard', 'rolls-royce-rr01-phantom-vii', 'Phantom VII Standard', 2003, 2017, '6.75L N73 V12 NA', '453 hp / 720 Nm', 'Sedan', 'Rolls-Royce Phantom VII'),
    ('rr01-phantom-vii-ewb', 'rolls-royce-rr01-phantom-vii', 'Phantom VII Extended Wheelbase', 2005, 2017, '6.75L N73 V12 NA', '453 hp / 720 Nm', 'Sedan LWB', 'Rolls-Royce Phantom VII EWB'),
    ('rr11-phantom-viii-standard', 'rolls-royce-rr11-phantom-viii', 'Phantom VIII Standard', 2017, NULL, '6.75L N74 Twin-Turbo V12', '563 hp / 900 Nm', 'Sedan', 'Rolls-Royce Phantom VIII'),
    ('rr11-phantom-viii-ewb', 'rolls-royce-rr11-phantom-viii', 'Phantom VIII Extended', 2017, NULL, '6.75L N74 Twin-Turbo V12', '563 hp / 900 Nm', 'Sedan LWB', 'Rolls-Royce Phantom VIII Extended'),
    ('rr04-ghost-i-standard', 'rolls-royce-rr04-ghost-i', 'Ghost I Standard', 2010, 2020, '6.6L N74 Twin-Turbo V12', '563 hp / 780 Nm', 'Sedan', 'Rolls-Royce Ghost'),
    ('rr04-ghost-i-ewb', 'rolls-royce-rr04-ghost-i', 'Ghost I Extended Wheelbase', 2011, 2020, '6.6L N74 Twin-Turbo V12', '563 hp / 780 Nm', 'Sedan LWB', 'Rolls-Royce Ghost EWB'),
    ('rr04-ghost-i-series-ii', 'rolls-royce-rr04-ghost-i', 'Ghost Series II', 2014, 2020, '6.6L N74 Twin-Turbo V12', '563 hp / 780 Nm', 'Sedan', 'Rolls-Royce Ghost Series II'),
    ('rr21-ghost-ii-standard', 'rolls-royce-rr21-ghost-ii', 'Ghost II Standard', 2020, NULL, '6.75L N74 Twin-Turbo V12', '563 hp / 850 Nm', 'Sedan', 'Rolls-Royce Ghost 2021'),
    ('rr21-ghost-ii-black-badge', 'rolls-royce-rr21-ghost-ii', 'Ghost II Black Badge', 2021, NULL, '6.75L N74 Twin-Turbo V12', '592 hp / 900 Nm', 'Sedan', 'Rolls-Royce Ghost Black Badge'),
    ('rr05-wraith-standard', 'rolls-royce-rr05-wraith', 'Wraith Standard', 2013, 2023, '6.6L N74 Twin-Turbo V12', '624 hp / 800 Nm', 'Coupe', 'Rolls-Royce Wraith'),
    ('rr05-wraith-black-badge', 'rolls-royce-rr05-wraith', 'Wraith Black Badge', 2016, 2023, '6.6L N74 Twin-Turbo V12', '632 hp / 870 Nm', 'Coupe', 'Rolls-Royce Wraith Black Badge'),
    ('rr06-dawn-standard', 'rolls-royce-rr06-dawn', 'Dawn Standard', 2015, 2023, '6.6L N74 Twin-Turbo V12', '563 hp / 780 Nm', 'Convertible', 'Rolls-Royce Dawn'),
    ('rr06-dawn-black-badge', 'rolls-royce-rr06-dawn', 'Dawn Black Badge', 2017, 2023, '6.6L N74 Twin-Turbo V12', '593 hp / 840 Nm', 'Convertible', 'Rolls-Royce Dawn Black Badge'),
    ('rr31-cullinan-standard', 'rolls-royce-rr31-cullinan', 'Cullinan Standard', 2018, NULL, '6.75L N74 Twin-Turbo V12', '563 hp / 850 Nm', 'SUV', 'Rolls-Royce Cullinan'),
    ('rr31-cullinan-black-badge', 'rolls-royce-rr31-cullinan', 'Cullinan Black Badge', 2019, NULL, '6.75L N74 Twin-Turbo V12', '592 hp / 900 Nm', 'SUV', 'Rolls-Royce Cullinan Black Badge'),
    ('rr25-spectre-standard', 'rolls-royce-rr25-spectre', 'Spectre Standard', 2023, NULL, 'Dual Electric Motors', '577 hp / 900 Nm', 'Electric Coupe', 'Rolls-Royce Spectre')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. FIX BIDIRECTIONAL wheel_ref ON VEHICLES
-- ============================================
-- This updates each vehicle's wheel_ref JSONB with all wheels that reference it

UPDATE public.oem_vehicles v
SET wheel_ref = (
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', w.id,
            'title', w.wheel_title
        )
    )
    FROM public.oem_wheels w
    WHERE w.vehicle_ref IS NOT NULL
      AND EXISTS (
          SELECT 1
          FROM jsonb_array_elements(w.vehicle_ref) AS elem
          WHERE elem->>'id' = v.id
      )
);

-- ============================================
-- 4. VERIFICATION QUERIES
-- ============================================

-- Show variant count
SELECT 'vehicle_variants count:' as check, COUNT(*)::text as result FROM public.vehicle_variants
UNION ALL
-- Show vehicles with wheel_ref populated
SELECT 'vehicles with wheel_ref:', COUNT(*)::text FROM public.oem_vehicles WHERE wheel_ref IS NOT NULL;
