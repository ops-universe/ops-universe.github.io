import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

/** Words wrapped in *asterisks* get the iridescent treatment. */
function parse(text: string) {
  return text.split(' ').map((raw) => ({ word: raw.replace(/\*/g, ''), accent: raw.includes('*') }));
}

function Word({ word, accent, progress, range }: { word: string; accent: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <motion.span style={{ opacity, y }} className={cn('inline-block', accent && 'font-accent text-iridescent pr-[0.06em]')}>
      {word}
    </motion.span>
  );
}

/**
 * Pinned statement: the section holds while its words light up one by one with
 * scroll, framed by registration crosshairs, hairlines and expanding rings.
 */
export function ScrollStatement({ label, text, footnote }: { label: string; text: string; footnote?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const ringScale = useTransform(scrollYProgress, [0, 1], [0.7, 1.25]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0.4]);
  const words = parse(text);
  const animated = mounted && !reduce;

  return (
    <section ref={ref} className={cn('relative', animated ? 'h-[240vh]' : '')} aria-label={label}>
      <div className={cn('flex items-center overflow-hidden', animated ? 'sticky top-0 h-[100svh]' : 'py-28')}>
        {/* concentric rings */}
        <motion.div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={animated ? { scale: ringScale, opacity: ringOpacity } : undefined} aria-hidden="true">
          {[520, 760, 1000, 1240].map((d) => (
            <span key={d} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/60" style={{ width: d, height: d }} />
          ))}
        </motion.div>

        <div className="container relative">
          <div className="relative mx-auto max-w-5xl border-y border-line/60 px-2 py-14 sm:px-10 sm:py-20">
            <span className="crosshair -left-1.5 -top-1.5" aria-hidden="true" />
            <span className="crosshair -right-1.5 -top-1.5" aria-hidden="true" />
            <span className="crosshair -bottom-1.5 -left-1.5" aria-hidden="true" />
            <span className="crosshair -bottom-1.5 -right-1.5" aria-hidden="true" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{label}</p>
            <p className="mt-6 text-[clamp(1.9rem,4.8vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-ink">
              {animated ? (
                <>
                  <span className="sr-only">{words.map((w) => w.word).join(' ')}</span>
                  <span aria-hidden="true" className="flex flex-wrap gap-x-[0.24em]">
                    {words.map((w, i) => {
                      const start = 0.08 + (i / words.length) * 0.72;
                      return <Word key={i} word={w.word} accent={w.accent} progress={scrollYProgress} range={[start, start + 0.08]} />;
                    })}
                  </span>
                </>
              ) : (
                words.map((w, i) => (
                  <span key={i} className={cn(w.accent && 'font-accent text-iridescent')}>
                    {w.word}{' '}
                  </span>
                ))
              )}
            </p>
            {footnote && <p className="mt-8 max-w-xl font-mono text-xs leading-relaxed text-muted">{footnote}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
