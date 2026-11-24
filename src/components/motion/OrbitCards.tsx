import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { cn } from '@/lib/cn';

export interface OrbitItem {
  icon: LucideIcon;
  title: string;
  sub: string;
  tone: 'accent' | 'warn' | 'danger' | 'signal';
}

const TONES = {
  accent: 'text-accent bg-accent/12',
  warn: 'text-warn bg-warn/12',
  danger: 'text-danger bg-danger/12',
  signal: 'text-signal bg-signal/12',
} as const;

function OrbitCard({ item, index, count, angle }: { item: OrbitItem; index: number; count: number; angle: MotionValue<number> }) {
  const offset = (index / count) * Math.PI * 2;
  // Position on a flattened ellipse; depth (sin) drives scale, layering, blur and fade.
  const left = useTransform(angle, (a) => `${50 + Math.cos(a + offset) * 38}%`);
  const top = useTransform(angle, (a) => `${50 + Math.sin(a + offset) * 15}%`);
  const depth = useTransform(angle, (a) => (Math.sin(a + offset) + 1) / 2);
  const scale = useTransform(depth, [0, 1], [0.72, 1.04]);
  const opacity = useTransform(depth, [0, 0.35, 1], [0.35, 0.75, 1]);
  const zIndex = useTransform(depth, (d) => (d > 0.45 ? 30 : 1));
  const filter = useTransform(depth, (d) => `blur(${Math.max(0, (0.45 - d) * 6).toFixed(2)}px)`);

  return (
    <motion.div className="absolute" style={{ left, top, zIndex }}>
      <div className="-translate-x-1/2 -translate-y-1/2 scale-[0.78] sm:scale-100">
      <motion.div className="glass-card whitespace-nowrap rounded-2xl px-3 py-2.5 sm:px-3.5 sm:py-3" style={{ scale, opacity, filter }}>
        <div className="flex items-center gap-2.5">
          <span className={cn('grid h-8 w-8 place-items-center rounded-xl', TONES[item.tone])}>
            <item.icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[13px] font-bold leading-tight text-ink">{item.title}</span>
            <span className="block font-mono text-[10.5px] leading-tight text-muted">{item.sub}</span>
          </span>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Glass cards orbiting a centre on a tilted 3D ring. Cards passing behind the
 * centre shrink, blur and drop beneath it. Hover pauses the orbit.
 */
export function OrbitCards({ items, className }: { items: OrbitItem[]; className?: string }) {
  const reduce = useReducedMotion();
  const angle = useMotionValue(0.35);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce || paused.current) return;
    angle.set(angle.get() + delta * 0.00018);
  });

  return (
    <div
      className={cn('pointer-events-auto absolute inset-0 -rotate-[8deg]', className)}
      onPointerEnter={() => {
        paused.current = true;
      }}
      onPointerLeave={() => {
        paused.current = false;
      }}
    >
      {/* the ring itself */}
      <div className="absolute left-[12%] right-[12%] top-1/2 h-[30%] -translate-y-1/2 rounded-[50%] border border-dashed border-accent/25" aria-hidden="true" />
      {items.map((item, i) => (
        <OrbitCard key={item.title} item={item} index={i} count={items.length} angle={angle} />
      ))}
    </div>
  );
}

/** Slowly rotating circular text badge with a mark in the middle. */
export function SpinningBadge({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn('relative grid h-24 w-24 place-items-center', className)} aria-hidden="true">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text className="fill-ink font-mono text-[8.4px] uppercase tracking-[0.28em]">
          <textPath href="#badge-circle">{text}</textPath>
        </text>
      </svg>
      <span className="glass-card grid h-11 w-11 place-items-center rounded-full">
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-accent">
          <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" />
        </svg>
      </span>
    </div>
  );
}
