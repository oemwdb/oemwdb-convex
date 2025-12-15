-- Create market_listings table
CREATE TABLE public.market_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_type TEXT NOT NULL CHECK (listing_type IN ('wheel', 'vehicle', 'brand')),
  linked_item_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  condition TEXT CHECK (condition IN ('new', 'like-new', 'good', 'fair', 'parts')),
  location TEXT,
  shipping_available BOOLEAN DEFAULT false,
  images TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.market_listings ENABLE ROW LEVEL SECURITY;

-- Create policies for market_listings
CREATE POLICY "Listings are viewable by everyone" 
ON public.market_listings 
FOR SELECT 
USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create their own listings" 
ON public.market_listings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" 
ON public.market_listings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" 
ON public.market_listings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS member_since TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS listing_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS transaction_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'verified', 'trusted'));

-- Create function to update listing count
CREATE OR REPLACE FUNCTION public.update_user_listing_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles 
    SET listing_count = listing_count + 1 
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles 
    SET listing_count = listing_count - 1 
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for listing count
CREATE TRIGGER update_listing_count_trigger
AFTER INSERT OR DELETE ON public.market_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_user_listing_count();

-- Create trigger for updated_at
CREATE TRIGGER update_market_listings_updated_at
BEFORE UPDATE ON public.market_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_market_listings_user_id ON public.market_listings(user_id);
CREATE INDEX idx_market_listings_status ON public.market_listings(status);
CREATE INDEX idx_market_listings_listing_type ON public.market_listings(listing_type);
CREATE INDEX idx_market_listings_linked_item_id ON public.market_listings(linked_item_id);