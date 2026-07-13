'use client';

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

/** Browser-side Supabase client. Uses the public anon key only — RLS enforces access. */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable NEXT_PUBLIC_DEMO_MODE for local evaluation.'
    );
  }

  return createBrowserClient<Database>(url, anonKey);
}
