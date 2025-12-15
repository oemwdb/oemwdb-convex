-- Fix get_vehicles_by_brand to work with simple string arrays
CREATE OR REPLACE FUNCTION public.get_vehicles_by_brand(brand_name_param text)
 RETURNS TABLE(id integer, chassis_code text, model_name text, brand_name text, production_years text, bolt_pattern text, center_bore text, hero_image_url text, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    v.id,
    v.chassis_code,
    v.model_name,
    brand_name_param as brand_name,
    v.production_years,
    v.bolt_pattern,
    v.center_bore,
    v.hero_image_url,
    CASE 
      WHEN v.hero_image_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_vehicles v
  CROSS JOIN jsonb_array_elements_text(v.brand_refs) as ref
  WHERE LOWER(ref) = LOWER(brand_name_param)
  ORDER BY v.model_name;
END;
$function$;

-- Fix get_wheels_by_brand to work with simple string arrays
CREATE OR REPLACE FUNCTION public.get_wheels_by_brand(brand_name_param text)
 RETURNS TABLE(id integer, wheel_name text, brand_name text, diameter text, width text, bolt_pattern text, center_bore text, wheel_offset text, color text, good_pic_url text, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id::integer,
    w.wheel_name,
    brand_name_param as brand_name,
    CASE 
      WHEN w.diameter_refs IS NOT NULL AND jsonb_array_length(w.diameter_refs) > 0
      THEN trim(both '"' from (w.diameter_refs->0)::text)
      ELSE NULL
    END as diameter,
    CASE 
      WHEN w.width_ref IS NOT NULL AND jsonb_array_length(w.width_ref) > 0
      THEN trim(both '"' from (w.width_ref->0)::text)
      ELSE NULL
    END as width,
    CASE 
      WHEN w.bolt_pattern_refs IS NOT NULL AND jsonb_array_length(w.bolt_pattern_refs) > 0
      THEN trim(both '"' from (w.bolt_pattern_refs->0)::text)
      ELSE NULL
    END as bolt_pattern,
    CASE 
      WHEN w.center_bore_ref IS NOT NULL AND jsonb_array_length(w.center_bore_ref) > 0
      THEN trim(both '"' from (w.center_bore_ref->0)::text)
      ELSE NULL
    END as center_bore,
    w.wheel_offset,
    w.color,
    w.good_pic_url,
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_wheels w
  CROSS JOIN jsonb_array_elements_text(w.brand_refs) as ref
  WHERE LOWER(ref) = LOWER(brand_name_param)
  ORDER BY w.wheel_name;
END;
$function$;

-- Populate missing bidirectional wheel_refs in vehicles based on existing vehicle_refs in wheels
UPDATE oem_vehicles v
SET wheel_refs = (
  SELECT COALESCE(jsonb_agg(DISTINCT w.wheel_name), '[]'::jsonb)
  FROM oem_wheels w
  WHERE w.vehicle_refs IS NOT NULL 
    AND v.vehicle_title = ANY(
      SELECT jsonb_array_elements_text(w.vehicle_refs)
    )
)
WHERE EXISTS (
  SELECT 1 FROM oem_wheels w
  WHERE w.vehicle_refs IS NOT NULL 
    AND v.vehicle_title = ANY(
      SELECT jsonb_array_elements_text(w.vehicle_refs)
    )
);

-- Create trigger function to sync wheel_refs when vehicle_refs changes in wheels
CREATE OR REPLACE FUNCTION sync_wheel_vehicle_refs()
RETURNS TRIGGER AS $$
BEGIN
  -- Update vehicles' wheel_refs when a wheel's vehicle_refs changes
  IF TG_TABLE_NAME = 'oem_wheels' THEN
    -- Add this wheel to all referenced vehicles
    UPDATE oem_vehicles
    SET wheel_refs = COALESCE(wheel_refs, '[]'::jsonb) || to_jsonb(NEW.wheel_name)
    WHERE vehicle_title = ANY(
      SELECT jsonb_array_elements_text(NEW.vehicle_refs)
    )
    AND NOT (wheel_refs @> to_jsonb(NEW.wheel_name));
    
    -- Remove this wheel from vehicles no longer referenced
    IF OLD.vehicle_refs IS NOT NULL THEN
      UPDATE oem_vehicles
      SET wheel_refs = (
        SELECT COALESCE(jsonb_agg(elem), '[]'::jsonb)
        FROM jsonb_array_elements_text(wheel_refs) elem
        WHERE elem::text != NEW.wheel_name
      )
      WHERE vehicle_title = ANY(
        SELECT jsonb_array_elements_text(OLD.vehicle_refs)
      )
      AND NOT (vehicle_title = ANY(
        SELECT jsonb_array_elements_text(NEW.vehicle_refs)
      ));
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on oem_wheels to sync vehicle wheel_refs
DROP TRIGGER IF EXISTS sync_vehicle_refs_on_wheel_update ON oem_wheels;
CREATE TRIGGER sync_vehicle_refs_on_wheel_update
AFTER INSERT OR UPDATE OF vehicle_refs ON oem_wheels
FOR EACH ROW
EXECUTE FUNCTION sync_wheel_vehicle_refs();