import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_project_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  supabaseUrl.includes('supabase.co');

if (!hasValidConfig) {
  console.warn('Missing or invalid Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

// Only create client if we have valid configuration
// Use dummy values that won't cause network requests if config is invalid
export const supabase = createClient<Database>(
  hasValidConfig ? supabaseUrl : 'https://dummy.supabase.co',
  hasValidConfig ? supabaseAnonKey : 'dummy-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'X-Client-Info': 'nova-hestia-web'
      }
    }
  }
);

// Export configuration status for debugging
export const supabaseConfig = {
  hasUrl: !!supabaseUrl && supabaseUrl !== 'your_supabase_project_url',
  hasKey: !!supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key',
  isValid: hasValidConfig,
  url: supabaseUrl ? 'configured' : 'missing',
  key: supabaseAnonKey ? 'configured' : 'missing'
};