import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '@/lib/cn';

// Isometric projection: x runs down-right, y runs down-left, z is up.
const OX = 215;
const OY = 398;
const COS = 0.866;
const iso = (x: number, y: number, z = 0) => [OX + (x - y) * COS, OY + (x + y) * 0.5 - z] as const;
const pts = (list: (readonly [number, number])[]) => list.map((p) => p.join(',')).join(' ');

const W = 100; // half width of a slab
const T = 16; // slab thickness

export interface StackLayer {
  name: string;
  role: string;
}

function Slab({ index, highlight }: { index: number; highlight: boolean }) {
  const top = pts([iso(-W, -W), iso(W, -W), iso(W, W), iso(-W, W)]);
  const left = pts([iso(-W, W), iso(W, W), iso(W, W, -T), iso(-W, W, -T)]);
  const right = pts([iso(W, -W), iso(W, W), iso(W, W, -T), iso(W, -W, -T)]);
  const inner = pts([iso(-W * 0.72, -W * 0.72), iso(W * 0.72, -W * 0.72), iso(W * 0.72, W * 0.72), iso(-W * 0.72, W * 0.72)]);
  const stroke = highlight ? 'rgb(var(--accent))' : 'rgb(var(--ink) / 0.72)';

  // Per-layer detail on the top face, so each slab reads differently.
  const detail = (() => {
    switch (index) {
      case 0: // standards: ruled document lines
        return [-48, -24, 0, 24, 48].map((y) => <polyline key={y} points={pts([iso(-60, y), iso(60, y)])} className="fill-none" stroke="rgb(var(--ink) / 0.35)" strokeWidth="1" />);
      case 1: // template: allow / review / deny chips
        return [
          [-50, -40, 'accent'],
          [-50, 0, 'warn'],
          [-50, 40, 'danger'],
        ].map(([x, y, tone]) => (
          <polygon
            key={String(y)}
            points={pts([iso(Number(x), Number(y) - 10), iso(Number(x) + 100, Number(y) - 10), iso(Number(x) + 100, Number(y) + 10), iso(Number(x), Number(y) + 10)])}
            fill={`rgb(var(--${tone}) / 0.18)`}
            stroke={`rgb(var(--${tone}))`}
            strokeWidth="1"
          />
        ));
      case 2: // cli: terminal prompt blocks
        return (
          <>
            <polygon points={pts([iso(-55, -55), iso(55, -55), iso(55, 55), iso(-55, 55)])} fill="rgb(var(--ink) / 0.06)" stroke="rgb(var(--ink) / 0.4)" strokeWidth="1" />
            {[-30, -6, 18].map((y, i) => (
              <polyline key={y} points={pts([iso(-40, y), iso(-40 + 30 + i * 18, y)])} className="fill-none" stroke="rgb(var(--signal))" strokeWidth="2" strokeLinecap="round" />
            ))}
          </>
        );
      default: // ui: panels
        return (
          <>
            <polygon points={pts([iso(-60, -60), iso(0, -60), iso(0, 0), iso(-60, 0)])} fill="rgb(var(--accent) / 0.16)" stroke="rgb(var(--accent))" strokeWidth="1" />
            <polygon points={pts([iso(10, -60), iso(60, -60), iso(60, 60), iso(10, 60)])} fill="rgb(var(--glow-2) / 0.18)" stroke="rgb(var(--ink) / 0.45)" strokeWidth="1" />
            <polygon points={pts([iso(-60, 10), iso(0, 10), iso(0, 60), iso(-60, 60)])} fill="rgb(var(--glow-3) / 0.2)" stroke="rgb(var(--ink) / 0.45)" strokeWidth="1" />
          </>
        );
    }
  })();

  return (
    <g strokeLinejoin="round">
      <polygon points={left} fill="rgb(var(--elevated))" stroke={stroke} strokeWidth="1.2" />
      <polygon points={right} fill="rgb(var(--line))" stroke={stroke} strokeWidth="1.2" />
      <polygon points={top} fill="rgb(var(--surface))" stroke={stroke} strokeWidth="1.2" />
      <polygon points={inner} className="fill-none" stroke="rgb(var(--ink) / 0.25)" strokeWidth="1" strokeDasharray="3 4" />
      {detail}
    </g>
  );
}

