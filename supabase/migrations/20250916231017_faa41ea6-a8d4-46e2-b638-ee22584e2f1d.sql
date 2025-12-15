-- Create cool_ratings table for user ratings
CREATE TABLE public.cool_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('brand', 'vehicle', 'wheel')),
  item_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  justification TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cool_board_queue table for managing random items
CREATE TABLE public.cool_board_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('brand', 'vehicle', 'wheel')),
  item_id INTEGER NOT NULL,
  last_shown_at TIMESTAMP WITH TIME ZONE,
  total_ratings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_type, item_id)
);

-- Enable RLS
ALTER TABLE public.cool_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cool_board_queue ENABLE ROW LEVEL SECURITY;

-- Policies for cool_ratings
CREATE POLICY "Ratings are viewable by everyone" 
ON public.cool_ratings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own ratings" 
ON public.cool_ratings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" 
ON public.cool_ratings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" 
ON public.cool_ratings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Policies for cool_board_queue (public read, system managed write)
CREATE POLICY "Queue is viewable by everyone" 
ON public.cool_board_queue 
FOR SELECT 
USING (true);

-- Create update timestamp triggers
CREATE TRIGGER update_cool_ratings_updated_at
BEFORE UPDATE ON public.cool_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cool_board_queue_updated_at
BEFORE UPDATE ON public.cool_board_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for efficient queries
CREATE INDEX idx_cool_ratings_user_item ON public.cool_ratings(user_id, item_type, item_id);
CREATE INDEX idx_cool_ratings_item ON public.cool_ratings(item_type, item_id);
CREATE INDEX idx_cool_board_queue_shown ON public.cool_board_queue(last_shown_at);