import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';

const FACES: { key: string; transform: (h: number) => string; glow: string }[] = [
  { key: 'front', transform: (h) => `translateZ(${h}px)`, glow: 'var(--glow-3)' },
  { key: 'back', transform: (h) => `rotateY(180deg) translateZ(${h}px)`, glow: 'var(--glow-2)' },
  { key: 'right', transform: (h) => `rotateY(90deg) translateZ(${h}px)`, glow: 'var(--glow-1)' },
  { key: 'left', transform: (h) => `rotateY(-90deg) translateZ(${h}px)`, glow: 'var(--glow-2)' },
  { key: 'top', transform: (h) => `rotateX(90deg) translateZ(${h}px)`, glow: 'var(--glow-1)' },
  { key: 'bottom', transform: (h) => `rotateX(-90deg) translateZ(${h}px)`, glow: 'var(--glow-3)' },
];

function Cube({ size, icon: Icon, spin, delay }: { size: number; icon: LucideIcon; spin: number; delay: number }) {
  const reduce = useReducedMotion();
  const h = size / 2;
  return (
    <motion.div
      className="relative [transform-style:preserve-3d]"
      style={{ width: size, height: size }}
      initial={{ rotateX: -24, rotateY: 35 + delay * 40 }}
      animate={reduce ? undefined : { rotateX: [-24, -34, -24], rotateY: [35 + delay * 40, 395 + delay * 40] }}
      transition={{ duration: spin, repeat: Infinity, ease: 'linear', rotateX: { duration: spin / 2, repeat: Infinity, ease: 'easeInOut' } }}
    >
      {FACES.map((f) => (
        <div
          key={f.key}
          className="absolute inset-0 grid place-items-center rounded-[14%] border border-white/25 [backface-visibility:visible]"
          style={
            {
              transform: f.transform(h),
              background:
                'radial-gradient(circle at 30% 25%, rgb(255 255 255 / 0.45), transparent 55%), linear-gradient(145deg, rgb(255 255 255 / 0.22), rgb(255 255 255 / 0.03) 60%), repeating-radial-gradient(circle at 50% 50%, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 5px)',
              boxShadow: `inset 0 -4px 0 rgb(${f.glow} / 0.95), inset 0 -18px 30px -8px rgb(${f.glow} / 0.65), inset 0 0 22px rgb(255 255 255 / 0.08)`,
            } as CSSProperties
          }
        >
          {f.key === 'front' && <Icon className="h-[34%] w-[34%] text-white/90 drop-shadow-[0_0_8px_rgb(255_255_255/0.6)]" aria-hidden="true" />}
        </div>
      ))}
    </motion.div>
  );
}

interface CubeSpec {
  icon: LucideIcon;
  x: string;
  y: string;
  size: number;
  depth: number;
  spin: number;
}

/**
 * A cluster of glassy 3D cubes with neon edges, floating at different depths.
 * The scene leans toward the pointer; each cube bobs on its own rhythm.
 */
export function GlassCubes({ cubes, className }: { cubes: CubeSpec[]; className?: string }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);

  return (
    <div
      className={cn('relative [perspective:1100px]', className)}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      aria-hidden="true"
    >
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX, rotateY }}>
        {cubes.map((c, i) => (
          <motion.div
            key={i}
            className="absolute [transform-style:preserve-3d]"
            style={{ left: c.x, top: c.y, z: c.depth }}
            animate={reduce ? undefined : { y: [0, -14 - i * 3, 0] }}
            transition={{ duration: 5 + i * 0.9, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          >
            <Cube size={c.size} icon={c.icon} spin={c.spin} delay={i} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
