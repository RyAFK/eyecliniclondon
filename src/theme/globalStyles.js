export const GLOBAL_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Parisienne&display=swap');

@keyframes eclFadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
@keyframes eclFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes eclScaleIn { from { opacity: 0; transform: scale(0.95) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes eclBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
@keyframes eclPop { 0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { transform: scale(1); } }
@keyframes eclGlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
@keyframes eclFloatY { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
@keyframes eclFloatY2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(8px); } }
@keyframes eclBorderGlow {
  0%, 100% { box-shadow: 0 0 0 2px rgba(176,138,78,0.3), 0 0 16px rgba(176,138,78,0.28); }
  50% { box-shadow: 0 0 0 4px rgba(176,138,78,0.5), 0 0 32px rgba(176,138,78,0.45); }
}
@keyframes eclConfettiFall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translateY(105vh) rotate(560deg); opacity: 0; }
}

.ecl-fade-up { animation: eclFadeInUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
.ecl-fade-in { animation: eclFadeIn 0.4s ease-out both; }
.ecl-scale-in { animation: eclScaleIn 0.3s cubic-bezier(0.16,1,0.3,1) both; }
.ecl-breathe { animation: eclBreathe 5s ease-in-out infinite; }
.ecl-pop { animation: eclPop 0.5s cubic-bezier(0.16,1,0.3,1) both; }
.ecl-glow-dot { animation: eclGlow 2.4s ease-in-out infinite; }
.ecl-float { animation: eclFloatY 16s ease-in-out infinite; }
.ecl-float-2 { animation: eclFloatY2 19s ease-in-out infinite; }
.ecl-tip-glow { animation: eclBorderGlow 2.8s ease-in-out infinite; }

.ecl-lift { transition: transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms ease, border-color 220ms ease; }
.ecl-lift:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -12px rgba(11,37,69,0.25); }
.ecl-press:active { transform: scale(0.97); }
.ecl-btn { transition: transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms ease, filter 180ms ease, background 180ms ease, opacity 180ms ease; }
.ecl-btn:hover { transform: translateY(-1px); filter: brightness(1.04); }
.ecl-btn:active { transform: translateY(0) scale(0.98); }
.ecl-underline { position: relative; }
.ecl-underline::after { content: ''; position: absolute; left: 0; right: 100%; bottom: -2px; height: 1.5px; background: currentColor; transition: right 220ms ease; }
.ecl-underline:hover::after { right: 0; }
.ecl-focus-ring:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--ecl-focus-ring-offset, transparent), 0 0 0 4px rgba(176,138,78,0.55); }
* { transition: background-color 240ms ease, border-color 240ms ease, color 240ms ease; }
`;
