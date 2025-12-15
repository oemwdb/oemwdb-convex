CREATE OR REPLACE FUNCTION public.get_wheels_with_brands()
 RETURNS TABLE(id integer, wheel_name text, brand_name text, diameter text, width text, bolt_pattern text, center_bore text, wheel_offset text, color text, good_pic_url text, status text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id::integer,
    w.wheel_name,
    COALESCE(b.name, (w.brand_refs->0->>'value')::text) as brand_name,
    (w.diameter_refs->0->>'value')::text as diameter,
    (w.width_ref->0->>'value')::text as width,
    (w.bolt_pattern_refs->0->>'value')::text as bolt_pattern,
    (w.center_bore_ref->0->>'value')::text as center_bore,
    w.wheel_offset,
    w.color,
    w.good_pic_url,
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_wheels w
  LEFT JOIN LATERAL (
    SELECT b.name
    FROM jsonb_array_elements(w.brand_refs) as ref
    JOIN oem_brands b ON b.id = (ref->>'id')::integer
    LIMIT 1
  ) b ON true
  ORDER BY w.wheel_name;
END;
$function$;