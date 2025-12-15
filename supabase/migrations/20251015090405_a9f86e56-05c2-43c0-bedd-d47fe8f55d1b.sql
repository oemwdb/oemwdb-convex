-- Update get_vehicles_with_brands function to set search_path
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
   hero_image_url text, 
   status text
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
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
    v.hero_image_url,
    CASE 
      WHEN v.hero_image_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_vehicles v
  ORDER BY brand_name, v.model_name;
END;
$function$;