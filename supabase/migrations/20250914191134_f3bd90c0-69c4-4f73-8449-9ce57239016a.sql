-- Create table for card system mappings
CREATE TABLE IF NOT EXISTS public.card_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  card_type TEXT NOT NULL,
  mappings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  UNIQUE(card_type, user_id)
);

-- Enable RLS
ALTER TABLE public.card_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own card mappings" 
ON public.card_mappings 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own card mappings" 
ON public.card_mappings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own card mappings" 
ON public.card_mappings 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own card mappings" 
ON public.card_mappings 
FOR DELETE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_card_mappings_updated_at
BEFORE UPDATE ON public.card_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();