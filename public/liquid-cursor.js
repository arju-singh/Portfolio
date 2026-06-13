/*
 * liquid-cursor.js — a portable "liquid mirror" pointer trail. Raw WebGL2,
 * zero dependencies, works on ANY website (plain HTML, React, Vue, WordPress…).
 *
 * It runs a tiny fluid simulation (ping-pong textures: advect + decay + splat
 * at the pointer) and shades the field as chrome + a Fresnel rim — the wet,
 * "liquid water" look that follows your cursor.
 *
 * ── Plain HTML ────────────────────────────────────────────────────────────
 *   <script type="module">
 *     import { initLiquidCursor } from '/liquid-cursor.js';
 *     initLiquidCursor();                       // full-viewport overlay
 *     // or scope it to one element:
 *     // initLiquidCursor({ target: document.querySelector('.hero') });
 *   </script>
 *
 * ── No-module / classic <script> ─────────────────────────────────────────
 *   <script src="/liquid-cursor.js"></script>
 *   <script>window.initLiquidCursor({ intensity: 'bold' });</script>
 *
 * ── React (drop-in effect) ────────────────────────────────────────────────
 *   useEffect(() => initLiquidCursor(), []);    // returns the cleanup fn
 *
 * Options: { target=document.body, intensity='subtle'|'bold', opacity=1,
 *            rimColor=[0.78,1.0,0.30] }   // rim RGB in 0..1
 * Returns: a destroy() function — call it to remove everything.
 */
