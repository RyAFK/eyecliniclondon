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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
