-- Create new table notion_source
CREATE TABLE notion_source (
  id text PRIMARY KEY, -- wheel_name used as ID
  wheel_title text,
  part_numbers text,
  oem_part_number text,
  wheel_offset text, -- keeping original just in case? Or user said "convert all existing data". 
  -- User said "put this in a brand new table", "convert all existing data to this for offset".
  -- I will keep wheel_offset (original) AND add offset_ref (new).
  weight text,
  notes text,
  color text,
  metal_type text,
  image_source text,
  good_pic_url text,
  bad_pic_url text,
  production_ready boolean,
  ai_processing_complete boolean,
  uuid uuid DEFAULT gen_random_uuid(),
  
  -- Refs (JSONB)
  brand_ref jsonb[],
  diameter_ref jsonb[],
  width_ref jsonb[],
  bolt_pattern_ref jsonb[],
  center_bore_ref jsonb[],
  vehicle_ref jsonb[],
  color_ref jsonb[],
  tire_size_ref jsonb[],
  design_style_ref jsonb[],
  offset_ref jsonb, -- NEW FIELD, single jsonb (array of objects or strings)
  
  specifications jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public_blurb text,
  private_blurb text,
  variants jsonb
);