function Layer({ layer, index, spread }: { layer: StackLayer; index: number; spread: MotionValue<number> }) {
  const y = useTransform(spread, (s) => -index * (20 + 78 * s));
  const [lx, ly] = iso(W, -W);
  return (
    <motion.g style={{ y }}>
      <Slab index={index} highlight={index === 1} />
      {/* leader line + label */}
      <polyline points={`${lx},${ly} ${lx + 34},${ly - 18} ${lx + 52},${ly - 18}`} className="fill-none animate-dash-flow" stroke="rgb(var(--accent) / 0.8)" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx={lx} cy={ly} r="3" fill="rgb(var(--accent))" />
      <text x={lx + 58} y={ly - 21} className="fill-ink font-mono text-[12px] font-bold">
        {layer.name}
      </text>
      <text x={lx + 58} y={ly - 7} className="fill-muted text-[10.5px]">
        {layer.role}
      </text>
    </motion.g>
  );
}

/**
 * Line-art isometric stack of the ecosystem's foundations. Layers sit tight at
 * first and pull apart as the section scrolls into view, with flowing dotted
 * connectors and a packet travelling up through the stack.
 */
export function IsometricStack({ layers, className }: { layers: StackLayer[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const eased = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });
  const spread = useTransform(eased, (v) => (reduce ? 1 : Math.min(1, Math.max(0, v))));
  const packetY = useTransform(spread, (s) => -(layers.length - 1) * (20 + 78 * s));
  const [cx, cy] = iso(0, 0);
  const [sx, sy] = iso(-150, 70);
  const spineEnd = useTransform(packetY, (v) => cy + v - 20);

  return (
    <div ref={ref} className={cn('relative', className)} aria-hidden="true">
      <div className="iso-grid mask-radial absolute inset-0" />
      <svg viewBox="0 0 560 540" className="relative h-full w-full overflow-visible">
        {/* spine: dotted line through the stack centre */}
        <motion.line x1={cx} y1={cy} x2={cx} y2={spineEnd} stroke="rgb(var(--accent) / 0.6)" strokeWidth="1.2" strokeDasharray="2 5" className="animate-dash-flow" />

        {layers.map((l, i) => (
          <Layer key={l.name} layer={l} index={i} spread={spread} />
        ))}

        {/* packet travelling up the spine */}
        {!reduce && (
          <motion.circle
            cx={cx}
            r="4.5"
            fill="rgb(var(--glow-2))"
            style={{ filter: 'drop-shadow(0 0 6px rgb(var(--glow-2)))' }}
            animate={{ cy: [cy + 10, cy - 260], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
          />
        )}

        {/* small server stack, floating beside the main stack */}
        <motion.g animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
          {[0, 1, 2].map((k) => {
            const z = k * 15;
            const w = 22;
            const ox = -150;
            const oy = 70;
            return (
              <g key={k} strokeLinejoin="round">
                <polygon points={pts([iso(ox - w, oy + w, z), iso(ox + w, oy + w, z), iso(ox + w, oy + w, z - 12), iso(ox - w, oy + w, z - 12)])} fill="rgb(var(--elevated))" stroke="rgb(var(--ink) / 0.7)" strokeWidth="1" />
                <polygon points={pts([iso(ox + w, oy - w, z), iso(ox + w, oy + w, z), iso(ox + w, oy + w, z - 12), iso(ox + w, oy - w, z - 12)])} fill="rgb(var(--line))" stroke="rgb(var(--ink) / 0.7)" strokeWidth="1" />
                <polygon points={pts([iso(ox - w, oy - w, z), iso(ox + w, oy - w, z), iso(ox + w, oy + w, z), iso(ox - w, oy + w, z)])} fill="rgb(var(--surface))" stroke="rgb(var(--ink) / 0.7)" strokeWidth="1" />
              </g>
            );
          })}
          <polyline points={`${sx + 20},${sy - 50} ${sx + 60},${sy - 70} ${cx - 120},${cy - 70}`} className="fill-none animate-dash-flow" stroke="rgb(var(--ink) / 0.4)" strokeWidth="1" strokeDasharray="3 4" />
        </motion.g>
      </svg>
    </div>
  );
}
