-- Create ownership status enum
CREATE TYPE ownership_status AS ENUM ('owned', 'leased', 'financed', 'sold');

-- Create user_registered_vehicles table
CREATE TABLE public.user_registered_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vin TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  color TEXT,
  mileage INTEGER NOT NULL,
  purchase_date DATE,
  purchase_price NUMERIC(10, 2),
  current_value_estimate NUMERIC(10, 2),
  ownership_status ownership_status NOT NULL DEFAULT 'owned',
  license_plate TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  registration_expiry DATE,
  last_service_date DATE,
  next_service_due DATE,
  notes TEXT,
  images TEXT[],
  documents TEXT[],
  linked_oem_vehicle_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_linked_vehicle FOREIGN KEY (linked_oem_vehicle_id) REFERENCES public.oem_vehicles(id) ON DELETE SET NULL,
  CONSTRAINT valid_vin_length CHECK (length(vin) = 17),
  CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2026),
  CONSTRAINT positive_mileage CHECK (mileage >= 0)
);

-- Enable RLS
ALTER TABLE public.user_registered_vehicles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own registered vehicles"
  ON public.user_registered_vehicles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registered vehicles"
  ON public.user_registered_vehicles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own registered vehicles"
  ON public.user_registered_vehicles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own registered vehicles"
  ON public.user_registered_vehicles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own registered vehicles"
  ON public.user_registered_vehicles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_registered_vehicles_updated_at
  BEFORE UPDATE ON public.user_registered_vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_registered_vehicles_user_id ON public.user_registered_vehicles(user_id);
CREATE INDEX idx_registered_vehicles_vin ON public.user_registered_vehicles(vin);

-- Create storage bucket for registered vehicles
INSERT INTO storage.buckets (id, name, public)
VALUES ('registered-vehicles', 'registered-vehicles', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'registered-vehicles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'registered-vehicles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can read all registered vehicle files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'registered-vehicles' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'registered-vehicles' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );