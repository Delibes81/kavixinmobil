import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.includes('supabase.co');
  } catch {
    return false;
  }
};

const isValidKey = (key: string) => {
  return key && key.length > 20 && !key.includes('your-');
};

// Check if we have valid Supabase configuration
const hasValidConfig = supabaseUrl && supabaseAnonKey && 
                      isValidUrl(supabaseUrl) && 
                      isValidKey(supabaseAnonKey);

if (!hasValidConfig) {
  console.warn('⚠️  Supabase not properly configured. Please check your environment variables.');
  console.warn('📋 Setup instructions:');
  console.warn('1. Go to https://supabase.com/dashboard');
  console.warn('2. Select your project or create a new one');
  console.warn('3. Go to Settings > API');
  console.warn('4. Copy your Project URL and Anon Key to .env file');
  console.warn('5. Restart your development server');
}

// Use dummy values if not configured (will trigger fallback to mock data)
const defaultUrl = 'https://demo.supabase.co';
const defaultKey = 'demo-key';

export const supabase = createClient<Database>(
  hasValidConfig ? supabaseUrl : defaultUrl,
  hasValidConfig ? supabaseAnonKey : defaultKey,
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
  hasUrl: !!supabaseUrl && isValidUrl(supabaseUrl),
  hasKey: !!supabaseAnonKey && isValidKey(supabaseAnonKey),
  isConfigured: hasValidConfig,
  url: hasValidConfig ? 'configured' : 'missing or invalid',
  key: hasValidConfig ? 'configured' : 'missing or invalid'
};