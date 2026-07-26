import { createClient } from '@supabase/supabase-js';

// Environment variables or fallback
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || '';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseUrl.startsWith('https://')
  );
};

// Create client instance if configured, or a mock-compatible proxy
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL Schema for manual initialization in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- APEX ATHLETICS KULGAM - SUPABASE SCHEMA SETUP
-- Run this in your Supabase SQL Editor to initialize all tables:

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  date DATE NOT NULL,
  time TEXT,
  location TEXT,
  distances TEXT[] NOT NULL,
  registration_status TEXT DEFAULT 'upcoming',
  registration_fee TEXT,
  description TEXT,
  route_details TEXT,
  image TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  type TEXT DEFAULT 'photo',
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail TEXT,
  caption TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Marathon Results Table
CREATE TABLE IF NOT EXISTS public.results (
  id TEXT PRIMARY KEY,
  bib_number TEXT NOT NULL,
  participant_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  distance TEXT NOT NULL,
  gender TEXT NOT NULL,
  category TEXT NOT NULL,
  finish_time TEXT NOT NULL,
  pace TEXT,
  rank INTEGER NOT NULL,
  certificate_no TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
  certificate_number TEXT PRIMARY KEY,
  participant_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  distance TEXT NOT NULL,
  event_date DATE NOT NULL,
  position TEXT,
  status TEXT DEFAULT 'valid',
  issue_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.registrations (
  id TEXT PRIMARY KEY,
  event_id TEXT REFERENCES public.events(id),
  event_name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  gender TEXT NOT NULL,
  age INTEGER NOT NULL,
  distance TEXT NOT NULL,
  t_shirt_size TEXT NOT NULL,
  emergency_contact TEXT NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bib_number TEXT NOT NULL
);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all public data
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);
CREATE POLICY "Public Read Results" ON public.results FOR SELECT USING (true);
CREATE POLICY "Public Read Certificates" ON public.certificates FOR SELECT USING (true);

-- Allow public insert on registrations
CREATE POLICY "Public Insert Registrations" ON public.registrations FOR INSERT WITH CHECK (true);

-- Allow admin full access
CREATE POLICY "Admin Full Events" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Gallery" ON public.gallery FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Announcements" ON public.announcements FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Results" ON public.results FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Certificates" ON public.certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Registrations" ON public.registrations FOR ALL USING (auth.role() = 'authenticated');
`;
