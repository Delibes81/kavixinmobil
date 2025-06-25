import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// For development, provide fallback values to prevent the app from crashing
const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder-key';

// Use fallback values if environment variables are not properly set
const finalUrl = (supabaseUrl && supabaseUrl !== 'your_supabase_url_here') ? supabaseUrl : defaultUrl;
const finalKey = (supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key_here') ? supabaseAnonKey : defaultKey;

export const supabase = createClient(finalUrl, finalKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== defaultUrl && supabaseAnonKey !== defaultKey &&
  supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here');