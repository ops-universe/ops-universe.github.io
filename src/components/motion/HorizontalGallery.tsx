import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Pinned horizontal gallery: on wide screens the section holds while vertical
 * scroll slides the track sideways. On small screens, with reduced motion, or
 * before JavaScript runs, it falls back to a swipeable row.
 */
export function HorizontalGallery({ header, items, label }: { header: ReactNode; items: ReactNode[]; label: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const wide = useMediaQuery('(min-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  const [distance, setDistance] = useState(0);
  useEffect(() => setMounted(true), []);
  const pinned = mounted && wide && !reduce;

  useIsoLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const el = track.current;
      if (el) setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 64));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned, items.length]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.0005 });
  const x = useTransform(smooth, [0, 1], [0, -distance]);
  const bar = useTransform(smooth, [0, 1], [0.04, 1]);

  if (!pinned) {
    return (
      <section ref={section} className="py-20" aria-label={label}>
        <div className="container">{header}</div>
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:px-6 lg:px-8 [scrollbar-width:thin]">
          {items.map((item, i) => (
            <div key={i} className="w-[300px] shrink-0 snap-start sm:w-[340px] [&>*]:h-full">
              {item}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} aria-label={label} style={{ height: `calc(100vh + ${distance}px)` }} className="relative">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        <div className="container">{header}</div>
        <motion.div ref={track} style={{ x }} className="mt-10 flex w-max gap-5 pl-[max(2rem,calc((100vw-1320px)/2+2rem))] pr-16">
          {items.map((item, i) => (
            <div key={i} className="w-[360px] shrink-0 [&>*]:h-full">
              {item}
            </div>
          ))}
        </motion.div>
        <div className="container mt-8 flex items-center gap-4">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-line/60">
            <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-glow-3 via-glow-1 to-glow-2" style={{ scaleX: bar }} />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">scroll</span>
        </div>
      </div>
    </section>
  );
}
