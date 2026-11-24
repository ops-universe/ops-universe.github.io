import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Boxes, Code2, GitFork, History, Github, Star, Users } from 'lucide-react';
import { useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DataSourceBadge } from '@/components/Badges';
import { Button } from '@/components/Button';
import { HeroTerminal } from '@/components/HeroTerminal';
import { Marquee } from '@/components/Marquee';
import { NetworkCanvas } from '@/components/NetworkCanvas';
import { ProjectCard, ProjectCardSkeleton } from '@/components/ProjectCard';
import { Reveal, Stagger, staggerItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { StatCounter } from '@/components/StatCounter';
import { TelemetryPanel } from '@/components/TelemetryPanel';
import { focusAreas, pillars, principles } from '@/data/content';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useOrgData } from '@/hooks/useOrgData';
import { fetchOrgContributors } from '@/lib/github';
import { timeAgo } from '@/lib/format';
import { mergeProjects } from '@/lib/projects';
import { site } from '@/lib/site';

const HEADLINE = [
  { text: 'Engineer', accent: false },
  { text: 'responsibly.', accent: false },
  { text: 'Deploy', accent: true },
  { text: 'confidently.', accent: true },
];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const yVisual = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40" aria-labelledby="hero-title">
      {/* Background layers */}
      <div className="bg-grid mask-radial absolute inset-0 animate-grid-pan" aria-hidden="true" />
      <NetworkCanvas className="absolute inset-0 h-full w-full opacity-70" />
      <motion.div style={{ y: yOrb }} aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[110px]" />
      <motion.div style={{ y: yOrb }} aria-hidden="true" className="pointer-events-none absolute -right-32 top-40 h-[380px] w-[380px] rounded-full bg-signal/10 blur-[120px]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" aria-hidden="true" />

      <div className="container relative grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <motion.a
            href={site.links.github}
            target="_blank"
            rel="noreferrer noopener"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 py-1 pl-1 pr-3 text-xs text-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-ink"
          >
            <span className="whitespace-nowrap rounded-full bg-warn/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warn">{site.maturity}</span>
            <span className="hidden sm:inline">Foundations under development</span>
            <span className="sm:hidden">Under development</span>
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </motion.a>

          <h1 id="hero-title" className="mt-7 text-display-xl font-semibold text-ink">
            <span className="sr-only">Engineer responsibly. Deploy confidently.</span>
            <span aria-hidden="true" className="flex flex-wrap gap-x-[0.25em]">
              {HEADLINE.map((w, i) => (
                <span key={w.text} className="-mb-[0.16em] inline-block overflow-hidden pb-[0.16em]">
                  <motion.span
                    className={w.accent ? 'text-gradient inline-block' : 'inline-block'}
                    initial={reduce ? { opacity: 0 } : { y: '110%' }}
                    animate={reduce ? { opacity: 1 } : { y: '0%' }}
                    transition={{ duration: 0.9, delay: 0.1 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w.text}
                  </motion.span>
                  {i === 1 && <br className="hidden sm:block" />}
                </span>
              ))}
            </span>
          </h1>

          <motion.p
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            Open-source AI engineering, forward deployment and responsible automation. Standards, starters and tools where risk comes from trusted policy, sensitive
            actions need explicit approval, and every release is backed by evidence.
          </motion.p>

          <motion.div className="mt-9 flex flex-wrap gap-3" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}>
            <Button to="/projects" magnetic>
              Explore Projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Button>
            <Button href={site.links.github} variant="secondary" magnetic>
              <Github className="h-4 w-4" aria-hidden="true" />
              View on GitHub
            </Button>
          </motion.div>

          <motion.ul
            className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            aria-label="Principles"
          >
            {principles.map((p) => (
              <li key={p.title} className="inline-flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
                {p.title}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div style={{ y: yVisual }} className="relative lg:pl-6">
          <motion.div initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <HeroTerminal />
          </motion.div>
          <motion.div
            className="relative z-10 -mt-5 ml-auto w-[90%] sm:-ml-8 sm:mr-auto sm:w-[340px] lg:-ml-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <TelemetryPanel className="bg-surface/90 backdrop-blur-xl" />
          </motion.div>
        </motion.div>
      </div>
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

function WhatWeBuild() {
  return (
    <section className="container py-20" aria-labelledby="build-title">
      <SectionHeading eyebrow="What we build" title={<span id="build-title">Foundations for automation you can trust.</span>}>
        Four building blocks, each living in its own repository. Together they make the safe path the default path.
      </SectionHeading>
      <Stagger className="mt-12 grid gap-4 sm:grid-cols-2">
        {pillars.map((p, i) => (
          <motion.article key={p.title} variants={staggerItem} className="card glow-border group relative overflow-hidden p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-line bg-elevated/70 text-accent transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                <p.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-mono text-xs text-muted/60">0{i + 1}</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-ink">{p.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted sm:text-[15px]">{p.body}</p>
            <Link
              to={`/projects?open=${encodeURIComponent(p.repo)}`}
              className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs text-accent after:absolute after:inset-0"
              aria-label={`${p.title}: view ${p.repo}`}
            >
              {p.repo}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </Stagger>
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
    <section className="container py-20" aria-labelledby="trust-title">
      <div className="card relative overflow-hidden p-6 sm:p-10 lg:p-14">
        <div className="bg-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading eyebrow="The pattern" title={<span id="trust-title">Risk comes from policy, not from the request.</span>}>
            In <code className="rounded bg-elevated px-1.5 py-0.5 text-sm text-accent">ops-template</code>, a caller names an action. A trusted, server-side
            policy decides its risk. Unknown and inherited actions are denied — and the tests prove it.
          </SectionHeading>
          <Reveal delay={0.1}>
            <div className="font-mono text-xs sm:text-sm">
              <div className="grid grid-cols-[1fr_auto_1fr_auto_auto] items-center gap-x-2 gap-y-3 sm:gap-x-4">
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
      </div>
    </section>
  );
}

function Featured() {
  const state = useOrgData();
  const navigate = useNavigate();
  const featured = useMemo(() => (state.data ? mergeProjects(state.data.repos).filter((p) => p.meta.featured) : []), [state.data]);
  const open = (name: string) => navigate(`/projects?open=${encodeURIComponent(name)}`);

  return (
    <section className="container py-20" aria-labelledby="featured-title">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Featured repositories" title={<span id="featured-title">Start with the foundations.</span>}>
          Two foundations are merged on <code className="text-accent">main</code>; the CLI and UI kit are open for review.
        </SectionHeading>
        <Reveal>
          <Link to="/projects" className="group inline-flex items-center gap-2 text-sm text-ink">
            <span className="link-underline">All projects</span>
            <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
      {state.status === 'loading' ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4" role="status" aria-label="Loading repositories">
          {Array.from({ length: 4 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {featured.map((p) => (
            <ProjectCard key={p.meta.name} project={p} onOpen={open} />
          ))}
        </Stagger>
      )}
    </section>
  );
}

function CallToAction() {
  return (
    <section className="container py-20" aria-labelledby="cta-title">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/[0.12] via-surface to-signal/[0.08] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="bg-grid mask-radial absolute inset-0" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl">
            <p className="eyebrow justify-center">Get involved</p>
            <h2 id="cta-title" className="mt-4 text-display-lg font-semibold text-ink">
              Help shape the standards from day one.
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-muted sm:text-lg">
              Review an open pull request, propose a standard, or star a repository so others can find it. Early contributors define the defaults.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button to="/contact" magnetic>
                Start contributing <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button href={site.links.github} variant="secondary" magnetic>
                <Star className="h-4 w-4" aria-hidden="true" /> Star on GitHub
              </Button>
            </div>
          </div>
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
      <div className="border-y border-line/60 py-6">
        <Marquee items={focusAreas} />
      </div>
      <Stats />
      <WhatWeBuild />
      <TrustBoundary />
      <Featured />
      <CallToAction />
    </>
  );
}
