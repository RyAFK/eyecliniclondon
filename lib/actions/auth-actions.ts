'use server';

import { redirect } from 'next/navigation';
import { isDemoMode } from '@/lib/demo/config';
import { setDemoSession, clearDemoSession } from '@/lib/demo/session';
import { DEMO_USERS, findDemoUserByEmail } from '@/lib/demo/data';
import { isStaffRole, isPartnerRole } from '@/types/user';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export interface AuthActionState {
  error?: string;
}

/**
 * Demo-mode-only "partner sign-in". This entire code path is unreachable
 * unless lib/demo/config.ts#isDemoMode() returns true, which is itself
 * hard-gated off in production builds unless a deployer explicitly opts in
 * (see .env.example). It exists purely to make the demo build click-through-able.
 */
export async function demoSignInPartnerAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isDemoMode()) return { error: 'Demo sign-in is not available.' };

  const email = String(formData.get('email') ?? '').trim();
  const match = findDemoUserByEmail(email);
  const user = match && isPartnerRole(match.role) ? match : DEMO_USERS.find((u) => isPartnerRole(u.role));
  if (!user) return { error: 'No demo partner account is available.' };

  setDemoSession(user.id);
  redirect('/dashboard');
}

// Only used when NEXT_PUBLIC_DEMO_STAFF_CODE is left unset, so the demo
// build's staff side is fully click-through-able with zero configuration.
// Not a secret — demo mode only ever serves the fictional dataset in
// lib/demo/data.ts, never real data, so there is nothing this code protects.
const FALLBACK_DEMO_STAFF_CODE = 'ecl-demo';

export async function demoSignInStaffAction(_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  if (!isDemoMode()) return { error: 'Demo sign-in is not available.' };

  const code = String(formData.get('code') ?? '').trim();
  const expected = process.env.NEXT_PUBLIC_DEMO_STAFF_CODE || FALLBACK_DEMO_STAFF_CODE;
  if (code !== expected) {
    return { error: 'Incorrect team code. Please try again.' };
  }

  const staffUser = DEMO_USERS.find((u) => isStaffRole(u.role));
  if (!staffUser) return { error: 'No demo staff account is available.' };

  setDemoSession(staffUser.id);
  redirect('/staff');
}

export async function signOutAction(): Promise<void> {
  if (isDemoMode()) {
    clearDemoSession();
  } else {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch (err) {
      // Sign-out should never trap the user on a broken page — log the
      // real cause server-side and still send them back to /login.
      console.error('[auth] signOutAction failed to sign out via Supabase:', err);
    }
  }
  redirect('/login');
}
