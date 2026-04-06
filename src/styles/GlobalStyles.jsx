import { useTheme } from "../hooks/useTheme";
import { AMBER, AMBER_D } from "../utils/constants";

/**
 * Injects global CSS into the document head.
 * Re-renders on theme change so CSS vars stay in sync.
 */
export default function GlobalStyles() {
  const th = useTheme();

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── Keyframe animations ── */
    @keyframes fadeUp  { from { opacity: 0; transform: translateY(10px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(.95)        } to { opacity: 1; transform: scale(1)     } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(18px)  } to { opacity: 1; transform: translateX(0)} }
    @keyframes pulse   { 0%,100% { opacity: .4 } 50% { opacity: .15 } }
    @keyframes toastIn { from { opacity: 0; transform: translateX(110%) } to { opacity: 1; transform: translateX(0) } }

    /* ── Animation utility classes ── */
    .fu { animation: fadeUp  .45s cubic-bezier(.16,1,.3,1) both }
    .si { animation: scaleIn .32s cubic-bezier(.16,1,.3,1) both }
    .sl { animation: slideIn .35s cubic-bezier(.16,1,.3,1) both }
    .ti { animation: toastIn .38s cubic-bezier(.16,1,.3,1) both }
    .sk { animation: pulse 1.6s ease-in-out infinite; background: ${th.border}; border-radius: 6px }

    /* ── Stagger delay helpers ── */
    .d0 { animation-delay: .00s } .d1 { animation-delay: .07s } .d2 { animation-delay: .13s }
    .d3 { animation-delay: .19s } .d4 { animation-delay: .25s } .d5 { animation-delay: .31s }

    /* ── Component class helpers ── */
    .nav:hover  { background: ${th.hover} !important }
    .card       { transition: transform .25s, box-shadow .25s }
    .card:hover { transform: translateY(-3px) !important; box-shadow: 0 14px 38px rgba(0,0,0,.24) !important }
    .row        { transition: background .12s }
    .row:hover td { background: ${th.hover} }

    /* ── Button variants ── */
    .bp          { background: ${AMBER}; color: #000; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-weight: 600; transition: all .2s }
    .bp:hover    { background: ${AMBER_D}; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(245,158,11,.35) }
    .bp:active   { transform: none }
    .bg          { background: transparent; border: 1px solid ${th.border}; color: ${th.text}; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s }
    .bg:hover    { background: ${th.hover} }

    /* ── Misc ── */
    input[type=date]::-webkit-calendar-picker-indicator { filter: ${th.dark ? "invert(1)" : "none"}; opacity: .6 }
    ::-webkit-scrollbar       { width: 3px; height: 3px }
    ::-webkit-scrollbar-thumb { background: ${th.border}; border-radius: 3px }
    select option             { background: ${th.card}; color: ${th.text} }
    input::placeholder        { color: ${th.muted} }
  `;

  return <style>{css}</style>;
}
