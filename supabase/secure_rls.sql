-- 1. Helper Function for Admin Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on Public Tables Only
ALTER TABLE public.oem_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oem_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oem_wheels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policies (Project Content)
create policy "Public Read Brands" on public.oem_brands for select using (true);
create policy "Public Read Vehicles" on public.oem_vehicles for select using (true);
create policy "Public Read Wheels" on public.oem_wheels for select using (true);
create policy "Public Read Variants" on public.vehicle_variants for select using (true);

-- 4. Admin Write Policies (Project Content)
create policy "Admin Insert Brands" on public.oem_brands for insert with check (is_admin());
create policy "Admin Update Brands" on public.oem_brands for update using (is_admin());
create policy "Admin Delete Brands" on public.oem_brands for delete using (is_admin());

create policy "Admin Insert Vehicles" on public.oem_vehicles for insert with check (is_admin());
create policy "Admin Update Vehicles" on public.oem_vehicles for update using (is_admin());
create policy "Admin Delete Vehicles" on public.oem_vehicles for delete using (is_admin());

create policy "Admin Insert Wheels" on public.oem_wheels for insert with check (is_admin());
create policy "Admin Update Wheels" on public.oem_wheels for update using (is_admin());
create policy "Admin Delete Wheels" on public.oem_wheels for delete using (is_admin());

create policy "Admin Insert Variants" on public.vehicle_variants for insert with check (is_admin());
create policy "Admin Update Variants" on public.vehicle_variants for update using (is_admin());
create policy "Admin Delete Variants" on public.vehicle_variants for delete using (is_admin());

-- 5. User Policies
create policy "Public Read Profiles" on public.profiles for select using (true);
create policy "Read Own Role" on public.user_roles for select using (auth.uid() = user_id);
create policy "Update Own Profile" on public.profiles for update using (auth.uid() = id);

-- 6. Storage Policies (Bucket: 'oemwdb images')
-- RLS on storage.objects is enabled by default. We just add policies.

-- Public Read for OEM Images
create policy "Public Access Images"
on storage.objects for select
using ( bucket_id = 'oemwdb images' );

-- Admin Upload/Delete (Using is_admin() check)
create policy "Admin Upload Images"
on storage.objects for insert
with check ( bucket_id = 'oemwdb images' AND is_admin() );

create policy "Admin Update Images"
on storage.objects for update
using ( bucket_id = 'oemwdb images' AND is_admin() );

create policy "Admin Delete Images"
on storage.objects for delete
using ( bucket_id = 'oemwdb images' AND is_admin() );
