-- Update get_vehicles_with_brands to properly join with brand_refs JSONB
CREATE OR REPLACE FUNCTION public.get_vehicles_with_brands()
RETURNS TABLE(
  id integer,
  chassis_code text,
  model_name text,
  brand_name text,
  production_years text,
  bolt_pattern text,
  center_bore text,
  hero_image_url text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    v.id,
    v.chassis_code,
    v.model_name,
    COALESCE(b.name, (v.brand_refs->0->>'value')::text) as brand_name,
    v.production_years,
    v.bolt_pattern,
    v.center_bore,
    v.hero_image_url,
    CASE 
      WHEN v.hero_image_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_vehicles v
  LEFT JOIN LATERAL (
    SELECT b.name
    FROM jsonb_array_elements(v.brand_refs) as ref
    JOIN oem_brands b ON b.id = (ref->>'id')::integer
    LIMIT 1
  ) b ON true
  ORDER BY b.name, v.model_name;
END;
$function$;

-- Create function to get vehicles for a specific brand
CREATE OR REPLACE FUNCTION public.get_vehicles_by_brand(brand_name_param text)
RETURNS TABLE(
  id integer,
  chassis_code text,
  model_name text,
  brand_name text,
  production_years text,
  bolt_pattern text,
  center_bore text,
  hero_image_url text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    v.id,
    v.chassis_code,
    v.model_name,
    b.name as brand_name,
    v.production_years,
    v.bolt_pattern,
    v.center_bore,
    v.hero_image_url,
    CASE 
      WHEN v.hero_image_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_vehicles v
  CROSS JOIN jsonb_array_elements(v.brand_refs) as ref
  JOIN oem_brands b ON b.id = (ref->>'id')::integer
  WHERE LOWER(b.name) = LOWER(brand_name_param)
  ORDER BY v.model_name;
END;
$function$;

-- Create function to get wheels for a specific brand
CREATE OR REPLACE FUNCTION public.get_wheels_by_brand(brand_name_param text)
RETURNS TABLE(
  id integer,
  wheel_name text,
  brand_name text,
  diameter text,
  width text,
  bolt_pattern text,
  center_bore text,
  wheel_offset text,
  color text,
  good_pic_url text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id,
    w.wheel_name,
    b.name as brand_name,
    (w.diameter_refs->0->>'value')::text as diameter,
    (w.width_refs->0->>'value')::text as width,
    (w.bolt_pattern_refs->0->>'value')::text as bolt_pattern,
    (w.center_bore_refs->0->>'value')::text as center_bore,
    w.wheel_offset,
    w.color,
    w.good_pic_url,
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_wheels w
  CROSS JOIN jsonb_array_elements(w.brand_refs) as ref
  JOIN oem_brands b ON b.id = (ref->>'id')::integer
  WHERE LOWER(b.name) = LOWER(brand_name_param)
  ORDER BY w.wheel_name;
END;
$function$;