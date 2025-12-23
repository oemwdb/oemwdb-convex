
-- =============================================
-- ROLLS-ROYCE DEEP POLISH DATA SCRIPT
-- =============================================

-- HELPER: Function to merge jsonb detailed_specs
CREATE OR REPLACE FUNCTION merge_detailed_specs(vid text, new_specs jsonb) RETURNS void AS $$
BEGIN
  UPDATE oem_vehicles 
  SET detailed_specs = COALESCE(detailed_specs, '{}'::jsonb) || new_specs
  WHERE id = vid;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 1. DETAILED SPECS (Platform, Dimensions, Performance)
-- =============================================

-- RR01: Phantom VII (2003-2017)
SELECT merge_detailed_specs('Rolls-Royce - RR01: Phantom VII', '{
  "platform": "BMW Group Architecture (Spaceframe)",
  "bodyType": "Sedan",
  "dimensions": { "length": "5842 mm", "width": "1990 mm", "height": "1638 mm", "wheelbase": "3570 mm", "weight": "2550 kg" },
  "performance": { "acceleration": "5.7s (0-60)", "topSpeed": "149 mph", "power": "453 hp", "torque": "531 lb-ft" },
  "fuelEconomy": { "city": "11 mpg", "highway": "19 mpg", "combined": "14 mpg" },
  "priceRange": "$350,000 - $450,000 (Used)",
  "competitors": ["Maybach 62", "Bentley Mulsanne"]
}'::jsonb);

-- RR02: Phantom Drophead Coupe (2007-2016)
SELECT merge_detailed_specs('Rolls-Royce - RR02: Phantom Drophead Coupe', '{
  "platform": "BMW Group Architecture (Spaceframe)",
  "bodyType": "Convertible",
  "dimensions": { "length": "5612 mm", "width": "1987 mm", "height": "1566 mm", "wheelbase": "3320 mm", "weight": "2620 kg" },
  "performance": { "acceleration": "5.6s (0-60)", "topSpeed": "149 mph", "power": "453 hp", "torque": "531 lb-ft" },
  "fuelEconomy": { "city": "11 mpg", "highway": "18 mpg", "combined": "13 mpg" },
  "priceRange": "$200,000 - $350,000 (Used)",
  "competitors": ["Bentley Azure", "Bentley Continental GTC"]
}'::jsonb);

-- RR03: Phantom Coupe (2008-2016)
SELECT merge_detailed_specs('Rolls-Royce - RR03: Phantom Coupe', '{
  "platform": "BMW Group Architecture (Spaceframe)",
  "bodyType": "Coupe",
  "dimensions": { "length": "5612 mm", "width": "1987 mm", "height": "1598 mm", "wheelbase": "3320 mm", "weight": "2590 kg" },
  "performance": { "acceleration": "5.6s (0-60)", "topSpeed": "155 mph", "power": "453 hp", "torque": "531 lb-ft" },
  "fuelEconomy": { "city": "11 mpg", "highway": "19 mpg", "combined": "14 mpg" },
  "priceRange": "$220,000 - $380,000 (Used)",
  "competitors": ["Bentley Brooklands", "Mercedes-Benz CL-Class"]
}'::jsonb);

