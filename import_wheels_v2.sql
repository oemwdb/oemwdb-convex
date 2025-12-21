INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '1997-acura-cl-71676-1',
  'Acura OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Acura"}]',
  NULL,
  '![[acura-cl-wheels-71676.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '1997-acura-cl-71689-1',
  ' 1997 Acura CL (71689)1',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[acura-cl-wheels-71689.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '1997-acura-cl-wheels-71672',
  ' 1997 Acura CL Wheels (71672)',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[acura-cl-wheels-71672.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'porsche-carrera-gt-wheel',
  ' Porsche Carrera GT Wheel',
  '???',
  '[{"value":19,"unit":"inch","raw":"19 inch 20 inch"}]',
  NULL,
  NULL,
  NULL,
  'Hyper Silver',
  '![[porsche-carreragt-rims-67279.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '10-spoke-edge-glossy-black',
  'Saab https://kontiki2.nl/saab/images/wheels/10s-edgeblack.jpg 18"',
  '12824030',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '10-spoke-edge-silver',
  'Saab https://kontiki2.nl/saab/images/wheels/10s-edgesilver.jpg 18"',
  '12823375',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '10-spoke-nail',
  'Saab https://kontiki2.nl/saab/images/wheels/10nail.jpg,10-Spoke 17"',
  '32025561',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '10-spoke-sculpted',
  'Saab https://kontiki2.nl/saab/images/wheels/10s-sculpted.jpg 16"',
  '400130936',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '10-spoke-turbine-black',
  'Saab https://kontiki2.nl/saab/images/wheels/10s-black.jpg 18"',
  '12824031',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '12-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/97-12s.jpg 18"',
  '9595631',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '15-aero-spg',
  'Saab https://kontiki2.nl/saab/images/wheels/aero.jpg 15"',
  '105121800cap 105121818',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '16-aero-polished-lip',
  'Saab https://kontiki2.nl/saab/images/wheels/16aero2.jpg 16"',
  '105123707cap 105123715',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '16-aero',
  'Saab https://kontiki2.nl/saab/images/wheels/16aero.jpg 16"',
  '105123723cap 105123400',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '16-16-spoke-graphite-painted-diamond-turned-alloy-wheels',
  '16” 16 - spoke graphite painted diamond turned alloy wheels',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_19.40.22.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '16-8-spoke-graphite-painted-diamond-turned-alloy-wheels',
  '16” 8 - spoke graphite painted diamond turned alloy wheels',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_19.39.09.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '20-alloy-wheels-with-graphite-finish',
  '20” alloy wheels with Graphite finish',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.06.36.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '3-spoke-inca',
  'Saab https://kontiki2.nl/saab/images/wheels/3s-inca.jpg 18"',
  '32025941',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '3-spoke-soft-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/softspoke.jpg,3-Spoke 15"',
  '4545687cap 8987620cap 4425476',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '3-spoke-double-blade',
  'Saab https://kontiki2.nl/saab/images/wheels/3sdoubleblade.jpg 18"',
  '32025565',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '3-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/3s-1.jpg,3-Spoke 15"',
  '400108957',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  '![[Saab3-SpokeWheel.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-etech-wheels-chrono',
  '5 Etech wheels chrono',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_23.12.38.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-etech-wheels-techno',
  '5 etech wheels techno',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_23.06.43.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-double-wing',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-dw.jpg,5-Spoke 17"',
  '32025564',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/92-5spoke.jpg 16"',
  '32006312cap 32006354',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-94',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-94.jpg,5-Spoke 15"',
  '400100566',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-claw',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-claw.jpg 18"',
  '32025560',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-double-bridge',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-dw.jpg,5-Spoke 17"',
  '32025559',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-flared',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-f.jpg 16"',
  '1278799432026150',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-split',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-s.jpg 16"',
  '4689634',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-star',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-star120.jpg 20"',
  '12823161cap 12824370',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke-two-piece',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-dw.jpg,5-Spoke 17"',
  '400130928',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-dw.jpg,5-Spoke 17"',
  '400132593',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-twin-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/92-5twin.jpg 16"',
  '32006314cap 32006354',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '5-twin-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/5s-dw.jpg,5-Spoke 17"',
  '32006313cap 32006354',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '6-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/6s.jpg,6-Spoke 15"',
  '400106571',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '6-spoke-split-2',
  'Saab https://kontiki2.nl/saab/images/wheels/97-split.jpg 18"',
  '17800192',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '6-spoke-split',
  'Saab https://kontiki2.nl/saab/images/wheels/6s-split.jpg,6-Spoke 17"',
  '400130803',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '6-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/97-6s.jpg 18"',
  '9595629',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '7-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/7s.jpg,7-Spoke 15"',
  '400103198cap 400103297',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '8-spoke-a50',
  'Saab https://kontiki2.nl/saab/images/wheels/a50.jpg,8-Spoke 15"',
  '400106035cap saab 4648424cap griffin 45666311',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  '812-wheel',
  '812 wheel',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-04-02_at_00.18.58.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu100-5-spoke-blade',
  'Saab https://kontiki2.nl/saab/images/wheels/alu100.jpg,5-Spoke 17"',
  '13241704',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu101-7-spoke-core',
  'Saab https://kontiki2.nl/saab/images/wheels/alu101.jpg,7-Spoke 17"',
  '13241506',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu102-5-spoke-carve',
  'Saab https://kontiki2.nl/saab/images/wheels/alu102.jpg 18"',
  '13241705',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu103-15-spoke-rotor',
  'Saab https://kontiki2.nl/saab/images/wheels/alu103.jpg 18"',
  '13241505',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu104-10-spoke-edge',
  'Saab https://kontiki2.nl/saab/images/wheels/alu104.jpg 19"',
  '13241511',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu105-10-spoke-turbine',
  'Saab https://kontiki2.nl/saab/images/wheels/alu105.jpg 19"',
  '13241509',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu108-independence-wheel',
  'Saab https://kontiki2.nl/saab/images/wheels/alu108.jpg 18"',
  '12824042',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu20-3-spoke-97',
  'Saab https://kontiki2.nl/saab/images/wheels/alu20.jpg,3-Spoke 15"',
  '4905626400107934',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu21-10-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu21.jpg,10-Spoke 15"',
  '400109591',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu22-5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu22.jpg 16"',
  '400106563',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu23-3-spoke-delta',
  'Saab https://kontiki2.nl/saab/images/wheels/alu23.jpg,3-Spoke 15"',
  '400106605',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu25-10-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu25.jpg 16"',
  '400109583',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu26-3-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu26.jpg 16"',
  '400108361',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu27-long-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu27.jpg 16"',
  '400109336',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu28-3-spoke-sport',
  'Saab https://kontiki2.nl/saab/images/wheels/alu28.jpg,3-Spoke 17"',
  '4566063',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu29-7-spoke-bbs',
  'Saab https://kontiki2.nl/saab/images/wheels/alu29.jpg 16"',
  '477830440010647232026148',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu31-3-spoke-98',
  'Saab https://kontiki2.nl/saab/images/wheels/alu31.jpg,3-Spoke 15"',
  '400111340',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu32-5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu32.jpg,5-Spoke 15"',
  '400106597',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu33-3-spoke-split',
  'Saab https://kontiki2.nl/saab/images/wheels/alu33.jpg 16"',
  '400111670',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu34-5-spoke-viggen',
  'Saab https://kontiki2.nl/saab/images/wheels/alu34.jpg,5-Spoke 17"',
  '400129847',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu35-3-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu35.jpg 16"',
  '400128799',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu36-3-spoke-double',
  'Saab https://kontiki2.nl/saab/images/wheels/alu36.jpg,3-Spoke 17"',
  '400129730400132908',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu37-5-spoke-anniversary',
  'Saab https://kontiki2.nl/saab/images/wheels/alu37.jpg 16"',
  '400131074',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu38-10-spoke-linear',
  'Saab https://kontiki2.nl/saab/images/wheels/alu38.jpg 16"',
  '400130977',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu39-10-spoke-aero',
  'Saab https://kontiki2.nl/saab/images/wheels/alu39.jpg,10-Spoke 17"',
  '32026149',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu40-5-spoke-turbine',
  'Saab https://kontiki2.nl/saab/images/wheels/alu40.jpg,5-Spoke 17"',
  '400127262',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu41-3-spoke-quad',
  'Saab https://kontiki2.nl/saab/images/wheels/alu41.jpg,3-Spoke 17"',
  '400128849',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu42-5-spoke-linear',
  'Saab https://kontiki2.nl/saab/images/wheels/alu42.jpg,5-Spoke 15"',
  '12785708',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu43-10-spoke-arc',
  'Saab https://kontiki2.nl/saab/images/wheels/alu43.jpg 16"',
  '12785709',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu45-5-spoke-vector',
  'Saab https://kontiki2.nl/saab/images/wheels/alu45.jpg,5-Spoke 17"',
  '12785711',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu46-3-spoke-double-evo',
  'Saab https://kontiki2.nl/saab/images/wheels/alu46.jpg,3-Spoke 17"',
  '12786708',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu47-5-spoke-arc',
  'Saab https://kontiki2.nl/saab/images/wheels/alu47.jpg 16"',
  '40012788232026147',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu48-6-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu48.jpg,6-Spoke 17"',
  '400131579',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu50-5-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu50.jpg,5-Spoke 17"',
  '12785710',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu51-10-spoke-forged',
  'Saab https://kontiki2.nl/saab/images/wheels/alu51.jpg 16"',
  '400133385',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu52-5-spoke-evo',
  'Saab https://kontiki2.nl/saab/images/wheels/alu52.jpg,5-Spoke 17"',
  '400133377',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu54-9-spoke-double',
  'Saab https://kontiki2.nl/saab/images/wheels/alu54.jpg 16"',
  '5531355',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu55-7-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu55.jpg,7-Spoke 17"',
  '5531363',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu56-5-spoke-split',
  'Saab https://kontiki2.nl/saab/images/wheels/alu56.jpg 18"',
  '12787996',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu57-5-spoke-open',
  'Saab https://kontiki2.nl/saab/images/wheels/alu57.jpg 16"',
  '12804095',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu59-5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu59.jpg,5-Spoke 17"',
  '12759551',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu62-5-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu62.jpg,5-Spoke 17"',
  '12757104',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu63-7-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu63.jpg,7-Spoke 17"',
  '12759810',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu64-7-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu64.jpg,7-Spoke 17"',
  '12848703',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu65-10-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu65.jpg 18"',
  '12763042',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu66-15-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu66.jpg,15-Spoke 17"',
  '12787995',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu70-10-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu70.jpg 16"',
  '12771532',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu71-5-spoke-low-split',
  'Saab https://kontiki2.nl/saab/images/wheels/alu71.jpg,5-Spoke 17"',
  '12771524',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu72-14-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu72.jpg 16"',
  '12770236',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu73-v-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu73.jpg 18"',
  '12770237',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu74-5-spoke-high-split',
  'Saab https://kontiki2.nl/saab/images/wheels/alu74.jpg,5-Spoke 17"',
  '12771523',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu77-3-spoke-dark-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu77.jpg 18"',
  '12780378',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu78-3-spoke-dark-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu78.jpg 19"',
  '12779294',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu79-v-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu79.jpg,??? 17"',
  '12780082',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu8-viking',
  'Saab https://kontiki2.nl/saab/images/wheels/alu8.jpg 16"',
  '4648028',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu81-5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu81.jpg,5-Spoke 17"',
  '12780223',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu82-5-spoke-aktiv',
  'Saab https://kontiki2.nl/saab/images/wheels/alu82.jpg,5-Spoke 17"',
  '12780244',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu83-5-spoke-griffin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu83.jpg,5-Spoke 17"',
  '12780246',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu84-3-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu84.jpg 18"',
  '12783436',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu85-3-spoke-twin',
  'Saab https://kontiki2.nl/saab/images/wheels/alu85.jpg 19"',
  '12783435',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu86-3-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu86.jpg 16"',
  '12822019',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu87-5-spoke-double-bridge',
  'Saab https://kontiki2.nl/saab/images/wheels/alu87.jpg 16"',
  '12784445',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu88-5-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/alu88.jpg,5-Spoke 17"',
  '12784446',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alu90-10-spoke-turbine',
  'Saab https://kontiki2.nl/saab/images/wheels/alu90.jpg 18"',
  '12784444',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aero-aerodynamic',
  'Jaguar https://kontiki2.nl/saab/images/wheels/superaero.jpg 16"',
  'MMD6113CA, MNA6113AB, MNA6113AA (Note: 400100491 appears to be incorrect/SAAB part number)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Jaguar"}]',
  'Silver/Sparkle Silver, Charcoal Grey, Chrome (aftermarket refinishing available)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aero-spg',
  'Saab https://kontiki2.nl/saab/images/wheels/aero.jpg 15"',
  '105123103cap 105123400',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aero92-directionals-2',
  'Saab https://kontiki2.nl/saab/images/wheels/aero92.jpg 15"',
  'L 105124507R 105124606cap 105124119',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aero92-directionals-3',
  'Saab https://kontiki2.nl/saab/images/wheels/aero92grey.jpg 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aero92-directionals',
  'Saab https://kontiki2.nl/saab/images/wheels/aero92.jpg 15"',
  'L 105124309R 105124408cap 105124119',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-19-veloce',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.41.50.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-alliage-18-dark-aero',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.33.00.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-competition-19',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.35.12.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-gt-wheels-monza',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_17.24.20.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-junior-wheels',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.25.26.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-stelvio-qv-wheels',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_17.03.52.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-tonale-ti',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.47.38.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-tonale-tributo-italiano',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[AlfaRomeoTonaleWheelTributoItaliano.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-tonale-veloce',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.53.14.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'alfa-romeo-alloy-20-competition',
  'Alfa-Romeo OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_16.42.43.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'aston-martin-0ne-77',
  'Aston Martin 0ne-77',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.19.45.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-10',
  'BMW OEM Wheel 15"',
  '1092717 (various applications)',
  '[{"value":15,"unit":"inch","raw":"15 inch16 inch17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J, 9.0J"}]',
  '[{"value":"5x120, 4x100"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[BMWStyle10.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-101',
  'BMW OEM Wheel 18"',
  '36116762002, 36116774008, 36116774009, 36116759898, 36116759899, 36116775668, 36116775669, 36116757370, 36116757371',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.0J, 9.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Chrome (aftermarket), various finishes available',
  '![[bmwstyle101.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-102',
  'BMW 5-Spoke 16"',
  '36116758189',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle102.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-103',
  'BMW 7-Spoke,Twin-Spoke 17"',
  '36116759841',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle103.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-104',
  'BMW 9-Spoke,Multi-Spoke 16"',
  '36116758189',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Titan Silver (BMW standard OEM finish)',
  '![[bmwstyle104.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-105',
  'BMW 5-Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (factory standard)',
  '![[bmwstyle105.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-106',
  'BMW 10-Spoke,Multi-Spoke 17"',
  '36116758191',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle106.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-107',
  'BMW 5-Spoke,10-Spoke,Multi-Spoke 18"',
  '36116758192 (front 8.0J), 36116758193 (rear 8.5J)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (standard), Chrome (aftermarket option)',
  '![[bmwstyle107.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-108',
  'BMW 5-Spoke 18"',
  '36116758194 (front) / 36116758195 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with machined lip (factory finish)',
  '![[bmwstyle108.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-109',
  'BMW 5-Spoke 17"',
  '36103415720',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard OEM Finish)',
  '![[bmwstyle109.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-11',
  'BMW 7-Spoke 15"',
  'Various Z1 spare wheel variants',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":4,"unit":"inch","raw":"4.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Natural Aluminum',
  '![[BMWStyle11.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-110',
  'BMW Multi-Spoke 17"',
  '36113401198',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle110.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-111',
  'BMW 5-Spoke,Twin-Spoke 17"',
  '36116401199',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle111.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-112',
  'BMW 5-Spoke,Twin-Spoke 17"',
  '36113401200',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle112.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-113',
  'BMW 5-Spoke 18"',
  '36113401201, 36116761927',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory Standard)',
  '![[bmwstyle113.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-114',
  'BMW 5-Spoke,Y-Spoke 18"',
  '36113401202 (front 8J), 36113401203 (rear 9J)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (standard factory finish)',
  '![[bmwstyle114.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-115',
  'BMW 7-Spoke 16"',
  '6758774, 36116758774',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with Lacquer Finish',
  '![[bmwstyle115.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-116',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116758775',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle116.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-117',
  'BMW 5-Spoke 17"',
  '36116758776',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle117.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-118',
  'BMW 12-Spoke,Multi-Spoke 18"',
  '36116758777, 6758777',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Chrome (aftermarket finish available)',
  '![[bmwstyle118.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-119',
  'BMW 5-Spoke 17"',
  '36116758987',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Felgensilber - Paint Code 144)',
  '![[bmwstyle119.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-12',
  'BMW Steelies 17"',
  '36116750254, 36111095004',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[BMWStyle12.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-120',
  'BMW 10-Spoke 18"',
  '36116760625 (front 8J), 36116760626 (rear 9J)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Factory silver finish',
  '![[bmwstyle120.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-121',
  'BMW 7-Spoke 19"',
  '36116760629 (Front), 36116760630 (Rear), 36136763117 (Center Cap)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard Factory Finish)',
  '![[bmwstyle121.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-122',
  'BMW 5-Spoke 17"',
  '36116776778',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (Standard OEM finish)',
  '![[bmwstyle122.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-123',
  'BMW 7-Spoke 18"',
  '36116760616',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (painted finish)',
  '![[bmwstyle123.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-124',
  'BMW Multi-Spoke 18"',
  '36116775645 (Front 8J), 36116775646 (Rear 9J), 36116775793 (Xi Front), 36116775794 (Xi Rear), 36116779554 (Black Front)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Reflexsilber A44/Felgensilber 144), Black version available',
  '![[bmwstyle124.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-125',
  'BMW 5-Spoke 18"',
  '36116761999 (19x9.5 rear), various sizes available',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic (standard factory finish)',
  '![[bmwstyle125.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-126',
  'BMW 5-Spoke,Y-Spoke 19"',
  '36116761556 (front 9x19), 36116761555 (rear 10x19)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard Silver finish, Chrome aftermarket available',
  '![[bmwstyle126.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-127',
  'BMW Multi-Spoke 19"',
  '36112282650 (front), 36112282660/36112282999 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic',
  '![[bmwstyle127.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-128',
  'BMW OEM Wheel 19"',
  '36116766956 (9Jx21 ET22), 36116766957 (10Jx21 ET25), 36116771176 (10Jx21 ET32), 36116765028 (8.5Jx19 ET46), 36116765029 (9Jx19 ET51), 36116776841/36116776842 (Chrome versions)',
  '[{"value":19,"unit":"inch","raw":"19 inch, 21 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7J, 8.0J, 8.5J, 9.0J, 9.5J, 10.5J, 11.5J "}]',
  '[{"value":"5x120mm PCD"}]',
  '[{"value":"BMW"}]',
  'Standard Silver, Chrome-plated, Liquid Black',
  '![[bmwstyle128.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-129',
  'BMW 5-Spoke,Twin-Spoke 18"',
  '6765441, 36116765441',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic factory finish',
  '![[bmwstyle129.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-13',
  'BMW Multi-Spoke 15"',
  '36111180069, BMW 1 180 069-1',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[BMWStyle13.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-130',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116761929',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle130.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-131',
  'BMW 5-Spoke,Y-Spoke 18"',
  '36116761930',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle131.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-132',
  'BMW 5-Spoke 19"',
  '36116761931 (9J), 36116761932 (10J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Gun Metal Grey',
  '![[bmwstyle132.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-133',
  'BMW 9-Spoke,Multi-Spoke,Y-Spoke 17"',
  '36116762109',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle133.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-134',
  'BMW 7-Spoke 16"',
  '36116762000',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Forged finish)',
  '![[bmwstyle134.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-135',
  'BMW OEM Wheel 18"',
  '36117896470 (front), 36117896490/36118036944 (rear), 36118036947 (E60 X-Drive)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Decor Silver I (A55) - factory OEM finish, also available in various refinished colors',
  '![[bmwstyle135.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-136',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116762299',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Reflex Silver/BMW Standard Silver finish)',
  '![[bmwstyle136.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-137',
  'BMW 5-Spoke 17"',
  '36116762300',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver - Standard BMW aluminum finish',
  '![[bmwstyle137.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-138',
  'BMW 5-Spoke 17"',
  '36116776776, 36116762001, 36116767538, 36116776777',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic',
  '![[bmwstyle138.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-139',
  'BMW 10-Spoke 16"',
  '36116775618, 6775618-13',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle139.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-14',
  'BMW OEM Wheel 15"',
  '36111181875',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[BMWStyle14.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-140',
  'BMW 5-Spoke 16"',
  '36116775619, 3611676940',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle140.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-141',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116775621',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard Silver, available in Gloss Black',
  '![[bmwstyle141.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-142',
  'BMW 5-Spoke 17"',
  '36116775622 (7.0J front), 36116775623 (7.5J rear)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle142.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-143',
  'BMW 5-Spoke 18"',
  '36113411524',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle143.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-144',
  'BMW 10-Spoke,Multi-Spoke,Y-Spoke 17"',
  '36116763828',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Felgensilber (Silver) - Color Code 144',
  '![[bmwstyle144.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-145',
  'BMW 8-Spoke,Y-Spoke 19"',
  '36 11 6 764 534 (8.5J Front), 36 11 6 764 535 (9.0J Rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle145.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-146',
  'BMW 5-Spoke 19"',
  '36116764536 (front), 36116764537 (rear), 36110303872 (complete set), 36136768640 (hub cap)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J front, 9.0J rear"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle146.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-147',
  'BMW 5-Spoke 19"',
  '36116764538',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Code 144)',
  '![[bmwstyle147.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-148',
  'BMW 5-Spoke,Y-Spoke 17"',
  '36113417268, 36103412060, Center cap: 36 13 6 783 536',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle148.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-149',
  'BMW Multi-Spoke 20"',
  '36116764863 (front 9J), 36116764864 (rear 10J), BBS RX270 (front), BBS RX271 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (original), Black Metallic, Wet Black (aftermarket finishes available)',
  '![[bmwstyle149.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-15',
  'BMW Multi-Spoke 16"',
  '36116763002, 36116763004, 85329409856',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic',
  '![[BMWStyle15.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-150',
  'BMW 5-Spoke,Twin-Spoke 19"',
  '36116765026 (front 8.5J), 36116765027 (rear 9J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"???"}]',
  '[{"value":"BMW"}]',
  'Silver/Aluminum finish (standard OEM)',
  '![[bmwstyle150.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-151',
  'BMW 7-Spoke 16"',
  '36116775620, Center cap: 36 13 6 783 536',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish) - Cast aluminum alloy with silver painted finish and clear coating',
  '![[bmwstyle151.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-152',
  'BMW OEM Wheel 18"',
  '36117897252 (18" front), 36117897253 (18" rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8J, 8.5J, 9J, 9.5J, 10J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Kamacit Grey, Silver',
  '![[bmwstyle152.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-153',
  'BMW 5-Spoke,Twin-Spoke 18"',
  '36116765502',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Powder Coat',
  '![[bmwstyle153.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-154',
  'BMW 5-Spoke 16"',
  '36116775593 (current), 36116765762 (previous)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle154.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-155',
  'BMW 5-Spoke 16"',
  '36116672791',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Hypersilver finish',
  '![[bmwstyle155.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-156',
  'BMW 5-Spoke,Twin-Spoke 16"',
  '36116775595, 36116765810, 36136783536',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard Factory Finish)',
  '![[bmwstyle156.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-157',
  'BMW 5-Spoke 17"',
  'BMW Style #157, Hollander 59611',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory original finish)',
  '![[bmwstyle157.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-158',
  'BMW 7-Spoke 17"',
  '36116775596, 36116765810',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle158.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-159',
  'BMW OEM Wheel 17"',
  '36116775597',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish), Chrome (aftermarket available)',
  '![[bmwstyle159.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-16',
  'BMW OEM Wheel 16"',
  '36111092528',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'BMW Silver (Paint Code 144)',
  '![[BMWStyle16.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-160',
  'BMW Multi-Spoke 17"',
  '36116775597',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle160.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-161',
  'BMW 5-Spoke,Twin-Spoke 17"',
  '36116775600, 36116765815, 36116775599, 36116765814',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle161.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-162',
  'BMW 7-Spoke 18"',
  'Front: 36116775601, Rear: 36116775602, Previous: 36116765816, 36116765817',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver / Metallic Silver / Reflex Silver',
  '![[bmwstyle162.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-163',
  'BMW OEM Wheel 19"',
  '36112282650 (8.5J x 19 ET44), 36112282895 (8.0J x 19 ET47), 36112282999 (9.5J x 19 ET27)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (primary finish)',
  '![[bmwstyle163.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-164',
  'BMW OEM Wheel 18"',
  '36112282590, 36112282591',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Bright Silver finish',
  '![[bmwstyle164.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-165',
  'BMW 7-Spoke 17"',
  '36116765144',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'BMW Standard Silver',
  '![[bmwstyle165.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-166',
  'BMW OEM Wheel 19"',
  '36117834625 (front), 36117834626 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard Silver, Optional Polished (Style 167M)',
  '![[bmwstyle166.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-167',
  'BMW OEM Wheel 19"',
  '36117835146 (8.5J ET12), 36117835147 (9.5J ET17), 36117835148 (9.5J ET28)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Polished Face (Standard), Silver, Chrome (Available)',
  '![[bmwstyle167.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-168',
  'BMW 7-Spoke 20"',
  '36116766068 (front), 36116766069 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle168.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-169',
  'BMW 7-Spoke 16"',
  '36116766734',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bright Silver',
  '![[bmwstyle169.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-17',
  'BMW Multi-Spoke 15"',
  'BMW OEM - varies by size',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[BMWStyle17.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-170',
  'BMW 7-Spoke 17"',
  '36116766740',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle170.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-171',
  'BMW 10-Spoke 17"',
  '36116766741',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle171.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-172',
  'BMW 10-Spoke,Twin-Spoke 19"',
  '36118036948 (Front 8.5J x 19 ET18), 36118036949 (Rear 9.5J x 19 ET32)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard OEM finish)',
  '![[bmwstyle172.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-174',
  'BMW 10-Spoke,5-Spoke 18"',
  '36116767827',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle174.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-175',
  'BMW 7-Spoke 18"',
  '36116767828',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle175.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-176',
  'BMW Multi-Spoke 19"',
  '36116767394 (9J x 19 ET24), 36116767395 (10J x 19 ET24)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle176.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-177',
  'BMW OEM Wheel 18"',
  '36116774395, 36116774396, 36116774397, 36116774398, 36116774399, 36116768446, 36116768447',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J, 9.5J, 10.0J, 10.5J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver',
  '![[bmwstyle177.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-178',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116775624, 36116775625, 36116787975, 36116787976, 36116768558, 36116768559, 36136783536',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Black (variant)',
  '![[bmwstyle178.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-179-36116775604',
  'BMW OEM Wheel 18"',
  '36116775604',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8J, 8.5J, 9J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Anthracite, Chrome Powder (Refurbished Option)',
  '![[bmwstyle179.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-18',
  'BMW OEM Wheel 15"',
  'Multiple BMW OEM part numbers by chassis and size (36116XXXXXX series)',
  '[{"value":15,"unit":"inch","raw":"15 inch 16 inch17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J, 8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard OEM finish), Machined finishes available',
  '![[BMWStyle18.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-180',
  'BMW 7-Spoke 18"',
  '36 11 6 768 562 (front 7.5J), 36 11 6 768 563 (rear 8J), 36 13 6 768 640 (hub cap)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard OEM finish) - BMW''s traditional silver alloy wheel coating with clear protective topcoat. Paint code matches BMW''s OEM silver specifications for the E87 1 Series generation.',
  '![[bmwstyle180.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-181',
  'BMW 5-Spoke,Twin-Spoke 18"',
  'Front: 36 11 6 768 564, Rear: 36 11 6 768 565, Complete set: 36 11 0 390 272, Hub cap: 36 13 6 768 640',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle181.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-182',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36 11 6 768 566 (front), 36 11 6 768 567 (rear), 36 13 6 768 640 (hub cap), 36 11 0 390 274 (complete set with RSC tires)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish), Black (available finish)',
  '![[bmwstyle182.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-183',
  'BMW 5-Spoke 18"',
  '36117842183',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic (factory finish)',
  '![[bmwstyle183.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-184',
  'BMW OEM Wheel 18"',
  '36112282990 (primary), 36146792831 (RDC valve), 36146774590 (valve caps), 36111095436 (valve caps)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Aluminum finish (factory standard)',
  '![[bmwstyle184.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-185',
  'BMW 7-Spoke 17"',
  '36116764623 (OEM), Hollander: 59612',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle185.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-187',
  'BMW Multi-Spoke 17"',
  '36116768969, 6768969',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle187.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-188',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116768854 (standard), Front: 36116768854, Rear: 36116768854',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard BMW finish), machined face',
  '![[bmwstyle188.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-189',
  'BMW 5-Spoke 18"',
  'Front: 36116768858, Rear: 36116768859, Center Cap: 36136783536',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle189.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-19',
  'BMW OEM Wheel 17"',
  'BBS RT Series, various BMW part numbers by application',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8J, 9J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[BMWStyle19.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-190',
  'BMW Multi-Spoke 19"',
  '36116788786, 36116788787, 36116788788, 36116788789, 36116768970, 36116768971',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey with Bright Turned (Burnished Face), Silver, Bicolour with Polished Silver',
  '![[bmwstyle190.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-191',
  'BMW 7-Spoke,Y-Spoke 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard BMW OEM finish)',
  '![[bmwstyle191.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-192',
  'BMW 5-Spoke,Y-Spoke 18"',
  '36113415614 (8J x 18 ET44), 36113415615 (9J x 18 ET51)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM standard), also available in aftermarket finishes including Ferric Grey',
  '![[bmwstyle192.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-193',
  'BMW 10-Spoke 18"',
  '36118036933 (front 8x18 ET34), 36118036934 (rear 8.5x18 ET37)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Hyper Silver (standard), Ferric Grey, Gloss Black',
  '![[bmwstyle193.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-194',
  'BMW 7-Spoke 17"',
  '36117836335 (Front), 36118036935 (Rear), 8036935',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard BMW Silver Finish)',
  '![[bmwstyle194.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-195',
  'BMW 7-Spoke 18"',
  '36116775605 (front), 36116769561, 36116769563 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver',
  '![[bmwstyle195.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-196',
  'BMW Multi-Spoke 18"',
  '36 11 6 769 564 (front), 36 11 6 769 565 (rear), 36 13 6 768 640 (hub cap), 36 11 0 398 752 (complete set with Goodyear RSC)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J , 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Aluminum finish',
  '![[bmwstyle196.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-197',
  'BMW Multi-Spoke,8-Spoke 18"',
  '36116769566 (8x18 ET34), 36116769567 (8.5x18 ET37), 36116775609 (8x18 ET34 newer), 36116775610 (8.5x18 ET37 newer)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle197.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-198',
  'BMW Multi-Spoke 19"',
  'Front: 36116769570, Rear: 36116769571, Hub Cap: 36136768640/36136783536',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle198.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-199',
  'BMW 5-Spoke 19"',
  'Front: 36116783239 (8x19 ET37), Rear: 36116783240 (9x19 ET39)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish (standard), various BMW Individual colors available',
  '![[bmwstyle199.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-2-36111179761',
  'BMW Multi-spoke 15"',
  '36111179761, 36111129030',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard BMW Silver Paint finish. Factory original finish only available in silver painted aluminum alloy.',
  '![[BMWStyle2.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-20',
  'BMW OEM Wheel 17"',
  '36132226845 (turbine covers), various wheel part numbers',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J (front), 9.0J (rear)"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver turbine covers and center caps, black spokes and barrels (factory finish)',
  '![[BMWStyle20.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-200',
  'BMW 10-Spoke 17"',
  '36116768915',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey (Silver)',
  '![[bmwstyle200.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-201',
  'BMW 10-Spoke 17"',
  '36116771158, Hollander: 59601/59601S',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Titan Silver (painted silver finish)',
  '![[bmwstyle201.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-202',
  'BMW 5-Spoke,10-Spoke 18"',
  'Front: 36116771159, Rear: 36116771160',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM standard finish)',
  '![[bmwstyle202.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-203',
  'BMW 5-Spoke 18"',
  '36116771161 (front), 36116771162 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder coat silver',
  '![[bmwstyle203.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-204',
  'BMW 5-Spoke 17"',
  '36113417393',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard OEM finish)',
  '![[bmwstyle204.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-205',
  'BMW 5-Spoke,10-Spoke 18"',
  '36113417394',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle205.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-206',
  'BMW 5-Spoke,10-Spoke 18"',
  '36113417395 (8x18 front), 36113417396 (9x18 rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard finish)',
  '![[bmwstyle206.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-207',
  'BMW 10-Spoke,Multi-Spoke 17"',
  '36118036937 (7J), 36118036938 (7.5J)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Black (option)',
  '![[bmwstyle207.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-208',
  'BMW OEM Wheel 18"',
  '36118036939 (7.5J front), 36118036940 (8J rear), 36117839305 (8.5J rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle208.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-209',
  'BMW 5-Spoke 18"',
  '6770200, 36116770200',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle209.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-21',
  'BMW OEM Wheel 17"',
  '36 11 2 226 706 (front 8J), 36 11 2 226 707 (rear 9J), 36 11 2 227 438 (ET10)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J (front), 9.0J (rear)"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/natural aluminum finish, also available polished',
  '![[BMWStyle21.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-210',
  'BMW 5-Spoke 18"',
  '36116772243 (wheel), 36136783536 (center cap), 36136781151 (wheel bolt M14x1.25)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Powder Coat Silver',
  '![[bmwstyle210.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-211',
  'BMW 7-Spoke 19"',
  '36116772244, 6772244',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard), Chrome (aftermarket available)',
  '![[bmwstyle211.jpeg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-212',
  'BMW OEM Wheel 19"',
  '36116772245',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver',
  '![[bmwstyle212.jpeg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-213',
  'BMW 5-Spoke 19"',
  '36116772247 (front), 36116777248 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver',
  '![[bmwstyle213.jpeg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-214',
  'BMW OEM Wheel 20"',
  '36116772249 (front), 36116772250/36116782916 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Black, Grey',
  '![[bmwstyle214.jpeg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-215',
  'BMW OEM Wheel 21"',
  'Front Black: 36116781993, Front Ferric Grey: 36116772252, Rear Black: 36116782835, Rear Ferric Grey: 36116772253/36116782834',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Black (powder coat), Ferric Grey (bi-color)',
  '![[bmwstyle215.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-216',
  'BMW Multi-Spoke 18"',
  'Front: 36116770464, Rear: 36116770465',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle216.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-217',
  'BMW OEM Wheel 18"',
  '36116775634 (Front), 36116779380 (Rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (Standard)',
  '![[bmwstyle217.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-218',
  'BMW 10-Spoke 19"',
  '36116770941 (front), 36116770942 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Gray with clear coat finish',
  '![[bmwstyle218.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-219',
  'BMW 10-Spoke 18"',
  '36102283550 (front), 36102283551 (rear), 36102284050/36102284051 (silver versions)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey (Gunmetal), Reflex Silver',
  '![[bmwstyle219.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-22',
  'BMW 10-Spoke, Multi-Spoke 17"',
  '36112227194',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[BMWStyle22.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-220',
  'BMW 10-Spoke 19"',
  'Front: 36117842933, Rear: 36117842934',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Original: Silver/Gunmetal, Special Edition: Jet Black (Gloss Black)',
  '![[bmwstyle220.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-222',
  'BMW 5-Spoke 16"',
  '6779696',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle222.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-223',
  'BMW 7-Spoke,Twin-Spoke 19"',
  '36118037347 (front) / 36118037348 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard silver/aluminum finish, also available in Gloss Black',
  '![[bmwstyle223.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-224',
  'BMW 5-Spoke,10-Spoke 18"',
  '36107836832 (front), 36107836833 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Hyper Silver (metallic finish)',
  '![[bmwstyle224.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-225',
  'BMW 10-Spoke,Multi-Spoke 19"',
  '36118037141 (Front 8J), 36118037142 (Rear 9J)',
  '[{"value":19,"unit":"inch","raw":"19 inches"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (Standard Factory Finish)',
  '![[bmwstyle225.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-227',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36118037349 (front), 36118037350 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (OEM finish)',
  '![[bmwstyle227.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-228',
  'BMW OEM Wheel 19"',
  '36117841224 (front), 36117841225 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.0J, 9.5J"}]',
  '[{"value":"5x120mm"}]',
  '[{"value":"BMW"}]',
  'BMW Individual finishes (typically silver/anthracite)',
  '![[bmwstyle228.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-229',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116779786, 36116774684, 6774684',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle229.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-23',
  'BMW OEM Wheel 17"',
  '36112227895, 36112227995',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Chrome (aftermarket)',
  '![[BMWStyle23.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-230',
  'BMW 5-Spoke 19"',
  '36116785003 (front), 36116785004 (rear), 36136775937 (valve stem)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J,  9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard finish)',
  '![[bmwstyle230.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-231',
  'BMW 10-Spoke 19"',
  '36116774705 (front 9x19), 36116774706 (rear 10x19)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish), Chrome (aftermarket available)',
  '![[bmwstyle231.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-232',
  'BMW OEM Wheel 19"',
  '36116774893 (front 9Jx19 ET48), 36116774894 (rear 9Jx19 ET18), 36136783536 (hub cap)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard OEM finish)',
  '![[bmwstyle232.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-233',
  'BMW 7-Spoke 17"',
  '36116777654',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver',
  '![[bmwstyle233.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-234',
  'BMW OEM Wheel 18"',
  '36116775403',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (Metallic Silver)',
  '![[bmwstyle234.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-236',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116780720',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver, Reflex Silver, Metallic Silver',
  '![[bmwstyle236.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-237',
  'BMW Multi-Spoke 18"',
  '36116775407',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle237.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-238',
  'BMW OEM Wheel 18"',
  '6775992 (19" variant)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch, 21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish standard',
  '![[bmwstyle238.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-239',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 21"',
  '36116776449 (front 10.0J x 21 ET40), 36116776450 (rear 11.5J x 21 ET38)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle239.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-24',
  'BMW OEM Wheel 17"',
  '350 (front painted), 360 (rear painted), 759/760 (GT polished), 850/860 (M badge polished), 851 (later 7.5" polished)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J (front), 8.5J (rear)"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (painted or polished finish)',
  '![[bmwstyle24.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-241',
  'BMW 5-Spoke 18"',
  '36116777773 (front), 36116777774 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle241.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-242',
  'BMW 5-Spoke 16"',
  '36116777345',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Clear coat finish (standard OEM)',
  '![[bmwstyle242.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-243',
  'BMW 5-Spoke 17"',
  '36116777346, 36116777760, 36116777761',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Factory silver, aftermarket chrome available',
  '![[bmwstyle243.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-244',
  'BMW 10-Spoke 17"',
  '36116777347',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish (standard factory finish)',
  '![[bmwstyle244.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-245',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116777348',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle245.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-246',
  'BMW 5-Spoke 18"',
  '36116777349 (RWD ET20), 36116777761 (AWD ET43)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle246.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-247',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116777350 (front 8Jx18 ET20), 36116777351 (rear 9Jx18 ET32)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard BMW wheel silver finish)',
  '![[bmwstyle247.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-248',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116777352',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle248.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-249',
  'BMW 5-Spoke 19"',
  '36116777353 (Front), 36116777354 (Rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (Factory Standard)',
  '![[bmwstyle249.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-25',
  'BMW OEM Wheel 16"',
  '1090224',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish, Metallic silver',
  '![[bmwstyle25.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-250',
  'BMW 10-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Painted finish',
  '![[bmwstyle250.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-251',
  'BMW OEM Wheel 19"',
  '36116775390 (front 8.5x19 ET25), 36116775391 (rear 9.5x19 ET39)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (factory standard), Custom finishes available',
  '![[bmwstyle251.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-252',
  'BMW OEM Wheel 19"',
  '6775392 (front 8.5J), 6775393 (rear 9.5J), 36116775392, 36116775393',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J "}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor - Ferric Gray with Bright Turned finish',
  '![[bmwstyle252.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-253',
  'BMW OEM Wheel 20"',
  '36116777779 (8.5x20 ET25), 36116777780 (10x20 ET41), 36136769370 (Center Cap), 36136781151/36136890324 (Wheel Bolts)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory Standard)',
  '![[bmwstyle253.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-254',
  'BMW Multi-Spoke 18"',
  '36116775777, Interchange: 71327',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (aluminum alloy finish)',
  '![[bmwstyle254.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-255',
  'BMW 5-Spoke,Y-Spoke 16"',
  '36116778218, 6778218',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with clear coat finish',
  '![[bmwstyle255.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-256',
  'BMW 5-Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle256.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-257',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 36116778582, Rear: 36116778585',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle257.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-258',
  'BMW 5-Spoke 19"',
  '36116783244 (Rear), 6778586, 6778587',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard OEM finish)',
  '![[bmwstyle258.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-259',
  'BMW 5-Spoke 20"',
  '36116778588 (Front), 36116778589 (Rear), 36136783536 (Hub Cap)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard), Anthracite Grey available',
  '![[bmwstyle259.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-26',
  'BMW OEM Wheel 16"',
  '1182697 (7x16 ET46)',
  '[{"value":16,"unit":"inch","raw":"16 inch17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle26.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-260',
  'BMW 10-Spoke,Twin-Spoke,Multi-Spoke 18"',
  '36102283750 (front 8.5J), 36102283751 (rear 9.5J)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey (confirmed), possibly Reflex Silver and other BMW standard finishes',
  '![[bmwstyle260.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-261',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36117891050 (Front Reflex Silver), 36117891051 (Rear Reflex Silver), 36117842607 (Front Ferric Grey), 36117842608 (Rear Ferric Grey)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver, Ferric Grey (both OEM finishes)',
  '![[bmwstyle261.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-262',
  'BMW 5-Spoke 17"',
  '36116779791 (front 7x17), 36116779793 (rear 7.5x17)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard), Chrome (aftermarket available)',
  '![[bmwstyle262.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-263',
  'BMW 5-Spoke,Multi-Spoke,15-Spoke 18"',
  'Front: 36116779794, Rear: 36116779797, Hollander: 71258/71259',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver',
  '![[bmwstyle263.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-264',
  'BMW 5-Spoke 18"',
  '36116779800 (front 7.5x18), 36116779803 (rear 8.5x18)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic finish',
  '![[bmwstyle264.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-265',
  'BMW OEM Wheel 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic finish (standard)',
  '![[bmwstyle265.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-266',
  'BMW 5-Spoke,10-Spoke 18"',
  '36116780224 (8JX18 ET14), 36116780225 (9JX18 ET14), 36136781150 (wheel bolt), 36136783536 (hub cap), 36121116326 (rubber valve)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle266.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-268',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116780907, 6780907',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard OEM Silver/Aluminum finish',
  '![[bmwstyle268.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-269',
  'BMW OEM Wheel 18"',
  '36116781046, 36116781047, 36116787612, 36116781043',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Diamond Cut Face, Bicolour with Burnished Face',
  '![[bmwstyle269.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-27',
  'BMW 10-Spoke, Multi-Spoke 15"',
  '36111182608',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard factory)',
  '![[bmwstyle27.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-270',
  'BMW 7-Spoke,14-Spoke,Twin-Spoke 18"',
  '7840382',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle270.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-271',
  'BMW 10-Spoke,Multi-Spoke 18"',
  '36116781274',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (standard factory finish)',
  '![[bmwstyle271.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-272',
  'BMW 7-Spoke 19"',
  '36116781275 (front 8.5x19), 36116781276 (rear 9.5x19), 36136783536 (hub cap), 36136781151/36136890324 (wheel bolts M14x1.25)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle272.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-275',
  'BMW OEM Wheel 21"',
  'BMW Style 275 - Various BMW OEM part numbers available',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10.5,"unit":"inch","raw":"10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle275.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-276',
  'BMW 5-Spoke 17"',
  '36116782905, 36116782906, 36116782907, 36116782908, 36110053547',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch, 19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflexsilber (Silver)',
  '![[bmwstyle276.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-277',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116783283',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle277.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-278',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116783284 (ET20), 36116783285 (ET43), Hollander: 71300',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard)',
  '![[bmwstyle278.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-279',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36103451879',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard factory finish)',
  '![[bmwstyle279.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-28',
  'BMW Multi-Spoke,10-Spoke 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle28.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-280',
  'BMW 5-Spoke,Y-Spoke 18"',
  '36103451880',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle280.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-281',
  'BMW OEM Wheel 18"',
  '36116783521 (front), 36116783522 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle281.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-282',
  'BMW 12-Spoke,Multi-Spoke 16"',
  '36116783628 (Front), 6783628',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard alloy finish)',
  '![[bmwstyle282.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-283',
  'BMW 10-Spoke,15-Spoke 16"',
  '36116783629',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle283.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-284',
  'BMW 15-Spoke,Multi-Spoke 17"',
  '36116783630, Hollander: 71318',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (lacquered finish)',
  '![[bmwstyle284.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-285',
  'BMW 10-Spoke 17"',
  '36116783631, 36136783536',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflexsilber (Silver) - Color Code A44',
  '![[bmwstyle285.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-286',
  'BMW 10-Spoke,Multi-Spoke 17"',
  '36116783632 (main part number)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[bmwstyle286.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-287',
  'BMW 5-Spoke 18"',
  '36116783634 (Front 18x8), 36116783635 (Rear 18x8.5)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard factory finish)',
  '![[bmwstyle287.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-288',
  'BMW 7-Spoke,14-Spoke,Multi-Spoke 19"',
  '36117841375 (front 8.5x19), 36117841376 (rear 9x19)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle288.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-29',
  'BMW Multi-Spoke 15"',
  '36111093529 (primary), 36131093908 (center cap)',
  '[{"value":15,"unit":"inch","raw":"15 inch 16 inch 17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish), Chrome (aftermarket), Paint code 144',
  '![[bmwstyle29.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-290',
  'BMW 5-Spoke 17"',
  '36116785240',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle290.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-292',
  'BMW 5-Spoke 17"',
  '36116785248 (17x8 front), 36116785249 (17x8.5 rear)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (factory finish)',
  '![[bmwstyle292.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-293',
  'BMW Multi-Spoke 18"',
  'Front: 36116785250, Rear: 36116785251, Center Cap: 36136783536, Valve Caps: 36121120779, RDC Valve Caps: 36111095436, Wheel Bolts: 36136781150',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J , 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard factory finish)',
  '![[bmwstyle293.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-294',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke,2-Piece 18"',
  '36116785252 (Front 8.0J), 36116785253 (Rear 8.5J), 36136781150 (Wheel bolts), 36136783536 (Hub cap with chrome edge)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard finish)',
  '![[bmwstyle294.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-295',
  'BMW 5-Spoke 18"',
  'Front: 36116785254, Rear: 36116785255',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver (OEM standard finish)',
  '![[bmwstyle295.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-296',
  'BMW 5-Spoke,10-Spoke 19"',
  '36116785256 (front 8J x 19 ET29), 36116785257 (rear 9J x 19 ET40)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Bicolor (Silver with machined face)',
  '![[bmwstyle296.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-297',
  'BMW 5-Spoke 20"',
  '36116791416 (front), 36116791417 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish',
  '![[bmwstyle297.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-298',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116785503 (front 19x9 ET37), 36116785504 (rear 19x9 ET18)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Gray (standard OEM finish)',
  '![[bmwstyle298.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-299',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36116785499 (front 10x20 ET40), 36116785500 (rear 11x20 ET35)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM), Chrome, Black finishes available',
  '![[bmwstyle299.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-3-turbofan',
  'BMW Turbofan 15"',
  '36131179230',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard), Polished Aluminum',
  '![[BMWStyle3.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-30',
  'BMW 5-Spoke,10-Spoke 16"',
  '36111182760',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (factory standard)',
  '![[bmwstyle30.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-301',
  'BMW 7-Spoke,14-Spoke,Multi-Spoke 20"',
  '36117841226 (8.5x20 ET25), 36117841227 (10x20 ET41)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[bmwstyle301.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-302',
  'BMW 7-Spoke,14-Spoke,Twin-Spoke 19"',
  'Front: 36117841819, Rear: 36117841822',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Standard finish (OEM), available in custom finishes',
  '![[bmwstyle302.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-303',
  'BMW 5-Spoke,10-Spoke 20"',
  '36117841823 (8.5J front), 36117841824 (10J rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle303.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-304',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116787575',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle304.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-305',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '6787576',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle305.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-306',
  'BMW 5-Spoke 16"',
  '36116794271 (17" Left), 36116794272 (17" Right)',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Decoration Silver',
  '![[bmwstyle306.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-307',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '6787578, 36-11-0-053-550 (Winter Complete Wheel)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Lacquered), Black',
  '![[bmwstyle307.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-308',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116787579',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflexsilber (Silver Machined), Bicolour with Burnished Face',
  '![[bmwstyle308.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-309',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116787580 (8.5x19), additional variants available',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[bmwstyle309.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-31',
  'BMW Multi-Spoke 15"',
  '1092277',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish',
  '![[bmwstyle31.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-310',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36116787582 (front 20x8.5" ET38), 36116787583 (rear 20x10.0" ET51), 36136783536 (center cap)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bi-colour: Polished 5-spoke surface with Orbit Grey paint, also available in Ferric Grey, Black variants',
  '![[bmwstyle310.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-311',
  'BMW OEM Wheel 18"',
  '36116787604 (21" front), various BMW part numbers by size',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch, 21 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Midnight Chrome, Reflex Silver, Silver, Summer Chrome',
  '![[bmwstyle311.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-312',
  'BMW OEM Wheel 20"',
  '36116792594, 36116792595, 36116792596, 36116792597, 36116787610, 36116787611, 36136783536',
  '[{"value":20,"unit":"inch","raw":"20 inch, 21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey, Reflex Silver, Silver',
  '![[bmwstyle312.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-313',
  'BMW OEM Wheel 18"',
  '36116787647, 36116787648, 36117844344, 36136783536 (center caps)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Diamond Turned Face, Bicolour Burnished Face, Gloss-Turned Light Alloy',
  '![[bmwstyle313.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-315',
  'BMW OEM Wheel 19"',
  '36116788703 (front), 36116788704 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Ferric Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle315.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-316',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Bronze Metallic available',
  '![[bmwstyle316.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-317',
  'BMW 5-Spoke 17"',
  '36 11 6 789 140, 36 13 6 783 536',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM Factory Finish)',
  '![[bmwstyle317.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-318',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116789141',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle318.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-319',
  'BMW 5-Spoke 17"',
  '36116789142 (Silver), 36116867130 (Black)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Black (optional)',
  '![[bmwstyle319.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-32',
  'BMW OEM Wheel 15"',
  '36111091869, 36111095340, 36111093519, 36111095337, 36111093520, W59295H (varies by size/application)',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch, 17 inch, 18 inch, 20 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J, 7.0J, 7.5J, 8.0J, 9.0J, 10.0J"}]',
  '[{"value":"5×120mm"}]',
  '[{"value":"BMW"}]',
  'BMW Metallic Silver (standard), Brilliantline (darker graphite/anthracite finish)',
  '![[bmwstyle32.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-320',
  'BMW 5-Spoke 18"',
  '36116789143',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5×120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (Standard OEM finish)',
  '![[bmwstyle320.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-321',
  'BMW 7-Spoke,14-Spoke,Multi-Spoke,Twin-Spoke 18"',
  '36116789144',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver',
  '![[bmwstyle321.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-322',
  'BMW 5-Spoke,Y-Spoke 18"',
  '36116789145 (Front 8J), 36116789146 (Rear 9J), 36136783536 (Center Cap)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (OEM finish)',
  '![[bmwstyle322.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-323',
  'BMW 5-Spoke 18"',
  'Front: 36116789147, Rear: 36116789148',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Diamond Turned/Burnished Face',
  '![[bmwstyle323.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-324',
  'BMW 5-Spoke 19"',
  '36112211242 (Complete wheel and tire set)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey',
  '![[bmwstyle324.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-325',
  'BMW 5-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Machined Face with Clear Coat',
  '![[bmwstyle325.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-326',
  'BMW 5-Spoke 19"',
  '36117842135 (Front 8.0J x 19 ET29), 36117842136 (Rear 9.0J x 19 ET40)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J / 9.0J "}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (standard), also available in Black, Anthracite, and custom powder coat finishes',
  '![[bmwstyle326.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-327',
  'BMW 5-Spoke 17"',
  '71402, 6790172',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard), Chrome finish available',
  '![[bmwstyle327.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-328',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116790173, 6790173',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard factory finish)',
  '![[bmwstyle328.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-329',
  'BMW OEM Wheel 18"',
  '36116790174 (front 8x18 ET30), 36116790175 (rear 9x18 ET44), 36136783536 (center cap)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[bmwstyle329.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-33',
  'BMW Multi-Spoke 16"',
  '36111092209',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle33.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-330',
  'BMW 7-Spoke 18"',
  '36116790176 (front 8x18 ET30), 36116790177 (rear 9x18 ET44)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver machined finish (standard factory finish)',
  '![[bmwstyle330.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-331',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 36116790178 (8.5J x 19 ET33), Rear: 36116790179 (9J x 19 ET44), Hub cap: 36136783536, Wheel bolts: 36136781151/36136890324, TPMS valve: 36146792829',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflective Silver (standard), Chrome (aftermarket option)',
  '![[bmwstyle331.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-332',
  'BMW 5-Spoke,Multi-Spoke 19"',
  '36116790177, 36116790178',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Machined with silver finish',
  '![[bmwstyle332.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-333',
  'BMW 7-Spoke 20"',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'OEM Silver, Bicolor (Colored Finish with Burnished Face), Gloss Black (refinished)',
  '![[bmwstyle333.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-334',
  'BMW 5-Spoke,Multi-Spoke,Y-Spoke 19"',
  '36116788007',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle334.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-335',
  'BMW 5-Spoke,Y-Spoke 19"',
  '36106788008 (front 9x19) / 36116788009 (rear 10x19)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (powder coat silver finish)',
  '![[bmwstyle335.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-336',
  'BMW 5-Spoke,Twin-Spoke,Y-Spoke 20"',
  '36116788010 (front 10x20), 36116788011 (rear 11x20)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Schiefer Grey (factory finish)',
  '![[bmwstyle336.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-337',
  'BMW 5-Spoke,Twin-Spoke 20"',
  '36116788027 (front 10x20), 36116788028 (rear 11x20), 36116851068 (silver variant)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Ferric Grey/Schiefergrau with bright turned face), Silver',
  '![[bmwstyle337.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-338',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36-11-6-791-478 (wheel), 36-13-6-783-536 (center cap)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle338.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-339',
  'BMW 5-Spoke 17"',
  '36116791479, 6791479, Interchange: 71452',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Black, Grey finishes available',
  '![[bmwstyle339.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-34',
  'BMW Multi-Spoke 15"',
  '36 11 1 092 175, 36 13 1 095 361',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle34.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-340',
  'BMW 10-Spoke 17"',
  '36116791480 (8Jx17 ET34), 36116791481 (8.5Jx17 ET37), 36136781150 (Wheel Bolt), 36136783536 (Hub Cap), 36121178869 (Rubber Valve)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle340.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-342',
  'BMW Multi-Spoke,10-Spoke 18"',
  '36116791484 (Front 8Jx18 ET34), 36116791485 (Rear 8.5Jx18 ET37), 36116852285 (Spacegrau Front), 36116852286 (Spacegrau Rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), Spacegrau (space grey alternative)',
  '![[bmwstyle342.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-343',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Front: 36112283999, Rear: 36112283401',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Machined Grey, Matt Black, Schiefer Grey, Silver, Ferric Grey',
  '![[bmwstyle343.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-344',
  'BMW OEM Wheel 19"',
  '36112283950 (front 19x9.5), 36112283960 (rear 19x10.5)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard), various M Performance finishes available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-345',
  'BMW 10-Spoke,20-Spoke 19"',
  'Front: 36112284250, Rear: 36112284251',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (standard), Ferric Grey (optional)',
  '![[bmwstyle345.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-349',
  'BMW 14-Spoke,Multi-Spoke 19"',
  '36117842656 (front 8.5J), 36117842657 (rear 9.0J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle349.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-35',
  'BMW 5-Spoke 16"',
  '36111092260',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM), Chrome (aftermarket), Black powder coat (aftermarket)',
  '![[bmwstyle35.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-350',
  'BMW 7-Spoke,14-Spoke 18"',
  '36117842650 (front 8x18 ET30)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle350.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-351',
  'BMW 5-Spoke,Twin-Spoke 19"',
  '36117842652 (Front 8.5J x 19 ET33), 36117842653 (Rear 9J x 19 ET44)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Decor Silver (Standard), also available in Gloss Black and other finishes',
  '![[bmwstyle351.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-354',
  'BMW 7-Spoke,Y-Spoke 17"',
  '36117842635 (wheel), 36136783536 (center cap), 36136781150 (wheel bolt), 36121178869 (rubber valve)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Titanium Silver Metallic (BMW Color Code 354)',
  '![[bmwstyle354.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-355',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle355.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-356',
  'BMW 5-Spoke,10-Spoke 20"',
  'Front: 36116792594, Rear: 36116792595',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Grey with Burnished Face and Liquid Black',
  '![[bmwstyle356.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-357',
  'BMW 10-Spoke 19"',
  'Front: 36116796140, Rear: 36116796141 (typical F01 part number format)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic (standard), Ferric Grey metallic available',
  '![[bmwstyle357.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-359',
  'BMW Multi-Spoke 19"',
  'Silver: 36112284055 (Front), 36112284060 (Rear) | Matte Black: 36112284150 (Front), 36112284151 (Rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver, Matte Black (schwarz matt)',
  '![[bmwstyle359.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-36',
  'BMW Multi-Spoke 15"',
  '36111092408',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle36.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-360',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116793675 (ET31), 36116795207 (ET44)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle360.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-361',
  'BMW 5-Spoke 18"',
  '36116794369 (18"), 36116794370 (19" 7.5J), 36116794371 (19" 8J / 20" 8J), 36116794372 (20" 8.5J), 36116855092',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J"}]',
  '[{"value":"5x120, 5x112 ?????"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey, Orbit Grey with Bright Turned, Black, Black with Red Rim Edge, Bi-Color (Black & Red), Grey & Diamond Turned',
  '![[bmwstyle361.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-363',
  'BMW 5-Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle363.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-365',
  'BMW 10-Spoke 18"',
  'Front: 36116794688, Rear: 36116794689 (est.), 6794688 (short)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver, Black',
  '![[bmwstyle365.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-366',
  'BMW 5-Spoke,10-Spoke 19"',
  '36116794690 (front 8.5J ET33), 36116794691 (rear 9.0J ET44)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (original finish)',
  '![[bmwstyle366.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-367',
  'BMW 5-Spoke 19"',
  '36116794692 (front 8.5x19 ET33)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Sheen finish silver, Bicolor silver/ferric grey',
  '![[bmwstyle367.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-368',
  'BMW 5-Spoke,15-Spoke 18"',
  '36117844249 (Disc wheel light alloy dekor silver 2), 36136783536 (Hub cap with chrome edge)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Dekor Silver 2 (factory finish)',
  '![[bmwstyle368.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-369',
  'BMW 5-Spoke,Twin-Spoke 19"',
  '36117844250 (Front 8.5J), 36117844251 (Rear 9.5J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Dekor Silver (Standard)',
  '![[bmwstyle369.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-37',
  'BMW OEM Wheel 18"',
  '36112229635 (front), 36112227633 (rear), kit: 36112229731KT',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Matte Silver (E34 M5)',
  '![[bmwstyle37.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-373',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36117843715 (front 8.5J), 36117843716 (rear 9.0J), 36136783536 (center cap), 36121178869 (valve)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle373.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-374',
  'BMW 14-Spoke,Multi-Spoke 20"',
  'Front: 36117843717 (Silver), 36118091911 (Orbitgrey) | Rear: 36117843718 (Silver), 36118091912 (Orbitgrey)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J "}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Orbitgrey',
  '![[bmwstyle374.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-375',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke,Multi-Spoke 21"',
  '36116796149 (front 10x21 ET40), 36116796151 (rear 11.5x21 ET38), 36136783536 (center cap)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with burnished face, Bicolor with burnished face, Sheen finish',
  '![[bmwstyle375.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-376',
  'BMW 5-Spoke 16"',
  '36116796199, 36112287848',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Reflex Silver)',
  '![[bmwstyle376.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-377',
  'BMW 7-Spoke 16"',
  '36116796201',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle377.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-378',
  'BMW 5-Spoke,10-Spoke 16"',
  '36316796202, 36136783536',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle378.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-379',
  'BMW 5-Spoke 17"',
  '36116850151 (17x7.5 ET43)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120, 5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Orbit Grey with Burnished Face (Diamond Cut finish)',
  '![[bmwstyle379.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-38',
  'BMW OEM Wheel 17"',
  '36111092963 (primary)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Brilliantline (silver)',
  '![[bmwstyle38.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-380',
  'BMW 10-Spoke,Multi-Spoke 17"',
  '36316796205',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle380.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-381',
  'BMW 10-Spoke 17"',
  '36116796206, 36112287851 (complete wheel set)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Reflex Silver)',
  '![[bmwstyle381.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-382',
  'BMW 5-Spoke 17"',
  '36116796219, 36116796220, 36116855087, 36116855088',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor Space Grey with Burnished Face, Silver metallic',
  '![[bmwstyle382.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-385',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116796212 (Front 18"), 36116796213 (Rear 18")',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120, 5x112"}]',
  '[{"value":"BMW"}]',
  'Black, Reflex Silver',
  '![[bmwstyle385.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-388',
  'BMW Multi-Spoke 18"',
  '36116796218 (7.5x18), 36116796219 (8.0x18), 36115A63C80 (winter complete wheel)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey',
  '![[bmwstyle388.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-39',
  'BMW OEM Wheel 17"',
  '36112228160 (rear 8.5x17)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Polished finish, Chrome (aftermarket)',
  '![[bmwstyle39.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-390',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '6796236',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM standard finish)',
  '![[bmwstyle390.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-391',
  'BMW 5-Spoke 16"',
  '6796242 (17x7.5 variant), various BMW part numbers for 16x7.5 version',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM standard finish)',
  '![[bmwstyle391.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-392',
  'BMW 5-Spoke,10-Spoke 17"',
  '6796239, 36116796239',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle392.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-393',
  'BMW 5-Spoke 17"',
  '36116796242',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver, Silver',
  '![[bmwstyle393.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-394',
  'BMW 7-Spoke 17"',
  '36116856893, 6796243',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle394.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-395',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116796244 (7.5J ET37), 36116796245 (8.5J ET47), 36116859025 (8.0J ET34)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (factory finish)',
  '![[bmwstyle395.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-396',
  'BMW 7-Spoke 18"',
  '36116796246',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Gray/Bright Turned Bicolor, Silver, Various BMW OEM finishes',
  '![[bmwstyle396.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-397',
  'BMW 5-Spoke,10-Spoke 18"',
  '36116796247 (Primary), 36 11 6 796 247',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Gloss-Turned finish (Bicolor)',
  '![[bmwstyle397.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-398',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116796250 (front 8J), 36116796251 (rear 8.5J)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflexsilber (Silver), Orbit Grey',
  '![[bmwstyle398.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-399',
  'BMW Multi-Spoke 19"',
  'Front: 36116856218, Rear: 36116856219',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Reflex Silver, gloss-lathed)',
  '![[bmwstyle399.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-4',
  'BMW Multi-Spoke 15"',
  '36111181841 (16x8 ET23), Additional part numbers for 15" variants',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J (15\"), 8.0J (16\")"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Polished Aluminum, Multi-tone silver finish with polished accents',
  '![[BMWStyle4.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-40',
  'BMW 5-Spoke 17"',
  '36112228050 (front), 36112228060 (rear)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Gray finish (standard), Chrome shadow finish available',
  '![[bmwstyle40.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-400',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  'Front: 36117845880, Rear: 36117845881, Ferric Grey Front: 36118091939, Ferric Grey Rear: 36118091940, Jet Black Front: 36118099473, Jet Black Rear: 36118099474',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Dekor Silver 2 (Metallic Silver), Ferric Grey, Jet Black Solid Paint',
  '![[bmwstyle400.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-401',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116796256KT (staggered set)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with machined face',
  '![[bmwstyle401.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-402',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 8x19 ET30, Rear: 8.5x19 ET37 (typical staggered setup). Specific BMW part numbers vary by model year and market.',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver Bicolor (gloss-lathed face)',
  '![[bmwstyle402.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-403',
  'BMW 7-Spoke,14-Spoke,Twin-Spoke 19"',
  '36117845882 (Front 8J x 19 ET36), 36117845883 (Rear 8.5J x 19 ET47)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Bright Turned (Diamond Cut), Anthracite Grey, Satin Black',
  '![[bmwstyle403.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-404',
  'BMW Multi-Spoke 20"',
  '36116796262 (Front), 36116796263 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour (Orbitgrey), Gloss Gray, Gloss Black',
  '![[bmwstyle404.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-405',
  'BMW Multi-Spoke 18"',
  '36115A734D4 (20" M Performance Orbit Grey), 36115A3DE45 (20" M Performance Black/Diamond), 36112287894 (20" M Performance), 6796220 (19" versions)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch, 20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard finishes include Sheen finish, Schwarz matt (Matte Black). M Performance versions available in Orbit Grey with gloss-lathed face, Jet Black with polished/diamond-cut face, and various bicolour combinations.',
  '![[bmwstyle405.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-406',
  'BMW 5-Spoke 16"',
  '36116868392',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey (standard factory finish)',
  '![[bmwstyle406.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-407',
  'BMW 5-Spoke 19"',
  '36116857565 (8Jx19 ET36), 36116857566 (8.5Jx19 ET47), 36136783536 (center cap)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Ferric Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle407.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-408',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36112284252 (9Jx19 ET32 front), 36112284253 (9Jx19 ET25 rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J "}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle408.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-409',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36112284254 (Front ET32), 36112284255 (Rear ET25)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Satin Black',
  '![[bmwstyle409.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-41',
  'BMW 10-Spoke, Multi-Spoke 15"',
  '36111094480',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard BMW Factory Finish)',
  '![[bmwstyle41.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-410',
  'BMW Multi-Spoke 20"',
  '36116797477 (front), 36116797478 (rear), 36136783536',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour (Black high-gloss with burnished face), Polished',
  '![[bmwstyle410.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-411',
  'BMW 5-Spoke 16"',
  '36116867125, 6796200',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle411.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-412',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '6850152',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor White/High-Sheen Finish, Aspen White with Burnished Face and Silver',
  '![[bmwstyle412.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-413',
  'BMW 10-Spoke 17"',
  '36116796240 (Reflex Silver), 36116867126 (Black), 36136783536 (Hub cap)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver, Gloss Black',
  '![[bmwstyle413.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-414',
  'BMW Multi-Spoke 17"',
  '36116796241, 36116796241KT',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Aluminum alloy finish',
  '![[bmwstyle414.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-415',
  'BMW 10-Spoke 18"',
  '36116796248',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (Standard), Brushed, Polished, Chrome finishes available',
  '![[bmwstyle415.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-416',
  'BMW Multi-Spoke 18"',
  '36116796249, 36116866306 (Front), 36116866398 (Rear), 36116868424 (Ferric Grey)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Reflex Silver, Ferric Grey, Silver & Diamond Turned',
  '![[bmwstyle416.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-419',
  'BMW 5-Spoke 18"',
  '36116850376 (Left), 36316850941 (Right), 36136783536 (Center Caps)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Orbit Grey with Burnished Face (Bright Turned/Diamond Cut), Mirror Polished Face with Black Painted Spokes',
  '![[bmwstyle419.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-42',
  'BMW Multi-Spoke 15"',
  'BMW: 1095058, 1094373, 1094374, 1094377, 1094380; BBS: RS723, RS724, RS740, RS745',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch, 17 inch, 18 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J, 7.5J, 8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with machined face, polished lip, clear coat finish. Various refinish options available.',
  '![[bmwstyle42.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-421',
  'BMW 5-Spoke,10-Spoke 18"',
  '36116850293, 36136783536, 36136781150, 36121178869, 36146792830, 36141095389',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with Bright Turned, Machined Grey',
  '![[bmwstyle421.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-423',
  'BMW Multi-Spoke 19"',
  '36116851071 (8.5J), 36116851072 (9.0J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Gloss-Turned Light Alloy (Silver/Machined Face)',
  '![[bmwstyle423.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-424',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Research indicates Style 424 may not be a legitimate BMW style number',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver / Hypersilver finish',
  '![[bmwstyle424.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-425',
  'BMW 5-Spoke,10-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic (factory standard)',
  '![[bmwstyle425.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-426',
  'BMW Multi-Spoke 19"',
  '36116851076 (front 8.5J), 36116851077 (rear 9.5J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bright-turned bicolour finish with burnished face (diamond cut)',
  '![[bmwstyle426.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-427',
  'BMW 5-Spoke 19"',
  'Front: 6852053, Rear: 6856438, Complete Package: 36112357088KT',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":5,"unit":"inch","raw":"5.0J, 5.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle427.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-428',
  'BMW Multi-Spoke,5-Spoke 19"',
  'Front: 36116856894, 36116852054; Rear: 36116856895, 36116852055; Winter: 36112455050',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":5,"unit":"inch","raw":"5.0J, 5.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Black/Bright turned), Jet Black',
  '![[bmwstyle428.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-429',
  'BMW 5-Spoke 19"',
  '36116856896',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":5,"unit":"inch","raw":"5.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor Black with machined/polished face',
  '![[bmwstyle429.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-43',
  'BMW 5-Spoke 16"',
  '36111094505',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Paint Code 144)',
  '![[bmwstyle43.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-430',
  'BMW 5-Spoke 20"',
  'Front: 36116856898, 36116852058 | Rear: 36116856899, 36116852059',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":5,"unit":"inch","raw":"5.0J, 5.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Black with Burnished Face/Bright Turned/Diamond Cut finish)',
  '![[bmwstyle430.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-431',
  'BMW OEM Wheel 20"',
  'Front: 36116852080, 36116888010 | Rear: 36116852081, 36116888011 | Center Cap: 36136852052',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J, 6.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Jet Black, Bicolor: Jet Black with Burnished Face, Black & Diamond Turned',
  '![[Screenshot_2025-07-27_at_15.03.01.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-433',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36112284450 (front/orbit), 36112284451 (rear/orbit), 36118047255 (front/black), 36118047256 (rear/black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Gray/Gloss Turned, Jet Black',
  '![[bmwstyle433.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-434',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36117845867 (front 8.5x20), 36117845868 (rear 9.0x20)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey',
  '![[bmwstyle434.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-435',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Rear: 7845861 (11.0J x 20 ET 37)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Original BMW finish - typically Silver/Machined',
  '![[bmwstyle435.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-436',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36117845870 (7.5J Ferric), 36117847413 (7.5J Orbit), 36117845871 (8.0J Ferric), 36117847414 (8.0J Orbit)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey, Orbit Grey',
  '![[bmwstyle436.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-437',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 36112284755 (Ferric Grey), 36112284550 (Jet Black). Rear: 36112284756 (Ferric Grey), 36112284551 (Jet Black)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey, Jet Black (both with diamond cut finish options)',
  '![[bmwstyle437.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-439',
  'BMW 7-Spoke,14-Spoke,Twin-Spoke 19"',
  'Front: 36117845865, Rear: 36117845866, Hollander: 71620/71622',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Silver powder coated with burnished/machined face',
  '![[bmwstyle439.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-44',
  'BMW 7-Spoke 17"',
  '36111094506',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish (standard), also available in lacquered and other custom finishes',
  '![[bmwstyle44.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-440',
  'BMW 10-Spoke,Multi-Spoke 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Machined Face, Bicolor options available',
  '![[bmwstyle440.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-441',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  'Front: 36117846778, Rear: 36117846779',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey Metallic, Silver',
  '![[bmwstyle441.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-442',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36117852493 (front), 36117852494 (rear), 36117846493, 36117846494',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey, Ferric Grey, Gloss Black (all with Diamond Turned/Burnished faces)',
  '![[bmwstyle442.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-443',
  'BMW OEM Wheel 19"',
  'Research indicates M443 front and rear variants exist for F06/F12/F13 M6 models. Specific BMW part numbers require dealer verification.',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard: Bicolor Orbit Grey Metallic, Black finished spokes available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-444',
  'BMW OEM Wheel 20"',
  'Front: 36116857575 (6857575), Rear: 36116853004 (6853004), 36116855313',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Black with Burnished Face, Diamond Cut Black, Bright Turned/Diamond Cut',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-446',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116853952',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferricgrey metallic (standard), Silver',
  '![[bmwstyle446.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-447',
  'BMW 5-Spoke,15-Spoke 19"',
  '36116853957 (front 9.0J), 36116853958 (rear 10.0J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle447.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-448',
  'BMW 5-Spoke,15-Spoke 19"',
  '36116853954, 6853954',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Reflex Silver with Burnished Face, Silver gloss-lathed',
  '![[bmwstyle448.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-449',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116853955, 6853955, 36-11-2-357-085 (winter assembly)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Gray with Burnished Face (Machined), Bicolour finish',
  '![[bmwstyle449.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-45',
  'BMW 7-Spoke 16"',
  '36111094498',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM), Chrome (Aftermarket Available)',
  '![[bmwstyle45.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-450',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116853953',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Powder Coat Silver finish)',
  '![[bmwstyle450.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-451',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36116853959 (Front), 36116853960 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Burnished Face (Standard), Gloss Black (Style 451M)',
  '![[bmwstyle451.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-452',
  'BMW 10-Spoke 18"',
  '36116857665 (18" Ferric Grey), 36116857672 (19" 8.5J Silver), 36116859877 (19" 9.5J Silver)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.5J"}]',
  '[{"value":"5x120mm"}]',
  '[{"value":"BMW"}]',
  '''Bicolour: Ferric Grey with Burnished Face (18"), Silver (19")''',
  '![[bmwstyle452.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-453',
  'BMW 10-Spoke 19"',
  '36116857666 (front 8.5J), 36116857667 (rear 9.0J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle453.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-454',
  'BMW 10-Spoke,15-Spoke 18"',
  '36116857668, 36116883414, Hollander: 71629',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver with Bright Turned finish, Bicolor Reflex Silver with Burnished Face, Machined Silver',
  '![[bmwstyle454.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-455',
  'BMW Multi-Spoke 19"',
  '36116857669 (front), 36116857670 (rear), 36136783536',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor Reflex Silver with gloss-lathed face',
  '![[bmwstyle455.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-456',
  'BMW Multi-Spoke 17"',
  '36116857671 (Silver), 36116860572 (Reflex Silver), 36136783536 (Hub Cap)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Reflex Silver',
  '![[bmwstyle456.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-457',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Front: 36116857673 (8.5J x 20 ET25), Rear: 36116857674 (10J x 20 ET41), Hub Cap: 36136783536, Wheel Bolts: 36136781151/36136890324',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Grey with Burnished Face (Bright-Turned/Diamond Cut)',
  '![[bmwstyle457.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-458',
  'BMW 5-Spoke,Multi-Spoke 19"',
  '36116857675 (front 8.5Jx19), 36116859878 (rear 9.5Jx19), 36136783536 (center cap)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour Reflex Silver (gloss-lathed), Ferric Grey with Bright Turned Face',
  '![[bmwstyle458.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-459',
  'BMW Multi-Spoke 20"',
  'Front: 36116857676, Rear: 36116857677, Center Cap: 36136783536',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor Reflex Silver (gloss-lathed, two-tone finish)',
  '![[bmwstyle459.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-46',
  'BMW Multi-Spoke 15"',
  'Various BMW part numbers for different sizes',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (BMW paint code 144 typical)',
  '![[bmwstyle46.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-460',
  'BMW 10-Spoke,20-Spoke,Twin-Spoke 17"',
  'Front: 36117846782, Rear: 36117846783',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (factory standard)',
  '![[bmwstyle460.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-461',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  'Front: 36117846784 (Silver), 36117852489 (Gray), Rear: 36117846785 (Silver)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Dekor Silver 2, Ferric Gray',
  '![[bmwstyle461.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-463',
  'BMW 10-Spoke,15-Spoke,Multi-Spoke 21"',
  'Front: 36116854556, Rear: 36116854557, Additional: 36136783536',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Grey with Burnished Face (Diamond Cut/Gloss-lathed finish)',
  '![[bmwstyle463.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-464',
  'BMW 10-Spoke 20"',
  'Front: 36116854558, Rear: 36116854559, Complete Set: 36112303768',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Ferric Grey/high-gloss), Liquid Black',
  '![[bmwstyle464.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-465',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke,Multi-Spoke 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Silver with machined face)',
  '![[bmwstyle465.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-466',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36106854681 (Front 8.0J x 19 ET30), 36106854682 (Rear 9.0J x 19 ET42), 36136783536',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Bright Turned Face (Bicolour)',
  '![[bmwstyle466.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-467',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36117846786 (Front), 36117846787 (Rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (Metallic Silver), Gloss Black',
  '![[bmwstyle467.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-468',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Front: 36117846788, Rear: 36117846789, TPMS: 36136783536',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Orbit Grey gloss-lathed), M Performance finishes',
  '![[bmwstyle468.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-469',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36-11-7-846-790 (front), 36-11-7-846-791 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey (standard), Black available',
  '![[bmwstyle469.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-47',
  'BMW 5-Spoke, Twin-Spoke 16"',
  '36116759841 (base part number), additional variants: 85329408692, 1095095',
  '[{"value":16,"unit":"inch","raw":"16 inch,17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver - factory OEM finish, traditional BMW wheel silver paint typical of mid-1990s to early 2000s production',
  '![[bmwstyle47.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-470',
  'BMW 5-Spoke,15-Spoke 20"',
  'Front: 36116855013, 36116885167, 36106882953, 36106882954. Rear: 36116857572, 36116885172, 36106882955, 36106882956',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor Black with Burnished Face, Orbit Grey with Burnished Face, Matt Black, Bicolor Black with Bright Turned finish',
  '![[bmwstyle470.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-471',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116855080 (Borbet), 36116876692 (CMS), 36136850834 (Hub cap), 36136781151 (Wheel bolt), 36136890324 (Wheel bolt), 36121178869 (Rubber valve), 36141095389 (Valve), 36121120779 (Valve caps)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle471.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-472',
  'BMW 5-Spoke 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Silver/Bright Polished',
  '![[bmwstyle472.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-473',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '36116855082 (Reflex Silver), 36116874641 (Jet Black), 36112471495 (Winter set), 36136850834 (Hub cap)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver, Jet Black',
  '![[bmwstyle473.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-474',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '6855083',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (standard factory finish)',
  '![[bmwstyle474.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-475',
  'BMW 5-Spoke,15-Spoke,Multi-Spoke 16"',
  '36 13 6 850 834, 36 11 6 855 084',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle475.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-476',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 16"',
  '6855085',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (standard OEM finish)',
  '![[bmwstyle476.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-478',
  'BMW 5-Spoke 17"',
  '36116855087 (17x7.5 ET52)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (Reflexsilber)',
  '![[bmwstyle478.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-479',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116855088 (ET54), 36116856063 (ET52 - Discontinued)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle479.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-48',
  'BMW Multi-Spoke 16"',
  '36111095441',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle48.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-480',
  'BMW 5-Spoke 17"',
  '36116855089',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Silver with Burnished/Luster Turned Face',
  '![[bmwstyle480.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-481',
  'BMW Multi-Spoke 17"',
  '36 13 6 850 834, 36 11 6 881 440, 36 13 6 852 052 (standard), 36 13 6 855 090 (gloss-lathed)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Standard finish and gloss-lathed finish available',
  '![[bmwstyle481.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-483',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  'OEM BMW part numbers for F45/F46 17x7.5 ET54 wheels',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Standard BMW Silver finish, likely available in other OEM finishes',
  '![[bmwstyle483.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-484',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116855093, 6855093',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Grey with Burnished Face (Diamond Cut)',
  '![[bmwstyle484.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-485',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116855095 (primary), variations may exist for different finishes',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Silver, Ferric Grey, Bicolour (Ferric Grey/High-sheen finish)',
  '![[bmwstyle485.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-486',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"BMW"}]',
  'Bicolor - Ferric Grey Matt with Burnished Surfaces, Silver',
  '![[bmwstyle486.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-487',
  'BMW 5-Spoke,Multi-Spoke 19"',
  '36116855096',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle487.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-488',
  'BMW OEM Wheel 18"',
  '36116856089, 6856089',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Orbitgray Bright-turned',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-489',
  'BMW 5-Spoke 17"',
  '36107849122, 7849122, 36136850834, 36136852052, 36112471501',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour Orbit Grey with Gloss-Lathed Face',
  '![[bmwstyle489.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-49',
  'BMW 5-Spoke 17"',
  '36111095442',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with clear lacquer finish',
  '![[bmwstyle49.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-490',
  'BMW 5-Spoke 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor finish - machined face with darker recessed areas',
  '![[bmwstyle490.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-491',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36116858527 (Front), 36116858528 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Gloss Black, Bicolour Black with Burnished Face (Diamond Cut)',
  '![[bmwstyle491.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-496',
  'BMW 5-Spoke,10-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (BMW Code 144 - Standard OEM Silver)',
  '![[bmwstyle496.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-5',
  'BMW Multi-Spoke 14"',
  'Various BMW OEM part numbers per size/offset',
  '[{"value":14,"unit":"inch","raw":"14 inch, 15 inch, 16 inch, 17 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J, 7.5J"}]',
  '[{"value":"4x100 (E30), 5x120 (Most Models)"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard), Polished Aluminum, Granite Silver',
  '![[BMWStyle5.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-50',
  'BMW 5-Spoke, 10-Spoke, Twin-Spoke, Multi-Spoke 16"',
  '36111095339 (17x8" E46), 36116750273 (16x7" E39)',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle50.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-51',
  'BMW Multi-Spoke, Twin-Spoke, 8-Spoke, 16-Spoke 17"',
  '1095410',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM Standard Finish)',
  '![[bmwstyle51.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-511',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116851785, 6851785',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Orbit Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle511.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-514',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116855527 (Front 17x8 ET29), 36116855528 (Rear 17x8.5 ET40)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder Coat Silver',
  '![[bmwstyle514.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-515',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116855529 (Front 8Jx18 ET29), 36116855530 (Rear 8.5Jx18 ET40)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor - Bright-turned/Burnished Face with Colored Finish',
  '![[bmwstyle515.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-53',
  'BMW 5-Spoke, Twin-Spoke 15"',
  '36111095368',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (BMW Paint Code 144)',
  '![[bmwstyle53.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-54',
  'BMW 5-Spoke, Twin-Spoke, 10-Spoke 15"',
  '36111096552 (16" version)',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory OEM finish)',
  '![[bmwstyle54.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-542',
  'BMW 5-Spoke,Y-Spoke 20"',
  '36116864262 (Front 8.5J x 20 ET38), 36116864263 (Rear 10.0J x 20 ET51)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Charcoal Machined, Black with Burnished Face, Black with Bright Turned, Jet Black Matt (M Performance)',
  '![[bmwstyle542.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-55',
  'BMW 5-Spoke 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish (standard BMW OEM)',
  '![[bmwstyle55.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-551',
  'BMW 10-Spoke,5-Spoke,Twin-Spoke 20"',
  '36117847311 (Rear 11Jx20 ET37), 36108092110 (Front 10Jx20 ET40)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Silver base with machined/bright turned face)',
  '![[bmwstyle551.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-555',
  'BMW 5-Spoke,10-Spoke,Multi-Spoke 19"',
  '36115A143D2',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Jet Black Matt with Burnished Face (Bicolour)',
  '![[bmwstyle555.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-56',
  'BMW Multi-Spoke 17"',
  '36136768640, 36111096156',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard BMW OEM finish)',
  '![[bmwstyle56.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-560',
  'BMW 10-Spoke 17"',
  '36116856061 (Primary), 36136781151 (Wheel bolt), 36136890324 (Wheel bolt), 36136850834 (Hub cap), 36121116326 (Rubber valve), 36141095389 (Valve), 36121120779 (Valve caps), 36106881890 (RDCI module)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (Powder Coat Silver)',
  '![[bmwstyle560.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-561',
  'BMW 5-Spoke 17"',
  '6866106, 36116866106, 3610 6866106, 3611 6856062',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Burnished Face, Ferric Grey with Bright Turned face, Bicolour options',
  '![[bmwstyle561.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-564',
  'BMW 5-Spoke,10-Spoke 17"',
  '36116856065, 36136850834, 36112413554 (winter assembly)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (standard factory finish)',
  '![[bmwstyle564.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-566',
  'BMW 5-Spoke,10-Spoke 18"',
  '36116856067, 36116883503, 36112469018 (complete set)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour Ferric Grey with Burnished Face (gloss-lathed)',
  '![[bmwstyle566.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-567',
  'BMW 5-Spoke,10-Spoke 18"',
  '36116881443, 36116856068, 36116885381',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour Reflex Silver with Burnished Face, Reflex Silver',
  '![[bmwstyle567.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-568',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116856069',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Silver Machined (primary), Bicolour Ferric Grey with Burnished Face (Diamond Cut)',
  '![[bmwstyle568.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-569',
  'BMW 5-Spoke 18"',
  '36116856070',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Orbit Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle569.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-57',
  'BMW 5-Spoke 17"',
  '36111096159',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver metallic (factory standard)',
  '![[bmwstyle57.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-570',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36107850456 (primary), 36109503053 (ferric grey variant)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Bright Turned/Machined Face (Bicolor), Ferric Grey',
  '![[bmwstyle570.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-572',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36107849120 (19" M Double Spoke 572M)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor (Orbit Grey, gloss-lathed/diamond cut)',
  '![[bmwstyle572.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-573',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116856074',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Black Machined, Bi-Silver (Gloss Turned)',
  '![[bmwstyle573.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-58',
  'BMW 5-Spoke 18"',
  '36 11 1 096 160',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard OEM)',
  '![[bmwstyle58.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-59',
  'BMW 5-Spoke, 10-Spoke, Twin-Spoke 18"',
  'Front: 8J x 18 ET20, Rear: 9J x 18 ET22 (E52 Z8 Specific)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Titanium Silver (Factory), Chrome (Aftermarket)',
  '![[bmwstyle59.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-594',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116858872 (front), 36116858873 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Powder coated silver',
  '![[bmwstyle594.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-595',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116858874 (front 9J x 19" ET48), 36116858875 (rear 9J x 19" ET18)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Bright Turned finish (bicolor)',
  '![[bmwstyle595.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-597',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Front: 36116858878, Rear: 36116858879',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Ferric Gray with Bright Turned Face, Titanium with Burnished Face',
  '![[bmwstyle597.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-598',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36-11-7-847-543 (8x19 ET30), 36-11-2-287-847 (wheel/tire set)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Orbit Grey with Burnished Face',
  '![[bmwstyle598.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-599',
  'BMW 5-Spoke,10-Spoke 21"',
  '36116859423 (Front), 36116859424 (Rear), 36112349591 (Complete Set)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Orbit Grey with Burnished Face, Black with Burnished Face, High Gloss Polished Face with Orbit Grey',
  '![[bmwstyle599.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-6',
  'BMW Multi-Spoke 15"',
  '1180447',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5×120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory Finish)',
  '![[BMWStyle6.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-60',
  'BMW 10-Spoke, Multi-Spoke 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Bright Silver finish',
  '![[bmwstyle60.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-601',
  'BMW 7-Spoke 20"',
  'F10 M5: 36112284870 (front 20x9), 36112284871 (rear 20x10); F12/F06 M6: 36112284872 (front 20x9.5), 36112284873 (rear 20x10.5)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 9.5J, 10.0J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Charcoal Machined, Gloss Turned, Orbit Gray',
  '![[bmwstyle601.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-605',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116862886',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle605.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-606',
  'BMW 5-Spoke 19"',
  '36116862887 (front), 36116862888 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle606.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-607',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116862889',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Ferric Gray with Burnished Face (Bright Turned)',
  '![[bmwstyle607.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-608',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116862890 (Front 8.5J), 36116862891 (Rear 9.5J)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (OEM), Various refinished options available',
  '![[bmwstyle608.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-609',
  'BMW OEM Wheel 18"',
  '6862892 (front), 6868498 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle609.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-61',
  'BMW Multi-Spoke 16"',
  '36111095049',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Light Alloy Finish',
  '![[bmwstyle61.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-610',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116862894 (rear 19x9.0 ET44)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor - Machined Grey with polished face',
  '![[bmwstyle610.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-611',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  'Front: 36112284650, 36112284654, 36118043665 | Rear: 36112284651, 36112284655, 36118043666',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Black with Burnished Face, Bicolour: Orbit Grey with Burnished Face, Solid Orbit Grey, Jet Black',
  '![[bmwstyle611.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-612',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 21"',
  '36112284652 (front 21x10), 36112284653 (rear 21x11.5)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey with Bright Turned Face (Bicolor), Jet Black option available',
  '![[bmwstyle612.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-613',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36117848572 (front 8J x 18 ET30), 36117848573 (rear 9J x 18 ET44)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver, Ferric Grey',
  '![[bmwstyle613.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-616',
  'BMW 10-Spoke 20"',
  '36116862899 (front), 36116862900 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Machined Charcoal, Bicolour Orbit Grey with Burnished Face',
  '![[bmwstyle616.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-618',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '36116868217 (17x7.5J), 36116880047 (18x7.0J), 36116880684 (18x8.5J)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J, 8.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver (standard factory finish)',
  '![[bmwstyle618.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-619',
  'BMW 15-Spoke 18"',
  '36116861224 (current), 36116874442 (previous)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle619.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-62',
  'BMW OEM Wheel 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Shadow Chrome, Polished finishes available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-620',
  'BMW 14-Spoke 19"',
  'Front: 36116861225 | Rear: 36116861226 | Center Cap: 36136868053',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle620.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-621',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 17"',
  '6861846',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (OEM finish)',
  '![[bmwstyle621.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-622',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 36117849661 / 7849661, Rear: 36117849662 / 7849662',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Ferric Grey with Burnished Face',
  '![[bmwstyle622.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-623',
  'BMW OEM Wheel 19"',
  '36117849629 (Front 19x9 ET48), 36117850070 (Rear 19x9 ET18)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Gray',
  '![[bmwstyle623.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-624',
  'BMW 10-Spoke,Twin-Spoke 19"',
  '36116862772 (19" front), 36116862773 (19" rear), 36116862774 (20"), 36116864391 (19" silver), 36112287877 (wheel/tire set)',
  '[{"value":19,"unit":"inch","raw":"19 inch, 20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J,"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Jet Black Matt with Bright Turned face (primary), Silver (discontinued), Matte Black (M Performance variant)',
  '![[bmwstyle624.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-626',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36117849066 (8.0J front), 36117849067 (8.5J rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle626.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-627',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 21"',
  'Front: 36116863100, Rear: 36116863101, Additional: 36136783536',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":10,"unit":"inch","raw":"10.0J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Cerium Grey with gloss-lathed face, Grey Machined finish',
  '![[bmwstyle627.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-628',
  'BMW 15-Spoke,Multi-Spoke 20"',
  '36115A2A370 (Front), 36115A2A380 (Rear), Complete Set: 36115A2AF29',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor Ferric Grey with Burnished Face, Night Gold with Bright Turned',
  '![[bmwstyle628.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-629',
  'BMW Multi-Spoke 21"',
  'Front: 36-11-6-863-112/113, Rear: 36-11-6-869-014, Complete Set: 36-11-2-408-922',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Orbit Grey with Burnished Face, Liquid Black',
  '![[bmwstyle629.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-63',
  'BMW 5-Spoke, Y-Spoke 19"',
  'Front: 36111096231, Rear: 36111096228, Hub Cap: 36136768640',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (OEM finish)',
  '![[bmwstyle63.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-630',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  '36116887591 (8.5J ET25 Orbit Grey), 36116887592 (9.5J ET39 Orbit Grey), 36116881665 (8.5J Ferric Grey), 36116883159 (8.5J Reflex Silver), 36116863114 (8.5J Reflex Silver Bright Turned), 36116867337 (9.5J Reflex Silver Bright Turned), 36116883160 (9.5J Reflex Silver)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey with Burnished Face, Reflex Silver with Burnished Face, Ferric Grey, Reflex Silver',
  '![[bmwstyle630.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-64',
  'BMW 8-Spoke 16"',
  '36116760629, 36116760630',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory standard)',
  '![[bmwstyle64.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-640',
  'BMW OEM Wheel 18"',
  'Front: 36112284905 (8.5x18 ET27), Rear: 36112284906 (9x18 ET29), Winter assemblies: 36112448386 (F87 M2 front), 36112365421 (F8x M3/M4 rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Decor Silver (standard factory finish)',
  '![[bmwstyle640.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-641',
  'BMW OEM Wheel 19"',
  '36102284907 (Front 8.5x19), 36102284908 (Rear 9x19), 36108093920 (Rear Matte Black)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Decoration Silver, Jet Black Matte',
  '![[bmwstyle641.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-642',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 18"',
  '36116867338, 6867338',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle642.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-643',
  'BMW 5-Spoke,Twin-Spoke 18"',
  '36116867339',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Reflex Silver with Burnished Face (Diamond Cut)',
  '![[bmwstyle643.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-645',
  'BMW OEM Wheel 17"',
  '36116868047',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolour: Orbit Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle645.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-646',
  'BMW Multi-Spoke 20"',
  '36116868051 (front 8.5Jx20 ET25), 36116868052 (rear 10Jx20 ET41)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Polished Silver/Polished finish',
  '![[bmwstyle646.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-647',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 19"',
  'Front: 36117850579, Rear: 36117850580',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Burnished Face (Diamond Cut), Orbit Grey with Burnished Face, Jet Black',
  '![[bmwstyle647.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-648',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36117850581 (front 8.5J), 36117850582 (rear 10J), 36136850834 (center cap)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey, gloss-lathed (bicolor)',
  '![[bmwstyle648.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-649',
  'BMW 10-Spoke,Twin-Spoke 20"',
  '36112420615 (front), 36112420616 (rear), 36117850584 (rear individual)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with gloss-lathed accents (BMW Individual bicolor finish)',
  '![[bmwstyle649.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-65',
  'BMW 10-Spoke, Multi-Spoke, Twin-Spoke 18"',
  '36112228950 (front), 36112228960 (rear)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Chrome Shadow (factory finish)',
  '![[bmwstyle65.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-650',
  'BMW 10-Spoke,20-Spoke,Twin-Spoke,Multi-Spoke 21"',
  'Style 650M M Performance variant available',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey (standard), also available in other finishes',
  '![[bmwstyle650.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-654',
  'BMW OEM Wheel 16"',
  '36116866302, 6866302',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle654.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-655',
  'BMW OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Light gunmetal with polished face',
  '![[bmwstyle655.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-658',
  'BMW OEM Wheel 18"',
  '36116866306 (8J ET34), 36116866398 (8.5J ET47)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Reflex Silver',
  '![[bmwstyle658.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-66',
  'BMW 5-Spoke, Twin-Spoke 17"',
  '36112228995 (8x17), 36112229035 (9x17)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'OEM Silver (Titanium Silver), available in various OEM refinish options',
  '![[bmwstyle66.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-660',
  'BMW OEM Wheel 19"',
  '36-11-2-287-880 (19"), 36-11-2-287-900 (20")',
  '[{"value":19,"unit":"inch","raw":"19 inch, 20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Gray (High Gloss Clear Coat)',
  '![[bmwstyle660.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-666',
  'BMW OEM Wheel 20"',
  '36108090192 (Front), 36108090193 (Rear), 36112287500 (Front), 36112287501 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Diamond Cut, Jet Black, Satin Black, Orange (GTS), Bronze',
  '![[bmwstyle666.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-668',
  'BMW OEM Wheel 20"',
  '36117855087 (Front), 36117855088 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Cerium Grey Matt with Burnished Face (Bright Turned)',
  '![[bmwstyle668.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-669',
  'BMW OEM Wheel 20"',
  '36116884498 (8Jx20 ET30), 36116884505 (9Jx20 ET44), 36112446967 (Orbit Grey Set), 36112420426 (Black Bi-Color Set)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey, Black Bi-Color',
  '![[bmwstyle669.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-67',
  'BMW 10-Spoke, Multi-Spoke, Twin-Spoke 18"',
  '36112229950 (18x8 ET47), 36112229650/36112229660 (19" variants)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Chrome Shadow (machined face with clear coat), Anthracite Grey & Diamond Turned',
  '![[bmwstyle67.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-68',
  'BMW 5-Spoke,Twin-Spoke 17"',
  '36112229180 (7.5J), 36112229135 (8.5J)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey, Silver',
  '![[bmwstyle68.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-680',
  'BMW 5-Spoke,10-Spoke,Twin-Spoke 20"',
  '36117854208 (Front), 36117854209 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Bicolor Ferric Grey with Burnished Face',
  '![[bmwstyle680.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-683',
  'BMW OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Silver/Light Alloy (standard BMW finish)',
  '![[bmwstyle683.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-69',
  'BMW OEM Wheel 18"',
  '36116752027, 1096233, 1096234',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J, 9.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Brilliantline, Silver, Custom finishes available',
  '![[bmwstyle69.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-7',
  'BMW Multi-Spoke 15"',
  '36116751298, 36111093235',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0 inches (7.0J)"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver painted finish (standard factory finish), Optional: Clear coat over silver base',
  '![[BMWStyle7.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-70',
  'BMW 7-Spoke 17"',
  'BMW LA wheel, star spoke 70 - E38 specific',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Alloy (Standard OEM finish)',
  '![[bmwstyle70.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-71',
  'BMW OEM Wheel 17"',
  '36111097186, 36116760821',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'BMW Silver (standard), chrome available aftermarket',
  '![[bmwstyle71.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-718',
  'BMW OEM Wheel 21"',
  '36108053455 (Front 8.5J), 36108053456 (Rear 9.5J), 36107916272 (Jet Black)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolour Jet Black with Burnished Face, Matt Titanium with Burnished Face, Cerium Grey with Diamond Turned',
  '![[bmwstyle718.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-719',
  'BMW OEM Wheel 18"',
  'Front: 36118074185 (Jet Black), 36118009701 (Black/Bright), 36118745164 (Cerium Grey/Bright) | Rear: 36118074186 (Jet Black), 36118009703 (Black/Bright), 36118745166 (Cerium Grey/Bright)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Jet Black, Black with Bright Turned Face, Cerium Grey with Bright Turned Face',
  '![[bmwstyle719.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-72',
  'BMW Multi-Spoke,Y-Spoke 18"',
  '36112229145 (front), 36112229155 (rear), 36136783536 (center caps)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard OEM)',
  '![[bmwstyle72.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-73',
  'BMW Multi-Spoke 17"',
  '36116753816, 6753816',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Paint Code 144 - Standard BMW Silver)',
  '![[bmwstyle73.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-74',
  'BMW 5-Spoke,Twin-Spoke 18"',
  '36116750865',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver - Standard BMW light alloy finish',
  '![[bmwstyle74.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-742',
  'BMW OEM Wheel 22"',
  '36118090013 (F), 36118090014 (R), 36119882610 (F), 36119882611 (R)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Jet Black, Bicolor (Silver Face/Jet Black Interior), Jet Black with Burnished Face',
  '![[bmwstyle742.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-746',
  'BMW OEM Wheel 22"',
  '746I, 36-11-8-xxx-xxx series',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":10.5,"unit":"inch","raw":"10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Orbit Grey with Burnished Face',
  '![[bmwstyle746.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-747',
  'BMW OEM Wheel 22"',
  '36118072002 (Front 9.5Jx22 ET37), 36118072003 (Rear 10.5Jx22 ET43)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Cerium Grey with Burnished Face (Bicolor), Black II Solid with Bright Turned',
  '![[bmwstyle747.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-75',
  'BMW Multi-Spoke 19"',
  '36116750888 (front)36116750889 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J "}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic (powder coat finish)',
  '![[bmwstyle75.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-753',
  'BMW OEM Wheel 21"',
  '36116885142',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Ferric Grey with Bright Turned Face (Bicolor)',
  '![[bmwstyle753.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-755',
  'BMW OEM Wheel 22"',
  'Front: 36118074221, Rear: 36118090108, Alt: 36108093913/36108093914',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Jet Black with Burnished Face, Cerium Grey with Burnished Face, Matte Black',
  '![[bmwstyle755.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-756',
  'BMW OEM Wheel 22"',
  '36116885143 (Front 9.5J), 36116885462 (Rear 10.5J)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Orbit Grey with Burnished Face (Bicolour)',
  '![[bmwstyle756.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-76',
  'BMW Multi-Spoke 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Polished aluminum finish',
  '![[bmwstyle76.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-77',
  'BMW Multi-Spoke,5-Spoke 18"',
  'BBS RT162',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard finish)',
  '![[bmwstyle77.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-78',
  'BMW OEM Wheel 17"',
  '36116751364 (17"), 36116751358, 36116751359 (18")',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Anthracite (Standard), available in various refinish options',
  '![[bmwstyle78.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-79',
  'BMW 5-Spoke,Twin-Spoke,Y-Spoke 17"',
  '36116751415',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle79.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-799',
  'BMW OEM Wheel 19"',
  'Front: 36118089876 (Burnished), 36118091763 (Black) | Rear: 36118089877 (Burnished), 36118091764 (Black)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Jet Black, Jet Black with Burnished Face (Diamond Cut)',
  '![[bmwstyle799.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-8',
  'BMW Multi-Spoke 16"',
  '36111181919',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory Finish)',
  '![[BMW_Style_8.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-80',
  'BMW Multi-Spoke 17"',
  '36116756231',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (standard OEM)',
  '![[bmwstyle80.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-800',
  'BMW OEM Wheel 19"',
  '36118089878 (Front 9x19 ET32), 36118089879 (Rear 10x19 ET40)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Cerium Grey with Burnished Face (Bright Turned/Diamond Cut)',
  '![[bmwstyle800.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-809',
  'BMW OEM Wheel 21"',
  '36-11-8-090-796 (21" front), 36-11-9-502-648 (21" front matte), 36-11-9-502-663 (22" rear)',
  '[{"value":21,"unit":"inch","raw":"21 inch, 22 inch"}]',
  '[{"value":10.5,"unit":"inch","raw":"10.5J, 11.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Jet Black with Burnished Face, Jet Black Matte with Burnished Face',
  '![[bmwstyle809.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-81',
  'BMW 7-Spoke 17"',
  '36116751761',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Aluminum (Standard OEM), Chrome (Aftermarket Option)',
  '![[bmwstyle81.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-811',
  'BMW OEM Wheel 20"',
  '36-11-8-089-564 (9.5J front), 36-11-8-089-565 (10.5J rear), 36-13-6-850-834 (center cap)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Bicolor: Jet Black with Burnished/Machined Face',
  '![[bmwstyle811.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-813',
  'BMW OEM Wheel 20"',
  'Front: 36-10-8-089-568, Rear: 36-10-7-883-373',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Jet Black with Translucent Shadow Face, Bicolour Jet Black with Gold Bronze, Midnight Grey',
  '![[bmwstyle813.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-82',
  'BMW Multi-Spoke 16"',
  '36116751762',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle82.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-829',
  'BMW OEM Wheel 19"',
  'Front: 36-10-8-093-844, Rear: 36-10-8-093-845',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"BMW"}]',
  'Matte Black',
  '![[bmwstyle829.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-83',
  'BMW 7-Spoke 15"',
  '6751763',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Standard BMW finish)',
  '![[bmwstyle83.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-85',
  'BMW OEM Wheel 17"',
  '36116751548, 36116752084, 36116752086',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J, 9.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver',
  '![[bmwstyle85.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-86',
  'BMW OEM Wheel 17"',
  '36116752087, 36110009629, 36131095361',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J, 8J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Aluminum finish',
  '![[bmwstyle86.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-863',
  'BMW OEM Wheel 20"',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  NULL,
  '[{"value":"BMW"}]',
  NULL,
  '![[bmwstyle863.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-87',
  'BMW 5-Spoke 20"',
  '36116753516, 36116753517',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver, Anthracite, available in various BMW factory finishes',
  '![[bmwstyle87.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-88',
  'BMW 5-Spoke,Twin-Spoke 16"',
  '36116752769',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (BMW Paint Code 144)',
  '![[bmwstyle88.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-89',
  'BMW OEM Wheel 17"',
  '36116761993, 36116757373',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory), Chrome (aftermarket)',
  '![[bmwstyle89.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-9',
  'BMW 7-Spoke 16"',
  '36111180197 (Left), 36111180198 (Right)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'BMW Silver (Code #144)',
  '![[BMWStyle9.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-90',
  'BMW 5-Spoke 17"',
  '36116753236',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (Factory Finish)',
  '![[bmwstyle90.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-91',
  'BMW 10-Spoke,Multi-Spoke 18"',
  '36116753237',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver/Clear Coat Finish',
  '![[bmwstyle91.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-92',
  'BMW 5-Spoke 19"',
  '36116753238, 36116754998, 36116760627, 36116760628, 36116765346',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver with Bright Turned Face (Bicolour finish)',
  '![[bmwstyle92.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-93',
  'BMW 7-Spoke,Twin-Spoke 18"',
  '36116753239, 6753239',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Metallic Silver (standard factory finish)',
  '![[bmwstyle93.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-94',
  'BMW Multi-Spoke 18"',
  '36116753240',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (factory finish)',
  '![[bmwstyle94.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-95',
  'BMW 10-Spoke 19"',
  '36116753241 (front), 36116753242 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Standard silver finish, anthracite available as aftermarket option',
  '![[bmwstyle95.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-96',
  'BMW 7-Spoke 17"',
  '36116755857 (primary), 36110144211, 36136756717',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver Metallic, Hypersilver finish available',
  '![[bmwstyle96.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-97',
  'BMW 7-Spoke,Twin-Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish',
  '![[bmwstyle97.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-98',
  'BMW 5-Spoke,Twin-Spoke 17"',
  '36116757042',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver (standard factory finish)',
  '![[bmwstyle98.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'bmw-style-99',
  'BMW 5-Spoke 18"',
  '36116757355',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"BMW"}]',
  'Silver finish (factory standard)',
  '![[bmwstyle99.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'cross-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/16cross.jpg 16"',
  '105122337cap 105122311',
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'cross-spoke-3',
  'Saab https://kontiki2.nl/saab/images/wheels/15cross2.jpg 15"',
  '0251157cap 0251124',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'cross-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/15cross.jpg 15"',
  '400103800cap 105122311cap2 105122309',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'db9-wheels',
  'DB9 WHEELS',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_21.52.39.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'dbs-superleggera-concorde-ed',
  'DBS Superleggera concorde ed',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.12.03.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'dbs-superleggera',
  'DBS superleggera',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.10.42.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'dodge-charger-daytona-rt-wheel',
  'DODGE CHARGER DAYTONA RT WHEEL',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'diamond-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/diamond.jpg 15"',
  '105122402cap 105123400',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'five-spoke-square-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/fives-1grey.jpg 15"',
  '105124945cap 105124952',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'five-spoke-square-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/fives-1.jpg 15"',
  '105124903cap 105124929',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'ford-gt-wheel-2020',
  'Ford OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Ford"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_00.07.28.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'ford-gt-wheels-new-one',
  'Ford GT Wheels (new one)',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-i10-fe-diamond-cut-16-alloy-wheel-rim-6-5j-oem-52910k7700-genuine-x',
  'HYUNDAI I10 FE DIAMOND CUT 16 ALLOY WHEEL RIM 6.5J OEM 52910K7700 GENUINE X',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_I10_FE_DIAMOND_CUT_16_ALLOY_WHEEL_RIM_6.5J_OEM_52910K7700_GENUINE_X.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-i20-silver-15-diamond-cut-alloy-wheel-rim-6-0j-grey-genuine-x1',
  'HYUNDAI I20 SILVER 15 DIAMOND CUT ALLOY WHEEL RIM 6.0J GREY GENUINE X1',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_I20_SILVER_15_DIAMOND_CUT_ALLOY_WHEEL_RIM_6.0J_GREY_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-ioniq-16-diamond-cut-alloy-wheel-rim-oem-52910-g7700-genuine-x1',
  'HYUNDAI IONIQ 16 DIAMOND CUT ALLOY WHEEL RIM OEM 52910-G7700 GENUINE X1',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_IONIQ_16_DIAMOND_CUT_ALLOY_WHEEL_RIM_OEM_52910-G7700_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-ioniq-5-20-alloy-wheel-rim-black-diamond-cut-52910-g1210-genuine-x1',
  'HYUNDAI IONIQ 5 20 ALLOY WHEEL RIM BLACK DIAMOND CUT 52910-G1210 GENUINE X1',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_IONIQ_5_20_ALLOY_WHEEL_RIM_BLACK_DIAMOND_CUT_52910-G1210_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-ioniq-ae-17-grey-silver-alloy-wheel-rim-oem-52910-c2600-genuine-x1',
  'HYUNDAI IONIQ AE 17 GREY & SILVER ALLOY WHEEL RIM OEM 52910-C2600 GENUINE X1',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_IONIQ_AE_17_GREY__SILVER_ALLOY_WHEEL_RIM_OEM_52910-C2600_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-kona-16-diamond-cut-alloy-wheel-rim-oem-52910-cm100-genuine-x1',
  'HYUNDAI KONA 16 DIAMOND CUT ALLOY WHEEL RIM OEM 52910-CM100 GENUINE X1',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_KONA_16_DIAMOND_CUT_ALLOY_WHEEL_RIM_OEM_52910-CM100_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-tucson-silver-17-alloy-wheel-rim-7j-et51-oem-52910d7220-genuine-x1',
  'HYUNDAI TUCSON SILVER 17 ALLOY WHEEL RIM 7J ET51 OEM 52910D7220 GENUINE X1',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_TUCSON_SILVER_17_ALLOY_WHEEL_RIM_7J_ET51_OEM_52910D7220_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-i10-15-silver-alloy-wheel-rim-6j-oem-52910k7100-x1',
  'HYUNDAI i10 15 SILVER ALLOY WHEEL RIM 6J OEM 52910K7100 X1',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_i10_15_SILVER_ALLOY_WHEEL_RIM_6J_OEM_52910K7100_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-i10-mk3-16-diamond-cut-alloy-wheel-rim-oem-52910k7200-genuine-x1',
  'HYUNDAI i10 MK3 16 DIAMOND CUT ALLOY WHEEL RIM OEM 52910K7200 GENUINE X1',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_i10_MK3_16_DIAMOND_CUT_ALLOY_WHEEL_RIM_OEM_52910K7200_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hyundai-i20-silver-16-alloy-wheel-rim-6-5j-oem-c00079498-genuine-x1',
  'HYUNDAI i20 SILVER 16 ALLOY WHEEL RIM 6.5J OEM C00079498 GENUINE X1',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 Inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[HYUNDAI_i20_SILVER_16_ALLOY_WHEEL_RIM_6.5J_OEM_C00079498_GENUINE_X1.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-3-twin-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/h3-twin.jpg 19"',
  '750001000',
  '[{"value":19,"unit":"inch","raw":"19 Inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-5-twin-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/h5-twin.jpg 18"',
  '740002000',
  '[{"value":18,"unit":"inch","raw":"18 Inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-6-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/h6-17.jpg 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 Inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-6-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/h6-18.jpg 18"',
  '740001001',
  '[{"value":18,"unit":"inch","raw":"18 Inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-6-twin-spoke-2',
  'Saab https://kontiki2.nl/saab/images/wheels/h6-twinblack.jpg 19"',
  '750002001',
  '[{"value":19,"unit":"inch","raw":"19 Inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'hirsch-6-twin-spoke',
  'Saab https://kontiki2.nl/saab/images/wheels/h6-twin.jpg 19"',
  '750002000',
  '[{"value":19,"unit":"inch","raw":"19 Inch"}]',
  NULL,
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'inca',
  'Saab https://kontiki2.nl/saab/images/wheels/inca.jpg 15"',
  '105118707cap 105119101',
  '[{"value":15,"unit":"inch","raw":"15 Inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Saab"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jp-cromodora',
  'Jaguar https://kontiki2.nl/saab/images/wheels/jp.jpg 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":4.5,"unit":"inch","raw":"4.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Jaguar"}]',
  'Silver / Natural Aluminum finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-5-spoke-5102',
  'Jaguar OEM Wheel 20"',
  'T2R43121 (Front, Tech Grey), T2R43122 (Rear, Tech Grey), T2R43123 (Front, Gloss Black), T2R43124 (Rear, Gloss Black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Technical Grey Diamond Turned, Satin Dark Grey Diamond Turned',
  '![[Jaguar_5_Spoke_5102_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-7-split-spoke-7013',
  'Jaguar OEM Wheel 19"',
  'T2R4749, T2R4750, T2R4751, T2R4752, T2H2206, T2H5339',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver, Black, Contrast Diamond Turned finish',
  '![[Jaguar_7_Split_Spoke_7013_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-aerodynamic-1017',
  'Jaguar OEM Wheel 17"',
  'T2H2203, T2H12516',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (standard factory finish)',
  '![[Jaguar_Aerodynamic_1017_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-aerodynamic-1021',
  'Jaguar OEM Wheel 18"',
  'T4A2304',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Sparkle Silver',
  '![[Jaguar_Aerodynamic_1021_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-aerodynamic-1037',
  'Jaguar OEM Wheel 17"',
  'J9C3083',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (factory finish)',
  '![[Jaguar_Aerodynamic_1037_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-aerospeed-svr',
  'Jaguar OEM Wheel 20"',
  'T4N26754 (front), T4N26755 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Dark Grey with Gloss Black finish',
  '![[Jaguar_Aerospeed_SVR_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-aleutian-1028',
  'Jaguar OEM Wheel 19"',
  'Front: C2D4499 (AW931007CA), Rear: C2D4500 (AW931007DB)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (factory finish)',
  '![[Jaguar_Aleutian_1028_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-amirante',
  'Jaguar OEM Wheel 20"',
  'Front: C2D7439, Rear: C2D7440',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (metallic finish with metallic flakes for sparkle effect)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-arm-6006',
  'Jaguar OEM Wheel 18"',
  'T4N1676',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver (Sparkle Silver)',
  '![[Jaguar_Arm_6006_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-atom-5055',
  'Jaguar OEM Wheel 18"',
  'T4K4006 (18"), T4K11670 (19"), J9D31007NA (18" Manuf ID), M9D31007BA (19" Manuf ID)',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Dark Grey Diamond Turned, Sparkle Silver',
  '![[Jaguar_Atom_5055_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-axis-7013',
  'Jaguar OEM Wheel 19"',
  'T2R4749, T2R4750 (front), T2R4751, T2R4752 (rear), T2H2206, T2H5339',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black Diamond Turned, Contrast Diamond Turned finish',
  '![[Jaguar_Axis_7013_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-biganun-5081',
  'Jaguar OEM Wheel 22"',
  'Front: T4A17666, KK8M1007EA; Rear: T4A17667, KK8M1007FA',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Technical Grey Diamond Turned, Gloss Black, Gloss Black Diamond Turned',
  '![[Jaguar_Biganun_5081_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-bionic-5038',
  'Jaguar OEM Wheel 19"',
  'T4A3800, T4A12372, HK8M-1007-NA, HK8M-1007-EA, LK8M-1007-AA',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Grey Diamond Turned, Gloss Black',
  '![[Jaguar_Bionic_5038_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-blade-5035',
  'Jaguar OEM Wheel 19"',
  'T4A4437, T4A4438, T4A35068, T2H5941, T2H5943, T2H39047, HK8M1007KB, HK8M1007GB, HK8M1007JB, LK8M1007BA, KX6M1007AA, GX6M1007CB',
  '[{"value":19,"unit":"inch","raw":"19 inch20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Grey Diamond Turned, Dark Grey Diamond Turned, Satin Grey Diamond Turned, Satin Tech Grey Diamond Turned',
  '![[Jaguar_Blade_5035_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-blade-5048',
  'Jaguar OEM Wheel 18"',
  'J9C5435',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Sparkle Silver',
  '![[Jaguar_Blade_5048_Wheels-photoaidcom-cropped.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-brundle-5101',
  'Jaguar OEM Wheel 19"',
  'T2R45849 (front Silver), T2R45852 (rear Silver), T2R45851 & T2R45852 (Gloss Black Diamond Turned)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver, Gloss Black Diamond Turned finish',
  '![[Jaguar_Brundle_5101_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-chalice-7011',
  'Jaguar OEM Wheel 18"',
  'GX63-1007-EA, T2H4952',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black',
  '![[Jaguar_Chalice_7011_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-coriolis-svr-5061',
  'Jaguar OEM Wheel 20"',
  'T2R50382 (Front), T2R50383 (Rear), T2R20853 (Front Technical Grey)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 11.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Satin Technical Grey',
  '![[Jaguar_Coriolis_SVR_5061_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-crux-7010',
  'Jaguar OEM Wheel 17"',
  'T4N1683, T4N13500, T4N21576',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Dark Grey',
  '![[Jaguar_Crux_7010_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-cyclone-5041',
  'Jaguar OEM Wheel 20"',
  'Front: T2R4745, T2R4746, T2R21297, EX53-1007-GAA | Rear: T2R4747, T2R4748, T2R21298, EX53-1007-HAA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Technical Grey, Metallic Silver, Gloss Black',
  '![[Jaguar_Cyclone_5041_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-double-helix-1020',
  'Jaguar OEM Wheel 22"',
  'T4A3797 (Black), T4A8586 (Grey), T4A3796 (Silver), T4A858 (Technical Grey/Satin Black), Hollander: ALY59978U',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black/Black inserts, Gloss Grey/Black inserts, Gloss Silver/Tech Grey inserts, Technical Grey/Black inserts, Satin Black finish',
  '![[Jaguar_Double_Helix_1020_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-echo-1049',
  'Jaguar OEM Wheel 18"',
  'KX7M-1007-EA, T4N23247',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black Diamond Turned',
  '![[Jaguar_Echo_1049_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-fan-5034',
  'Jaguar OEM Wheel 18"',
  'T2H2205 (Jaguar OEM part number)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver, Factory finish powder coat silver',
  '![[Jaguar_Fan_5034_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-fan-5037',
  'Jaguar OEM Wheel 19"',
  'T4A3988 (Silver), T4A9970 (Gloss Black Pre-21MY), T4A41544 (21MY+), T4A41545 (Sparkle Silver)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black',
  '![[Jaguar_Fan_5037_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-fan-5049',
  'Jaguar OEM Wheel 19"',
  'J9C2894 (Sparkle Silver), J9C9564 (Satin Dark Grey)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Dark Grey, Sparkle Silver, Satin Tech Grey Diamond Turned',
  '![[Jaguar_Fan_5049_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-farallon-xjr-wheels',
  'Jaguar OEM Wheel 20"',
  'Front: C2D31264 (Tech Grey), C2D31262 (Sparkle Silver); Rear: C2D31265 (Tech Grey), C2D31263 (Sparkle Silver)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Technical Grey, Gloss Black',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-flow-5068',
  'Jaguar OEM Wheel 20"',
  'T4K3896 (Dark Grey Diamond Turned), T4K3898 (Gloss Black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108.0"}]',
  '[{"value":"Jaguar"}]',
  'Dark Grey Diamond Turned, Gloss Black',
  '![[Jaguar_Flow_5068_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-flux-5056',
  'Jaguar OEM Wheel 22"',
  'T4K2260',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Dark Grey Diamond Turned finish, Anthracite Polished (available finishes)',
  '![[Jaguar_Flux_5056_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-forged-aero-5062',
  'Jaguar OEM Wheel 20"',
  'T2R11271 (Front), T2R11272 (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Carbon Fibre Silver Weave, Black Polished Carbon Fibre, Grey Polished Carbon Fibre',
  '![[Jaguar_Forged_Aero_5062_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-forged-blade-5042',
  'Jaguar OEM Wheel 20"',
  'T2R20830 (Front), T2R20831 (Rear), Previous: T2R3290/EX5M1007EA (Front), T2R3291/EX5M1007FA (Rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Dark Grey Diamond Turned with Carbon Fibre inserts',
  '![[Jaguar_Forged_Blade_5042_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-gyrodyne-6003',
  'Jaguar OEM Wheel 20"',
  'T2R12014 (front), T2R12015 (rear)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Technical Grey Diamond Turned, Gloss Black Diamond Turned, Sparkle Silver',
  '![[Jaguar_Gyrodyne_6003_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-heidi-5060',
  'Jaguar OEM Wheel 20"',
  'T2R17515 (Front Silver), T2R17516 (Rear Silver), T2R18763 (Front Satin Grey), T2R18764 (Rear Satin Grey)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Satin Technical Grey',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-helix-5033',
  'Jaguar OEM Wheel 18"',
  'T2H4953 (Silver), T2H5340 (Diamond Turned), T2H6443 (Gloss Black Pre-21MY), T2H46676 (Post-21MY)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black, Contrast Diamond Turned finish, Gloss Grey Diamond Turned',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-kasuga-1029',
  'Jaguar OEM Wheel 20"',
  'Front: C2D4245 (Sparkle Silver), C2D9177 (Chrome Polished), AW93-1007-GA; Rear: C2D4246 (Sparkle Silver), C2D9178 (Chrome Polished), AW93-1007-HA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Chrome Polished, Sparkle Silver',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-katana-1050',
  'Jaguar OEM Wheel 19"',
  'Front: T4N25746, Rear: T4N25747, Dark Grey Front: T4N28694, Dark Grey Rear: T4N28695, Manuf ID: LX7M1007DA',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Dark Grey Diamond Turned finish, Dark Grey',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-labyrinth-5036-wheels',
  'Jaguar OEM Wheel 20"',
  'T2H5949 (Satin Dark Grey), T4A2308 (Gloss Sparkle Silver), T4A3802 (F-Pace Silver), GX6M1007FA (Manufacturer ID)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Dark Grey Diamond Turned, Gloss Sparkle Silver',
  '![[Jaguar_Templar_5036_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-labyrinth-5036',
  'Jaguar OEM Wheel 20"',
  'T2H5949 (Satin Dark Grey Diamond Turned), T4A2308 (Gloss Sparkle Silver), GX6M1007FA (Manuf ID)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Dark Grey Diamond Turned, Satin Tech Grey Diamond Turned, Gloss Sparkle Silver',
  '![[Jaguar_Labyrinth_5036_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-lightspeed-svr',
  'Jaguar OEM Wheel 20"',
  'T4A series (Jaguar OEM part number prefix)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black',
  '![[Jaguar_Lightspeed_SVR_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-lightweight-1005',
  'Jaguar OEM Wheel 17"',
  'J9C1273 (Silver), J9C25185 (Satin Dark Grey), LR114494 (Land Rover variant)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (standard), Satin Dark Grey (optional)',
  '![[Jaguar_Lightweight_1005_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-lightweight-1016',
  'Jaguar OEM Wheel 17"',
  'T2H4950, T2H11210',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x108 (5x4.25\")"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (Standard finish)',
  '![[Jaguar_Lightweight_1016_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-lightweight-1022',
  'Jaguar OEM Wheel 18"',
  'T4A1085 (Sparkle Silver), HK831007AA',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black available',
  '![[Jaguar_Lightweight_1022_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-lightweight-1036-wheels',
  'Jaguar OEM Wheel 18"',
  'T2R17513 (Front 18x8.5 ET49), T2R17514 (Rear 18x9.5 ET27), ALY59981 (Front aftermarket), ALY59982 (Rear aftermarket)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (primary factory finish), also available in Powder Coat Silver. Both feature a bright metallic finish with excellent corrosion resistance and UV stability.',
  '![[Jaguar_Lightweight_1036_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-maelstrom-1041-wheels',
  'Jaguar OEM Wheel 20"',
  'Front: T2R50384, T2R95099, T2R25380 | Rear: T2R50385, T2R95100, T2R25381',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 11.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Black Diamond Turned (R Edition, SVR Edition, ZP Edition)',
  '![[Jaguar_Maelstrom_1041_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-manra-wheels',
  'Jaguar OEM Wheel 18"',
  'C2Z30084',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[Jaguar_Manra_Wheels_.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-mataiva',
  'Jaguar OEM Wheel 20"',
  'Front: C2D10951, AW9M-1007-AA, C2D53110, AW9M1007CA | Rear: C2D10952, AW9M-1007-BA, C2D53111, AW9M1007DA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Technical Grey Diamond Turned (OEM), Gloss Black (Available), Chrome (Available)',
  '![[Jaguar_Mataiva_Wheels_.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-matrix-1019-wheels',
  'Jaguar OEM Wheel 20"',
  'T4A2309, Manufacturer ID: HK831007JB',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Technical Grey Diamond Turned, Silver finish available',
  '![[Jaguar_Matrix_1019_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-matrix-7009-wheels',
  'Jaguar OEM Wheel 18"',
  'T4N1677 (Silver), T4N6915 (Gloss Black), GX73-1007-EA (OEM)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5×108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Sparkle Silver, Gloss Silver',
  '![[Jaguar_Matrix_7009_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-matrix-9004-wheels',
  'Jaguar OEM Wheel 20"',
  'T2H2208 (Sparkle Silver), T2H4956 (Gloss Black Diamond Turned), GX631007KB (Silver), GX631007LB (Black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Gloss Black Diamond Turned',
  '![[Jaguar_Matrix_9004_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-meru-wheels',
  'Jaguar OEM Wheel 18"',
  'Front: C2D4497 (AW931007AA), Rear: C2D4498 (AW931007BA)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[Jaguar_Meru_Wheels_.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-mid-spoke-14-spoke',
  'Jaguar https://kontiki2.nl/saab/images/wheels/midspoke.jpg 15"',
  '400103826cap 105124119',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver/Aluminum finish with clear protective coating',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-nighthawk-5069-wheels',
  'Jaguar OEM Wheel 22"',
  'T4K4002 (Technical Grey), J9DM1007AB (Gloss Black), R9DM1007CA (Technical Grey)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Technical Grey with Carbon Fibre inserts, Gloss Black with Carbon Fibre inserts',
  '![[Jaguar_Nighthawk_5069_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-orbit-1026-wheels',
  'Jaguar OEM Wheel 19"',
  'T2R9704 (Front Sparkle Silver), T2R9705 (Rear Sparkle Silver), T2R9706 (Front Gloss Black Diamond Turned), T2R9707 (Rear Gloss Black Diamond Turned)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black Diamond Turned, Sparkle Silver',
  '![[Jaguar_Orbit_1026_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-orona-8001-wheels',
  'Jaguar OEM Wheel 20"',
  'C2D24742 (Front Anthracite), C2D24743 (Rear Anthracite), C2D7283 (Front Polished), C2D7286 (Rear Polished), BW9M-1007-CA, BW9M-1007-DA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Anthracite, Polished, Chrome Polished, Sparkle Silver',
  '![[Jaguar_Orona_8001_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-projector-5054',
  'Jaguar OEM Wheel 20"',
  'J9C3208 (Silver), J9C3-1007-SA (Black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Sparkle Silver, Gloss Black',
  '![[Jaguar_Projector_5054_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-prop-6014',
  'Jaguar OEM Wheel 20"',
  'J9C5343',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Grey Diamond Turned finish',
  '![[Jaguar_Prop_6014_Wheel.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-propeller-1014-wheels',
  'Jaguar OEM Wheel 20"',
  'T4N25616 (Front), T4N25617 (Rear), T4N5393, T4N5394, GX7M-1007-LA, GX7M-1007-MA, KX7M-1007-NA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Dark Grey Diamond Turned, Satin Technical Grey',
  '![[Jaguar_Propeller_1014_Wheels_.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-propeller-1023-wheels',
  'Jaguar OEM Wheel 19"',
  'T2R1860 (front), T2R1862 (rear)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (factory finish)',
  '![[Jaguar_Propeller_1023_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-radiance-1015-wheels',
  'Jaguar OEM Wheel 19"',
  'T4N1679 (Front Silver), T4N1680 (Rear Silver), T4N1681 (Front Black), T4N1682 (Rear Black)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Black Diamond Turned Finish',
  '![[Jaguar_Radiance_1015_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-razor-1039',
  'Jaguar OEM Wheel 19"',
  'J9C5016, LR127602, J9C31007EA',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Sparkle Silver, Satin Dark Grey',
  '![[Jaguar_Razor_1039_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-razor-7012-wheels',
  'Jaguar OEM Wheel 19"',
  'T2H4954 (XF Saloon), T2H37065 (XF Sportbrake)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Technical Grey Diamond Turned',
  '![[Jaguar_Razor_7012_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-scimitar-9008',
  'Jaguar OEM Wheel 18"',
  'J9C5195',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[Jaguar_Scimitar_9008_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-span-6007-wheels',
  'Jaguar OEM Wheel 20"',
  'T4K2252 (Sparkle Silver), T4K2254 (Dark Grey Diamond Turned)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Dark Grey Diamond Turned',
  '![[Jaguar_Span_6007_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-star-5030-wheels',
  'Jaguar OEM Wheel 18"',
  'Front: T4N3699, Rear: T4N1678',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Mid Silver Diamond Turned',
  '![[Jaguar_Star_5030_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-star-5030',
  'Jaguar OEM Wheel 17"',
  'T4N13801 (17" Projector), T4N3699 (18" Front), T4N1678 (18" Rear)',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J, 8.0J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Mid Silver Diamond Turned, Gloss Black Diamond Cut',
  '![[Jaguar_Projector_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-star-5071-wheels',
  'Jaguar OEM Wheel 19"',
  'T4N13261, T4N13262, T2H4957, T2H39371, T4N1684, T4N1685',
  '[{"value":19,"unit":"inch","raw":"19 inch, 20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[Jaguar_Alloy_Wheel_20__Style_5071.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-stealth-1048-wheels-no-pics',
  'Jaguar OEM Wheel 17"',
  'T4N26858, T4N28442, T4N29352, T4N28560; Manufacturing IDs: LX731007AA, LX731007FA, L9W31007AA, LX731007EA',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J, 7.5J"}]',
  '[{"value":"5x108.0"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[NOPICTUREAVAILABLE.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-storm-5040-wheels',
  'Jaguar OEM Wheel 20"',
  'T2R10299 (front), T2R10300 (rear), T2R9909, T2R9910, EX5M-1007-VA, EX5M-1007-XA',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black Diamond Turned, Satin Technical Grey, Santorini Metallic Black',
  '![[Jaguar_Storm_5040_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-sunda-7016-wheels',
  'Jaguar OEM Wheel 19"',
  'Front: C2D31789, Rear: C2D31790. Genuine Jaguar OEM parts with full manufacturer warranty. Sold individually, set requires both front and rear part numbers.',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108mm PCD (5-bolt pattern with 108mm bolt circle diameter, standard for modern Jaguar vehicles)"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (standard factory finish), also known as Sunda Silver Sparkle. Premium alloy construction with durable clear coat finish designed for superior corrosion resistance.',
  '![[Jaguar_Sunda_7016_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-tamana-5057-wheels',
  'Jaguar OEM Wheel 19"',
  'Front: C2P12619 (Manuf ID: 9W831007AB), Rear: C2P12620 (Manuf ID: 9W831007BB)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108.0"}]',
  '[{"value":"Jaguar"}]',
  'Grey Diamond Turned finish. Diamond turned face with grey painted centers providing elegant contrast and sophisticated appearance.',
  '![[Jaguar_Tamana_5057_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-templar-5029-wheels',
  'Jaguar OEM Wheel 18"',
  'T4N13696 (Front), T4N13697 (Rear), Previous: T4N4801/T4N4802',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Technical Grey Diamond Turned',
  '![[Jaguar_Templar_5029_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-toba-5043-wheels',
  'Jaguar OEM Wheel 19"',
  'Front: C2D38659, C2D7287, BW9M1007JB | Rear: C2D7288, BW9M1007KA',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Chrome Polished, Sparkle Silver, Metallic Silver',
  '![[Jaguar_Toba_5043_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-tornado-5039-wheels',
  'Jaguar OEM Wheel 20"',
  'T2R3288 (Front Black), T2R3289 (Rear Black), T2R3286 (Front Silver), T2R3287 (Rear Silver)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Sparkle Silver',
  '![[Jaguar_Tornado_5039_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-turbine-1025-wheels',
  'Jaguar OEM Wheel 20"',
  'T2R1864 (Front 9J), T2R1866 (Rear 10.5J), EX531007FA (Manufacturer ID)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (Standard)',
  '![[Jaguar_Turbine_1025_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-turbine-9005-wheels',
  'Jaguar OEM Wheel 17"',
  'T2H4951, GX631007CB',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver finish, machine polished face',
  '![[Jaguar_Turbine_9005_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-turbine-wheels',
  'Jaguar OEM Wheel 20"',
  'T4A3798, T4A3799, T2R1864, T2R1866',
  '[{"value":20,"unit":"inch","raw":"20 inch, 22 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 9.5J, 10.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver, Grey Diamond Turned, Chrome Polished',
  '![[/Jaguar_Turbine_Wheels 2.jpg|Jaguar_Turbine_Wheels 2.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-turbine',
  'Jaguar OEM Wheel 17"',
  'T2H4951, GX63-1007-CB (17"), T4A3798 (22" Grey Diamond Turned), T4A3799 (22" Polished)',
  '[{"value":17,"unit":"inch","raw":"17 inch, 22 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 9.0J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Silver, Grey Diamond Turned, Polished',
  '![[Jaguar_Turbine_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-vela-1024-wheels',
  'Jaguar OEM Wheel 18"',
  'BW831007AA (Front), EX531007BA (Rear), C2P18511, T2R1858',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver',
  '![[Jaguar_Vela_1024_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-venom-5031-wheels',
  'Jaguar OEM Wheel 19"',
  'T4N4796, T4N4797, T4N4798, T4N4799, T4A3803, T2H5945, T2H5947, T4A39348, T4N25614, T4N25615',
  '[{"value":19,"unit":"inch","raw":"19 inch, 20 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x108.0"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Gloss Black Diamond Turned, Gloss Grey Diamond Turned, Satin Dark Grey Diamond Turned, Sparkle Silver, Anthracite with Silver Diamond Turned',
  '![[Jaguar_Venom_5031_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-venom-5045-wheels',
  'Jaguar OEM Wheel 20"',
  'C2D40716 (Front GB), C2D40717 (Rear GB), C2D53112 (Front GBDT), C2D53113 (Rear GBDT)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108.0"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Gloss Black Diamond Turned, Grey Diamond Turned',
  '![[Jaguar_Venom_5045_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-venom-5051',
  'Jaguar OEM Wheel 20"',
  'J9C6023 (Gloss Black), J9C2786 (Satin Grey Diamond Turned)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Gloss Black, Satin Tech Grey Diamond Turned',
  '![[Jaguar_Venom_5051_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-venoprop-5080-wheels',
  'Jaguar OEM Wheel 21"',
  'Style 5080 - Jaguar OEM forged wheels, specific part numbers vary by size',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 10.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Technical Grey Diamond Turned',
  '![[Jaguar_Venoprop_5080_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-venus-7017-wheels',
  'Jaguar OEM Wheel 18"',
  'C2P1010 (Front), C2P12612 (Rear), Manuf ID: 8W831007BA',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver (Standard Factory Finish)',
  '![[Jaguar_Venus_7017_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-vision-5053',
  'Jaguar OEM Wheel 21"',
  'J9C2788',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Satin Grey Diamond Turned finish',
  '![[Jaguar_Vision_5053_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-volution-5058-wheels',
  'Jaguar OEM Wheel 19"',
  'T2R14421 (front), T2R14422 (rear), T2R14419 & T2R14420 (Sparkle Silver), GX531007CA (front MFG ID), GX531007DA (rear MFG ID)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver, Technical Grey Diamond Turned',
  '![[Jaguar_Volution_5058_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'jaguar-vortex-1018',
  'Jaguar OEM Wheel 18"',
  'T4A2305 (18"), T2H4955 (19")',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  NULL,
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Sparkle Silver finish (also available as Silver)',
  '![[Jaguar_Vortex_1018_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-apollo',
  'Lamborghini OEM Wheel 19"',
  '400601017CC (Front), 400601017CD (Rear), 400601025AA (Rear), 400601025T (Front)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Satin Silver (standard), Diamond Turned (Final Edition), Matte Black with Polished Silver spokes (Edizione Technica)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-aseir',
  'Lamborghini OEM Wheel 20"',
  '4T0601017BD/BE (Bronze), 4T0601017BF/BG (Diamond Black), 4T0601017CB/CC (Graphite Gray)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Multiple finishes: Graphite Gray, Titanium Matt, Diamond Shiny Black, Bronze, Satin Titanium',
  '![[Screenshot_2025-02-09_at_21.27.07.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-auriga',
  'Lamborghini OEM Wheel 22"',
  '4ML601023K (Kit Shiny Black), 4ML601023M (Kit Bronze), 4ML601025DP (Rear Bronze), 4ML601025S (Rear), 4ML601025BA (Front), 4ML601025AS (Front)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 11.5J"}]',
  '[{"value":"5x130"}]',
  '[{"value":"Lamborghini"}]',
  'Auriga Bronze, Shiny Black, Various OEM finishes',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-callisto',
  'Lamborghini OEM Wheel 19"',
  '400601017CB (rear black), 400601025B (front silver), 400601025P, 400601025C, 400601017BC (front silver), 400601011RG',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"Lamborghini"}]',
  'Satin Silver, Titanium, Glossy Black, Charcoal, Hyper Silver',
  '![[LamboCallisto_Placeholder_pic.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-cassiopeia',
  'Lamborghini OEM Wheel 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Satin Silver (standard), Titanium (optional from 2005)',
  '![[Lambo_Cassiopeie_placeholderpic.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-cordelia',
  'Lamborghini OEM Wheel 19"',
  '400601017CN (front, shiny silver), 400601017CR (rear, shiny black), 40060102COR (complete set)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Originally polished silver, also available in shiny black finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-dianthus',
  'Lamborghini OEM Wheel 20"',
  '470601017AE (front 9J x 20"), 470601017AG (rear 13J x 21")',
  '[{"value":20,"unit":"inch","raw":"20 inch, 21 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 13.0J"}]',
  '[{"value":"Center-lock (single nut system)"}]',
  '[{"value":"Lamborghini"}]',
  'Gloss black, silver, bronze, brushed, polished, chrome, custom finishes',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-dione',
  'Lamborghini OEM Wheel 20"',
  '470601017G, 470601017T, 470601017AB, 470601017AK, 470601017AL, 470601017F, 470601017AG',
  '[{"value":20,"unit":"inch","raw":"20 inch / 21 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 13.0J"}]',
  '[{"value":"5x112 / 5x120"}]',
  '[{"value":"Lamborghini"}]',
  'Silver, Titanium Matte, Black Diamond, Gloss Black, Custom finishes available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-giano',
  'Lamborghini OEM Wheel 20"',
  '4T0601017 (Front Silver), 4T0601017J (Front Black), 4T0601017A (Rear Silver), 4T0601017L (Rear Black), 4T0601017AM (Rear Diamond Black)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Shiny Silver, Gloss Black, Diamond Black',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-kari',
  'Lamborghini OEM Wheel 19"',
  'Front: 4T0601017K, Rear: 4T0601017AQ, Alt Rear: 4T0601017AF',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Silver (standard), available in brushed, polished, chrome, matte, satin, gloss finishes',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-leirion',
  'Lamborghini OEM Wheel 20"',
  '470601017',
  '[{"value":20,"unit":"inch","raw":"20 inch / 21 inch"}]',
  '[{"value":9,"unit":"inch","raw":"9.0J, 13.0J"}]',
  '[{"value":"Center Lock"}]',
  '[{"value":"Lamborghini"}]',
  'Matte Bronze, Gloss Black, Various finishes available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-narvi',
  'Lamborghini OEM Wheel 20"',
  '4T0601017 (base), 4T0601017AN (Shiny Black), 4T0601017AR (Bronze front), 4T0601017AS (Bronze rear), 4T0099305A (Bronze kit)',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Shiny Black, Bronze, Silver, Titanio Opaco (Matte Titanium), Brushed, Polished, Chrome',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-scorpius-2',
  'Lamborghini OEM Wheel 19"',
  '400601017DJ (Front 19x8.5), 400601017CM (Rear 19x11)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Titanium (Standard), High Gloss Black, Matte Black',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-scorpius',
  'Lamborghini OEM Wheel 19"',
  'Front: 400601017DJ, Rear: 400601017CM',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Lamborghini"}]',
  'Titanium, Polished, Black, Dark Gray',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lamborghini-vanir',
  'Lamborghini OEM Wheel 19"',
  '4T0601017BQ (19" front black), 4T0601017AO (19" front silver), 4T0601017K (19" rear black), 4T0601017AF (19" rear silver)',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 11.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"Lamborghini"}]',
  'Silver (Argento), Gloss Black (Nero Lucido)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'land-rover-21-style-1001-10-spoke-silver',
  'Land Rover OEM Wheel 21"',
  'LR037746 (Silver Sparkle), LR038149 (Diamond Turned), CK521007FA',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J"}]',
  '[{"value":"5x120mm"}]',
  '[{"value":"Land Rover"}]',
  'Silver Sparkle (LR037746), Diamond Turned (LR038149)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'land-rover-22-style-7007-7-split-spoke-diamond-turned',
  'Land Rover OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Land Rover"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'land-rover-style-5001-5-split-spoke',
  'Land Rover OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Land Rover"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'long-spoke',
  'Jaguar https://kontiki2.nl/saab/images/wheels/longspoke.jpg 15"',
  '400100681cap 400100707',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x120.65 (PCD 120.65mm)"}]',
  '[{"value":"Jaguar"}]',
  'Silver alloy finish, painted spoke details',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-1041-double-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[NOPICTUREAVAILABLE 1.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-12-steel',
  'MINI OEM Wheel 15"',
  '36116851510 (Matt Black), 36116768497 (Silver)',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"4x100"}]',
  '[{"value":"MINI"}]',
  'Silver, Matt Black',
  '![[MINI12Steel-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-492-heli-spoke',
  'MINI OEM Wheel 15"',
  '36 11 6 855 101, 36 13 6 857 149, 36 11 2 460 622 (winter complete)',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Bright Silver metallic, Silver',
  '![[MINI492HeliSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-494-loop-spoke-silver',
  'MINI OEM Wheel 16"',
  '36116855103 (6.5J F55/F56/F57), 36116875387 (7.0J F54), 36116891824 (Jet Black), 36136857149',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"MINI"}]',
  'Bright Silver metallic, also available in Jet Black',
  '![[MINI494LoopSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-495-victory-spoke',
  'MINI OEM Wheel 16"',
  '36 11 6 855 104 (Silver), 36 11 6 855 106 (Black), 36 13 6 857 149',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Bright Silver metallic, Jet Black, Polished Black',
  '![[MINI495VictorySpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-497-seven-spoke',
  'MINI OEM Wheel 17"',
  '36106873928 (Spectre Grey), 36106873929 (Bright Turned with Black)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Spectre Grey, Bright Turned with Black',
  '![[MINI497SevenSpoke-SpectreGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-498-race-spoke-jcw',
  'MINI OEM Wheel 17"',
  '36116855110, 36106861092',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Silver (OEM factory finish)',
  '![[MINIJCW498RaceSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-499-cosmos-spoke',
  'MINI OEM Wheel 17"',
  '36116855108 (Silver), 36116855109 (Black), 36136857149',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Bright Silver Metallic, Jet Black',
  '![[MINI499CosmosSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-500-tentacle-spoke',
  'MINI OEM Wheel 17"',
  'Silver: 36116856099, 36136857149 | Jet Black: 36106898290',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"MINI"}]',
  'Bright Silver Metallic, Jet Black',
  '![[MINI500TentacleSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-501-track-spoke-silver-jcw',
  'MINI OEM Wheel 17"',
  '36116855107 (Silver), 36116856057 (Black), 36106861092 (JCW Hub Cap)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Bright Silver metallic, Jet Black',
  '![[MINIJCW501TrackSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-502-roulette-spoke',
  'MINI OEM Wheel 17"',
  '36116855111, 36136857149',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Jet Black, Polished Black, Black Machined',
  '![[MINI502RouletteSpoke-PolishedBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-503-propeller-spoke',
  'MINI OEM Wheel 17"',
  '36116855112',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"MINI"}]',
  'Silver (standard), Black Machined',
  '![[MINI503PropellerSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-504-vanity-spoke',
  'MINI OEM Wheel 18"',
  '36116855113, 36116884892, 36136857149',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Silver, Spectre Grey, Spectre Grey gloss-lathed and polished',
  '![[Mini504VanitySpoke-SpectreGrey.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-505-multi-spoke',
  'MINI OEM Wheel 17"',
  '36116855114 (Silver), 36116859620 (Liquid Black), 36116889636 (JCW Matte Black), 36106861092 (JCW), 36112349694 (Complete Set Silver), 36112349695 (Complete Set Liquid Black), 36112459604 (JCW Complete Set)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"MINI"}]',
  'Silver (Bright Silver), Liquid Black, Matte Black (JCW), Jet Black Matt',
  '![[MINI505MultiSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-506-cross-spoke-jcw',
  'MINI OEM Wheel 18"',
  '36116858705 (Standard), 36116855102 (JCW BBK compatible), 36112349696 (Wheel/tire set), 36112460624, 36112460625',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Jet Black with Gloss-lathed finish, Black with Bright Turned',
  '![[MINIJCW506CrossSpokeBlackW.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-507-cone-spoke',
  'MINI OEM Wheel 18"',
  '36116855116 (Silver), 36106859617 (White), 36106860724 (Silver Alt)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"MINI"}]',
  'Bright Silver Metallic, Aspen White',
  '![[MINI507ConeSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-508-radial-spoke',
  'MINI OEM Wheel 16"',
  '36116866674 (Jet Black), 36112286805 (Jet Black winter), 36112349709 (Bright Silver metallic)',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"MINI"}]',
  'Jet Black, Bright Silver metallic',
  '![[MINI508RadialSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-509-cup-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW509CupSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-510-double-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW510DoubleSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-517-revolution-spoke',
  'MINI OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI517RevolutionSpoke-SpectreGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-525-60-year-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI525-60YearSpoke-Spectre_Grey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-534-double-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW534DoubleSpoke-FerricGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-562-track-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW562TrackSpoke-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-563-cup-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW563CupSpoke-Black.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-737-corona-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI737CoronaSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-820-yours-british-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI820YoursBritishSpoke-EnigmaticBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-830-scissor-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI830ScissorSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-900-pulse-spoke',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI900PulseSpoke-JetBlackW.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-901-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW901Spoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-902-circuit-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW902CircuitSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-944-asteroid-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI944AsteroidSpoke-RefinedSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-945-y-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW945YSpoke-FrozenMidnight.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-946-windmill-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI946WindmillSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-947-kaleido-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI947KaleidoSpoke.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-948-runway-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI948RunwaySpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-949-flag-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW949FlagSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-950-rally-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI950RallySpoke-FrozenGunmetal.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-955-4-square-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI9554-SquareSpoke-RefinedSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-956-u-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI956USpoke-VibrantSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-957-sprint-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW957SprintSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-958-slide-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI958SlideSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-959-night-flash-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI959NightFlashSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-961-pin-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI961PinSpoke-LightningGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-962-star-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI962StarSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-964-rallye-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI964RallyeSpoke-VibrantSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-965-parallel-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI965ParallelSpoke-SpectreGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-980-4-square-spoke',
  'MINI OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[Mini9804-SquareSpoke-RefinedSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-981-x-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI981XSpoke-RefinedSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-982-u-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI982USpoke-VibrantSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-983-parallel-spoke',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI983ParallelSpoke-SpectreGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-984-night-flash-spoke',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI984NightFlashSpoke-Grey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-986-lap-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[NOPICTUREAVAILABLE.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-989-lap-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW989LapSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-990-pin-spoke',
  'MINI OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI990PinSpoke-LightningGrey.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-991-star-spoke-jcw',
  'MINI OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW991StarSpoke-JetBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-992-rallye-spoke-jcw',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINIJCW992RallyeSpoke-VibrantSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r100-spooler-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R100_Spooler_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r101-rotator-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R101_Rotator_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r102-s-winder-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R102_S-Winder__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r103-5-star-blaster-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R103_5_Star_Blaster__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r104-crown-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R104_Crown_Spoke__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r106-night-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R106_Night_Spoke__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r107-gp-wheels-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[JCW_R107_GP_Wheels_.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r108-multispoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R108_Multispoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r109-double-spoke-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[JCW_R109_Double_Spoke_2pc_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r110-pace-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R110_Pace_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r112-cross-spoke-challenge-jcw',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[JCW_R112_Cross_Spoke_Challenge_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r12-steel-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MiniR12SteelMatt-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r81-7-hole-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R81_7_Hole_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r82-8-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R82_8_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r83-5-spider-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R83_5_Spider_Spoke__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r84-x-lite-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R84_X-Lite__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r86-spider-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R86_Spider_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r88-double-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R88_Double_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r90-cross-spoke-2pc-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R90_Cross_Spoke_2pc_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r91-5-star-bullet-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R91_5_Star_Bullet__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r92-7-fin-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R92_7_Fin_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r93-star-rocket-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R93_Star_Rocket_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r94-bridge-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R94_Bridge_Spoke__Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r95-star-spoke-jcw',
  'MINI OEM Wheel 18"',
  '36116777972, 32106777974, 36136779555',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"4x100"}]',
  '[{"value":"MINI"}]',
  'Silver (Standard factory finish - powder coat)',
  '![[JCW_R95_Star_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r96-delta-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R96_Delta_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r97-flame-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R97_Flame_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r98-web-spoke-2pc-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R98_Web_Spoke_2pc_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-r99-double-spoke-wheels',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI_R99_Double_Spoke_Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-10-hole-w202',
  'Mercedes-Benz OEM Wheel 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz10Hole-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-10-spoke-w204',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz10Spoke-ChampionSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-10-spoke-wheel-w245-1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.25.25.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-10-twin-spoke-wheel-w169-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.02.48.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-10-twin-spoke-wheel-w211-1',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.54.55.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-11-spoke-wheel',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.59.48.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-12-spoke-wheel-w204-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.18.35.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-15-hole-w201',
  'Mercedes-Benz OEM Wheel 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz15Hole-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-17-spoke-wheel',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.14.14.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-w168',
  'Mercedes-Benz 5-Spoke 16"',
  'B6 647 4226',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Titanium Silver (Paint Code 9765), also available in Standard Silver',
  '![[Screenshot_2025-03-28_at_21.56.40.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-w203',
  'Mercedes-Benz 5-Spoke 17"',
  'A2034013502 (rear), A2094010502 (front), A2034012802 (16-inch variant)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Silver, Hyper Silver, Sparkle Silver',
  '![[Screenshot_2025-04-01_at_11.30.34.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w169-1',
  'Mercedes-Benz 5-Spoke 16"',
  'B66474491',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  '9765 Titanium Silver',
  '![[Screenshot_2025-04-07_at_19.46.33.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w169-2-w245-1',
  'Mercedes-Benz 5-Spoke 16"',
  'A16940100009765, B66474343, B66474224',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Titanium Silver (9765), Sterling Silver',
  '![[Screenshot_2025-04-07_at_19.56.26.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w204-1',
  'Mercedes-Benz 5-Spoke 17"',
  'A2044011502 (17x7.5 ET47)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Titanium Silver (factory standard)',
  '![[Screenshot_2025-04-07_at_21.27.12.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w221-2',
  'Mercedes-Benz OEM Wheel 18"',
  'B66474531 (18x8.5 ET43)',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Titanium Gray, Silver (available finishes)',
  '![[Screenshot_2025-04-08_at_14.39.52.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w221-3',
  'Mercedes-Benz OEM Wheel 18"',
  'B66474531, A2214011902, A2214012002',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Titanium Gray, Silver',
  '![[Screenshot_2025-04-08_at_14.41.45.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w245-2',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.29.59.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke-wheel-w245-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.27.14.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-spoke',
  'Mercedes-Benz OEM Wheel 15"',
  'B66474226, A1684010202, A2034010402, A2114010302, Various AMG part numbers',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch, 17 inch, 18 inch, 19 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J, 6.5J, 7.0J, 7.5J, 8.0J, 8.5J, 9.0J, 9.5J"}]',
  '[{"value":"5x112mm"}]',
  '[{"value":"Mercedes-Benz"}]',
  'Silver, Titanium Silver, High-Sheen, Black, Bi-color',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-twin-spoke-w245-1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.23.48.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-twin-spoke-w211-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.58.13.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-twin-spoke-wheel-clc1',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-09_at_00.15.02.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-5-twin-spoke-wheel-w204-1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.11.35.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-6-spoke-wheel-w169',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.53.48.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-spoke-w203',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz7Spoke-TitaniumSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-hole-w203',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz7Hole-TitaniumSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-spoke-forged-wheel-w204-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.16.46.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-spoke-wheel-w169-1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.47.56.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-spoke-wheel-w169-2',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.51.54.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-spoke-wheel-w204-1',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.20.56.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-twin-spoke-w169',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.49.22.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-twin-spoke-w203',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_11.44.46.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-7-twin-spoke-wheel-w204-1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.24.17.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-8-hole-w201',
  'Mercedes-Benz OEM Wheel 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz8Hole-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-9-spoke-wheel-w169',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.38.41.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-9-spoke-wheel-w221-1',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_14.35.59.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-acamar',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_17.30.45.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-adharaz',
  'Mercedes-Benz OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz_Adharaz.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alamak',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_16.40.46.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-albali',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_16.35.47.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-albireo',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_14.55.50.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alcyone',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.30.09.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-aldebaran',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzAldebaran-SterlingSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-algebar',
  'Mercedes-Benz 5-Spoke 15"',
  '- B6 647 0538',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-03-28_at_22.00.42.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-algenib',
  'Mercedes-Benz Multi-Spoke 16"',
  'B6 647 1301',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'High Sheen Finish',
  '![[Mercedes-Benz-Algenib.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-algieba',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzAlgieba-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alhena',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.24.33.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alioth',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_14.50.26.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-almaaz',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_14.59.23.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-almach',
  'Mercedes-Benz OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Almach.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-almuredin',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_23.33.10.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alrami',
  'Mercedes-Benz OEM Wheel 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_12.42.11.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alresha',
  'Mercedes-Benz OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Alersha.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alshain',
  'Mercedes-Benz 7-Spoke 17"',
  'B6 647 1511B6 647 1515',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Sterling Silver',
  '![[Mercedes-BenzAlshain-SterlingSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-alwaid',
  'Mercedes-Benz 5-Hole 15"',
  '- B6 647 0519',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Alwaid.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-ankaa',
  'Mercedes-Benz OEM Wheel 16"',
  'B6 647 2158 (16 Inch)B6 647 2157 (17 Inch)',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Ankaa.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-anshan',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.36.58.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-asaramas',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.33.55.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-ashtaroth',
  'Mercedes-Benz OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[MercedesAshtaroth-SterlingSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-behes',
  'Mercedes-Benz OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_14.32.28.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-bokhan',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.13.33.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-carmenta-ii',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.07.09.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-carmenta',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-ceginus',
  'Mercedes-Benz OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Ceginus.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-celaeno',
  'Mercedes-Benz OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Sterling Silver',
  '![[Mercedes-Benz-Celaeno.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-chertan',
  'Mercedes-Benz 5-Spoke 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Chertan.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-cor-caroli',
  'Mercedes-Benz 7-Spoke 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_11.51.29.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-corvus',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_12.29.07.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-cygnus',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Cygnus.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-deneb',
  'Mercedes-Benz OEM Wheel 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J, 7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Standard Silver',
  '![[Mercedes-Benz-Deneb.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-denebola',
  'Mercedes-Benz OEM Wheel 19"',
  '---',
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_14.25.49.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-difda',
  'Mercedes-Benz OEM Wheel ',
  '---',
  NULL,
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.02.56.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-electra',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 8.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_11.36.53.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-elnath',
  'Mercedes-Benz 7-Hole 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J, 7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzElnath-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-enir',
  'Mercedes-Benz 4-Hole 15"',
  '- B6 647 1571',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-03-28_at_21.37.20.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-erakis',
  'Mercedes-Benz OEM Wheel 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_12.31.40.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-eridanus',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_16.45.44.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-fidis',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_13.53.58.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-gienah',
  'Mercedes-Benz 10-Hole 15"',
  '- B6 647 4200',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-03-28_at_22.03.41.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-heze',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_14.53.40.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-hoedus',
  'Mercedes-Benz 6-Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Hoedus.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-kochab',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_19.31.52.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-lucida',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_12.26.24.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-markab',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.42.56.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mebsuta',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.46.03.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-megrez',
  'Mercedes-Benz OEM Wheel 16"',
  'B6 647 1831',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Silver',
  '![[Mercedes-Benz-Megrez-Wheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mekab',
  'Mercedes-Benz OEM Wheel 16"',
  'B6 647 0862 (C208/17in.)B6 647 0861 (W210/16in.)',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Mekab.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mekbuda',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.44.22.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-menkalina',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_17.00.54.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-merak',
  'Mercedes-Benz 5-Hole 15"',
  '- B6 647 0093',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzMerak-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-merez',
  'Mercedes-Benz 6-Spoke 15"',
  '- B6 647 0093',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Merez-wheelcard.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-merope',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[MercedesMerope-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-minelauva',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.39.20.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mirac',
  'Mercedes-Benz OEM Wheel 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_12.35.19.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mirzam',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzMirzam-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-mismar',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.16.37.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-monkar',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_16.38.46.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-multi-spoke-wheel-w221-clc-w209',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch, 19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_14.33.57.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-naantali',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.07.54.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-nibal',
  'Mercedes-Benz OEM Wheel ',
  '---',
  NULL,
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_16.58.00.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-nushaba',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-02_at_11.59.00.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-pictor',
  'Mercedes-Benz OEM Wheel ',
  '---',
  NULL,
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.39.17.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-pristix',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzPristix-TitaniumSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-proserpina',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.39.35.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-pulaha',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_21.08.48.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-rucha',
  'Mercedes-Benz 5-Spoke 16"',
  'B6 647 4126',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Rucha.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-sadachiba',
  'Mercedes-Benz OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Sadachiba.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-sadalbari',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.18.20.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-sador',
  'Mercedes-Benz 5-Spoke 17"',
  'B6 647 0542 (ET34)B6 647 0703 (ET37)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'High Sheen Finish',
  '![[Mercedes-Benz-Sador.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-saidak',
  'Mercedes-Benz OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Saidak.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-saiph',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzSaiph-TitaniumSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-sargas',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Sargas.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-segin',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.05.47.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-sertan',
  'Mercedes-Benz 3-Twin Spoke 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-03-28_at_21.50.19.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-shantou',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.48.53.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-shaula',
  'Mercedes-Benz 5-Spoke 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Shaula-bp.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-i-1pc',
  'Mercedes-Benz 5-Spoke 17"',
  '- B6 603 1017',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J, 7.5J, 8.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'SilverSilver w/ High Sheen Rim Flange ',
  '![[AMGStyle1-5spoke.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-ii-1pc',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  '[{"value":7.5,"unit":"inch","raw":"7.5J, 8.0J, 8.5J, 9.0J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_11.57.39.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iii-1-piece-v2',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.53.57.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iii-1pc-v1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.01.34.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iii-2pc-v1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.51.03.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iii-2pc-v3-i-think',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.49.44.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iv-2pc-v2',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_13.00.34.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iv-v1',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.57.16.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-iv-v2',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch, 18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_12.58.40.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-style-v',
  'Mercedes-Benz OEM Wheel 18"',
  '---',
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-01_at_13.01.50.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-suhail',
  'Mercedes-Benz 5-Hole 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch, 16 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-03-28_at_22.02.00.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-tarazed',
  'Mercedes-Benz OEM Wheel 17"',
  'B6 647 1851 (W210)B6 647 1852 (W211)',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Tarazed.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-taygeta',
  'Mercedes-Benz Multi-Spoke 16"',
  'B6 647 1631+ ',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Sterling Silver',
  '![[Mercedes-Benz-Taygeta-Sterling-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-tegmen',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch, 17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_17.05.35.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-thuban',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_17.03.09.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-tureis',
  'Mercedes-Benz OEM Wheel 17"',
  'B6 647 0513 ',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  'Standard Silver',
  '![[Mercedes-Benz-Tureis.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-vela',
  'Mercedes-Benz OEM Wheel 16"',
  '---',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-08_at_01.35.53.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-yad',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_15.14.59.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-yilduz',
  'Mercedes-Benz OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-Benz-Yilduz.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-zaurak',
  'Mercedes-Benz OEM Wheel 17"',
  '---',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Screenshot_2025-04-07_at_20.16.18.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mercedes-benz-zosca',
  'Mercedes-Benz OEM Wheel 15"',
  '---',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  NULL,
  NULL,
  '[{"value":"Mercedes-Benz"}]',
  NULL,
  '![[Mercedes-BenzZosca-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-985-slide-spoke',
  'MINI OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI985SlideSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-987-hexagram-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI987HexagramSpoke-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'mini-988-eternal-spoke',
  'MINI OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"MINI"}]',
  NULL,
  '![[MINI988EternalSpoke.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'minilite',
  'Jaguar https://kontiki2.nl/saab/images/wheels/minilite.jpg 15"',
  '105118806',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x120.65mm (5x4.75\")"}]',
  '[{"value":"Jaguar"}]',
  'Silver (standard), Anthracite/Graphite (optional), Polished edge variants available',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'oemwdb-wheel-card-template',
  'OEMWDB Wheel Card TEMPLATE',
  '---',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'open-spoke',
  'Jaguar https://kontiki2.nl/saab/images/wheels/92-open.jpg 17"',
  '0200027Cap: 32006354',
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x108"}]',
  '[{"value":"Jaguar"}]',
  'Silver painted finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'range-rover-alloy-wheel-20-style-5002-5-split-spoke',
  'Land Rover OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Land Rover"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-173',
  'Rolls-Royce OEM Wheel 21"',
  'Rolls-Royce Style 173 (OEM accessory wheel)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver, Chrome',
  '![[Rolls-Royce_Style_173_good_pic.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-267',
  'Rolls-Royce OEM Wheel 21"',
  '6789486 (front 21x8J), Style 267 designation, rear part numbers available through authorized Rolls-Royce dealerships',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver, Part Polished, Fully Polished',
  '![[RollsRoyceStyle267Wheels-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-274',
  'Rolls-Royce OEM Wheel 20"',
  '6782414 (front 20x8.5 ET25), 6782415 (rear 20x9.5 ET33), Style 274 designation',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, High Gloss Black',
  '![[Rolls-RoyceStyle274-HighGlossBlack.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-289',
  'Rolls-Royce OEM Wheel 21"',
  '36 11 6 785 642 (front silver), 36 11 6 785 643 (rear silver), 36 11 6 790 814 (front part polished), 36 11 6 790 815 (rear part polished), 36 11 6 850 392 (front fully polished), 36 11 6 850 393 (rear fully polished)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver, Part Polished, Fully Polished',
  '![[Rolls-RoyceStyle289-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-420',
  'Rolls-Royce OEM Wheel 20"',
  '6857732 (rear 20x9.5), Style 420 designation, additional part numbers available through Rolls-Royce dealerships',
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Part Polished, Fully Polished',
  '![[RollsRoyceStyle420Wheels-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-422',
  'Rolls-Royce OEM Wheel 21"',
  'Rolls-Royce Style 422 designation - Official part numbers available through authorized Rolls-Royce dealerships at Goodwood facility',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Fully Polished - Premium factory finishes designed for Phantom VII luxury applications',
  '![[Rolls-RoyceStyle422-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-462',
  'Rolls-Royce OEM Wheel 20"',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Grey Diamond Turned, Chrome',
  '![[RollsRoyceStyle462Wheels.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-471',
  'Rolls-Royce OEM Wheel 21"',
  '36 11 6 850 118 (Front Matt Silver), 36 11 6 850 119 (Rear Matt Silver), 36 11 6 856 728 (Front Part Polished), 36 11 6 856 729 (Rear Part Polished)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  NULL,
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Part Polished',
  '![[Rolls-RoyceStyle471-MattSilver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-593',
  'Rolls-Royce OEM Wheel 21"',
  'Front Matt Silver: 36 10 6 856 027, Rear Matt Silver: 36 10 6 856 028, Front Polished: 36 10 6 859 831, Rear Polished: 36 10 6 859 832',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Fully Polished, Satin Black, Satin Anthracite',
  '![[Rolls-RoyceStyle593-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-602',
  'Rolls-Royce OEM Wheel 21"',
  '36 11 6 862 611/612 (Dawn), 36 10 6 859 172/173 (Wraith), 36 11 6 862 613/614 (Wraith Polished)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Grey Part Polished, Fully Polished',
  '![[Rolls-RoyceStyle602-GreyPartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-603',
  'Rolls-Royce OEM Wheel 21"',
  NULL,
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver with Part Polished Finish, Two-Tone Part Polished Finish',
  '![[Rolls-RoyceStyle603-Black.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-615',
  'Rolls-Royce OEM Wheel 21"',
  '36 11 6 860 589/590 (Matt Silver), 36 11 6 860 591/592 (Fully Polished), 36 11 6 865 362/363 (Grey Part Polished)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Matt Silver, Grey Part Polished, Fully Polished',
  '![[Rolls-RoyceStyle615-GreyPartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-653',
  'Rolls-Royce OEM Wheel 21"',
  'Front: 36116864987, Rear: 36116864988',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver, Part Polished, Fully Polished',
  '![[Rolls-RoyceStyle653-PartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-670',
  'Rolls-Royce OEM Wheel 21"',
  '36 11 6 872 929 (Front Fully Polished), 36 11 6 872 930 (Rear Fully Polished), 36 11 6 872 931 (Front Orbit Grey), 36 11 6 872 932 (Rear Orbit Grey)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Fully Polished, Orbit Grey',
  '![[RollsRoyceStyle670-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-677',
  'Rolls-Royce OEM Wheel 21"',
  '36 10 6 871 607 (Front), 36 10 6 871 608 (Rear)',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Silver',
  '![[Rolls-RoyceStyle677-Silver.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-678',
  'Rolls-Royce OEM Wheel 21"',
  '6874346 (rear 9.5J), 3878757',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8,"unit":"inch","raw":"8.0J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Bi-Color (polished face with darker spokes), Fully Polished',
  '![[Rolls-RoyceStyle678-Bi-Colour.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-679',
  'Rolls-Royce OEM Wheel 22"',
  '36 10 6 874 351 (Front Bi-colour), 36 10 6 874 352 (Rear Bi-colour), 36 10 6 883 747 (Front Polished), 36 10 6 883 748 (Rear Polished)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":9.5,"unit":"inch","raw":"9.5J, 10.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Bi-colour, Fully Polished',
  '![[Rolls-RoyceStyle679-Bi-Colour.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-709',
  'Rolls-Royce OEM Wheel 21"',
  NULL,
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  NULL,
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Fully Polished, Part Polished',
  '![[Rolls-RoyceStyle709-FullyPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-710',
  'Rolls-Royce OEM Wheel 21"',
  '36116882590',
  '[{"value":21,"unit":"inch","raw":"21 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Fully polished, Part polished',
  '![[Rolls-RoyceStyle710-PartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-712',
  'Rolls-Royce OEM Wheel 22"',
  '36 10 6 882 835 (Front Shadow), 36 10 6 882 836 (Rear Shadow), 36 10 6 884 712 (Front Polished), 36 10 6 884 713 (Rear Polished)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Rolls-Royce"}]',
  'Shadow Finish, Polished Finish',
  '![[Rolls-RoyceStyle712-Polished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-713',
  'Rolls-Royce OEM Wheel 22"',
  '36 10 6 878 014 (Front), 36 10 6 878 025 (Rear)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x112"}]',
  '[{"value":"Rolls-Royce"}]',
  'Part Polished',
  '![[Rolls-RoyceStyle713-PartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-714',
  'Rolls-Royce OEM Wheel 22"',
  'Front: 36 10 6 884 708, Rear: 36 10 6 884 709',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Polished finish',
  '![[Rolls-Royce_Style_714.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-723',
  'Rolls-Royce OEM Wheel 22"',
  'Polished - Front: 36 10 6 884 710, Rear: 36 10 6 884 711 | Part Polished - Front: 36 10 6 878 393, Rear: 36 10 6 878 394',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  '[{"value":8.5,"unit":"inch","raw":"8.5J, 9.5J"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Rolls-Royce"}]',
  'Fully Polished, Part Polished',
  '![[Rolls-RoyceStyle723-PartPolished.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-924-4',
  'Rolls-Royce Style 924-4',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'rolls-royce-style-924',
  'Rolls-Royce OEM Wheel 22"',
  'Style 924 Dynamic Alloy Wheel (Rolls-Royce OEM)',
  '[{"value":22,"unit":"inch","raw":"22 inch"}]',
  NULL,
  '[{"value":"5x112"}]',
  '[{"value":"Rolls-Royce"}]',
  'Fully Polished, Part Polished, Part Polished & Jet Black finish',
  '![[Rolls-RoyceStyle924.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'silver-star',
  'Jaguar https://kontiki2.nl/saab/images/wheels/silverstar.jpg 15"',
  '125121206cap 105121305',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Silver painted finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'silver-spoke',
  'Jaguar https://kontiki2.nl/saab/images/wheels/silverspoke.jpg 15"',
  '105122709cap 105119101',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x120.65"}]',
  '[{"value":"Jaguar"}]',
  'Silver painted finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-alaris',
  'Skoda Alaris',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-alasia',
  'Skoda Alasia',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-altair',
  'Skoda Altair',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-aniara',
  'Skoda Aniara',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-aquarius',
  'Skoda Aquarius',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-aries',
  'Skoda Aries',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-aronia',
  'Skoda Aronia',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-asterion',
  'Skoda Asterion',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-atria',
  'Skoda OEM Wheel 19"',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  '[{"value":"Skoda"}]',
  NULL,
  '![[SkodaKodiaqAtria-SilverBrushed.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-avior',
  'Skoda Avior',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-becrux',
  'Skoda Becrux',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-blade',
  'Skoda Blade',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-braga',
  'Skoda Braga',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-canis',
  'Skoda Canis',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-castor',
  'Skoda Castor',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[SkodaCastor-SilverWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-cetus',
  'Skoda Cetus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-comet',
  'Skoda Comet',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-corvus',
  'Skoda Corvus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-crater',
  'Skoda Crater',
  NULL,
  '[{"value":19,"unit":"inch","raw":"19 inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[SkodaCrater-AnthraciteWinterWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-crystal',
  'Skoda Crystal',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-dofida',
  'Skoda Dofida',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-draconis',
  'Skoda Draconis',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-elias',
  'Skoda Elias',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-geneva',
  'Skoda Geneva',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-gigaro',
  'Skoda OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch "}]',
  NULL,
  NULL,
  '[{"value":"Skoda"}]',
  NULL,
  '![[SkodaKodiaqGigaro-SilverBrushedWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-hadar',
  'Skoda Hadar',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-helix',
  'Skoda Helix',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-hydrus',
  'Skoda Hydrus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-italia',
  'Skoda Italia',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-kajam',
  'Skoda Kajam',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-kuma',
  'Skoda Kuma',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-luxon',
  'Skoda Luxon',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-lyra',
  'Skoda Lyra',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-montado',
  'Skoda Montado',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-mytikas',
  'Skoda Mytikas',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  NULL,
  NULL,
  '![[SkodaMytikas-BlackWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-nanuq',
  'Skoda OEM Wheel 16"',
  NULL,
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Skoda"}]',
  NULL,
  '![[SkodaNanuq-SilverWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-neptune',
  'Skoda Neptune',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-nevis',
  'Skoda Nevis',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-perseus',
  'Skoda Perseus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-procyon',
  'Skoda Procyon',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-proteus',
  'Skoda Proteus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-proxima',
  'Skoda Proxima',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-ratikon',
  'Skoda Ratikon',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-riegel',
  'Skoda Riegel',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-slagard',
  'Skoda Slagard',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-spitzberg',
  'Skoda Spitzberg',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[SkodaSpitergSilverMetallicWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-stratos',
  'Skoda Stratos',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-supernova',
  'Skoda Supernova',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-trifid',
  'Skoda OEM Wheel 17"',
  NULL,
  '[{"value":17,"unit":"inch","raw":"17 inch"}]',
  NULL,
  NULL,
  '[{"value":"Skoda"}]',
  NULL,
  '![[SkodaKodiaqTrifid-SilverWheel.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-trinity',
  'Skoda Trinity',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-trisuli',
  'Skoda Trisuli',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-triton',
  'Skoda Triton',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-ursus',
  'Skoda Ursus',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-vega',
  'Skoda Vega',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-velorum',
  'Skoda Velorum',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-venus',
  'Skoda OEM Wheel 20"',
  NULL,
  '[{"value":20,"unit":"inch","raw":"20 inch"}]',
  NULL,
  NULL,
  '[{"value":"Skoda"}]',
  NULL,
  '![[SkodaKodiaqVenus-SilverBrushed.webp]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-vision',
  'Skoda Vision',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'skoda-volans',
  'Skoda Volans',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'soccer-ball',
  'Jaguar https://kontiki2.nl/saab/images/wheels/soccerball3.jpg 15"',
  'Research needed - no authoritative part numbers found',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":4.5,"unit":"inch","raw":"4.5J"}]',
  NULL,
  '[{"value":"Jaguar"}]',
  'Unknown - likely silver/machined finish typical of period',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'stelvio-wheels-no-name',
  'Alfa-Romeo OEM Wheel 18"',
  NULL,
  '[{"value":18,"unit":"inch","raw":"18 inch"}]',
  NULL,
  NULL,
  '[{"value":"Alfa-Romeo"}]',
  NULL,
  '![[Screenshot_2025-03-09_at_17.07.02.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'super-inca',
  'Jaguar https://kontiki2.nl/saab/images/wheels/superinca.jpg 15"',
  '105121701cap 105121305',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x120.65 (5x4.75)"}]',
  '[{"value":"Jaguar"}]',
  'Silver metallic finish, polished lip',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'super-spoke',
  'Jaguar https://kontiki2.nl/saab/images/wheels/superspoke.jpg 15"',
  '4010512',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":7,"unit":"inch","raw":"7.0J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"Jaguar"}]',
  'Silver painted finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'trx-135x390x45',
  'Jaguar https://kontiki2.nl/saab/images/wheels/trx.jpg 15"',
  '105120505',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":135,"unit":"inch","raw":"135mm (5.3)???"}]',
  '[{"value":"5x120"}]',
  '[{"value":"Jaguar"}]',
  'Metallic silver/gray finish with machined face',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'turbo85-sunburst',
  'Jaguar https://kontiki2.nl/saab/images/wheels/turbo85.jpg 15"',
  'C41290 (primary), 560-59648 (alternate), 105123301 (cap 105123400)',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  '[{"value":"5x120.65mm (5x4.75\")"}]',
  '[{"value":"Jaguar"}]',
  'Chrome finish (original), Dark Charcoal Machined (later variant)',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'turbo91-15-spoke-sport',
  'Jaguar https://kontiki2.nl/saab/images/wheels/turbo91.jpg 15"',
  '105124804cap 105123400',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":5.5,"unit":"inch","raw":"5.5J"}]',
  '[{"value":"5x120.65"}]',
  '[{"value":"Jaguar"}]',
  'Silver Painted Finish',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'turbo91-short-spoke',
  'SAAB https://kontiki2.nl/saab/images/wheels/turbo91.jpg 15"',
  '400100673 (94-96)400106498 (97-98)cap 400100707',
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6.5,"unit":"inch","raw":"6.5J"}]',
  '[{"value":"5x108mm"}]',
  '[{"value":"SAAB"}]',
  'Silver Metallic, Charcoal Machined Face',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'vw-avus-wheels',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'vw-daytona-wheels',
  'Volkswagen OEM Wheel 15"',
  NULL,
  '[{"value":15,"unit":"inch","raw":"15 inch"}]',
  '[{"value":6,"unit":"inch","raw":"6.0J"}]',
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'viking-aero',
  'Jaguar https://kontiki2.nl/saab/images/wheels/viking.jpg 16"',
  '400100699cap 400100175',
  '[{"value":16,"unit":"inch","raw":"16 inch"}]',
  NULL,
  NULL,
  '[{"value":"Jaguar"}]',
  '400100699cap 400100175',
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-activa-1k0-071-497-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Activa_-_1K0_071_497_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-arietta-jnv-601-025',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Arietta_-_JNV_601_025.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-arigos-3c9-071-4',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Arigos-3C9_071_497_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-azuro-diamond-black-3c0-071-497-v7u',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Azuro-Diamond-Black-_3C0_071_497_V7U.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-azuro-silver-3c0-071-497-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Azuro-Silver_-_3C0_071_497_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-bbs-rc-silver-zvw-145-200-ds-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-BBS-RC-Silver_-_ZVW_145_200_DS_666__.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-bbs-rx-ii-zvw-145-001-dsp',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-BBS-RX_II_-_ZVW_145_001_DSP.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-contur-1t0-071-496-666',
  'Volkswagen 6-Spoke ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Contur-1T0_071_496_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-delta-1j9-071-492-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Delta_-_1J9_071_492_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-exis-1t0-071-497-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Exis_-_1T0_071_497_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-exor-6q0-071-492-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Exor_-_6Q0_071_492_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-karthoum-silver-1k0-071-498-1zl',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Karthoum-Silver_-_1K0_071_498_1ZL.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-mambo-1j0-071-490-a-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-namib-1t0-071-491-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Namib_-_1T0_071_491_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-rave-1c0-071-491-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Rave-1C0_071_491_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-reggae-1j6-071-491-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Reggae_-_1J6_071_491_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-tangis-1t0-071-492-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Tangis_-_1T0_071_492_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-velos-diamond-black-3c0-071-498-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Velos-Diamond-Black_-_3C0_071_498_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-vision-v-machined-1k5-071-497-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Vision-V-Machined_-_1K5_071_497_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'volkswagen-vitus-1t4-071-496-666',
  'Volkswagen OEM Wheel ',
  NULL,
  NULL,
  NULL,
  NULL,
  '[{"value":"Volkswagen"}]',
  NULL,
  '![[Volkswagen-Vitus-1T4_071_496_A_666.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'wheel-page-template',
  'Wheel Page Template',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'wheel-template-oemwdb',
  'Wheel Template (oemwdb)',
  '---',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'captur-wheels',
  'captur wheels',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Renault-Capturwheels.jpg]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lexus-lc500',
  'lexus lc500',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_23.01.29.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'lfa',
  'lfa',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_23.03.20.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'oemwdb-wheel-card',
  'oemwdb wheel card',
  '---',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'overview-oem-wheels',
  'overview (oem_wheels)',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'renault-scenic-etech',
  'renault scenic etech',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_23.53.07.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'vantage-wheel',
  'vantage wheel',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.51.13.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
INSERT INTO oem_wheels (id, wheel_title, part_numbers, diameter_ref, width_ref, bolt_pattern_ref, brand_ref, color, bad_pic_url, production_ready)
VALUES (
  'vantage-wheels',
  'vantage wheels',
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  NULL,
  '![[Screenshot_2025-03-09_at_22.49.05.png]]',
  true
) ON CONFLICT (id) DO UPDATE SET
  wheel_title = EXCLUDED.wheel_title,
  part_numbers = EXCLUDED.part_numbers,
  diameter_ref = EXCLUDED.diameter_ref,
  width_ref = EXCLUDED.width_ref,
  bolt_pattern_ref = EXCLUDED.bolt_pattern_ref,
  brand_ref = EXCLUDED.brand_ref,
  color = EXCLUDED.color,
  bad_pic_url = EXCLUDED.bad_pic_url;
