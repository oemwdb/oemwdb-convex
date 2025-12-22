-- Create OEM Engines table
CREATE TABLE IF NOT EXISTS oem_engines (
    id TEXT PRIMARY KEY,
    engine_code TEXT NOT NULL,
    engine_name TEXT,
    brand_ref TEXT,
    displacement_cc INTEGER,
    displacement_l DECIMAL(3,1),
    cylinders INTEGER,
    configuration TEXT, -- V12, V8, I6, Electric, etc.
    aspiration TEXT, -- naturally aspirated, twin-turbo, supercharged, electric
    power_hp INTEGER,
    power_kw INTEGER,
    torque_nm INTEGER,
    torque_lb_ft INTEGER,
    fuel_type TEXT, -- petrol, diesel, electric, hybrid
    production_years TEXT,
    vehicle_ref JSONB, -- Array of vehicle IDs that use this engine
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_oem_engines_brand ON oem_engines(brand_ref);
CREATE INDEX IF NOT EXISTS idx_oem_engines_engine_code ON oem_engines(engine_code);

-- Enable RLS
ALTER TABLE oem_engines ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access on oem_engines"
ON oem_engines FOR SELECT
TO public
USING (true);

-- Insert Rolls-Royce engines (BMW era, 2003+)

-- Phantom I (2003-2017) - N73B68
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n73b68',
    'N73B68',
    '6.75L V12',
    'rolls-royce',
    6749,
    6.7,
    12,
    'V12',
    'naturally aspirated',
    453,
    338,
    720,
    531,
    'petrol',
    '2003-2017',
    'BMW N73 naturally aspirated V12. Used in Phantom I. One of the last large displacement NA V12s in production.'
) ON CONFLICT (id) DO NOTHING;

-- Phantom II (2017+) / Ghost II / Cullinan - N74B68
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n74b68',
    'N74B68',
    '6.75L V12 Twin-Turbo',
    'rolls-royce',
    6749,
    6.7,
    12,
    'V12',
    'twin-turbo',
    563,
    420,
    900,
    664,
    'petrol',
    '2017-present',
    'BMW N74 twin-turbocharged V12. Used in Phantom VIII, Ghost II, and Cullinan. The pinnacle of Rolls-Royce ICE power.'
) ON CONFLICT (id) DO NOTHING;

-- Ghost I / Wraith / Dawn - N74B66
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n74b66',
    'N74B66',
    '6.6L V12 Twin-Turbo',
    'rolls-royce',
    6592,
    6.6,
    12,
    'V12',
    'twin-turbo',
    563,
    420,
    780,
    575,
    'petrol',
    '2009-2020',
    'BMW N74 twin-turbocharged V12 in 6.6L form. Base power for Ghost I, later increased to 570hp for Ghost II Series.'
) ON CONFLICT (id) DO NOTHING;

-- Wraith Black Badge - N74B66 (higher output)
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n74b66-bb',
    'N74B66 Black Badge',
    '6.6L V12 Twin-Turbo Black Badge',
    'rolls-royce',
    6592,
    6.6,
    12,
    'V12',
    'twin-turbo',
    624,
    465,
    870,
    642,
    'petrol',
    '2016-present',
    'High-output version of N74B66 for Black Badge models. Used in Wraith Black Badge and Dawn Black Badge.'
) ON CONFLICT (id) DO NOTHING;

-- Ghost Black Badge - N74B68 (higher output)
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n74b68-bb',
    'N74B68 Black Badge',
    '6.75L V12 Twin-Turbo Black Badge',
    'rolls-royce',
    6749,
    6.7,
    12,
    'V12',
    'twin-turbo',
    592,
    441,
    900,
    664,
    'petrol',
    '2021-present',
    'High-output version of N74B68 for Ghost Black Badge. Enhanced power with signature Black Badge tuning.'
) ON CONFLICT (id) DO NOTHING;

-- Cullinan Black Badge - N74B68 (higher output)
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'n74b68-cullinan-bb',
    'N74B68 Cullinan Black Badge',
    '6.75L V12 Twin-Turbo Cullinan Black Badge',
    'rolls-royce',
    6749,
    6.7,
    12,
    'V12',
    'twin-turbo',
    600,
    447,
    900,
    664,
    'petrol',
    '2019-present',
    'High-output version of N74B68 for Cullinan Black Badge. Darkest and most powerful Cullinan variant.'
) ON CONFLICT (id) DO NOTHING;

-- Spectre - Electric
INSERT INTO oem_engines (id, engine_code, engine_name, brand_ref, displacement_cc, displacement_l, cylinders, configuration, aspiration, power_hp, power_kw, torque_nm, torque_lb_ft, fuel_type, production_years, notes)
VALUES (
    'spectre-electric',
    'Spirit Architecture',
    'Dual Motor Electric',
    'rolls-royce',
    0,
    0,
    0,
    'Electric',
    'electric',
    577,
    430,
    900,
    664,
    'electric',
    '2023-present',
    'First fully electric Rolls-Royce. Dual motor setup on bespoke Spirit Architecture platform. 120kWh battery, ~300 mile range.'
) ON CONFLICT (id) DO NOTHING;
