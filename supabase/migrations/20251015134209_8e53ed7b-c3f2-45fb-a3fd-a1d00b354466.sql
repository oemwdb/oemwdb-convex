-- Create function to efficiently get vehicle count for a brand
CREATE OR REPLACE FUNCTION public.get_brand_vehicle_count(brand_name_param text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  vehicle_count integer;
BEGIN
  SELECT COUNT(DISTINCT v.id)
  INTO vehicle_count
  FROM oem_vehicles v
  CROSS JOIN jsonb_array_elements_text(v.brand_ref) as ref
  WHERE LOWER(ref) = LOWER(brand_name_param);
  
  RETURN COALESCE(vehicle_count, 0);
END;
$function$;