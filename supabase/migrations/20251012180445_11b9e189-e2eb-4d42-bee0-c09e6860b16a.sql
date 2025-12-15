-- Drop and recreate the get_wheels_with_brands function with correct extraction logic
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
  status text,
  diameter_refs jsonb,
  width_ref jsonb,
  bolt_pattern_refs jsonb,
  center_bore_ref jsonb,
  color_refs jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id,
    w.wheel_name,
    -- Extract first brand from simple array (removing quotes)
    CASE 
      WHEN w.brand_refs IS NOT NULL AND jsonb_array_length(w.brand_refs) > 0 
      THEN trim(both '"' from (w.brand_refs->0)::text)
      ELSE NULL
    END as brand_name,
    -- Extract diameter as simple string
    CASE 
      WHEN w.diameter_refs IS NOT NULL AND jsonb_array_length(w.diameter_refs) > 0
      THEN trim(both '"' from (w.diameter_refs->0)::text)
      ELSE NULL
    END as diameter,
    -- Extract width as simple string
    CASE 
      WHEN w.width_ref IS NOT NULL AND jsonb_array_length(w.width_ref) > 0
      THEN trim(both '"' from (w.width_ref->0)::text)
      ELSE NULL
    END as width,
    -- Extract bolt_pattern as simple string
    CASE 
      WHEN w.bolt_pattern_refs IS NOT NULL AND jsonb_array_length(w.bolt_pattern_refs) > 0
      THEN trim(both '"' from (w.bolt_pattern_refs->0)::text)
      ELSE NULL
    END as bolt_pattern,
    -- Extract center_bore as simple string
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
    END as status,
    -- Return full ref arrays for filtering
    w.diameter_refs,
    w.width_ref,
    w.bolt_pattern_refs,
    w.center_bore_ref,
    w.color_refs
  FROM oem_wheels w
  ORDER BY w.wheel_name;
END;
$function$;