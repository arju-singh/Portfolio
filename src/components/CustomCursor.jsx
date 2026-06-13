import { useEffect, useRef } from 'react';

/**
 * CustomCursor — a bespoke ring cursor (vanilla DOM + rAF eased follow),
 * modelled on the unseen.co `.cursor` system. No third-party cursor library.
 *
 * Mount it once near the root of the app:
 *   <CustomCursor />
 *
 * Drive states from any element with data attributes:
 *   data-cursor="hover"  → ring swells   (auto-applied to a/button/inputs too)
 *   data-cursor="text"   → thin caret bar
 *   data-cursor="drag"   → arrows glyph, ring fades back
 *   data-cursor="video"  → large ring + play glyph
 *   data-cursor="hold"   → forces the press state while hovered
 *
 * Invert the ring colour per region (dark ring on light panels, etc.):
 *   data-cursor-color="rgb(33,33,33)"   on any ancestor
 *
 * It disables itself on touch devices and when prefers-reduced-motion is set.
 *
 * Props:
 *   defaultColor  ring colour when no [data-cursor-color] ancestor is found
 *   ease          follow easing, 0..1 (lower = more lag)
 */
export default function CustomCursor({
  defaultColor = 'rgb(244, 243, 239)',
  ease = 0.18,
}) {
  const rootRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Bail on touch / reduced-motion — the native pointer stays.
    const noFinePointer = window.matchMedia('(pointer: coarse)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noFinePointer || reduced) return;

    document.documentElement.classList.add('has-custom-cursor');
    root.style.setProperty('--cursor-color', defaultColor);

    // Position state: target follows the mouse, pos eases toward target.
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let visible = false;

    const STATES = ['hover', 'text', 'drag', 'video', 'hold'];
    let currentState = '';

    const setState = (state) => {
      if (state === currentState) return;
      STATES.forEach((s) => root.classList.toggle(`cursor--${s}`, s === state));
      currentState = state;
    };

    // What is the cursor over right now?
    const resolveState = (el) => {
      if (!el) return '';
      const tagged = el.closest('[data-cursor]');
      if (tagged) return tagged.getAttribute('data-cursor') || '';
      if (el.closest('a, button, [role="button"], label, select, summary')) {
        return 'hover';
      }
      if (el.closest('input, textarea, [contenteditable="true"]')) return 'text';
      return '';
    };

    const resolveColor = (el) => {
      const region = el && el.closest('[data-cursor-color]');
      return region ? region.getAttribute('data-cursor-color') : defaultColor;
    };

    let pressed = false;

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        root.classList.remove('cursor--hidden');
      }
      const el = e.target instanceof Element ? e.target : null;
      // While the button is held, keep the 'hold' state regardless of target.
      if (!pressed) setState(resolveState(el));
      root.style.setProperty('--cursor-color', resolveColor(el));
    };

    const onDown = () => {
      pressed = true;
      root.classList.add('cursor--hold');
    };
    const onUp = () => {
      pressed = false;
      root.classList.remove('cursor--hold');
      // re-evaluate the element under the cursor after release
      const el = document.elementFromPoint(pos.x, pos.y);
      currentState = ''; // force setState to re-apply
      setState(resolveState(el));
    };

    const onLeave = () => {
      visible = false;
      root.classList.add('cursor--hidden');
    };
    const onEnter = () => {
      visible = true;
      root.classList.remove('cursor--hidden');
    };

    // rAF eased-follow loop — the signature "slightly lagged" feel.
    const tick = () => {
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      if (wrapRef.current) {
        root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    root.classList.add('cursor--hidden');
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [defaultColor, ease]);

  return (
    <div className="cursor" ref={rootRef} aria-hidden="true">
      <div className="cursor__wrap" ref={wrapRef}>
        <div className="cursor__inner">
          <div className="cursor__circle" />
          <div className="cursor__hold-inner" />
          <div className="cursor__hold-outer" />

          <div className="cursor__drag">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 24H34M14 24l6-6M14 24l6 6M34 24l-6-6M34 24l-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="cursor__video">
            <svg viewBox="0 0 48 48" fill="currentColor">
              <path d="M19 16l14 8-14 8z" />
            </svg>
          </div>

          <div className="cursor__progress">
            <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="24" cy="24" r="18" strokeDasharray="28 90" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
