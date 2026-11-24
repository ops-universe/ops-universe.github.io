import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Ban, Boxes, CheckCircle2, Code2, FileCheck2, GitFork, History, PlayCircle, Star, UserCheck, Users } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataSourceBadge } from '@/components/Badges';
import { Button } from '@/components/Button';
import { HeroTerminal } from '@/components/HeroTerminal';
import { Marquee } from '@/components/Marquee';
import { GlassCubes } from '@/components/motion/GlassCubes';
import { HorizontalGallery } from '@/components/motion/HorizontalGallery';
import { IridescentOrb } from '@/components/motion/IridescentOrb';
import { IsometricStack } from '@/components/motion/IsometricStack';
import { OrbitCards, SpinningBadge, type OrbitItem } from '@/components/motion/OrbitCards';
import { PhysicsDrop, type DropSpec } from '@/components/motion/PhysicsDrop';
import { ScrollStatement } from '@/components/motion/ScrollStatement';
import { ProjectCard, ProjectCardSkeleton } from '@/components/ProjectCard';
import { Reveal, Stagger, staggerItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { StatCounter } from '@/components/StatCounter';
import { focusAreas, pillars, principles } from '@/data/content';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useOrgData } from '@/hooks/useOrgData';
import { timeAgo } from '@/lib/format';
import { fetchOrgContributors } from '@/lib/github';
import { mergeProjects } from '@/lib/projects';
import { site } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;

/* The allow / review / deny outcomes mirror the ops-template policy demo. */
const ORBIT: OrbitItem[] = [
  { icon: CheckCircle2, title: 'allow', sub: 'read · low risk', tone: 'accent' },
  { icon: UserCheck, title: 'review', sub: 'update · needs approval', tone: 'warn' },
  { icon: Ban, title: 'deny', sub: 'delete · not in policy', tone: 'danger' },
  { icon: FileCheck2, title: 'evidence', sub: 'release gate · per SHA', tone: 'signal' },
  { icon: Boxes, title: 'vendor-neutral', sub: 'adapters, no lock-in', tone: 'accent' },
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.25]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);

  const rise = (delay: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-32 lg:pt-36" aria-labelledby="hero-title">
      <div className="bg-grid mask-radial absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 top-0 h-[560px] w-[560px] animate-float rounded-full bg-glow-1/20 blur-[120px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] animate-float rounded-full bg-glow-3/15 blur-[110px] [animation-delay:-3s]" aria-hidden="true" />

      <div className="container relative grid items-center gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        <motion.div style={{ y: copyY }}>
          <motion.a
            href={site.links.github}
            target="_blank"
            rel="noreferrer noopener"
            {...rise(0)}
            className="glass-card group inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-xs text-muted transition-colors hover:text-ink"
          >
            <span className="whitespace-nowrap rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-ink">{site.maturity}</span>
            <span className="hidden sm:inline">Foundations under development</span>
            <span className="sm:hidden">Under development</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </motion.a>

          <motion.p {...rise(0.08)} className="mt-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
            <span className="h-px w-10 bg-muted/50" aria-hidden="true" />
            Open-source AI engineering
          </motion.p>

          <h1 id="hero-title" className="mt-4 text-[clamp(2.7rem,6.6vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-ink">
            <span className="sr-only">Engineer responsibly. Deploy confidently.</span>
            <span aria-hidden="true" className="block">
              {['Engineer', 'responsibly.'].map((w, i) => (
                <span key={w} className="-mb-[0.14em] mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? { opacity: 0 } : { y: '110%' }}
                    animate={reduce ? { opacity: 1 } : { y: '0%' }}
                    transition={{ duration: 0.95, delay: 0.12 + i * 0.09, ease: EASE }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="block">
              <span className="-mb-[0.14em] mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span className="inline-block" initial={reduce ? { opacity: 0 } : { y: '110%' }} animate={reduce ? { opacity: 1 } : { y: '0%' }} transition={{ duration: 0.95, delay: 0.3, ease: EASE }}>
                  Deploy
                </motion.span>
              </span>
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] pr-[0.08em] align-bottom">
                <motion.span
                  className="font-accent text-gradient inline-block text-[1.12em] leading-[0.9]"
                  initial={reduce ? { opacity: 0 } : { y: '110%', rotate: 4 }}
                  animate={reduce ? { opacity: 1 } : { y: '0%', rotate: 0 }}
                  transition={{ duration: 1.05, delay: 0.4, ease: EASE }}
                >
                  confidently.
                </motion.span>
              </span>
            </span>
          </h1>

          <motion.p {...rise(0.55)} className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Standards, starters and tools for AI automation where risk comes from trusted policy, sensitive actions need explicit approval, and every release is
            backed by evidence.
          </motion.p>

          <motion.div {...rise(0.65)} className="mt-9 flex flex-wrap gap-3">
            <Button to="/projects" magnetic>
              Explore projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button onClick={() => document.getElementById('pattern')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })} variant="secondary" magnetic>
              <PlayCircle className="h-4 w-4" aria-hidden="true" />
              See how it works
            </Button>
          </motion.div>

          <motion.ul {...rise(0.8)} className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted" aria-label="Principles">
            {principles.map((p) => (
              <li key={p.title} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-glow-3 to-glow-2" aria-hidden="true" />
                {p.title}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <motion.div style={{ y: stageY, scale: stageScale, opacity: stageOpacity }} className="relative mx-auto aspect-square w-full max-w-[620px]">
          <motion.div className="absolute inset-0" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.2, ease: EASE }}>
            <IridescentOrb className="absolute inset-0" />
          </motion.div>
          <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.9 }}>
            <OrbitCards items={ORBIT} />
          </motion.div>
          <SpinningBadge text="Engineer responsibly · Deploy confidently · " className="absolute right-[2%] top-[4%] hidden sm:grid" />
          <span className="crosshair left-[6%] top-[8%]" aria-hidden="true" />
          <span className="crosshair bottom-[8%] right-[6%]" aria-hidden="true" />
        </motion.div>
      </div>

      <motion.a
        href="#statement"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted hover:text-ink sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        Scroll
        <span className="relative h-10 w-6 rounded-full border border-line">
          <motion.span
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-accent"
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  );
}

