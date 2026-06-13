import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { useSound } from '../hooks/SoundContext';
import './Sound.css';

// Pentatonic-ish pad — friendly intervals so any combination sounds nice.
const NOTES = [
  { label: 'C', freq: 261.63 },
  { label: 'D', freq: 293.66 },
  { label: 'E', freq: 329.63 },
  { label: 'G', freq: 392.0 },
  { label: 'A', freq: 440.0 },
  { label: 'C↑', freq: 523.25 },
  { label: 'D↑', freq: 587.33 },
  { label: 'E↑', freq: 659.25 }
];

export default function Sound() {
  const { enabled, enable, disable, toggle, blip, engine } = useSound();
  const canvasRef = useRef(null);

  // Live analyser visualizer.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const analyser = engine.current?.analyser;
      let data;
      if (analyser && enabled) {
        data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
      }

      const bars = 48;
      const gap = 4 * dpr;
      const bw = (w - gap * (bars - 1)) / bars;
      const t = performance.now() / 1000;

      for (let i = 0; i < bars; i++) {
        let v;
        if (data) {
          v = data[Math.floor((i / bars) * data.length)] / 255;
        } else {
          // gentle idle waveform when muted
          v = (Math.sin(i * 0.5 + t) * 0.5 + 0.5) * 0.12 + 0.02;
        }
        const bh = Math.max(2 * dpr, v * h * 0.9);
        const x = i * (bw + gap);
        const y = (h - bh) / 2;
        ctx.fillStyle = enabled
          ? `rgba(200, 255, 77, ${0.35 + v * 0.65})`
          : 'rgba(255,255,255,0.12)';
        ctx.fillRect(x, y, bw, bh);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [enabled, engine]);

  return (
    <div className="soundpage">
      <PageHero
        index="03"
        eyebrow="Sound"
        title="Listen"
        lead="The whole site has a generative ambient layer — built live in the browser with the Web Audio API, no audio files. Turn it on, then play the pad below."
      />

      <section className="section">
        <div className="wrap">
          <motion.div
            className="sound-stage"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <canvas ref={canvasRef} className="sound-viz" aria-hidden="true" />

            <div className="sound-stage__controls">
              <button
                className={`sound-orb ${enabled ? 'is-on' : ''}`}
                onClick={toggle}
                aria-pressed={enabled}
                data-hover
              >
                <span className="sound-orb__icon">{enabled ? '❚❚' : '▶'}</span>
                <span className="sound-orb__label">{enabled ? 'Pause ambient' : 'Play ambient'}</span>
              </button>
              <p className="sound-stage__hint">
                {enabled
                  ? 'Ambient drone playing — a detuned pad through a moving low-pass filter.'
                  : 'Audio is generated on demand. Nothing autoplays.'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLAYABLE PAD */}
      <section className="section soundpage__pad-section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <Reveal><p className="eyebrow">Play</p></Reveal>
              <Reveal delay={0.05}><h2>Tap the pad</h2></Reveal>
            </div>
            <Reveal delay={0.1}>
              <p>A pentatonic pad — every key is consonant, so it always sounds good. Turn sound on first.</p>
            </Reveal>
          </div>

          <div className="sound-pad">
            {NOTES.map((n, i) => (
              <button
                key={n.label}
                className="sound-key"
                style={{ '--i': i }}
                onPointerDown={() => {
                  if (!enabled) enable();
                  blip(n.freq);
                }}
                data-hover
              >
                <span>{n.label}</span>
                <i className="sound-key__hz">{Math.round(n.freq)} Hz</i>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section soundpage__how">
        <div className="wrap soundpage__how-grid">
          {[
            { k: 'Pad', v: 'Three detuned sine/triangle voices stacked for a warm drone.' },
            { k: 'Filter', v: 'A low-pass cutoff swept by a slow 0.06 Hz LFO for motion.' },
            { k: 'Gate', v: 'A master gain ramps in and out — no clicks, no autoplay.' },
            { k: 'Analyser', v: 'An FFT node feeds the live bar visualizer you see above.' }
          ].map((item, i) => (
            <Reveal key={item.k} delay={i * 0.06} className="soundpage__how-card">
              <span className="soundpage__how-k">{item.k}</span>
              <p>{item.v}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
