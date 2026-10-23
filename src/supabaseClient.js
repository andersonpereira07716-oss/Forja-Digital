import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || '';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = (url && key) 
  ? createClient(url, key) 
  : { from: () => ({ select: () => Promise.resolve({ data: [], error: null }), insert: () => Promise.resolve({ data: null, error: null }), update: () => Promise.resolve({ data: null, error: null }) }) };
