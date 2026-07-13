import type { Metadata } from 'next';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ui/theme-provider';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eye Clinic London | Referral Portal',
  description: 'Refer patients to Eye Clinic London and track their journey from referral to treatment.',
};

/**
 * Every route in this app reads the signed-in user's session (via cookies)
 * to decide what to render, so none of it can be meaningfully static.
 * Without this, Next attempts to prerender pages at build time; on a fresh
 * deploy with no Supabase/demo env vars configured, the auth lookup throws
 * before Next's own dynamic-API detection (cookies()) kicks in, which
 * aborts `next build` entirely instead of just failing at request time.
 * Forcing dynamic rendering here means the build only compiles the code —
 * it no longer depends on runtime environment configuration to succeed.
 */
export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