-- RR04: Ghost I (2010-2020)
SELECT merge_detailed_specs('Rolls-Royce - RR04: Ghost I', '{
  "platform": "BMW F01 (7 Series)",
  "bodyType": "Sedan",
  "dimensions": { "length": "5399 mm", "width": "1948 mm", "height": "1550 mm", "wheelbase": "3295 mm", "weight": "2360 kg" },
  "performance": { "acceleration": "4.7s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "575 lb-ft" },
  "fuelEconomy": { "city": "13 mpg", "highway": "20 mpg", "combined": "15 mpg" },
  "priceRange": "$90,000 - $180,000 (Used)",
  "competitors": ["Bentley Flying Spur", "Mercedes-Maybach S600"]
}'::jsonb);

-- RR05: Wraith (2013-2023)
SELECT merge_detailed_specs('Rolls-Royce - RR05: Wraith', '{
  "platform": "BMW F01 (7 Series) Modified",
  "bodyType": "Coupe",
  "dimensions": { "length": "5269 mm", "width": "1947 mm", "height": "1507 mm", "wheelbase": "3112 mm", "weight": "2360 kg" },
  "performance": { "acceleration": "4.4s (0-60)", "topSpeed": "155 mph", "power": "624 hp", "torque": "590 lb-ft" },
  "fuelEconomy": { "city": "13 mpg", "highway": "21 mpg", "combined": "16 mpg" },
  "priceRange": "$150,000 - $300,000 (Used)",
  "competitors": ["Bentley Continental GT", "Mercedes-AMG S63 Coupe"]
}'::jsonb);

-- RR06: Dawn (2015-2023)
SELECT merge_detailed_specs('Rolls-Royce - RR06: Dawn', '{
  "platform": "BMW F01 (7 Series) Modified",
  "bodyType": "Convertible",
  "dimensions": { "length": "5285 mm", "width": "1947 mm", "height": "1502 mm", "wheelbase": "3112 mm", "weight": "2560 kg" },
  "performance": { "acceleration": "4.9s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "605 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "19 mpg", "combined": "14 mpg" },
  "priceRange": "$200,000 - $350,000 (Used)",
  "competitors": ["Bentley Continental GTC", "Mercedes-Maybach S650 Cabriolet"]
}'::jsonb);

-- RR11: Phantom VIII (2018-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR11: Phantom VIII', '{
  "platform": "Architecture of Luxury",
  "bodyType": "Sedan",
  "dimensions": { "length": "5762 mm", "width": "2018 mm", "height": "1646 mm", "wheelbase": "3552 mm", "weight": "2560 kg" },
  "performance": { "acceleration": "5.1s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "664 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "20 mpg", "combined": "14 mpg" },
  "priceRange": "$460,000+ (New)",
  "competitors": ["Bentley Mulsanne", "Aurus Senat"]
}'::jsonb);

-- RR12: Phantom VIII Extended (2018-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR12: Phantom VIII Extended', '{
  "platform": "Architecture of Luxury",
  "bodyType": "Sedan (LWB)",
  "dimensions": { "length": "5982 mm", "width": "2018 mm", "height": "1656 mm", "wheelbase": "3772 mm", "weight": "2610 kg" },
  "performance": { "acceleration": "5.2s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "664 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "20 mpg", "combined": "14 mpg" },
  "priceRange": "$540,000+ (New)",
  "competitors": ["Mercedes-Maybach S680", "Bentley Mulsanne EWB"]
}'::jsonb);

-- RR21: Ghost II (2020-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR21: Ghost II', '{
  "platform": "Architecture of Luxury",
  "bodyType": "Sedan",
  "dimensions": { "length": "5546 mm", "width": "2148 mm", "height": "1571 mm", "wheelbase": "3295 mm", "weight": "2490 kg" },
  "performance": { "acceleration": "4.6s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "627 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "19 mpg", "combined": "14 mpg" },
  "priceRange": "$340,000+ (New)",
  "competitors": ["Bentley Flying Spur", "Mercedes-Maybach S580"]
}'::jsonb);

-- RR22: Ghost II Extended (2020-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR22: Ghost II Extended', '{
  "platform": "Architecture of Luxury",
  "bodyType": "Sedan (LWB)",
  "dimensions": { "length": "5716 mm", "width": "2148 mm", "height": "1571 mm", "wheelbase": "3465 mm", "weight": "2530 kg" },
  "performance": { "acceleration": "4.6s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "627 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "19 mpg", "combined": "14 mpg" },
  "priceRange": "$380,000+ (New)",
  "competitors": ["Bentley Flying Spur", "Mercedes-Maybach S680"]
}'::jsonb);

-- RR25: Spectre (2023-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR25: Spectre', '{
  "platform": "Architecture of Luxury (EV)",
  "bodyType": "Coupe",
  "dimensions": { "length": "5453 mm", "width": "2080 mm", "height": "1559 mm", "wheelbase": "3210 mm", "weight": "2975 kg" },
  "performance": { "acceleration": "4.4s (0-60)", "topSpeed": "155 mph", "power": "577 hp", "torque": "664 lb-ft" },
  "fuelEconomy": { "city": "77 MPGe", "highway": "71 MPGe", "combined": "74 MPGe" },
  "priceRange": "$420,000+ (New)",
  "competitors": ["Cadillac Celestiq", "Bentley Continental GT (Hybrid)"]
}'::jsonb);

-- RR31: Cullinan (2018-Present)
SELECT merge_detailed_specs('Rolls-Royce - RR31: Cullinan', '{
  "platform": "Architecture of Luxury",
  "bodyType": "SUV",
  "dimensions": { "length": "5341 mm", "width": "2000 mm", "height": "1835 mm", "wheelbase": "3295 mm", "weight": "2660 kg" },
  "performance": { "acceleration": "5.0s (0-60)", "topSpeed": "155 mph", "power": "563 hp", "torque": "627 lb-ft" },
  "fuelEconomy": { "city": "12 mpg", "highway": "20 mpg", "combined": "14 mpg" },
  "priceRange": "$350,000+ (New)",
  "competitors": ["Bentley Bentayga", "Lamborghini Urus (Luxury trim)", "Range Rover SV"]
}'::jsonb);


-- =============================================
-- 2. MAINTENANCE DATA
-- =============================================
-- Truncate existing maintenance for RR to avoid duplicates if running multiple times? 
-- No, let's just insert with ON CONFLICT DO NOTHING implies we rely on ID, but we usually generate IDs.
-- Let's just delete old maintenance for these cars before re-inserting to be clean.
DELETE FROM vehicle_maintenance WHERE vehicle_id ILIKE 'Rolls-Royce%';

-- General V12 Maintenance (Applies to Phantom VII - N73)
INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready) VALUES
('Rolls-Royce - RR01: Phantom VII', 'Engine', 'known_issue', 'Valve Stem Seals', 'N73 engines are notorious for leaking valve stem seals causing blue smoke and oil consumption. Major job requiring engine out or specialized tools.', NULL, true),
('Rolls-Royce - RR01: Phantom VII', 'Engine', 'known_issue', 'Coolant Transfer Pipe', 'The weep hole leak. Internal collant pipe seal fails. Stant or aga pipe fix recommended.', NULL, true),
('Rolls-Royce - RR01: Phantom VII', 'Engine', 'schedule', 'Oil Change', 'Castrol Edge 5W-30 or BMW LL-01 Approved oil.', '5000', true),
('Rolls-Royce - RR01: Phantom VII', 'Suspension', 'known_issue', 'Air Struts', 'Front air struts can fail around 60k miles. Look for drooping overnight.', NULL, true),
('Rolls-Royce - RR01: Phantom VII', 'Electronics', 'known_issue', 'iDrive Screen Failure', 'The rotating screen mechanism gears can strip.', NULL, true);

-- Duplicate for Drophead (RR02) and Coupe (RR03)
INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready)
SELECT 'Rolls-Royce - RR02: Phantom Drophead Coupe', category, type, title, description, interval_miles, production_ready 
FROM vehicle_maintenance WHERE vehicle_id = 'Rolls-Royce - RR01: Phantom VII';

INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready)
SELECT 'Rolls-Royce - RR03: Phantom Coupe', category, type, title, description, interval_miles, production_ready 
FROM vehicle_maintenance WHERE vehicle_id = 'Rolls-Royce - RR01: Phantom VII';

-- Ghost/Wraith/Dawn (N74 V12 - Twin Turbo)
-- Ghost I (RR04)
INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready) VALUES
('Rolls-Royce - RR04: Ghost I', 'Engine', 'known_issue', 'High Pressure Fuel Pumps', 'HPFP failure can cause long cranks and limp mode.', NULL, true),
('Rolls-Royce - RR04: Ghost I', 'Engine', 'known_issue', 'Fuel Injectors', 'Piezo injectors can leak, washing cylinder walls. Verify index 12 equivalent updates.', NULL, true),
('Rolls-Royce - RR04: Ghost I', 'Suspension', 'schedule', 'Control Arm Bushings', 'Heavy vehicle weight wears front thrust arm bushings quickly.', '40000', true),
('Rolls-Royce - RR04: Ghost I', 'Brakes', 'schedule', 'Brake Fluid Flush', 'Every 2 years regardless of mileage.', NULL, true);

-- Copy Ghost I maintenance to Wraith (RR05) and Dawn (RR06)
INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready)
SELECT 'Rolls-Royce - RR05: Wraith', category, type, title, description, interval_miles, production_ready 
FROM vehicle_maintenance WHERE vehicle_id = 'Rolls-Royce - RR04: Ghost I';

INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready)
SELECT 'Rolls-Royce - RR06: Dawn', category, type, title, description, interval_miles, production_ready 
FROM vehicle_maintenance WHERE vehicle_id = 'Rolls-Royce - RR04: Ghost I';


