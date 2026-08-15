import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that env vars are set and not placeholders
const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'YOUR_SUPABASE_URL' &&
  supabaseUrl.startsWith('https://');

if (!isConfigured) {
  console.warn(
    '⚠️ Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

export const supabase = createClient(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder-key'
);

export const isSupabaseConfigured = isConfigured;
