import { useEffect, useRef } from 'react';
import './Cursor.css';

/**
 * Cursor — a bespoke ring cursor (vanilla DOM + rAF eased follow), modelled on
 * the unseen.co `.cursor` system. No third-party cursor library.
 *
 * Already mounted once in App.jsx. Drive states from any element via data attrs:
 *   data-cursor="hover"  → ring swells   (auto-applied to a / button / inputs)
 *   data-cursor="text"   → thin caret bar
 *   data-cursor="drag"   → arrows glyph, ring fades back
 *   data-cursor="video"  → large ring + play glyph
 *   data-cursor="hold"   → forces the press state while hovered
 *
 * Invert the ring colour per region (e.g. dark ring on a light panel):
 *   data-cursor-color="rgb(33,33,33)"   on any ancestor element
 *
 * Disables itself on touch devices and when prefers-reduced-motion is set.
 */
export default function Cursor({ defaultColor = 'rgb(244, 243, 239)', ease = 0.35 }) {
  const rootRef = useRef(null);   // inner dot — fast follow
  const ringRef = useRef(null);   // outer ring — lagging trail

  useEffect(() => {
    const root = rootRef.current;
    const ring = ringRef.current;
    if (!root || !ring) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    document.body.classList.add('has-custom-cursor');
    root.style.setProperty('--cursor-color', defaultColor);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;
    let visible = false;
    let pressed = false;

    const STATES = ['hover', 'text', 'drag', 'video', 'hold'];
    let currentState = '';
    const setState = (state) => {
      if (state === currentState) return;
      STATES.forEach((s) => {
        root.classList.toggle(`cursor--${s}`, s === state);
        ring.classList.toggle(`cursor--${s}`, s === state);
      });
      currentState = state;
    };

    const resolveState = (el) => {
      if (!el) return '';
      const tagged = el.closest('[data-cursor]');
      if (tagged) return tagged.getAttribute('data-cursor') || '';
      if (el.closest('a, button, [role="button"], label, select, summary, [data-hover]')) {
        return 'hover';
      }
      if (el.closest('input, textarea, [contenteditable="true"]')) return 'text';
      return '';
    };

    const resolveColor = (el) => {
      const region = el && el.closest('[data-cursor-color]');
      return region ? region.getAttribute('data-cursor-color') : defaultColor;
    };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        root.classList.remove('cursor--hidden');
        ring.classList.remove('cursor--hidden');
      }
      const el = e.target instanceof Element ? e.target : null;
      // While the button is held, keep the 'hold' state regardless of target.
      if (!pressed) setState(resolveState(el));
      const c = resolveColor(el);
      root.style.setProperty('--cursor-color', c);
      ring.style.setProperty('--cursor-color', c);
    };

    const onDown = () => {
      pressed = true;
      root.classList.add('cursor--hold');
      ring.classList.add('cursor--hold');
    };
    const onUp = () => {
      pressed = false;
      root.classList.remove('cursor--hold');
      ring.classList.remove('cursor--hold');
      const el = document.elementFromPoint(pos.x, pos.y);
      currentState = ''; // force re-apply after release
      setState(resolveState(el));
    };

    const onLeave = () => {
      visible = false;
      root.classList.add('cursor--hidden');
      ring.classList.add('cursor--hidden');
    };
    const onEnter = () => {
      visible = true;
      root.classList.remove('cursor--hidden');
      ring.classList.remove('cursor--hidden');
    };

    // Two eased-follow loops: the dot tracks fast, the ring lags behind — the
    // signature unseen.co "dual ring" trailing feel.
    const slow = { ...target };
    const RING_EASE = 0.14;
    const tick = () => {
      pos.x += (target.x - pos.x) * ease;
      pos.y += (target.y - pos.y) * ease;
      slow.x += (target.x - slow.x) * RING_EASE;
      slow.y += (target.y - slow.y) * RING_EASE;
      root.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      ring.style.transform = `translate3d(${slow.x}px, ${slow.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    root.classList.add('cursor--hidden');
    ring.classList.add('cursor--hidden');
    root.style.setProperty('--cursor-color', defaultColor);
    ring.style.setProperty('--cursor-color', defaultColor);
    raf = requestAnimationFrame(tick);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.body.classList.remove('has-custom-cursor');
    };
  }, [defaultColor, ease]);

  return (
    <>
      {/* OUTER lagging ring + state glyphs (slow follow) */}
      <div className="cursor cursor--ring" ref={ringRef} aria-hidden="true">
        <div className="cursor__wrap">
          <div className="cursor__inner">
            <div className="cursor__circle" />
            <div className="cursor__hold-outer" />

            <div className="cursor__drag">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M14 24H34M14 24l6-6M14 24l6 6M34 24l-6-6M34 24l-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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

      {/* INNER dot (fast follow) */}
      <div className="cursor cursor--dot" ref={rootRef} aria-hidden="true">
        <div className="cursor__wrap">
          <div className="cursor__inner">
            <div className="cursor__dot" />
            <div className="cursor__hold-inner" />
          </div>
        </div>
      </div>
    </>
  );
}
