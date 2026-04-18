-- ==========================================
-- WISHLIST LEADS & CONTACT ENHANCEMENTS
-- ==========================================

-- 1. Create Wishlist Leads table
CREATE TABLE IF NOT EXISTS public.wishlist_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    read BOOLEAN DEFAULT false
);

-- 2. Enable RLS
ALTER TABLE public.wishlist_leads ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
DROP POLICY IF EXISTS "Allow public anonymous inserts" ON public.wishlist_leads;
CREATE POLICY "Allow public anonymous inserts" ON public.wishlist_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read" ON public.wishlist_leads;
CREATE POLICY "Allow authenticated users to read" ON public.wishlist_leads FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.wishlist_leads;
CREATE POLICY "Allow authenticated users to update" ON public.wishlist_leads FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to delete" ON public.wishlist_leads;
CREATE POLICY "Allow authenticated users to delete" ON public.wishlist_leads FOR DELETE USING (auth.role() = 'authenticated');
