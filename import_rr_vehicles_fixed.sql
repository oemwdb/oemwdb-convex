-- Import Rolls-Royce Vehicles from Notion
-- Using Notion page IDs as secondary reference in the id itself

INSERT INTO oem_vehicles (id, vehicle_title, model_name, generation, production_years, oem_engine_ref, brand_ref) VALUES
  ('rolls-royce-rr11-phantom-viii', 'Rolls-Royce - RR11: Phantom VIII', 'Phantom VIII', 'RR11', '2017-present', 'Twin-turbocharged 6.75L V12 (N74B68)', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr21-ghost-ii', 'Rolls-Royce - RR21: Ghost II', 'Ghost II', 'RR21', '2020-present', 'Twin-turbocharged 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr05-wraith', 'Rolls-Royce - RR05: Wraith', 'Wraith', 'RR05', '2013-2023', 'Twin-turbocharged 6.6L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr31-cullinan', 'Rolls-Royce - RR31: Cullinan', 'Cullinan', 'RR31', '2018-present', 'Twin-turbocharged 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr04-ghost-i', 'Rolls-Royce - RR04: Ghost I', 'Ghost Series I', 'RR04', '2010-2020', 'Twin-turbocharged 6.6L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr02-phantom-drophead', 'Rolls-Royce - RR02: Phantom Drophead Coupe', 'Phantom Drophead Coupe', 'RR02', '2007-2016', 'Naturally Aspirated 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr03-phantom-coupe', 'Rolls-Royce - RR03: Phantom Coupe', 'Phantom Coupe', 'RR03', '2008-2016', 'Naturally Aspirated 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr01-phantom-vii', 'Rolls-Royce - RR01: Phantom VII', 'Phantom VII', 'RR01', '2003-2017', 'Naturally Aspirated 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr06-dawn', 'Rolls-Royce - RR06: Dawn', 'Dawn', 'RR06', '2015-2023', 'Twin-turbocharged 6.6L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr22-ghost-ii-extended', 'Rolls-Royce - RR22: Ghost II Extended', 'Ghost II Extended Wheelbase', 'RR22', '2020-present', 'Twin-turbocharged 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr25-spectre', 'Rolls-Royce - RR25: Spectre', 'Spectre', 'RR25', '2023-present', 'Dual Electric Motors (430kW)', '[{"value":"rolls-royce"}]'::jsonb),
  ('rolls-royce-rr12-phantom-viii-extended', 'Rolls-Royce - RR12: Phantom VIII Extended', 'Phantom VIII Extended Wheelbase', 'RR12', '2017-present', 'Twin-turbocharged 6.75L V12', '[{"value":"rolls-royce"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  generation = EXCLUDED.generation,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  brand_ref = EXCLUDED.brand_ref;

-- Now update wheel vehicle_ref to use proper IDs with title format
-- Map Notion UUIDs to vehicle IDs
UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"}]'::jsonb 
WHERE id = 'rolls-royce-style-173';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"},{"id":"rolls-royce-rr02-phantom-drophead","title":"Phantom Drophead Coupe"},{"id":"rolls-royce-rr03-phantom-coupe","title":"Phantom Coupe"}]'::jsonb 
WHERE id = 'rolls-royce-style-267';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-274';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"}]'::jsonb 
WHERE id = 'rolls-royce-style-289';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"}]'::jsonb 
WHERE id = 'rolls-royce-style-422';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"}]'::jsonb 
WHERE id = 'rolls-royce-style-471';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-593';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"}]'::jsonb 
WHERE id = 'rolls-royce-style-602';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-603';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr31-cullinan","title":"Cullinan"}]'::jsonb 
WHERE id = 'rolls-royce-style-712';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr31-cullinan","title":"Cullinan"}]'::jsonb 
WHERE id = 'rolls-royce-style-713';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-653';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-670';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr11-phantom-viii","title":"Phantom VIII"}]'::jsonb 
WHERE id = 'rolls-royce-style-678';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-709';

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"},{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-710';

-- Fill in missing vehicle_ref for wheels that don't have relations
UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr01-phantom-vii","title":"Phantom VII"}]'::jsonb 
WHERE id = 'rolls-royce-style-420' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr04-ghost-i","title":"Ghost I"}]'::jsonb 
WHERE id = 'rolls-royce-style-462' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"}]'::jsonb 
WHERE id = 'rolls-royce-style-615' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr05-wraith","title":"Wraith"},{"id":"rolls-royce-rr06-dawn","title":"Dawn"}]'::jsonb 
WHERE id = 'rolls-royce-style-677' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr11-phantom-viii","title":"Phantom VIII"}]'::jsonb 
WHERE id = 'rolls-royce-style-679' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr31-cullinan","title":"Cullinan"}]'::jsonb 
WHERE id = 'rolls-royce-style-714' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr21-ghost-ii","title":"Ghost II"},{"id":"rolls-royce-rr31-cullinan","title":"Cullinan"}]'::jsonb 
WHERE id = 'rolls-royce-style-723' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);

UPDATE oem_wheels SET vehicle_ref = '[{"id":"rolls-royce-rr25-spectre","title":"Spectre"},{"id":"rolls-royce-rr21-ghost-ii","title":"Ghost II"}]'::jsonb 
WHERE id = 'rolls-royce-style-924' AND (vehicle_ref IS NULL OR vehicle_ref = '[]'::jsonb);
