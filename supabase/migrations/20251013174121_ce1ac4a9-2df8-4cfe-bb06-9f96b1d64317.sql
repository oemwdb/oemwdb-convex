-- Drop existing functions to allow changing return types
DROP FUNCTION IF EXISTS public.get_wheels_with_brands();
DROP FUNCTION IF EXISTS public.get_vehicles_with_brands();
DROP FUNCTION IF EXISTS public.get_vehicles_by_brand(text);
DROP FUNCTION IF EXISTS public.get_wheels_by_brand(text);

-- Recreate get_wheels_with_brands() with new column names
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
  diameter_ref jsonb,
  width_ref jsonb,
  bolt_pattern_ref jsonb,
  center_bore_ref jsonb,
  color_ref jsonb
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
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status,
    w.diameter_ref,
    w.width_ref,
    w.bolt_pattern_ref,
    w.center_bore_ref,
    w.color_ref
  FROM oem_wheels w
  ORDER BY w.wheel_title;
END;
$function$;

-- Recreate get_vehicles_with_brands() with new column names
CREATE OR REPLACE FUNCTION public.get_vehicles_with_brands()
RETURNS TABLE(
  id text,
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
    v.vehicle_id_only as chassis_code,
    v.model_name,
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

-- Recreate get_vehicles_by_brand() with new column names
CREATE OR REPLACE FUNCTION public.get_vehicles_by_brand(brand_name_param text)
RETURNS TABLE(
  id text,
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
    v.vehicle_id_only as chassis_code,
    v.model_name,
    brand_name_param as brand_name,
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
  CROSS JOIN jsonb_array_elements_text(v.brand_ref) as ref
  WHERE LOWER(ref) = LOWER(brand_name_param)
  ORDER BY v.model_name;
END;
$function$;

-- Recreate get_wheels_by_brand() with new column names
CREATE OR REPLACE FUNCTION public.get_wheels_by_brand(brand_name_param text)
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
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT DISTINCT
    w.id,
    w.wheel_title as wheel_name,
    brand_name_param as brand_name,
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
    CASE 
      WHEN w.good_pic_url IS NOT NULL THEN 'Ready for website'
      ELSE 'Needs Good Pic'
    END as status
  FROM oem_wheels w
  CROSS JOIN jsonb_array_elements_text(w.brand_ref) as ref
  WHERE LOWER(ref) = LOWER(brand_name_param)
  ORDER BY w.wheel_title;
END;
$function$;