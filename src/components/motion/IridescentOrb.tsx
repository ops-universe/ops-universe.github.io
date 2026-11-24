import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { observeTheme, readToken, useVisibleLoop } from '@/hooks/useCanvasLoop';

interface Pt {
  x: number;
  y: number;
  z: number;
}

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function fibonacciSphere(n: number): Pt[] {
  const pts: Pt[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const a = golden * i;
    pts.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r });
  }
  return pts;
}

const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + ((b[i] ?? 0) - v) * t));

/**
 * The hero "policy core": a morphing particle sphere with an iridescent, glassy
 * centre. Points ride a few layered sine waves so the silhouette breathes; the
 * sphere follows the pointer slightly. Colours come from the active palette.
 */
export function IridescentOrb({ className }: { className?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reduce = !!useReducedMotion();
  const state = useRef({ w: 0, h: 0, dpr: 1, pts: [] as Pt[], colors: [[110, 200, 255], [140, 110, 255], [244, 150, 214]], tiltX: 0, tiltY: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const c = canvas.current;
    const el = wrap.current;
    if (!c || !el) return;
    const s = state.current;
    const readColors = () => {
      s.colors = ['glow-3', 'glow-1', 'glow-2'].map((n) => readToken(n).split(',').map(Number));
    };
    const resize = () => {
      const r = el.getBoundingClientRect();
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.w = r.width;
      s.h = r.height;
      c.width = r.width * s.dpr;
      c.height = r.height * s.dpr;
      s.pts = fibonacciSphere(r.width < 420 ? 900 : 1700);
    };
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      s.targetY = ((e.clientX - r.left) / r.width - 0.5) * 0.9;
      s.targetX = ((e.clientY - r.top) / r.height - 0.5) * -0.6;
    };
    readColors();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const stop = observeTheme(readColors);
    window.addEventListener('pointermove', onPointer, { passive: true });
    return () => {
      ro.disconnect();
      stop();
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);

  useVisibleLoop(
    wrap,
    (time) => {
      const c = canvas.current;
      const ctx = c?.getContext('2d');
      const s = state.current;
      if (!c || !ctx || !s.w) return;
      const t = reduce ? 1.2 : time / 1000;
      s.tiltX += (s.targetX - s.tiltX) * 0.04;
      s.tiltY += (s.targetY - s.tiltY) * 0.04;

      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);
      const cx = s.w / 2;
      const cy = s.h / 2;
      const R = Math.min(s.w, s.h) * 0.34;
      const rotY = t * 0.18 + s.tiltY;
      const rotX = 0.35 + s.tiltX;
      const [cyA = [], vio = [], pink = []] = s.colors;
      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);
      const sinX = Math.sin(rotX);
      const cosX = Math.cos(rotX);

      for (const p of s.pts) {
        // Breathing displacement: three layered waves give an organic, blobby silhouette.
        const d =
          1 +
          0.13 * Math.sin(p.x * 3.1 + t * 0.9) * Math.cos(p.y * 2.7 - t * 0.7) +
          0.07 * Math.sin(p.z * 5.3 + t * 1.3) +
          0.05 * Math.sin((p.x + p.y) * 7 - t * 1.6);
        let x = p.x * d;
        let y = p.y * d;
        let z = p.z * d;
        // rotate Y then X
        const x1 = x * cosY - z * sinY;
        const z1 = x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        x = x1;
        y = y1;
        z = z2;
        const persp = 2.6 / (2.6 - z);
        const sx = cx + x * R * persp;
        const sy = cy + y * R * persp;
        const depth = (z + 1.2) / 2.4; // 0 back → 1 front
        const hue = (Math.atan2(y, x) / Math.PI + 1) / 2;
        const col = hue < 0.5 ? mix(cyA, vio, hue * 2) : mix(vio, pink, (hue - 0.5) * 2);
        const alpha = 0.12 + depth * 0.7;
        const size = (0.6 + depth * 1.3) * persp;
        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${alpha.toFixed(3)})`;
        ctx.fillRect(sx, sy, size, size);
      }
    },
    reduce,
  );

  return (
    <div ref={wrap} className={className ?? 'relative'} aria-hidden="true">
      {/* Glassy core: layered gradients with a slowly morphing outline */}
      <div className="absolute inset-[24%] animate-[morph_14s_ease-in-out_infinite] rounded-[42%_58%_55%_45%/48%_42%_58%_52%] bg-[radial-gradient(circle_at_35%_30%,rgb(255_255_255/0.95),rgb(var(--glow-3)/0.85)_28%,rgb(var(--glow-1)/0.75)_62%,rgb(var(--glow-2)/0.7))] opacity-80 blur-[6px]" />
      <div className="absolute inset-[18%] animate-[morph_18s_ease-in-out_infinite_reverse] rounded-[55%_45%_48%_52%/52%_58%_42%_48%] bg-[conic-gradient(from_120deg,rgb(var(--glow-2)/0.5),rgb(var(--glow-3)/0.45),rgb(var(--glow-1)/0.5),rgb(var(--glow-2)/0.5))] opacity-60 mix-blend-soft-light blur-2xl" />
      <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgb(var(--glow-1)/0.35),transparent_65%)] blur-3xl" />
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
