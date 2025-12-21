-- Create saved_wheels table that was missing
CREATE TABLE IF NOT EXISTS public.saved_wheels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  wheel_id TEXT NOT NULL, -- Changed to TEXT to match oem_wheels.id type
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unique constraint to prevent duplicate saves
ALTER TABLE public.saved_wheels ADD CONSTRAINT unique_user_wheel UNIQUE (user_id, wheel_id);

-- Enable RLS
ALTER TABLE public.saved_wheels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view own saved wheels" ON public.saved_wheels;
CREATE POLICY "Users can view own saved wheels"
ON public.saved_wheels
FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save wheels" ON public.saved_wheels;
CREATE POLICY "Users can save wheels"
ON public.saved_wheels
FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can unsave wheels" ON public.saved_wheels;
CREATE POLICY "Users can unsave wheels"
ON public.saved_wheels
FOR DELETE
USING (auth.uid() = user_id);