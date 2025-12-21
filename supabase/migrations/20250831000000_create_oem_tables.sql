-- Create OEM Tables Schema (reconstructed from types.ts and import needs)

-- 1. oem_brands
CREATE TABLE IF NOT EXISTS public.oem_brands (
    id TEXT PRIMARY KEY, -- slug (e.g. 'rolls-royce')
    brand_title TEXT NOT NULL,
    brand_description TEXT,
    brand_image_url TEXT,
    brand_page TEXT,
    wheel_count INTEGER,
    -- JSONB refs
    parent_company_ref JSONB,
    founded_year_ref JSONB,
    headquarters_ref JSONB,
    country_ref JSONB,
    brand_type_ref JSONB,
    specialties_ref JSONB,
    brands_tuned_ref JSONB,
    subsidiaries TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. oem_vehicles
CREATE TABLE IF NOT EXISTS public.oem_vehicles (
    id TEXT PRIMARY KEY, -- e.g. 'Rolls-Royce - RR01: Phantom VII'
    vehicle_title TEXT,
    model_name TEXT,
    generation TEXT,
    production_years TEXT,
    vehicle_image TEXT,
    vehicle_id_only TEXT,
    production_stats TEXT,
    oem_engine_ref TEXT,
    -- JSONB refs
    brand_ref JSONB,
    diameter_ref JSONB,
    width_ref JSONB,
    bolt_pattern_ref JSONB,
    center_bore_ref JSONB,
    wheel_ref JSONB,
    color_ref JSONB,
    detailed_specs JSONB, -- Added from populate_rr_data usage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. oem_wheels
CREATE TABLE IF NOT EXISTS public.oem_wheels (
    id TEXT PRIMARY KEY, -- slug
    wheel_title TEXT NOT NULL,
    part_numbers TEXT,
    oem_part_number TEXT, -- alias?
    wheel_offset TEXT,
    weight TEXT,
    notes TEXT,
    color TEXT,
    metal_type TEXT,
    image_source TEXT,
    good_pic_url TEXT,
    bad_pic_url TEXT,
    production_ready BOOLEAN DEFAULT false,
    ai_processing_complete BOOLEAN DEFAULT false,
    uuid TEXT, -- maybe UUID generated?
    -- JSONB refs
    brand_ref JSONB,
    diameter_ref JSONB,
    width_ref JSONB,
    bolt_pattern_ref JSONB,
    center_bore_ref JSONB,
    vehicle_ref JSONB,
    color_ref JSONB,
    tire_size_ref JSONB,
    design_style_ref TEXT[], -- Array of strings
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. vehicle_maintenance (referenced in populate_rr_data)
CREATE TABLE IF NOT EXISTS public.vehicle_maintenance (
    id SERIAL PRIMARY KEY,
    vehicle_id TEXT REFERENCES public.oem_vehicles(id),
    category TEXT,
    type TEXT,
    title TEXT,
    description TEXT,
    interval_miles TEXT,
    production_ready BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. vehicle_upgrades (referenced in populate_rr_data)
CREATE TABLE IF NOT EXISTS public.vehicle_upgrades (
    id SERIAL PRIMARY KEY,
    vehicle_id TEXT REFERENCES public.oem_vehicles(id),
    category TEXT,
    title TEXT,
    description TEXT,
    source TEXT,
    level TEXT,
    production_ready BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