function WhatWeBuild() {
  return (
    <section className="container py-24" aria-labelledby="build-title">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="order-2 lg:order-1">
          <IsometricStack className="mx-auto aspect-[56/54] w-full max-w-[640px]" layers={pillars.map((p) => ({ name: p.repo, role: p.title }))} />
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="What we build"
            title={
              <span id="build-title">
                Foundations, <span className="font-accent text-gradient">stacked</span> for trust.
              </span>
            }
          >
            Four building blocks, each in its own repository. Standards at the base, a policy starter on top, then tooling and interface — so the safe path is the
            default path.
          </SectionHeading>
          <Stagger as="ul" className="mt-8 space-y-2.5">
            {pillars.map((p, i) => (
              <motion.li key={p.title} variants={staggerItem}>
                <Link
                  to={`/projects?open=${encodeURIComponent(p.repo)}`}
                  className="group flex items-start gap-4 rounded-2xl border border-transparent p-3.5 transition-colors hover:border-line hover:bg-surface/70"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-elevated/70 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <p.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-semibold text-ink">{p.title}</span>
                      <span className="font-mono text-[11px] text-muted/70">0{i + 1}</span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{p.body}</span>
                    <span className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-accent">
                      {p.repo}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}

function Principles() {
  const icons = principles.map((p) => p.icon);
  return (
    <section className="container py-12 sm:py-20" aria-labelledby="principles-title">
      <Reveal>
        <div className="deep-panel relative grid overflow-hidden rounded-[32px] p-7 sm:p-12 lg:grid-cols-[0.95fr_1.05fr] lg:p-16">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-white/60">Core values</p>
            <h2 id="principles-title" className="mt-4 text-display-lg font-bold text-white">
              Four principles, <span className="font-accent font-normal text-[1.08em] text-[rgb(var(--glow-2))]">built in.</span>
            </h2>
            <ol className="mt-8 space-y-5">
              {principles.map((p, i) => (
                <li key={p.title} className="flex gap-4">
                  <span className="mt-0.5 font-mono text-xs text-white/40">0{i + 1}</span>
                  <span>
                    <span className="block font-semibold text-white">{p.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-white/65">{p.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative -mx-4 mt-6 h-[320px] sm:h-[440px] lg:mx-0 lg:mt-0 lg:h-auto">
            <div className="absolute inset-0 origin-center scale-[0.7] sm:scale-100">
              <GlassCubes
                className="h-full w-full"
                cubes={[
                  { icon: icons[0]!, x: '14%', y: '10%', size: 118, depth: 40, spin: 28 },
                  { icon: icons[1]!, x: '58%', y: '4%', size: 92, depth: -70, spin: 32 },
                  { icon: icons[2]!, x: '46%', y: '46%', size: 140, depth: 90, spin: 36 },
                  { icon: icons[3]!, x: '8%', y: '58%', size: 84, depth: -30, spin: 24 },
                ]}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Stats() {
  const state = useOrgData();
  const repos = state.data?.repos;
  const contributors = useAsync(repos ? `contributors:${repos.map((r) => r.name).join(',')}` : null, () => fetchOrgContributors(repos ?? []));

  const stats = useMemo(() => {
    if (!state.data) return null;
    const { repos: list, org } = state.data;
    const languages = new Set(list.map((r) => r.language).filter(Boolean));
    const latest = [...list].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))[0];
    return {
      repos: org.public_repos,
      stars: list.reduce((n, r) => n + r.stargazers_count, 0),
      forks: list.reduce((n, r) => n + r.forks_count, 0),
      languages: languages.size,
      languageNames: [...languages].join(', ') || 'Markdown-only so far',
      latest,
    };
  }, [state.data]);

  const contributorCount = contributors.status === 'success' && contributors.value.length > 0 ? contributors.value.length : undefined;

  return (
    <section className="container py-20" aria-labelledby="stats-title">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="By the numbers" title={<span id="stats-title">Early, honest and in the open.</span>}>
          Every figure below is read from the GitHub API — no rounding up, no vanity metrics. The organization launched recently; these numbers start at the
          beginning.
        </SectionHeading>
        <Reveal>
          <DataSourceBadge loading={state.status === 'loading'} source={state.data?.source} fetchedAt={state.data?.fetchedAt} />
        </Reveal>
      </div>

      {!stats ? (
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6" role="status" aria-label="Loading statistics">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="card h-[126px] p-5">
              <div className="skeleton h-4 w-20" />
              <div className="skeleton mt-5 h-8 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <Stagger className="mt-10">
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <StatCounter icon={Boxes} label="Public repos" value={stats.repos} note="ops-universe/*" />
            <StatCounter icon={Users} label="Contributors" value={contributorCount ?? (contributors.status === 'success' ? 0 : '—')} note="unique, all repos" />
            <StatCounter icon={Star} label="Stars" value={stats.stars} note="be the first ★" />
            <StatCounter icon={GitFork} label="Forks" value={stats.forks} note="across all repos" />
            <StatCounter icon={Code2} label="Languages" value={stats.languages} note={stats.languageNames} />
            <StatCounter icon={History} label="Latest push" value={stats.latest ? timeAgo(stats.latest.pushed_at) : '—'} note={stats.latest?.name} />
          </dl>
        </Stagger>
      )}
      {state.data?.error && <p className="mt-4 font-mono text-xs text-warn">{state.data.error}</p>}
    </section>
  );
}

function TrustBoundary() {
  const rows = [
    { name: 'read', risk: 'low', decision: 'allow', cls: 'text-accent border-accent/40 bg-accent/10' },
    { name: 'update', risk: 'high', decision: 'review', cls: 'text-warn border-warn/40 bg-warn/10' },
    { name: 'delete', risk: '— not in policy', decision: 'deny', cls: 'text-danger border-danger/40 bg-danger/10' },
  ];
  return (
    <section id="pattern" className="container scroll-mt-28 py-20" aria-labelledby="trust-title">
      <div className="card relative overflow-hidden p-6 sm:p-10 lg:p-14">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading eyebrow="The pattern" title={<span id="trust-title">Risk comes from policy, not from the request.</span>}>
              In <code className="rounded bg-elevated px-1.5 py-0.5 text-sm text-accent">ops-template</code>, a caller names an action. A trusted, server-side
              policy decides its risk. Unknown and inherited actions are denied — and the tests prove it.
            </SectionHeading>
            <Reveal delay={0.1}>
              <div className="mt-8 font-mono text-xs sm:text-sm">
                <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-x-2 gap-y-3 sm:gap-x-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted/70">action</span>
                  <span />
                  <span className="text-[10px] uppercase tracking-widest text-muted/70">trusted risk</span>
                  <span />
                  <span className="text-[10px] uppercase tracking-widest text-muted/70">decision</span>
                  {rows.map((r, i) => (
                    <motion.div key={r.name} className="contents" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15 }}>
                      <span className="rounded-lg border border-line bg-elevated/60 px-3 py-2 text-ink">{r.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                      <span className="truncate rounded-lg border border-line bg-elevated/60 px-3 py-2 text-muted">{r.risk}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                      <span className={`rounded-lg border px-3 py-2 text-center ${r.cls}`}>{r.decision}</span>
                    </motion.div>
                  ))}
                </div>
                <p className="mt-6 text-xs leading-relaxed text-muted">
                  Illustrative starter — it does not execute tools, verify identity or store approval receipts.{' '}
                  <Link to="/blog/trusted-risk-classification" className="text-accent underline-offset-2 hover:underline">
                    Read the walkthrough →
                  </Link>
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <HeroTerminal />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  const state = useOrgData();
  const navigate = useNavigate();
  const projects = useMemo(() => (state.data ? mergeProjects(state.data.repos) : []), [state.data]);
  const open = (name: string) => navigate(`/projects?open=${encodeURIComponent(name)}`);

  const header = (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <SectionHeading
        eyebrow="The ecosystem"
        title={
          <span id="ecosystem-title">
            Every repository, <span className="font-accent text-gradient">in one sweep.</span>
          </span>
        }
      >
        Foundations merged on <code className="text-accent">main</code> and what is planned next — live from GitHub.
      </SectionHeading>
      <Reveal className="flex items-center gap-4">
        <DataSourceBadge loading={state.status === 'loading'} source={state.data?.source} fetchedAt={state.data?.fetchedAt} />
        <Link to="/projects" className="group inline-flex items-center gap-2 whitespace-nowrap text-sm text-ink">
          <span className="link-underline">All projects</span>
          <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </Reveal>
    </div>
  );

  const items =
    state.status === 'loading'
      ? Array.from({ length: 5 }, (_, i) => <ProjectCardSkeleton key={i} />)
      : projects.map((p) => <ProjectCard key={p.meta.name} project={p} onOpen={open} />);

  return <HorizontalGallery label="The ecosystem" header={header} items={items} />;
}

const DROP: DropSpec[] = [
  { kind: 'chip', size: 104, label: 'policy', glow: 1 },
  { kind: 'sphere', size: 88, glow: 2 },
  { kind: 'chip', size: 112, label: 'approval', glow: 3 },
  { kind: 'sphere', size: 64, glow: 3 },
  { kind: 'chip', size: 108, label: 'evidence', glow: 2 },
  { kind: 'sphere', size: 110, glow: 1 },
  { kind: 'chip', size: 100, label: 'rollback', glow: 3 },
  { kind: 'sphere', size: 56, glow: 2 },
  { kind: 'chip', size: 118, label: 'threat model', glow: 1 },
  { kind: 'sphere', size: 78, glow: 3 },
  { kind: 'chip', size: 96, label: 'tests', glow: 2 },
  { kind: 'sphere', size: 96, glow: 1 },
  { kind: 'chip', size: 114, label: 'release gate', glow: 3 },
  { kind: 'sphere', size: 60, glow: 1 },
  { kind: 'chip', size: 98, label: 'runbook', glow: 1 },
  { kind: 'sphere', size: 84, glow: 2 },
  { kind: 'chip', size: 102, label: 'lockfile', glow: 2 },
  { kind: 'sphere', size: 70, glow: 3 },
  { kind: 'chip', size: 92, label: 'ADR', glow: 3 },
  { kind: 'sphere', size: 100, glow: 2 },
];

function CallToAction() {
  return (
    <section className="container py-20" aria-labelledby="cta-title">
      <Reveal>
        <div className="glass-card relative h-[640px] overflow-hidden rounded-[36px] sm:h-[700px]">
          <div className="bg-grid mask-radial absolute inset-0" aria-hidden="true" />
          <div className="absolute left-1/2 top-[18%] h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-glow-1/25 blur-[100px]" aria-hidden="true" />
          <PhysicsDrop specs={DROP} />
          <div className="pointer-events-none relative z-10 mx-auto max-w-2xl px-6 pt-14 text-center sm:pt-20">
            <p className="eyebrow justify-center">Get involved</p>
            <h2 id="cta-title" className="mt-4 text-[clamp(2.3rem,5.6vw,4.4rem)] font-extrabold leading-[1] tracking-[-0.04em] text-ink">
              Small steps.
              <br />
              <span className="font-accent text-gradient font-normal">Safer defaults.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted sm:text-lg">
              Review an open pull request, propose a standard, or star a repository so others can find it. Early contributors define the defaults.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/contact" magnetic>
                Start contributing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={site.links.github} variant="secondary" magnetic>
                <Star className="h-4 w-4" aria-hidden="true" /> Star on GitHub
              </Button>
            </div>
          </div>
          <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80 sm:flex">
            <ArrowDown className="h-3 w-3" aria-hidden="true" /> push the pile · click to pop
          </p>
        </div>
      </Reveal>
    </section>
  );
}

export function Home() {
  useDocumentMeta({});
  return (
    <>
      <Hero />
      <div className="border-y border-line/60 bg-surface/30 py-6 backdrop-blur-sm">
        <Marquee items={focusAreas} />
      </div>
      <div id="statement">
        <ScrollStatement
          label="Direction 01 — The idea"
          text="We make the *safe* *path* the *easy* *path.* Risk comes from trusted policy, sensitive actions wait for explicit approval, and every release ships with its *evidence.*"
          footnote="Paraphrased from the organization profile and ops-standards."
        />
      </div>
      <WhatWeBuild />
      <Principles />
      <Stats />
      <TrustBoundary />
      <Ecosystem />
      <CallToAction />
    </>
  );
}
