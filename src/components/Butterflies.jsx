import { useMemo } from 'react';
import './Butterflies.css';

// Ambient animated butterflies that drift across the background.
// Pure CSS/SVG — no canvas, no three.js — so it's cheap to keep mounted.
// Each butterfly flaps its wings and floats along a looping diagonal path.
// `accent` tints the wings; `count` sets how many; respects reduced-motion
// (the float/flap animations are disabled globally via global.css).
export default function Butterflies({ count = 14, accent = '#c8ff4d' }) {
  // Deterministic-ish spread so they don't clump. Computed once per mount.
  const flies = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const r = (n) => {
        // simple seeded pseudo-random from index so layout is stable per mount
        const s = Math.sin((i + 1) * (n + 1) * 12.9898) * 43758.5453;
        return s - Math.floor(s);
      };
      const depth = r(1); // 0 = far (small, blurred, dim), 1 = near
      return {
        id: i,
        left: `${Math.round(r(2) * 100)}%`,
        top: `${Math.round(r(3) * 100)}%`,
        scale: 0.45 + depth * 0.85,
        opacity: 0.18 + depth * 0.5,
        blur: (1 - depth) * 2.2,
        duration: 16 + r(4) * 22, // float loop length
        delay: -(r(5) * 30), // negative so they start mid-flight
        flap: 0.45 + r(6) * 0.5, // wing-flap speed
        driftX: (r(7) - 0.5) * 60, // vw travelled
        driftY: (r(8) - 0.5) * 40, // vh travelled
        hue: r(9) > 0.6 ? 'var(--bfly-accent-2)' : 'var(--bfly-accent)'
      };
    });
  }, [count]);

  return (
    <div
      className="butterflies"
      aria-hidden="true"
      style={{ '--bfly-accent': accent, '--bfly-accent-2': '#93c5fd' }}
    >
      {flies.map((f) => (
        <span
          key={f.id}
          className="bfly"
          style={{
            left: f.left,
            top: f.top,
            opacity: f.opacity,
            filter: `blur(${f.blur}px)`,
            '--scale': f.scale,
            '--dur': `${f.duration}s`,
            '--delay': `${f.delay}s`,
            '--flap': `${f.flap}s`,
            '--dx': `${f.driftX}vw`,
            '--dy': `${f.driftY}vh`,
            '--wing': f.hue
          }}
        >
          <span className="bfly__inner">
            <span className="bfly__wing bfly__wing--l" />
            <span className="bfly__wing bfly__wing--r" />
            <span className="bfly__body" />
          </span>
        </span>
      ))}
    </div>
  );
}
