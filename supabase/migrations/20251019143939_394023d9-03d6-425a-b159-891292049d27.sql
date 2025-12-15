-- Drop the old function
DROP FUNCTION IF EXISTS public.get_vehicles_with_brands();

-- Recreate with vehicle_image instead of hero_image_url
CREATE OR REPLACE FUNCTION public.get_vehicles_with_brands()
RETURNS TABLE(
  id text,
  chassis_code text,
  model_name text,
  vehicle_title text,
  brand_name text,
  production_years text,
  bolt_pattern text,
  center_bore text,
  vehicle_image text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    v.id,
    v.vehicle_id_only as chassis_code,
    v.model_name,
    v.vehicle_title,
    CASE 
      WHEN v.brand_ref IS NOT NULL AND jsonb_array_length(v.brand_ref) > 0 
      THEN trim(both '"' from (v.brand_ref->0)::text)
      ELSE NULL
    END as brand_name,
    v.production_years,
    CASE 
      WHEN v.bolt_pattern_ref IS NOT NULL AND jsonb_array_length(v.bolt_pattern_ref) > 0
      THEN trim(both '"' from (v.bolt_pattern_ref->0)::text)
      ELSE NULL
    END as bolt_pattern,
    CASE 
      WHEN v.center_bore_ref IS NOT NULL AND jsonb_array_length(v.center_bore_ref) > 0
      THEN trim(both '"' from (v.center_bore_ref->0)::text)
      ELSE NULL
    END as center_bore,
    v.vehicle_image,
    CASE 
      WHEN v.vehicle_image IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_vehicles v
  ORDER BY brand_name, v.model_name;
END;
$function$;