export function initLiquidCursor(opts = {}) {
  const {
    target = document.body,
    intensity = 'subtle',
    opacity = 1,
    rimColor = [0.78, 1.0, 0.3],
  } = opts;

  // Respect device limits — bail to no-op on touch / reduced-motion / no WebGL2.
  const fine = window.matchMedia('(pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return () => {};

  const scoped = target !== document.body && target !== document.documentElement;

  // ---- canvas ----------------------------------------------------------
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: scoped ? 'absolute' : 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    zIndex: '9000',
    pointerEvents: 'none',
    display: 'block',
  });
  if (scoped && getComputedStyle(target).position === 'static') {
    target.style.position = 'relative';
  }
  target.appendChild(canvas);

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) {
    canvas.remove();
    return () => {};
  }

  const TUNE =
    intensity === 'bold'
      ? { radius: 0.085, decay: 0.965, ink: 1.0, velGain: 10, baseA: 0.16, fresA: 0.7, advect: 7 }
      : { radius: 0.06, decay: 0.94, ink: 0.85, velGain: 8, baseA: 0.09, fresA: 0.45, advect: 6 };

  // ---- shaders ---------------------------------------------------------
  const VERT = `#version 300 es
    in vec2 aPos; out vec2 vUv;
    void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

  const SIM = `#version 300 es
    precision highp float;
    in vec2 vUv; out vec4 frag;
    uniform sampler2D uPrev;
    uniform vec2 uTexel, uMouse, uVel;
    uniform float uAspect, uActive, uRadius, uDecay, uInk, uAdvect;
    void main(){
      vec4 prev = texture(uPrev, vUv);
      vec2 vel = (prev.rg - 0.5) * 2.0;
      vec2 advUv = vUv - vel * uTexel * uAdvect;
      vec4 src = texture(uPrev, advUv);
      float ink = src.b * uDecay;
      vec2 carried = (src.rg - 0.5) * (uDecay * 0.96);
      vec2 d = vUv - uMouse; d.x *= uAspect;
      float blob = smoothstep(uRadius, 0.0, length(d)) * uActive;
      ink += blob * uInk;
      carried += uVel * blob;
      carried = clamp(carried, -0.5, 0.5);
      frag = vec4(carried*0.5+0.5, clamp(ink,0.0,1.0), 1.0);
    }`;

  const DISP = `#version 300 es
    precision highp float;
    in vec2 vUv; out vec4 frag;
    uniform sampler2D uField; uniform vec2 uTexel;
    uniform float uOpacity, uBaseA, uFresA; uniform vec3 uRim;
    void main(){
      float h = texture(uField, vUv).b;
      if (h <= 0.002) { frag = vec4(0.0); return; }
      float hx = texture(uField, vUv+vec2(uTexel.x,0.0)).b - texture(uField, vUv-vec2(uTexel.x,0.0)).b;
      float hy = texture(uField, vUv+vec2(0.0,uTexel.y)).b - texture(uField, vUv-vec2(0.0,uTexel.y)).b;
      vec3 n = normalize(vec3(-hx, -hy, 0.12));
      float fres = pow(1.0 - max(n.z, 0.0), 3.0);
      vec3 chrome = mix(vec3(0.70,0.78,0.85), vec3(1.0), n.y*0.5+0.5);
      vec3 rim = uRim * fres * 0.6;
      vec3 col = chrome + rim;
      float a = h * (uBaseA + fres*uFresA) * uOpacity;
      frag = vec4(col*a, a);
    }`;

  const dedent = (s) => s.split('\n').map((l) => l.trim()).join('\n').trim();
  let glError = false;
  const compile = (type, src) => {
    const s = gl.createShader(type);
    if (!s) { glError = true; return null; }
    gl.shaderSource(s, dedent(src));
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('liquid-cursor shader failed:', gl.getShaderInfoLog(s));
      glError = true; return null;
    }
    return s;
  };
  const linkProg = (frag) => {
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.bindAttribLocation(p, 0, 'aPos');
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { glError = true; return null; }
    return p;
  };
  const simProg = linkProg(SIM);
  const dispProg = linkProg(DISP);
  if (glError || !simProg || !dispProg) { canvas.remove(); return () => {}; }

  const U = (p, names) => names.reduce((o, n) => ((o[n] = gl.getUniformLocation(p, n)), o), {});
  const simU = U(simProg, ['uPrev','uTexel','uMouse','uVel','uAspect','uActive','uRadius','uDecay','uInk','uAdvect']);
  const dispU = U(dispProg, ['uField','uTexel','uOpacity','uBaseA','uFresA','uRim']);

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // ---- ping-pong targets ----------------------------------------------
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

  const resize = () => {
    const r = canvas.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      for (const t of [A, B]) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
        gl.viewport(0, 0, simW, simH);
        gl.clearColor(0.5, 0.5, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    }
  };

  // ---- pointer ---------------------------------------------------------
  const pt = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, hot: 0 };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const u = (e.clientX - r.left) / r.width;
    const v = 1 - (e.clientY - r.top) / r.height;
    const inside = u >= -0.05 && u <= 1.05 && v >= -0.05 && v <= 1.05;
    pt.x = u; pt.y = v; pt.hot = inside ? 1 : 0;
  };
  const onLeave = () => { pt.hot = 0; };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);

  // ---- loop ------------------------------------------------------------
  let raf = 0, running = false;
  const draw = () => {
    if (!running) return;
    const vx = (pt.x - pt.px) * TUNE.velGain;
    const vy = (pt.y - pt.py) * TUNE.velGain;
    pt.px = pt.x; pt.py = pt.y;

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
    gl.uniform1f(simU.uActive, pt.hot);
    gl.uniform1f(simU.uRadius, TUNE.radius);
    gl.uniform1f(simU.uDecay, TUNE.decay);
    gl.uniform1f(simU.uInk, TUNE.ink);
    gl.uniform1f(simU.uAdvect, TUNE.advect);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    const tmp = A; A = B; B = tmp;

    gl.useProgram(dispProg);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(dispU.uField, 0);
    gl.uniform2f(dispU.uTexel, 1 / simW, 1 / simH);
    gl.uniform1f(dispU.uOpacity, opacity);
    gl.uniform1f(dispU.uBaseA, TUNE.baseA);
    gl.uniform1f(dispU.uFresA, TUNE.fresA);
    gl.uniform3f(dispU.uRim, rimColor[0], rimColor[1], rimColor[2]);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    raf = requestAnimationFrame(draw);
  };
  const start = () => { if (!running) { running = true; raf = requestAnimationFrame(draw); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0 });
  io.observe(canvas);

  // ---- destroy ---------------------------------------------------------
  return function destroy() {
    stop();
    ro.disconnect();
    io.disconnect();
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
    free(A); free(B);
    gl.deleteBuffer(quad);
    gl.deleteProgram(simProg);
    gl.deleteProgram(dispProg);
    canvas.remove();
  };
}

// Also expose globally for classic <script> tags (no module/build step).
if (typeof window !== 'undefined') window.initLiquidCursor = initLiquidCursor;
