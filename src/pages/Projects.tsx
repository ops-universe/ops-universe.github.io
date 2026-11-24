import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { FolderSearch, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataSourceBadge } from '@/components/Badges';
import { ProjectCard, ProjectCardSkeleton } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import type { ProjectStatus } from '@/data/projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useOrgData } from '@/hooks/useOrgData';
import { cn } from '@/lib/cn';
import { mergeProjects, projectLanguage, projectSummary, projectTags, type Project } from '@/lib/projects';

type FilterKey = 'status' | 'category' | 'language' | 'topic';
const STATUS_ORDER: ProjectStatus[] = ['Foundation', 'In review', 'Planned'];
type Sort = 'curated' | 'recent' | 'name';

function FilterGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string | null; onChange: (v: string | null) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(active ? null : o)}
              className={cn(
                'relative min-h-9 rounded-full border px-3 text-xs transition-colors active:scale-95',
                active ? 'border-accent/60 text-accent-ink' : 'border-line bg-surface/60 text-muted hover:border-accent/40 hover:text-ink',
              )}
            >
              {active && <motion.span layoutId={`filter-${label}`} className="absolute inset-0 rounded-full bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
              <span className="relative">{o}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function EmptyState({ onReset, children }: { onReset: () => void; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card col-span-full flex flex-col items-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl border border-line bg-elevated text-muted">
        <FolderSearch className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-ink">No projects match</h2>
      <p className="mt-2 max-w-sm text-sm text-muted">{children}</p>
      <button type="button" onClick={onReset} className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-xl border border-line px-4 text-sm text-ink transition-colors hover:border-accent/60">
        <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset filters
      </button>
    </motion.div>
  );
}

export function Projects() {
  useDocumentMeta({
    title: 'Projects',
    description: 'Every ops-universe repository and planned project: standards, starter template, CLI, UI kit and website — with live GitHub data.',
  });
  const state = useOrgData();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<Sort>('curated');
  const [showFilters, setShowFilters] = useState(false);

  const filters: Record<FilterKey, string | null> = {
    status: params.get('status'),
    category: params.get('category'),
    language: params.get('language'),
    topic: params.get('topic'),
  };

  const setFilter = (key: FilterKey, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const reset = () => {
    setQuery('');
    const next = new URLSearchParams();
    const open = params.get('open');
    if (open) next.set('open', open);
    setParams(next, { replace: true });
  };

  const all = useMemo(() => (state.data ? mergeProjects(state.data.repos) : []), [state.data]);

  const options = useMemo(
    () => ({
      status: STATUS_ORDER.filter((s) => all.some((p) => p.meta.status === s)),
      category: [...new Set(all.map((p) => p.meta.category))].sort(),
      language: [...new Set(all.map(projectLanguage).filter((l): l is string => !!l))].sort(),
      topic: [...new Set(all.flatMap(projectTags))].sort(),
    }),
    [all],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = all.filter((p) => {
      if (filters.status && p.meta.status !== filters.status) return false;
      if (filters.category && p.meta.category !== filters.category) return false;
      if (filters.language && projectLanguage(p) !== filters.language) return false;
      if (filters.topic && !projectTags(p).includes(filters.topic)) return false;
      if (!q) return true;
      return [p.meta.name, projectSummary(p), ...projectTags(p), p.meta.category, ...p.meta.stack].join(' ').toLowerCase().includes(q);
    });
    if (sort === 'name') return [...list].sort((a, b) => a.meta.name.localeCompare(b.meta.name));
    if (sort === 'recent') return [...list].sort((a, b) => (b.repo?.pushed_at ?? '').localeCompare(a.repo?.pushed_at ?? ''));
    return list;
  }, [all, query, sort, filters.status, filters.category, filters.language, filters.topic]);

  const activeCount = Object.values(filters).filter(Boolean).length + (query ? 1 : 0);

  const openName = params.get('open');
  const selected: Project | null = (openName && all.find((p) => p.meta.name === openName)) || null;
  const openProject = useCallback(
    (name: string) => {
      const next = new URLSearchParams(params);
      next.set('open', name);
      setParams(next);
    },
    [params, setParams],
  );
  const closeProject = useCallback(() => {
    const next = new URLSearchParams(params);
    next.delete('open');
    setParams(next, { replace: true });
  }, [params, setParams]);

  return (
    <div className="container pb-10 pt-32 sm:pt-36">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading as="h1" eyebrow="Projects" title="Every repository, in one place.">
          Live repository data from GitHub, joined with curated summaries from each README and open pull request. Planned projects are listed so you can see
          where things are heading.
        </SectionHeading>
        <Reveal>
          <DataSourceBadge loading={state.status === 'loading'} source={state.data?.source} fetchedAt={state.data?.fetchedAt} />
        </Reveal>
      </div>

      <Reveal delay={0.05} className="glass sticky top-[72px] z-30 mt-10 rounded-2xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, topic or stack…"
              className="h-11 w-full rounded-xl border border-line bg-bg/60 pl-10 pr-10 text-sm text-ink transition-colors placeholder:text-muted/70 hover:border-accent/40 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted hover:text-ink" aria-label="Clear search">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <label className="relative flex-1 sm:flex-none">
              <span className="sr-only">Sort projects</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-line bg-bg/60 px-3.5 pr-8 text-sm text-ink hover:border-accent/40 focus:border-accent/60 focus:outline-none"
              >
                <option value="curated">Sort: Curated</option>
                <option value="recent">Sort: Recently pushed</option>
                <option value="name">Sort: Name</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted" aria-hidden="true">
                ▾
              </span>
            </label>
            <button
              type="button"
              onClick={() => setShowFilters((s) => !s)}
              aria-expanded={showFilters}
              aria-controls="project-filters"
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-sm transition-colors',
                showFilters ? 'border-accent/60 text-ink' : 'border-line text-muted hover:text-ink',
              )}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filters
              {activeCount > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 font-mono text-[10px] text-accent-ink">{activeCount}</span>}
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              id="project-filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <LayoutGroup>
                <div className="mt-4 grid gap-5 border-t border-line/70 pt-4 md:grid-cols-[auto_1fr_auto]">
                  <FilterGroup label="Status" options={options.status} value={filters.status} onChange={(v) => setFilter('status', v)} />
                  <FilterGroup label="Category" options={options.category} value={filters.category} onChange={(v) => setFilter('category', v)} />
                  <FilterGroup label="Language" options={options.language} value={filters.language} onChange={(v) => setFilter('language', v)} />
                  <div className="md:col-span-3">
                    <FilterGroup label="Topic" options={options.topic} value={filters.topic} onChange={(v) => setFilter('topic', v)} />
                  </div>
                </div>
              </LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </Reveal>

      <p className="mt-6 font-mono text-xs text-muted" aria-live="polite">
        {state.status === 'loading' ? 'Loading repositories…' : `${visible.length} of ${all.length} projects`}
        {activeCount > 0 && (
          <button type="button" onClick={reset} className="ml-3 text-accent underline-offset-2 hover:underline">
            Clear all
          </button>
        )}
      </p>

      {state.status === 'loading' ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading repositories">
          {Array.from({ length: 6 }, (_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <motion.div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}>
          <AnimatePresence initial={false}>
            {visible.length === 0 ? (
              <EmptyState key="empty" onReset={reset}>
                Nothing matches {query ? `“${query}”` : 'these filters'}. Try a broader search, or clear filters to see all {all.length} projects.
              </EmptyState>
            ) : (
              visible.map((p) => <ProjectCard key={p.meta.name} project={p} onOpen={openProject} />)
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {state.data?.error && <p className="mt-6 font-mono text-xs text-warn">{state.data.error}</p>}

      <ProjectModal project={selected} onClose={closeProject} />
    </div>
  );
}
