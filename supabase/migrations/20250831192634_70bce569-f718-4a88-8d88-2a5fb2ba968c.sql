-- First, let's check if we have any wheels and vehicles
-- Then create some sample relationships between them

-- Insert sample relationships if we have both vehicles and wheels
INSERT INTO vehicle_wheels (vehicle_id, wheel_id, is_oem_fitment, fitment_notes)
SELECT 
  v.id as vehicle_id,
  w.id as wheel_id,
  true as is_oem_fitment,
  'OEM wheel option for ' || v.model_name as fitment_notes
FROM vehicles v
CROSS JOIN wheels w
WHERE v.chassis_code = 'RR1' 
  AND w.bolt_pattern = '5x120'
  AND NOT EXISTS (
    SELECT 1 FROM vehicle_wheels vw 
    WHERE vw.vehicle_id = v.id AND vw.wheel_id = w.id
  )
LIMIT 5;

-- Also add relationships for other vehicles
INSERT INTO vehicle_wheels (vehicle_id, wheel_id, is_oem_fitment, fitment_notes)
SELECT 
  v.id as vehicle_id,
  w.id as wheel_id,
  false as is_oem_fitment,
  'Aftermarket option - verify fitment' as fitment_notes
FROM vehicles v
CROSS JOIN wheels w
WHERE v.chassis_code IN ('RR4', 'RR5', 'RR6')
  AND w.bolt_pattern = '5x120'
  AND NOT EXISTS (
    SELECT 1 FROM vehicle_wheels vw 
    WHERE vw.vehicle_id = v.id AND vw.wheel_id = w.id
  )
LIMIT 3;