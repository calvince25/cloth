-- ==========================================
-- CONTACTS TABLE SETUP
-- ==========================================

-- 1. Create Contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- 3. Create policies
-- Allow anyone (public/anonymous) to submit messages
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contacts;
CREATE POLICY "Allow anonymous inserts" ON public.contacts FOR INSERT WITH CHECK (true);

-- Allow authenticated users (Admins) to manage messages
DROP POLICY IF EXISTS "Allow authenticated to select" ON public.contacts;
CREATE POLICY "Allow authenticated to select" ON public.contacts FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated to update" ON public.contacts;
CREATE POLICY "Allow authenticated to update" ON public.contacts FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated to delete" ON public.contacts;
CREATE POLICY "Allow authenticated to delete" ON public.contacts FOR DELETE USING (auth.role() = 'authenticated');