-- Phantom VIII (RR11) & Cullinan (RR31) - Modern Era
-- Less 'issues', more 'schedule'
INSERT INTO vehicle_maintenance (vehicle_id, category, type, title, description, interval_miles, production_ready) VALUES
('Rolls-Royce - RR11: Phantom VIII', 'Engine', 'schedule', 'Oil Service', 'Full synthetic service. Maintain strict intervals for turbo health.', '10000', true),
('Rolls-Royce - RR11: Phantom VIII', 'Body', 'schedule', 'Detailing', 'Protect the paintwork. Ceramic coating recommended for hand-painted coachlines.', NULL, true),
('Rolls-Royce - RR31: Cullinan', 'Drivetrain', 'schedule', 'Differential Fluid', 'Check front and rear diff fluids if used off-road (rare but possible).', '30000', true),
('Rolls-Royce - RR31: Cullinan', 'Suspension', 'known_issue', 'Active Roll Bar', 'Listen for knocking on uneven surfaces. Heavy system load.', NULL, true);


-- =============================================
-- 3. UPGRADES DATA
-- =============================================
DELETE FROM vehicle_upgrades WHERE vehicle_id ILIKE 'Rolls-Royce%';

-- Phantom VII (RR01)
INSERT INTO vehicle_upgrades (vehicle_id, category, title, description, source, level, production_ready) VALUES
('Rolls-Royce - RR01: Phantom VII', 'Interior', 'Starlight Headliner Retrofit', 'Add the signature fiber optic headliner if not optioned.', 'aftermarket', 'HEAVY', true),
('Rolls-Royce - RR01: Phantom VII', 'Exterior', '2012 Facelift Conversion', 'Update front bumper and headlights to Series II style.', 'oem_plus', 'HEAVY', true),
('Rolls-Royce - RR01: Phantom VII', 'Wheels', '24-inch Forgiato', 'Large diameter multispoke wheels. Compromises ride quality but fills arches.', 'aftermarket', 'LIGHT', true);

