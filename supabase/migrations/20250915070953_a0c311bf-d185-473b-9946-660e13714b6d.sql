-- Create user role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Create user profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create wheel_comments table
CREATE TABLE public.wheel_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wheel_id INTEGER REFERENCES public.oem_wheels(id) ON DELETE CASCADE NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vehicle_comments table
CREATE TABLE public.vehicle_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id INTEGER REFERENCES public.oem_vehicles(id) ON DELETE CASCADE NOT NULL,
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_wheels table
CREATE TABLE public.saved_wheels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    wheel_id INTEGER REFERENCES public.oem_wheels(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, wheel_id)
);

-- Create saved_vehicles table
CREATE TABLE public.saved_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vehicle_id INTEGER REFERENCES public.oem_vehicles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Create saved_brands table
CREATE TABLE public.saved_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    brand_id INTEGER REFERENCES public.oem_brands(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, brand_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wheel_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_brands ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = _user_id
    LIMIT 1;
$$;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
    );
    
    -- Add default 'user' role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create update timestamp function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_wheel_comments_updated_at
    BEFORE UPDATE ON public.wheel_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_vehicle_comments_updated_at
    BEFORE UPDATE ON public.vehicle_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Roles are viewable by everyone"
    ON public.user_roles FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage roles"
    ON public.user_roles FOR INSERT
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles"
    ON public.user_roles FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
    ON public.user_roles FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone"
    ON public.wheel_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create comments"
    ON public.wheel_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON public.wheel_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments or admins can delete any"
    ON public.wheel_comments FOR DELETE
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Same policies for vehicle comments
CREATE POLICY "Vehicle comments are viewable by everyone"
    ON public.vehicle_comments FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create vehicle comments"
    ON public.vehicle_comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicle comments"
    ON public.vehicle_comments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicle comments or admins can delete any"
    ON public.vehicle_comments FOR DELETE
    USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for saved items
CREATE POLICY "Users can view own saved wheels"
    ON public.saved_wheels FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save wheels"
    ON public.saved_wheels FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave wheels"
    ON public.saved_wheels FOR DELETE
    USING (auth.uid() = user_id);

-- Same for saved vehicles
CREATE POLICY "Users can view own saved vehicles"
    ON public.saved_vehicles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save vehicles"
    ON public.saved_vehicles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave vehicles"
    ON public.saved_vehicles FOR DELETE
    USING (auth.uid() = user_id);

-- Same for saved brands
CREATE POLICY "Users can view own saved brands"
    ON public.saved_brands FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can save brands"
    ON public.saved_brands FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave brands"
    ON public.saved_brands FOR DELETE
    USING (auth.uid() = user_id);

-- Add first admin user (you'll need to update this with the actual user ID after first signup)
-- This is a placeholder that will need to be run manually after the first admin signs up
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_ADMIN_USER_ID', 'admin');