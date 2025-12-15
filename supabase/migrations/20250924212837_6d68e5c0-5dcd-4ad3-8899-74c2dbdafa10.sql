-- Drop existing function and recreate with correct data types
DROP FUNCTION IF EXISTS public.get_wheels_with_brands();

CREATE OR REPLACE FUNCTION public.get_wheels_with_brands()
RETURNS TABLE(id text, wheel_name text, brand_name text, diameter text, width text, bolt_pattern text, center_bore text, wheel_offset text, color text, good_pic_url text, status text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id,  -- id is already TEXT, no casting needed
    w.wheel_name,
    -- Extract first brand from simple array (removing quotes)
    CASE 
      WHEN w.brand_refs IS NOT NULL AND jsonb_array_length(w.brand_refs) > 0 
      THEN trim(both '"' from (w.brand_refs->0)::text)
      ELSE NULL
    END as brand_name,
    -- Extract from refs arrays
    CASE 
      WHEN w.diameter_refs IS NOT NULL AND jsonb_array_length(w.diameter_refs) > 0
      THEN (w.diameter_refs->0->>'value')::text
      ELSE NULL
    END as diameter,
    CASE 
      WHEN w.width_ref IS NOT NULL AND jsonb_array_length(w.width_ref) > 0
      THEN (w.width_ref->0->>'value')::text
      ELSE NULL
    END as width,
    CASE 
      WHEN w.bolt_pattern_refs IS NOT NULL AND jsonb_array_length(w.bolt_pattern_refs) > 0
      THEN (w.bolt_pattern_refs->0->>'value')::text
      ELSE NULL
    END as bolt_pattern,
    CASE 
      WHEN w.center_bore_ref IS NOT NULL AND jsonb_array_length(w.center_bore_ref) > 0
      THEN (w.center_bore_ref->0->>'value')::text
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
  ORDER BY w.wheel_name;
END;
$function$;