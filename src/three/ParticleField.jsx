import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Lightweight three.js background: a wave of points + slow drift,
// gently reacting to the pointer. Disposes cleanly on unmount.
export default function ParticleField({ color = '#c8ff4d', density = 1 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // grid of points
    const SIZE = 64;
    const GAP = 0.42;
    const count = SIZE * SIZE;
    const positions = new Float32Array(count * 3);
    const base = new Float32Array(count * 2);
    let i = 0;
    for (let x = 0; x < SIZE; x++) {
      for (let z = 0; z < SIZE; z++) {
        const px = (x - SIZE / 2) * GAP;
        const pz = (z - SIZE / 2) * GAP;
        positions[i * 3] = px;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pz;
        base[i * 2] = px;
        base[i * 2 + 1] = pz;
        i++;
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: new THREE.Color(color),
      size: 0.045 * density,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geom, mat);
    points.rotation.x = -0.9;
    scene.add(points);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);

    const clock = new THREE.Clock();
    let raf;
    const pos = geom.attributes.position.array;

    const render = () => {
      const t = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      if (!reduce) {
        for (let n = 0; n < count; n++) {
          const bx = base[n * 2];
          const bz = base[n * 2 + 1];
          const d = Math.sqrt(bx * bx + bz * bz);
          pos[n * 3 + 1] =
            Math.sin(d * 0.9 - t * 0.9) * 0.42 +
            Math.cos(bx * 0.5 + t * 0.6) * 0.18;
        }
        geom.attributes.position.needsUpdate = true;
      }

      points.rotation.z += 0.0006;
      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.04;
      camera.position.y += (pointer.y * 0.8 + 0.4 - camera.position.y) * 0.04;
      camera.lookAt(0, -0.4, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    render();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', onResize);
      geom.dispose();
      mat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [color, density]);

  return <div ref={mountRef} className="particle-field" aria-hidden="true" />;
}
