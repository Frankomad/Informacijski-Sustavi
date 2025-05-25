import { createClient } from '@supabase/supabase-js';

// Only check for environment variables if not in test environment
if (process.env.NODE_ENV !== 'test') {
  if (!process.env.SUPABASE_URL) {
    throw new Error('Missing SUPABASE_URL environment variable');
  }

  if (!process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_KEY environment variable');
  }
}

// Use mock values for test environment
const supabaseUrl = process.env.NODE_ENV === 'test' 
  ? 'https://test.supabase.co'
  : process.env.SUPABASE_URL!;

const supabaseKey = process.env.NODE_ENV === 'test'
  ? 'test-key'
  : process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey); 