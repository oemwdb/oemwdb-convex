-- Drop and recreate get_wheels_with_brands function to include bad_pic_url
DROP FUNCTION IF EXISTS public.get_wheels_with_brands();

CREATE OR REPLACE FUNCTION public.get_wheels_with_brands()
 RETURNS TABLE(
   id text, 
   wheel_name text, 
   brand_name text, 
   diameter text, 
   width text, 
   bolt_pattern text, 
   center_bore text, 
   wheel_offset text, 
   color text, 
   good_pic_url text, 
   bad_pic_url text,  -- Added this
   status text, 
   diameter_ref jsonb, 
   width_ref jsonb, 
   bolt_pattern_ref jsonb, 
   center_bore_ref jsonb, 
   color_ref jsonb,
   tire_size_ref jsonb,
   vehicle_ref jsonb,
   brand_ref jsonb,
   design_style_ref text[]
 )
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id,
    w.wheel_title as wheel_name,
    CASE 
      WHEN w.brand_ref IS NOT NULL AND jsonb_array_length(w.brand_ref) > 0 
      THEN trim(both '"' from (w.brand_ref->0)::text)
      ELSE NULL
    END as brand_name,
    CASE 
      WHEN w.diameter_ref IS NOT NULL AND jsonb_array_length(w.diameter_ref) > 0
      THEN trim(both '"' from (w.diameter_ref->0)::text)
      ELSE NULL
    END as diameter,
    CASE 
      WHEN w.width_ref IS NOT NULL AND jsonb_array_length(w.width_ref) > 0
      THEN trim(both '"' from (w.width_ref->0)::text)
      ELSE NULL
    END as width,
    CASE 
      WHEN w.bolt_pattern_ref IS NOT NULL AND jsonb_array_length(w.bolt_pattern_ref) > 0
      THEN trim(both '"' from (w.bolt_pattern_ref->0)::text)
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
    w.bad_pic_url, -- Added this
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status,
    w.diameter_ref,
    w.width_ref,
    w.bolt_pattern_ref,
    w.center_bore_ref,
    w.color_ref,
    w.tire_size_ref,
    w.vehicle_ref,
    w.brand_ref,
    w.design_style_ref
  FROM oem_wheels w
  ORDER BY w.wheel_title;
END;
$function$;
