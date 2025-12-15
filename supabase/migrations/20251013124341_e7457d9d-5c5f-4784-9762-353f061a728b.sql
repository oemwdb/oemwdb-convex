-- Add foreign key constraint for saved_wheels to oem_wheels
ALTER TABLE saved_wheels
ADD CONSTRAINT saved_wheels_wheel_fkey
FOREIGN KEY (wheel_id) 
REFERENCES oem_wheels(id)
ON DELETE CASCADE;

-- Add foreign key constraint for saved_vehicles to oem_vehicles
ALTER TABLE saved_vehicles
ADD CONSTRAINT saved_vehicles_vehicle_fkey
FOREIGN KEY (vehicle_id) 
REFERENCES oem_vehicles(id)
ON DELETE CASCADE;

-- Add foreign key constraint for saved_brands to oem_brands
ALTER TABLE saved_brands
ADD CONSTRAINT saved_brands_brand_fkey
FOREIGN KEY (brand_id) 
REFERENCES oem_brands(id)
ON DELETE CASCADE;