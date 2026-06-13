import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

const SoundCtx = createContext(null);
export const useSound = () => useContext(SoundCtx);

// A tiny generative ambient engine built on the Web Audio API — no audio files.
// A soft pad (two detuned oscillators) + filtered noise, gated behind a master gain.
export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef(null);

  const build = useCallback(() => {
    if (ref.current) return ref.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();

    const master = ctx.createGain();
    master.gain.value = 0;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 128;
    master.connect(analyser);
    analyser.connect(ctx.destination);

    // pad
    const padGain = ctx.createGain();
    padGain.gain.value = 0.16;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 700;
    filter.Q.value = 0.7;
    padGain.connect(filter);
    filter.connect(master);

    const freqs = [110, 164.81, 220];
    const oscs = freqs.flatMap((f) => {
      const a = ctx.createOscillator();
      const b = ctx.createOscillator();
      a.type = 'sine';
      b.type = 'triangle';
      a.frequency.value = f;
      b.frequency.value = f * 1.005;
      a.connect(padGain);
      b.connect(padGain);
      a.start();
      b.start();
      return [a, b];
    });

    // slow LFO on filter cutoff for movement
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.06;
    lfoGain.gain.value = 240;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    ref.current = { ctx, master, oscs, lfo, filter, analyser };
    return ref.current;
  }, []);

  const enable = useCallback(async () => {
    const eng = build();
    if (!eng) return;
    if (eng.ctx.state === 'suspended') await eng.ctx.resume();
    eng.master.gain.cancelScheduledValues(eng.ctx.currentTime);
    eng.master.gain.setTargetAtTime(0.5, eng.ctx.currentTime, 0.6);
    setEnabled(true);
    setReady(true);
  }, [build]);

  const disable = useCallback(() => {
    const eng = ref.current;
    if (!eng) return;
    eng.master.gain.setTargetAtTime(0, eng.ctx.currentTime, 0.4);
    setEnabled(false);
  }, []);

  const toggle = useCallback(() => (enabled ? disable() : enable()), [enabled, enable, disable]);

  // a short UI blip — only when sound is on
  const blip = useCallback((freq = 880) => {
    const eng = ref.current;
    if (!eng || !enabled) return;
    const { ctx, master } = eng;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(master);
    const now = ctx.currentTime;
    g.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    o.start(now);
    o.stop(now + 0.24);
  }, [enabled]);

  useEffect(() => {
    return () => {
      const eng = ref.current;
      if (eng) {
        try {
          eng.oscs.forEach((o) => o.stop());
          eng.lfo.stop();
          eng.ctx.close();
        } catch {
          /* noop */
        }
      }
    };
  }, []);

  return (
    <SoundCtx.Provider value={{ enabled, ready, enable, disable, toggle, blip, engine: ref }}>
      {children}
    </SoundCtx.Provider>
  );
}
