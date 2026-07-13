import 'server-only';
import { cookies } from 'next/headers';
import { DEMO_USERS } from '@/lib/demo/data';
import type { UserProfile } from '@/types/user';

const DEMO_SESSION_COOKIE = 'ecl_demo_session';

/**
 * Demo-mode-only session cookie. This is NOT a substitute for real
 * authentication — it exists purely so the demo build (see
 * lib/demo/config.ts) can simulate being signed in as a fictional user
 * without a Supabase project configured. It is never read or written when
 * the app is running in live mode.
 */
export function setDemoSession(userId: string) {
  cookies().set(DEMO_SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export function clearDemoSession() {
  cookies().delete(DEMO_SESSION_COOKIE);
}

export function getDemoSessionUser(): UserProfile | null {
  const userId = cookies().get(DEMO_SESSION_COOKIE)?.value;
  if (!userId) return null;
  return DEMO_USERS.find((u) => u.id === userId) ?? null;
}
