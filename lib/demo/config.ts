/**
 * Demo mode serves fictional in-memory data instead of hitting Supabase, and
 * enables a simplified staff sign-in code instead of real auth. It exists so
 * the app can be evaluated with `npm run dev` and no Supabase project.
 *
 * SAFETY: this must never silently turn on in a real production deployment.
 * `NODE_ENV === 'production'` forces demo mode off unless the deployer has
 * ALSO explicitly set NEXT_PUBLIC_ALLOW_DEMO_IN_PRODUCTION=true — a flag that
 * should only be used for a deliberately sandboxed demo deployment.
 */
export function isDemoMode(): boolean {
  const requested = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  if (!requested) return false;

  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_ALLOW_DEMO_IN_PRODUCTION === 'true';
  }

  return true;
}

export function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** True when the app should read/write real data through Supabase. */
export function isLiveMode(): boolean {
  return !isDemoMode() && hasSupabaseConfig();
}
