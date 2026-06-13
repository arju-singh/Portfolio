import { useEffect, useRef } from 'react';

/**
 * LiquidCursor — a "liquid mirror" trail that follows the pointer, scoped to a
 * single section (the hero). Modelled on the unseen.co WebGL cursor: a mouse-
 * driven feedback field (the "liquid" smear) read as a normal map and shaded as
 * cool chrome + Fresnel rim (the "mirror" sheen). Subtle by design — it sits as
 * a light film over the hero, so the text underneath stays readable.
 *
 * Self-contained raw WebGL2 (no three.js coupling). Two ping-pong RGBA8 targets
 * hold the field; a sim pass advects + decays + splats at the pointer, a display
 * pass shades it onto the canvas with premultiplied-over blending.
 *
 * Costs nothing off-screen: an IntersectionObserver parks the rAF loop whenever
 * the hero isn't visible. Disables itself on coarse pointers / reduced-motion.
 *
 * Mount it INSIDE the positioned hero section; it fills the section via CSS.
 */
export default function LiquidCursor({ opacity = 1, intensity = 'subtle' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    // ---- tuning ---------------------------------------------------------
    const TUNE = {
      bold:   { radius: 0.085, decay: 0.965, ink: 1.0,  velGain: 10, baseA: 0.16,  fresA: 0.7,  advect: 7 },
      subtle: { radius: 0.06,  decay: 0.94,  ink: 0.85, velGain: 8,  baseA: 0.09,  fresA: 0.45, advect: 6 },
      // smaller splat, shorter-lived trail, much lower opacity — a faint film
      faint:  { radius: 0.038, decay: 0.90,  ink: 0.45, velGain: 6,  baseA: 0.035, fresA: 0.22, advect: 4 },
    }[intensity] || { radius: 0.038, decay: 0.90, ink: 0.45, velGain: 6, baseA: 0.035, fresA: 0.22, advect: 4 };

    // ---- shaders --------------------------------------------------------
    const VERT = `#version 300 es
      in vec2 aPos;
      out vec2 vUv;
      void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`;

    const SIM = `#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 frag;
      uniform sampler2D uPrev;
      uniform vec2 uTexel; uniform vec2 uMouse; uniform vec2 uVel;
      uniform float uAspect, uActive, uRadius, uDecay, uInk, uAdvect, uVelKeep;
      void main(){
        vec4 prev = texture(uPrev, vUv);
        vec2 vel = (prev.rg - 0.5) * 2.0;
        // semi-Lagrangian advection: trace the field back along its velocity
        vec2 advUv = vUv - vel * uTexel * uAdvect;
        vec4 src = texture(uPrev, advUv);
        float ink = src.b * uDecay;
        vec2 carried = (src.rg - 0.5) * uVelKeep;   // velocity momentum (fluid feel)
        vec2 d = vUv - uMouse; d.x *= uAspect;
        float blob = smoothstep(uRadius, 0.0, length(d)) * uActive;
        ink += blob * uInk;
        carried += uVel * blob;
        carried = clamp(carried, -0.5, 0.5);
        frag = vec4(carried * 0.5 + 0.5, clamp(ink, 0.0, 1.0), 1.0);
      }`;

    const DISP = `#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 frag;
      uniform sampler2D uField; uniform vec2 uTexel;
      uniform float uOpacity, uBaseA, uFresA;
      void main(){
        float h = texture(uField, vUv).b;
        if (h <= 0.002) { frag = vec4(0.0); return; }
        float hx = texture(uField, vUv + vec2(uTexel.x,0.0)).b
                 - texture(uField, vUv - vec2(uTexel.x,0.0)).b;
        float hy = texture(uField, vUv + vec2(0.0,uTexel.y)).b
                 - texture(uField, vUv - vec2(0.0,uTexel.y)).b;
        vec3 n = normalize(vec3(-hx, -hy, 0.12));
        float fres = pow(1.0 - max(n.z, 0.0), 3.0);
        vec3 chrome = mix(vec3(0.70,0.78,0.85), vec3(1.0), n.y*0.5+0.5);
        vec3 rim = vec3(0.78,1.0,0.30) * fres * 0.6;           // faint brand-lime rim
        vec3 col = chrome + rim;
        float a = h * (uBaseA + fres * uFresA) * uOpacity;
        frag = vec4(col * a, a);                                // premultiplied
      }`;

    const dedent = (s) => s.split('\n').map((l) => l.trim()).join('\n').trim();
    let glError = false;
    const compile = (type, src) => {
      const s = gl.createShader(type);
      if (!s) { glError = true; return null; }
      gl.shaderSource(s, dedent(src));
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('LiquidCursor shader compile failed:', gl.getShaderInfoLog(s) || '(context lost)');
        gl.deleteShader(s);
        glError = true;
        return null;
      }
      return s;
    };
    const link = (fragSrc) => {
      const vs = compile(gl.VERTEX_SHADER, VERT);
      const fs = compile(gl.FRAGMENT_SHADER, fragSrc);
      if (!vs || !fs) return null;
      const p = gl.createProgram();
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.bindAttribLocation(p, 0, 'aPos');
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { glError = true; return null; }
      return p;
    };
    const simProg = link(SIM);
    const dispProg = link(DISP);
    if (glError || !simProg || !dispProg) {
      // WebGL unusable (unsupported) — disable quietly, no spam, no context loss.
      return;
    }
    const U = (p, names) => names.reduce((o, n) => ((o[n] = gl.getUniformLocation(p, n)), o), {});
    const simU = U(simProg, ['uPrev','uTexel','uMouse','uVel','uAspect','uActive','uRadius','uDecay','uInk','uAdvect','uVelKeep']);
    const dispU = U(dispProg, ['uField','uTexel','uOpacity','uBaseA','uFresA']);

    // fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    // ---- ping-pong targets (created/recreated on resize) ----------------
    let A, B, simW = 0, simH = 0, aspect = 1;
    const makeTarget = (w, h) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    };
    const free = (t) => { if (!t) return; gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fbo); };

    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      aspect = r.width / r.height;
      const ns = Math.max(160, Math.round(canvas.width / 3));
      const nh = Math.max(120, Math.round(canvas.height / 3));
      if (ns !== simW || nh !== simH) {
        simW = ns; simH = nh;
        free(A); free(B);
        A = makeTarget(simW, simH);
        B = makeTarget(simW, simH);
        // clear both
        for (const t of [A, B]) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
          gl.viewport(0, 0, simW, simH);
          gl.clearColor(0.5, 0.5, 0.0, 1.0); // velocity 0 (=.5), ink 0
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
      }
    };

    // ---- pointer --------------------------------------------------------
    // pt.fluidTarget = 1 while the pointer is over a [data-fluid] region
    // (project cards) → the field ramps from a subtle trail into a full
    // velocity-driven fluid there.
    const pt = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, inside: false, hot: 0, fluidTarget: 0, fluid: 0 };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const u = (e.clientX - r.left) / r.width;
      const v = 1 - (e.clientY - r.top) / r.height;
      pt.inside = u >= -0.05 && u <= 1.05 && v >= -0.05 && v <= 1.05;
      pt.x = u; pt.y = v; pt.hot = pt.inside ? 1 : 0;
      // canvas is pointer-events:none, so e.target is the real element underneath
      const el = e.target instanceof Element ? e.target : null;
      pt.fluidTarget = el && el.closest('[data-fluid]') ? 1 : 0;
    };
    const onLeave = () => { pt.inside = false; pt.hot = 0; pt.fluidTarget = 0; };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    // ---- loop -----------------------------------------------------------
    let raf = 0, running = false;
    const draw = () => {
      if (!running) return;
      // ease the fluid factor toward its target (in/out of a project region)
      pt.fluid += (pt.fluidTarget - pt.fluid) * 0.09;
      const f = pt.fluid;

      // boosted params over a fluid region (project / work rows): much more
      // velocity, far longer advection, strong momentum + persistence, bigger/
      // denser splat, much more visible film.
      const velGain = TUNE.velGain * (1 + f * 4.0);
      const radius  = TUNE.radius  * (1 + f * 1.1);
      const ink     = TUNE.ink     * (1 + f * 1.0);
      const advect  = TUNE.advect  * (1 + f * 4.5);
      const decay   = TUNE.decay + (0.995 - TUNE.decay) * f;    // trails linger longer
      const velKeep = 0.95 + (0.996 - 0.95) * f;                // stronger momentum
      const baseA   = TUNE.baseA * (1 + f * 2.6);
      const fresA   = TUNE.fresA * (1 + f * 2.2);

      // velocity in uv space (gained), then advance prev
      let vx = (pt.x - pt.px) * velGain;
      let vy = (pt.y - pt.py) * velGain;
      pt.px = pt.x; pt.py = pt.y;
      const active = pt.hot;

      // --- sim: A -> B ---
      gl.useProgram(simProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, B.fbo);
      gl.viewport(0, 0, simW, simH);
      gl.disable(gl.BLEND);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, A.tex);
      gl.uniform1i(simU.uPrev, 0);
      gl.uniform2f(simU.uTexel, 1 / simW, 1 / simH);
      gl.uniform2f(simU.uMouse, pt.x, pt.y);
      gl.uniform2f(simU.uVel, vx, vy);
      gl.uniform1f(simU.uAspect, aspect);
      gl.uniform1f(simU.uActive, active);
      gl.uniform1f(simU.uRadius, radius);
      gl.uniform1f(simU.uDecay, decay);
      gl.uniform1f(simU.uInk, ink);
      gl.uniform1f(simU.uAdvect, advect);
      gl.uniform1f(simU.uVelKeep, velKeep);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      const tmp = A; A = B; B = tmp; // swap

      // --- display: field -> canvas ---
      gl.useProgram(dispProg);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // premultiplied over
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, A.tex);
      gl.uniform1i(dispU.uField, 0);
      gl.uniform2f(dispU.uTexel, 1 / simW, 1 / simH);
      gl.uniform1f(dispU.uOpacity, opacity);
      gl.uniform1f(dispU.uBaseA, baseA);
      gl.uniform1f(dispU.uFresA, fresA);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      raf = requestAnimationFrame(draw);
    };
    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // park the loop while the hero is off-screen
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      free(A); free(B);
      gl.deleteBuffer(quad);
      gl.deleteProgram(simProg);
      gl.deleteProgram(dispProg);
      // NOTE: do NOT loseContext() here — under React StrictMode the effect
      // re-mounts on the same canvas, and a lost context can't be revived,
      // which would make every shader compile return null on the 2nd mount.
    };
  }, [opacity, intensity]);

  return <canvas ref={canvasRef} className="liquid-cursor" aria-hidden="true" />;
}
