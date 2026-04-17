-- =========================================================================
-- BUVER NAIROBI - SUPABASE FIX SQL SCRIPT
-- Paste this entire block into the Supabase SQL Editor and click "Run"
-- =========================================================================

-- 1. FIX THE "MISSING USERS" ISSUE
-- Automatically insert existing registered users into the 'profiles' table 
-- so they show up on your Admin Panel under "User Management".
INSERT INTO public.profiles (id, email, role)
SELECT id, email, 'pending'
FROM auth.users
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE public.profiles.id = auth.users.id
);

-- Ensure future users are automatically placed into the profiles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'pending')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- 2. FIX "SILENT FAILURES" FOR DELETES & EDITS (ROW LEVEL SECURITY)
-- Ensure that your admins can delete/edit blogs and products.
-- This creates permissive policies for Authenticated users on Key Tables.
DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.products;
CREATE POLICY "Allow all actions for authenticated users" ON public.products FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.blog_posts;
CREATE POLICY "Allow all actions for authenticated users" ON public.blog_posts FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow all actions for authenticated users" ON public.profiles;
CREATE POLICY "Allow all actions for authenticated users" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');


-- 3. SETUP PRODUCT IMAGE STORAGE BUCKET
-- This creates the "products" storage bucket and permits public uploads.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'products' );

DROP POLICY IF EXISTS "Admin Uploads" ON storage.objects;
CREATE POLICY "Admin Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- 4. ENSURE BLOG METADATA COLUMNS EXIST
-- These are required for the new SEO functionality on blogs.
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS meta_description text;
