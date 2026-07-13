import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

interface CookieToSet {
  name: string;
  value: string;
  options: CookieOptions;
}

/** Server Component / Route Handler / Server Action Supabase client — reads the user's session from cookies. */
export function createServerSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, or enable NEXT_PUBLIC_DEMO_MODE for local evaluation.'
    );
  }

  const cookieStore = cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component with no request context — safe to
          // ignore because the middleware refreshes the session on every request.
        }
      },
    },
  });
}

/**
 * Service-role client — bypasses RLS. Only ever import this from server-only
 * code (route handlers, server actions) that performs a specific, narrowly
 * scoped privileged write, e.g. generating a referral reference or writing
 * an audit log row. Never import this into client components.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set — service-role client unavailable.');
  }

  return createServerClient<Database>(url, serviceKey, {
    cookies: {
      getAll: () => [],
      setAll: () => {},
    },
  });
}
