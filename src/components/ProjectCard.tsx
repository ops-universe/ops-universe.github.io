import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Clock, GitFork, Star } from 'lucide-react';
import type { PointerEvent } from 'react';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/cn';
import { timeAgo } from '@/lib/format';
import { projectLanguage, projectSummary, projectTags, type Project } from '@/lib/projects';
import { LanguageDot, StatusBadge } from './Badges';
import { staggerItem } from './Reveal';

interface Props {
  project: Project;
  onOpen: (name: string) => void;
  className?: string;
}

/** Repository card: lift + glow border + spotlight + subtle 3D tilt (desktop, motion allowed). */
export function ProjectCard({ project, onOpen, className }: Props) {
  const { meta, repo } = project;
  const tiltEnabled = useFinePointer() && !useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 200, damping: 20 });
  const sx = useTransform(px, (v) => `${v * 100}%`);
  const sy = useTransform(py, (v) => `${v * 100}%`);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${sx} ${sy}, rgb(var(--accent) / 0.09), transparent 70%)`;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!tiltEnabled) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const language = projectLanguage(project);
  const tags = projectTags(project).slice(0, 4);

  return (
    <motion.article
      variants={staggerItem}
      layout
      className={cn('group [perspective:1000px]', className)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div
        style={tiltEnabled ? { rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' } : undefined}
        whileHover={tiltEnabled ? { y: -6 } : { y: -3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="card glow-border relative flex h-full flex-col rounded-2xl p-5 transition-shadow duration-300 group-hover:shadow-glow sm:p-6"
      >
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />

        <div className="relative flex items-start justify-between gap-3">
          <StatusBadge status={meta.status} />
          <span className="font-mono text-[11px] text-muted/80">{meta.category}</span>
        </div>

        <h3 className="relative mt-5 font-mono text-lg font-semibold tracking-tight text-ink">
          {/* Stretched button makes the whole card open the detail view. */}
          <button type="button" onClick={() => onOpen(meta.name)} className="text-left after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none [&:focus-visible]:after:ring-2 [&:focus-visible]:after:ring-accent">
            <span className="block text-[11px] font-normal text-muted/70">ops-universe /</span>
            <span className="break-all">{meta.name}</span>
          </button>
        </h3>
        <p className="relative mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{projectSummary(project)}</p>

        <ul className="relative mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
          {tags.map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>

        <div className="relative mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/60 pt-4 text-xs text-muted">
          {language && <LanguageDot language={language} />}
          {repo ? (
            <>
              <span className="inline-flex items-center gap-1" title="Stars">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Stars:</span> {repo.stargazers_count}
              </span>
              <span className="inline-flex items-center gap-1" title="Forks">
                <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Forks:</span> {repo.forks_count}
              </span>
              <span className="inline-flex items-center gap-1" title={`Last push ${repo.pushed_at}`}>
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <time dateTime={repo.pushed_at}>{timeAgo(repo.pushed_at)}</time>
              </span>
            </>
          ) : (
            <span className="font-mono">No repository yet</span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-accent opacity-80 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100">
            Details <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card flex h-[264px] flex-col p-6" aria-hidden="true">
      <div className="flex justify-between">
        <div className="skeleton h-6 w-24 rounded-full" />
        <div className="skeleton h-4 w-16" />
      </div>
      <div className="skeleton mt-6 h-5 w-3/4" />
      <div className="skeleton mt-4 h-3.5 w-full" />
      <div className="skeleton mt-2 h-3.5 w-5/6" />
      <div className="mt-4 flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton mt-auto h-4 w-2/3" />
    </div>
  );
}
