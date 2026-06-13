import { useEffect } from 'react';

/**
 * LiquidText — warps the REAL text inside a [data-fluid] region as the cursor
 * moves over it, so the content itself ripples like it's under the liquid.
 *
 * DOM text can't be fed cheaply into the WebGL fluid, so this distorts the
 * actual rendered text with an SVG displacement filter (feTurbulence drives a
 * flowing noise map; feDisplacementMap bends SourceGraphic by it). The bend
 * `scale` is driven by cursor VELOCITY over the region — it surges while you
 * move and eases back to ~0 (crisp, readable) when you stop. Pairs with the
 * WebGL LiquidCursor sheen on top for a combined "liquid text" effect.
 *
 * Renders a hidden <svg> holding the filter, plus a pointer controller that
 * toggles `.is-warping` on the hovered region and animates the filter scale.
 * Disabled on coarse pointers / reduced-motion.
 */
export default function LiquidText() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const disp = document.getElementById('liquidText-disp'); // feDisplacementMap
    if (!disp) return;

    let current = null; // region element currently carrying .is-warping
    const pt = { x: 0, y: 0, px: 0, py: 0 };
    let scale = 0;

    const onMove = (e) => {
      pt.x = e.clientX; pt.y = e.clientY;
      const el = e.target instanceof Element ? e.target.closest('[data-fluid]') : null;
      if (el !== current) {
        if (current) current.classList.remove('is-warping');
        if (el) el.classList.add('is-warping');
        current = el;
      }
    };
    const onLeave = () => {
      if (current) { current.classList.remove('is-warping'); current = null; }
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    let raf = 0;
    const tick = () => {
      const vx = pt.x - pt.px, vy = pt.y - pt.py;
      pt.px = pt.x; pt.py = pt.y;
      const speed = Math.min(Math.hypot(vx, vy), 60);
      // gentle baseline ripple while hovering + a strong surge with velocity
      const target = current ? Math.min(2.5 + speed * 0.85, 26) : 0;
      scale += (target - scale) * 0.12;
      disp.setAttribute('scale', scale.toFixed(2));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
      if (current) current.classList.remove('is-warping');
    };
  }, []);

  return (
    <svg className="liquid-text-defs" aria-hidden="true" width="0" height="0">
      <defs>
        <filter id="liquidText" x="-25%" y="-25%" width="150%" height="150%" colorInterpolationFilters="sRGB">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.016"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              dur="16s"
              values="0.011 0.016; 0.018 0.011; 0.011 0.016"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            id="liquidText-disp"
            in="SourceGraphic"
            in2="noise"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
