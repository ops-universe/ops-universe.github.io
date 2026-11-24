import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

type Kind = 'sphere' | 'chip';

interface Spec {
  kind: Kind;
  size: number; // diameter at full scale
  label?: string;
  glow: 1 | 2 | 3;
}

interface Body extends Spec {
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  spawnAt: number;
  live: boolean;
}

const GRAVITY = 2200;
const RESTITUTION = 0.34;
const STEP = 1 / 60;

/** Seeded PRNG so the build-time render and every visit drop the same way. */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function step(bodies: Body[], w: number, h: number, now: number) {
  for (const b of bodies) {
    if (!b.live) {
      if (now >= b.spawnAt) b.live = true;
      else continue;
    }
    b.vy += GRAVITY * STEP;
    b.x += b.vx * STEP;
    b.y += b.vy * STEP;
    b.a += (b.vx * STEP) / b.r;
    if (b.y > h - b.r) {
      b.y = h - b.r;
      b.vy *= -RESTITUTION;
      b.vx *= 0.96;
      if (Math.abs(b.vy) < 30) b.vy = 0;
    }
    if (b.x < b.r) {
      b.x = b.r;
      b.vx = Math.abs(b.vx) * RESTITUTION;
    } else if (b.x > w - b.r) {
      b.x = w - b.r;
      b.vx = -Math.abs(b.vx) * RESTITUTION;
    }
  }
  // Circle–circle contacts, a few relaxation passes for a stable pile.
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < bodies.length; i++) {
      const p = bodies[i]!;
      if (!p.live) continue;
      for (let j = i + 1; j < bodies.length; j++) {
        const q = bodies[j]!;
        if (!q.live) continue;
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const min = p.r + q.r;
        const d2 = dx * dx + dy * dy;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2);
        const nx = dx / d;
        const ny = dy / d;
        const mp = p.r * p.r;
        const mq = q.r * q.r;
        const overlap = (min - d) / (mp + mq);
        p.x -= nx * overlap * mq;
        p.y -= ny * overlap * mq;
        q.x += nx * overlap * mp;
        q.y += ny * overlap * mp;
        const rel = (q.vx - p.vx) * nx + (q.vy - p.vy) * ny;
        if (rel < 0) {
          const imp = (-(1 + RESTITUTION) * rel) / (1 / mp + 1 / mq);
          p.vx -= (imp * nx) / mp;
          p.vy -= (imp * ny) / mp;
          q.vx += (imp * nx) / mq;
          q.vy += (imp * ny) / mq;
        }
      }
    }
  }
}

function makeBodies(specs: Spec[], w: number, scale: number): Body[] {
  const rand = rng(7);
  return specs.map((s, i) => {
    const r = (s.size * scale) / 2;
    return {
      ...s,
      r,
      x: r + rand() * Math.max(1, w - 2 * r),
      y: -r - rand() * 260,
      vx: (rand() - 0.5) * 220,
      vy: 0,
      a: (rand() - 0.5) * 1.2,
      spawnAt: i * 0.085,
      live: false,
    };
  });
}

/**
 * Tastimi-style physics drop: glossy spheres and labelled chips rain into the
 * container, bounce and pile up. The pointer pushes them around and a click pops
 * one into the air. With reduced motion the pile is computed up front and shown
 * at rest.
 */
export function PhysicsDrop({ specs, className }: { specs: Spec[]; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let bodies: Body[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let started = false;
    let clock = 0;
    let quiet = 0;
    let running = false;
    let last = 0;

    const paint = () => {
      bodies.forEach((b, i) => {
        const n = nodes.current[i];
        if (!n) return;
        n.style.width = n.style.height = `${b.r * 2}px`;
        n.style.visibility = b.live ? 'visible' : 'hidden';
        n.style.transform = `translate3d(${b.x - b.r}px, ${b.y - b.r}px, 0) rotate(${b.kind === 'chip' ? b.a : b.a * 0.3}rad)`;
      });
    };

    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - (last || t)) / 1000);
      last = t;
      clock += dt;
      // fixed-step integration
      let acc = dt;
      while (acc > 0) {
        step(bodies, w, h, clock);
        acc -= STEP;
      }
      paint();
      const moving = bodies.some((b) => !b.live || Math.abs(b.vx) > 6 || Math.abs(b.vy) > 6);
      quiet = moving ? 0 : quiet + 1;
      if (quiet > 45) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const wake = () => {
      if (running || !started) return;
      running = true;
      quiet = 0;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const setup = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      const scale = Math.min(1, Math.max(0.55, w / 1100));
      bodies = makeBodies(specs, w, scale);
      if (reduce) {
        bodies.forEach((b) => (b.live = true));
        for (let k = 0; k < 900; k++) step(bodies, w, h, 99);
        bodies.forEach((b) => {
          b.vx = b.vy = 0;
        });
        paint();
      }
    };

    setup();

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting || started || reduce) return;
        started = true;
        wake();
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      if (reduce || !started) return;
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      let touched = false;
      for (const b of bodies) {
        const dx = b.x - px;
        const dy = b.y - py;
        const d = Math.hypot(dx, dy);
        const reach = b.r + 60;
        if (d < reach && d > 0) {
          const f = (1 - d / reach) * 900;
          b.vx += (dx / d) * f * 0.6;
          b.vy += (dy / d) * f - 120;
          touched = true;
        }
      }
      if (touched) wake();
    };
    const onDown = (e: PointerEvent) => {
      if (reduce || !started) return;
      const r = el.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      for (const b of bodies) {
        if (Math.hypot(b.x - px, b.y - py) < b.r) {
          b.vy = -1100;
          b.vx += (Math.random() - 0.5) * 500;
          wake();
          break;
        }
      }
    };
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        cancelAnimationFrame(raf);
        running = false;
        clock = 0;
        setup();
        if (started) {
          bodies.forEach((b) => (b.spawnAt = 0));
          wake();
        }
      }, 200);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, [specs, reduce]);

  return (
    <div ref={box} className={cn('absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {specs.map((s, i) => (
          <div
            key={i}
            ref={(n) => {
              nodes.current[i] = n;
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{ visibility: 'hidden' }}
          >
            {s.kind === 'sphere' ? (
              <span
                className="block h-full w-full rounded-full"
                style={{
                  background: `radial-gradient(circle at 32% 28%, rgb(255 255 255 / 0.95) 0 7%, rgb(var(--glow-${s.glow})) 38%, rgb(var(--glow-${s.glow}) / 0.75) 70%, rgb(var(--ink) / 0.35) 100%)`,
                  boxShadow: `inset -6px -10px 18px rgb(0 0 0 / 0.18), 0 14px 24px -12px rgb(var(--glow-${s.glow}) / 0.8)`,
                }}
              />
            ) : (
              <span
                className="flex h-full w-full items-center justify-center rounded-[30%] border border-white/50 px-1 text-center font-mono text-[11px] font-bold leading-tight text-ink sm:text-xs"
                style={{
                  background: `linear-gradient(150deg, rgb(255 255 255 / 0.92), rgb(var(--glow-${s.glow}) / 0.55))`,
                  boxShadow: `inset 0 -5px 0 rgb(var(--glow-${s.glow}) / 0.7), 0 14px 26px -14px rgb(var(--glow-${s.glow}))`,
                  color: 'rgb(31 29 90)',
                }}
              >
                {s.label}
              </span>
            )}
          </div>
        ))}
    </div>
  );
}

export type { Spec as DropSpec };
