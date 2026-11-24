import { motion, useReducedMotion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

/**
 * SIMULATED telemetry. Values are random-walk synthetic data generated in the
 * browser to illustrate what a governed-automation dashboard could show.
 * They do not describe any real system and are labelled as such in the UI.
 */
const POINTS = 32;
const walk = (prev: number, lo: number, hi: number, step: number) => Math.min(hi, Math.max(lo, prev + (Math.random() - 0.5) * step));
const seed = (lo: number, hi: number) => Array.from({ length: POINTS }, () => lo + Math.random() * (hi - lo));

function Spark({ data, max, className }: { data: number[]; max: number; className: string }) {
  const d = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${(i / (POINTS - 1)) * 100},${30 - (v / max) * 28}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-10 w-full" aria-hidden="true">
      <path d={`${d} L100,30 L0,30 Z`} className={cn(className, 'opacity-15')} fill="currentColor" />
      <path d={d} className={className} fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function TelemetryPanel({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [latency, setLatency] = useState(() => seed(40, 90));
  const [decisions, setDecisions] = useState({ allow: 128, review: 17, deny: 9 });

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setLatency((l) => [...l.slice(1), walk(l[l.length - 1] ?? 60, 25, 120, 24)]);
      setDecisions((d) => {
        const r = Math.random();
        return r < 0.8 ? { ...d, allow: d.allow + 1 } : r < 0.94 ? { ...d, review: d.review + 1 } : { ...d, deny: d.deny + 1 };
      });
    }, 1200);
    return () => window.clearInterval(id);
  }, [reduce]);

  const total = decisions.allow + decisions.review + decisions.deny;
  const last = Math.round(latency[latency.length - 1] ?? 0);
  const bars = [
    { k: 'allow', v: decisions.allow, cls: 'bg-accent' },
    { k: 'review', v: decisions.review, cls: 'bg-warn' },
    { k: 'deny', v: decisions.deny, cls: 'bg-danger' },
  ] as const;

  return (
    <div className={cn('card p-4 font-mono text-xs', className)} role="img" aria-label="Simulated policy telemetry with synthetic data">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-muted">
          <Activity className="h-3.5 w-3.5 text-signal" aria-hidden="true" /> policy.decisions
        </span>
        <span className="rounded border border-warn/40 bg-warn/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-warn">Simulated</span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted/80">p50 decision latency</p>
          <p className="mt-1 text-xl text-ink">
            {last}
            <span className="text-muted">ms</span>
          </p>
        </div>
        <p className="text-right text-[10px] text-muted/80">synthetic data · last 32 ticks</p>
      </div>
      <Spark data={latency} max={130} className="text-signal" />
      <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-elevated">
        {bars.map((b) => (
          <motion.span key={b.k} className={b.cls} animate={{ width: `${(b.v / total) * 100}%` }} transition={{ duration: 0.6 }} />
        ))}
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        {bars.map((b) => (
          <div key={b.k} className="rounded-lg border border-line/70 bg-elevated/40 px-2 py-1.5">
            <dt className="flex items-center gap-1.5 text-[10px] text-muted">
              <span className={cn('h-1.5 w-1.5 rounded-full', b.cls)} aria-hidden="true" />
              {b.k}
            </dt>
            <dd className="mt-0.5 text-sm text-ink">{b.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