-- Ghost I (RR04)
INSERT INTO vehicle_upgrades (vehicle_id, category, title, description, source, level, production_ready) VALUES
('Rolls-Royce - RR04: Ghost I', 'Performance', 'ECU Tune (Stage 1)', 'Increase power to ~630hp safely on consistent fuel.', 'aftermarket', 'LIGHT', true),
('Rolls-Royce - RR04: Ghost I', 'Exterior', 'Black Badge Trim', 'Chrome delete using legitimate Black Badge dark chrome parts.', 'oem_plus', 'LIGHT', true),
('Rolls-Royce - RR04: Ghost I', 'Exhaust', 'Quicksilver Exhaust', 'Unlocks the V12 sound usually suppressed by factory silencers.', 'aftermarket', 'LIGHT', true);

-- Wraith (RR05)
INSERT INTO vehicle_upgrades (vehicle_id, category, title, description, source, level, production_ready) VALUES
('Rolls-Royce - RR05: Wraith', 'Exterior', 'Mansory Body Kit', 'Aggressive carbon fiber additions. Polarizing style.', 'aftermarket', 'HEAVY', true),
('Rolls-Royce - RR05: Wraith', 'Interior', 'Shooting Star Headliner', 'Advanced headliner with shooting star animation.', 'oem_plus', 'HEAVY', true),
('Rolls-Royce - RR05: Wraith', 'Performance', 'Novitec Spofec N-Tronic', 'Plug-and-play power bump to 717hp.', 'aftermarket', 'LIGHT', true);

-- Cullinan (RR31)
INSERT INTO vehicle_upgrades (vehicle_id, category, title, description, source, level, production_ready) VALUES
('Rolls-Royce - RR31: Cullinan', 'Exterior', 'Urban Automotive Kit', 'Widebody kit and carbon fiber replacements.', 'aftermarket', 'HEAVY', true),
('Rolls-Royce - RR31: Cullinan', 'Interior', 'Viewing Suite', 'Deployable rear facing seats in the tailgate. OEM retrofit possible but difficult.', 'oem_plus', 'HEAVY', true),
('Rolls-Royce - RR31: Cullinan', 'Wheels', '24-inch Vossen HF-2', 'Popular choice for Cullinan to modernize the stance.', 'aftermarket', 'LIGHT', true);

-- Spectre (RR25)
INSERT INTO vehicle_upgrades (vehicle_id, category, title, description, source, level, production_ready) VALUES
('Rolls-Royce - RR25: Spectre', 'Exterior', 'Coachline Customization', 'Hand-painted custom pinstriping.', 'oem_plus', 'LIGHT', true),
('Rolls-Royce - RR25: Spectre', 'Wheels', '23-inch Aero Disc', 'Efficient designs to maintain range while improving look.', 'aftermarket', 'LIGHT', true);

