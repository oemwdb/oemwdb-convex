-- Import Rolls-Royce Vehicles from Notion
-- Generated: 2025-12-21T22:45:05.728Z

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr11-phantom-viii',
  'Rolls-Royce - RR11: Phantom VIII',
  'Phantom VIII',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2017 - Present',
  'Twin-turbocharged 6.75L V12 (N74B68 variant unique to Phantom). 563 hp @ 5,000 rpm (426 kW), 900 Nm @ 1,700 rpm (664 lb-ft). ZF 8HP 8-speed automatic transmission with GPS-linked optimization. Rev limiter keeps engine under 2,500 rpm during normal acceleration.',
  '1b417406-a14d-814e-8003-d8e90690d4a7'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr21-ghost-ii',
  'Rolls-Royce - RR21: Ghost II',
  'Ghost II',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2020 - present',
  '6.75L twin-turbocharged V12 (N74B66) producing 563 hp @ 5,000 rpm and 627 lb-ft torque @ 1,600 rpm. Black Badge variant produces 592 hp and 664 lb-ft torque. ZF 8-speed automatic transmission with satellite-aided gear selection using GPS data.',
  '1b417406-a14d-8159-8c17-cca097471053'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr05-wraith',
  'Rolls-Royce - RR05: Wraith',
  'Wraith',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2013 -2023',
  '6.6L twin-turbocharged V12 engine producing 624 hp (465 kW) at 5,600 rpm and 590 lb-ft (800 Nm) of torque from 1,500-5,500 rpm. BMW-derived N74 architecture with Rolls-Royce tuning. 8-speed ZF automatic transmission with GPS-assisted pre-selection. Rear-wheel drive configuration.',
  '1b417406-a14d-8165-a623-fc49d6f1da64'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr31-cullinan',
  'Rolls-Royce - RR31: Cullinan',
  'Cullinan',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2018 - present',
  '6.75-liter (6,749cc / 412 cu in) twin-turbocharged and intercooled DOHC 48-valve V12 engine with aluminum block and heads, direct fuel injection. Standard output: 563 hp @ 5,000 rpm and 627 lb-ft (850 Nm) @ 1,600 rpm. Black Badge variant produces 591 hp @ 5,000 rpm and 664 lb-ft (900 Nm) @ 1,600 rpm. 8-speed ZF automatic transmission with permanent all-wheel drive system.',
  '1b417406-a14d-8173-8a57-d912a02b30c4'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr04-ghost-i',
  'Rolls-Royce - RR04: Ghost I',
  'Ghost Series I',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2009 - 2020',
  '6.6L twin-turbocharged V12 (N74B66) - 563hp/780Nm (standard), 603hp/620lb-ft (Black Badge Series I), 591hp (Black Badge Series II). ZF 8-speed automatic transmission.',
  '1b417406-a14d-8183-9804-dea4237e7514'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr02-phantom-drophead-coupe',
  'Rolls-Royce - RR02: Phantom Drophead Coupe',
  'Phantom Drophead Coupe',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2007 - 2014',
  '6.75-liter (412 cu in) naturally aspirated V12 engine producing 453 horsepower (338 kW) at 5,350 rpm and 531 pound-feet (720 Nm) of torque at 3,500 rpm. Same displacement as classic Rolls-Royce L-Series V8 (1959-2002). BMW originally considered 9.0L V16 but chose V12 for efficiency. Mated to ZF 6-speed automatic transmission (later 8-speed) with rear-wheel drive. 0-60 mph in 5.7 seconds, top speed electronically limited.',
  '1b417406-a14d-8192-a973-ce14fc15774f'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr03-phantom-coupe',
  'Rolls-Royce - RR03: Phantom Coupe',
  'Phantom Coupe',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2007 - 2015',
  '6.75-liter (412 cu in) naturally aspirated V12 engine, producing 338 kW (453 bhp; 460 PS) and 720 N⋅m (530 lb⋅ft) of torque. Nearly 542 N⋅m (400 lb⋅ft) of torque (75%) available at 1,000 rpm for exceptional low-end performance. Paired with 6-speed automatic (early models) or 8-speed automatic transmission (2010+) for improved efficiency and smoothness.',
  '1b417406-a14d-81ac-8359-e40f35ccf4af'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr01-phantom-vii',
  'Rolls-Royce - RR01: Phantom VII',
  'Phantom VII',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2003 - 2017',
  '6.75L Twin-Turbocharged V12 BMW N73B68 (460 HP @ 5000 RPM, 720 Nm @ 3500 RPM). Originally intended for 9.0L V16 but changed to V12 for economy. ZF 6-speed automatic (Series I 2003-2009), ZF 8-speed automatic (Series II 2009-2017). Same displacement as classic L-Series V8 used 1959-2002.',
  '1b417406-a14d-81b5-b0ba-e05762cc0618'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr06-dawn',
  'Rolls-Royce - RR06: Dawn',
  'Dawn',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2016-2023',
  '6.6-liter twin-turbocharged V12 engine producing 563 horsepower (419 kW) and 575 lb-ft (780 Nm) of torque. Black Badge variant increases output to 593 horsepower (442 kW) and 619 lb-ft (840 Nm) of torque. 8-speed Satellite Aided Transmission with GPS technology. Rear-wheel drive configuration.',
  '1b417406-a14d-81e7-a29a-d8a13c37575e'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr22-ghost-ii-extended',
  'Rolls-Royce - RR22: Ghost II Extended',
  'Ghost II Extended Wheelbase',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2020-present',
  NULL,
  '26117406-a14d-8125-af75-eda3d7f9e1ad'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr25-spectre',
  'Rolls-Royce - RR25: Spectre',
  'Spectre',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2023-present',
  NULL,
  '26117406-a14d-815e-b666-d64de2129f71'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;

INSERT INTO oem_vehicles (id, vehicle_title, model_name, brand_ref, production_years, oem_engine_ref, uuid) VALUES (
  'rolls-royce-rr12-phantom-viii-extended',
  'Rolls-Royce - RR12: Phantom VIII Extended',
  'Phantom VIII Extended Wheelbase',
  '[{"value":"rolls-royce"}]'::jsonb,
  '2017-present',
  NULL,
  '26117406-a14d-8184-ab67-f9b09b0b69c9'
) ON CONFLICT (id) DO UPDATE SET
  vehicle_title = EXCLUDED.vehicle_title,
  model_name = EXCLUDED.model_name,
  brand_ref = EXCLUDED.brand_ref,
  production_years = EXCLUDED.production_years,
  oem_engine_ref = EXCLUDED.oem_engine_ref,
  uuid = EXCLUDED.uuid;


-- Update wheel vehicle_ref to use vehicle IDs instead of Notion UUIDs
-- This maps the Notion UUIDs in wheels to the imported vehicle IDs

