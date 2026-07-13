import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { isDemoMode } from '@/lib/demo/config';

export async function middleware(request: NextRequest) {
  // Demo mode has no real Supabase session to refresh — and, per
  // lib/demo/config.ts#isDemoMode(), it's also the automatic fallback when
  // no Supabase project is configured at all, so this must use the same
  // shared check as the rest of the app rather than reading the raw env var
  // directly (which would disagree with isDemoMode() whenever a real
  // Supabase project is configured but demo mode is blocked in production).
  if (isDemoMode()) {
    return NextResponse.next();
  }
  return updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
