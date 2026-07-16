export function statToneColor(tone, C) {
  if (tone === 'complete') return C.complete;
  if (tone === 'action') return C.action;
  if (tone === 'info') return '#1D4E75';
  if (tone === 'purple') return '#6D4AA3';
  if (tone === 'teal') return '#0F766E';
  if (tone === 'closed') return '#78716C';
  return C.text;
}

export function statToneBg(tone, C) {
  if (tone === 'complete') return '#2F7D5A1A';
  if (tone === 'action') return '#B4780E1A';
  if (tone === 'info') return '#1D4E751A';
  if (tone === 'purple') return '#6D4AA31A';
  if (tone === 'teal') return '#0F766E1A';
  if (tone === 'closed') return '#78716C1A';
  return C.primaryTint;
}
