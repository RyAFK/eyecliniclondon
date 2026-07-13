export function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/**
 * Demo mode serves fictional in-memory data instead of hitting Supabase, and
 * enables a simplified staff sign-in code instead of real auth. It exists so
 * the app can be evaluated with no Supabase project configured at all.
 *
 * There are two distinct cases:
 *
 * 1. No Supabase project is configured (hasSupabaseConfig() is false). There
 *    is no real backend to protect here, so falling back to the safe
 *    fictional dataset — in every environment, including production — is
 *    strictly better than the alternative: every request throwing when it
 *    tries to build a Supabase client with an empty URL/key, which is what
 *    used to happen on a fresh deploy with zero environment variables set.
 *
 * 2. A real Supabase project IS configured. This is the dangerous case the
 *    original safety check exists for — a deployer could accidentally leave
 *    NEXT_PUBLIC_DEMO_MODE=true set against a real production project and
 *    silently serve fake data / a fake sign-in flow over real patient data.
 *    Here demo mode requires an explicit opt-in (NEXT_PUBLIC_DEMO_MODE=true),
 *    and in production ALSO requires NEXT_PUBLIC_ALLOW_DEMO_IN_PRODUCTION=true.
 */
export function isDemoMode(): boolean {
  if (!hasSupabaseConfig()) {
    return true;
  }

  const requested = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  if (!requested) return false;

  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_ALLOW_DEMO_IN_PRODUCTION === 'true';
  }

  return true;
}

/** True when the app should read/write real data through Supabase. */
export function isLiveMode(): boolean {
  return !isDemoMode() && hasSupabaseConfig();
}
