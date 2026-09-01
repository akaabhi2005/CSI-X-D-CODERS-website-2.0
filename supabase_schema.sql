-- ============================================================================
-- CSI x D'CODERS SUPABASE DATABASE SCHEMA
-- Execute this script in your Supabase SQL Editor to create all required tables
-- ============================================================================

-- 1. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS & Allow public access for Subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read subscribers" ON public.subscribers FOR SELECT USING (true);
CREATE POLICY "Allow public insert subscribers" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete subscribers" ON public.subscribers FOR DELETE USING (true);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    registrationUrl TEXT,
    isFeatured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- 3. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    position TEXT NOT NULL,
    image TEXT NOT NULL,
    bio TEXT NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    branch TEXT,
    level INT DEFAULT 5,
    domain TEXT,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all team" ON public.team FOR ALL USING (true) WITH CHECK (true);

-- 4. LEGACY HEADS TABLE
CREATE TABLE IF NOT EXISTS public.legacy_heads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    tenure TEXT NOT NULL,
    placedAt TEXT,
    bio TEXT NOT NULL,
    highlight TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.legacy_heads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all legacy_heads" ON public.legacy_heads FOR ALL USING (true) WITH CHECK (true);

-- 5. SUB-TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.sub_teams (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    frontDesc TEXT NOT NULL,
    backDesc TEXT NOT NULL,
    points JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.sub_teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all sub_teams" ON public.sub_teams FOR ALL USING (true) WITH CHECK (true);

-- 6. CORE VALUES TABLE
CREATE TABLE IF NOT EXISTS public.core_values (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    color TEXT NOT NULL,
    frontDesc TEXT NOT NULL,
    backDesc TEXT NOT NULL,
    points JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.core_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all core_values" ON public.core_values FOR ALL USING (true) WITH CHECK (true);

-- 7. NEWS ISSUES TABLE
CREATE TABLE IF NOT EXISTS public.news_issues (
    id TEXT PRIMARY KEY,
    volume TEXT NOT NULL,
    month TEXT NOT NULL,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    coverImage TEXT NOT NULL,
    pdfUrl TEXT NOT NULL,
    fileSize TEXT NOT NULL,
    pageCount INT NOT NULL,
    topics JSONB DEFAULT '[]'::jsonb,
    isCurrent BOOLEAN DEFAULT false
);

ALTER TABLE public.news_issues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all news_issues" ON public.news_issues FOR ALL USING (true) WITH CHECK (true);

-- 8. GALLERY TABLE
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    image TEXT NOT NULL,
    size TEXT NOT NULL
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- 9. STATS TABLE
CREATE TABLE IF NOT EXISTS public.stats (
    id TEXT PRIMARY KEY DEFAULT 'main',
    eventsHosted TEXT NOT NULL,
    activeMembers TEXT NOT NULL,
    liveProjects TEXT NOT NULL,
    placementRate TEXT NOT NULL
);

ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public all stats" ON public.stats FOR ALL USING (true) WITH CHECK (true);
