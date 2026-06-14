import { useEffect, useRef } from 'react';

/**
 * AvatarLiquid — renders a portrait into a WebGL2 canvas with a continuous
 * "liquid mirror" treatment: a domain-warped UV ripple (the liquid) plus a
 * sweeping brand-tinted specular band (the mirror sheen). Intensifies on hover.
 *
 * Same visual language as the hero LiquidCursor, shrunk to an avatar. Falls back
 * to a plain <img> on reduced-motion or when WebGL2 is unavailable.
 */
export default function AvatarLiquid({ src, alt = '', className = '' }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return; // plain <img> fallback stays visible

    const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: true });
    if (!gl) return;

    const VERT = `#version 300 es
      in vec2 aPos; out vec2 vUv;
      void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;
    const FRAG = `#version 300 es
      precision highp float;
      in vec2 vUv; out vec4 frag;
      uniform sampler2D uTex; uniform float uTime; uniform float uHover;
      void main(){
        vec2 uv = vUv;
        float amp = 0.022 + uHover*0.030;
        float t = uTime;
        uv.x += sin(uv.y*10.0 + t*1.5) * amp;
        uv.y += cos(uv.x*12.0 - t*1.3) * amp;
        uv += amp*0.7*vec2(sin(uv.y*22.0 - t*2.2), cos(uv.x*20.0 + t*1.9));
        vec3 col = texture(uTex, clamp(uv,0.0,1.0)).rgb;
        // moving mirror band (two sweeps for a livelier chrome)
        float band = sin((vUv.x + vUv.y)*3.14159 - t*1.1);
        float band2 = sin((vUv.x - vUv.y)*3.14159*1.6 + t*0.7);
        float sheen = (smoothstep(0.62, 1.0, band) + smoothstep(0.78, 1.0, band2)*0.6)
                      * (0.34 + uHover*0.55);
        col += sheen * vec3(0.78,1.0,0.30);
        col = mix(col, col*vec3(0.82,0.93,1.10), 0.28);   // stronger chrome cast
        float d = distance(vUv, vec2(0.5));
        float a = smoothstep(0.5, 0.47, d);               // clean round edge
        frag = vec4(col*a, a);                            // premultiplied
      }`;

    const sh = (type, s) => { const o = gl.createShader(type); gl.shaderSource(o, s.replace(/^\s+/gm,'')); gl.compileShader(o); return o; };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uHover = gl.getUniformLocation(prog, 'uHover');

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

    // The <img> stays visible as the base layer (instant paint + guaranteed
    // fallback). The canvas draws the liquid version directly over it, so even
    // if WebGL/texture upload fails the plain photo is always shown.
    let ready = false;
    let disposed = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      // The image can finish loading after the effect cleanup already deleted
      // the texture (e.g. StrictMode unmount). Bail out so we don't touch a
      // deleted GL object.
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      ready = true;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(r.width * dpr));
      const h = Math.max(1, Math.round(r.height * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    let hover = 0, hoverTarget = 0;
    const onEnter = () => (hoverTarget = 1);
    const onLeave = () => (hoverTarget = 0);
    canvas.addEventListener('pointerenter', onEnter);
    canvas.addEventListener('pointerleave', onLeave);

    let raf = 0, start = 0;
    const tick = (now) => {
      if (!start) start = now;
      resize();
      hover += (hoverTarget - hover) * 0.08;
      gl.useProgram(prog);
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform1f(uHover, hover);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (ready) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => { document.hidden ? cancelAnimationFrame(raf) : (raf = requestAnimationFrame(tick)); };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      disposed = true;
      img.onload = null;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('pointerenter', onEnter);
      canvas.removeEventListener('pointerleave', onLeave);
      gl.deleteTexture(tex); gl.deleteBuffer(quad); gl.deleteProgram(prog);
      // No loseContext() — StrictMode re-mounts on the same canvas; a lost
      // context can't be restored and would break the 2nd mount.
    };
  }, [src]);

  return (
    <span className={`avatar-liquid ${className}`}>
      {/* plain image: instant paint + fallback; canvas fades over it once ready */}
      <img ref={imgRef} src={src} alt={alt} className="avatar-liquid__img" loading="eager" />
      <canvas ref={canvasRef} className="avatar-liquid__canvas" aria-hidden="true" />
    </span>
  );
}
