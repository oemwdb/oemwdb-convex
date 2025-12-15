-- Add new columns to user_registered_vehicles table
ALTER TABLE user_registered_vehicles 
ADD COLUMN vehicle_title TEXT,
ADD COLUMN brand_ref JSONB,
ADD COLUMN vehicle_ref JSONB;

COMMENT ON COLUMN user_registered_vehicles.vehicle_title IS 'User-defined custom title for quick identification';
COMMENT ON COLUMN user_registered_vehicles.brand_ref IS 'JSONB reference to oem_brands table';
COMMENT ON COLUMN user_registered_vehicles.vehicle_ref IS 'JSONB reference to oem_vehicles table';