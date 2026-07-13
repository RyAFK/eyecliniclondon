/**
 * Colour tokens resolve through CSS variables (see app/globals.css) so that
 * toggling `data-theme` on <html> re-themes every component with no re-render.
 */
export const COLOR = {
  bg: 'var(--ecl-bg)',
  recessed: 'var(--ecl-recessed)',
  primary: 'var(--ecl-primary)',
  primaryTint: 'var(--ecl-primary-tint)',
  secondary: 'var(--ecl-secondary)',
  accent: 'var(--ecl-accent)',
  accentTint: 'var(--ecl-accent-tint)',
  text: 'var(--ecl-text)',
  textMuted: 'var(--ecl-text-muted)',
  border: 'var(--ecl-border)',
  complete: 'var(--ecl-complete)',
  action: 'var(--ecl-action)',
  problem: 'var(--ecl-problem)',
  future: 'var(--ecl-future)',
} as const;

export const FONT_DISPLAY = { fontFamily: 'var(--font-fraunces), ui-serif, Georgia, serif' };
export const FONT_BODY = { fontFamily: 'var(--font-inter), ui-sans-serif, system-ui, sans-serif' };
export const FONT_MONO = { fontFamily: 'var(--font-mono), ui-monospace, monospace' };

export type Tone = 'default' | 'complete' | 'action' | 'accent' | 'info' | 'purple' | 'teal' | 'closed' | 'problem';

export function toneColor(tone: Tone): string {
  switch (tone) {
    case 'complete': return COLOR.complete;
    case 'action': return COLOR.action;
    case 'info': return '#1D4E75';
    case 'purple': return '#6D4AA3';
    case 'teal': return '#0F766E';
    case 'closed': return '#78716C';
    case 'problem': return COLOR.problem;
    case 'accent': return COLOR.accent;
    default: return COLOR.text;
  }
}

export function toneBg(tone: Tone): string {
  switch (tone) {
    case 'complete': return '#2F7D5A1A';
    case 'action': return '#B4780E1A';
    case 'info': return '#1D4E751A';
    case 'purple': return '#6D4AA31A';
    case 'teal': return '#0F766E1A';
    case 'closed': return '#78716C1A';
    case 'problem': return '#B3261E1A';
    case 'accent': return COLOR.accentTint;
    default: return COLOR.primaryTint;
  }
}
