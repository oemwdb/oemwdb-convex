-- Create page_mappings table for storing page template configurations
CREATE TABLE public.page_mappings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL,
  user_id UUID,
  mappings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint for global and user-specific mappings
ALTER TABLE public.page_mappings 
ADD CONSTRAINT unique_page_user_mapping 
UNIQUE (page_type, user_id);

-- Enable Row Level Security
ALTER TABLE public.page_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies for page mappings
CREATE POLICY "Users can view their own page mappings or global mappings" 
ON public.page_mappings 
FOR SELECT 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can create their own page mappings" 
ON public.page_mappings 
FOR INSERT 
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can update their own page mappings" 
ON public.page_mappings 
FOR UPDATE 
USING ((auth.uid() = user_id) OR (user_id IS NULL))
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can delete their own page mappings" 
ON public.page_mappings 
FOR DELETE 
USING ((auth.uid() = user_id) OR (user_id IS NULL));

-- Create function to update updated_at timestamp
CREATE TRIGGER update_page_mappings_updated_at
BEFORE UPDATE ON public.page_mappings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();