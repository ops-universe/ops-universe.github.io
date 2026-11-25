import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, ExternalLink, GitFork, GitPullRequest, Github, Info, Scale, Star, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAsync } from '@/hooks/useAsync';
import { fetchReadme } from '@/lib/github';
import { formatDate } from '@/lib/format';
import { Markdown } from '@/lib/markdown';
import { projectLanguage, projectSummary, projectTags, type Project } from '@/lib/projects';
import { LanguageDot, StatusBadge } from './Badges';

/** Accessible project detail dialog with README preview, stack, links and contribution guidance. */
export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const repo = project?.repo;
  const readme = useAsync(project && repo ? `readme:${repo.name}` : null, () =>
    repo?.readme !== undefined && repo.readme !== null ? Promise.resolve(repo.readme) : fetchReadme(repo!.name),
  );

  useEffect(() => {
    if (!project) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const id = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      lastFocus.current?.focus();
    };
  }, [project, onClose]);

  // Portal to <body>: the animated route wrapper uses transforms, which would
  // otherwise trap this fixed-position overlay inside <main>.
  // Nothing to portal into during build-time prerendering.
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-bg/75 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-title"
            className="card relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-b-none bg-surface sm:rounded-2xl"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line/70 p-5 sm:p-7">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={project.meta.status} />
                  <span className="chip">{project.meta.category}</span>
                  {repo?.license && (
                    <span className="chip">
                      <Scale className="h-3 w-3" aria-hidden="true" /> {repo.license}
                    </span>
                  )}
                </div>
                <h2 id="project-title" className="mt-3 break-words font-mono text-xl font-semibold text-ink sm:text-2xl">
                  {project.meta.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{projectSummary(project)}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-autofocus
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line text-muted transition-colors hover:border-accent/50 hover:text-ink"
                aria-label="Close project details"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-7">
              <div className="grid gap-6 md:grid-cols-[1fr_220px]">
                <div className="min-w-0 space-y-7">
                  <section>
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Highlights</h3>
                    <ul className="prose-ou mt-3 text-sm">
                      {project.meta.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </section>

                  {repo && (
                    <section>
                      <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted/80">
                        <BookOpenText className="h-3.5 w-3.5" aria-hidden="true" /> README on {repo.default_branch}
                      </h3>
                      <div className="prose-ou mt-3 rounded-xl border border-line/70 bg-bg/40 p-4 text-sm [&_p]:my-3">
                        {readme.status === 'loading' || readme.status === 'idle' ? (
                          <div className="space-y-2" role="status" aria-label="Loading README">
                            <div className="skeleton h-4 w-1/2" />
                            <div className="skeleton h-3.5 w-full" />
                            <div className="skeleton h-3.5 w-4/5" />
                          </div>
                        ) : readme.status === 'error' ? (
                          <p className="text-muted">README could not be loaded right now.</p>
                        ) : readme.value ? (
                          <Markdown source={readme.value} baseUrl={`${repo.html_url}/blob/${repo.default_branch}`} />
                        ) : (
                          <p className="text-muted">This repository has no README yet.</p>
                        )}
                      </div>
                    </section>
                  )}

                  <section className="rounded-xl border border-accent/25 bg-accent/5 p-4">
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">How to contribute</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/85">{project.meta.contribute}</p>
                  </section>

                  <p className="flex items-start gap-2 text-xs text-muted">
                    <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    Summary sourced from {project.meta.source}.
                  </p>
                </div>

                <aside className="space-y-5 text-sm">
                  {repo && (
                    <dl className="grid grid-cols-2 gap-2 md:grid-cols-1">
                      {[
                        { k: 'Stars', v: repo.stargazers_count, I: Star },
                        { k: 'Forks', v: repo.forks_count, I: GitFork },
                      ].map(({ k, v, I }) => (
                        <div key={k} className="rounded-xl border border-line/70 bg-elevated/40 px-3 py-2.5">
                          <dt className="flex items-center gap-1.5 text-xs text-muted">
                            <I className="h-3.5 w-3.5" aria-hidden="true" /> {k}
                          </dt>
                          <dd className="mt-1 font-mono text-lg text-ink">{v}</dd>
                        </div>
                      ))}
                      <div className="col-span-2 rounded-xl border border-line/70 bg-elevated/40 px-3 py-2.5 md:col-span-1">
                        <dt className="text-xs text-muted">Last push</dt>
                        <dd className="mt-1 font-mono text-ink">{formatDate(repo.pushed_at)}</dd>
                      </div>
                    </dl>
                  )}
                  {(project.meta.stack.length > 0 || projectLanguage(project)) && (
                    <div>
                      <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Stack</h3>
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {projectLanguage(project) && (
                          <li className="chip">
                            <LanguageDot language={projectLanguage(project)!} />
                          </li>
                        )}
                        {project.meta.stack.map((s) => (
                          <li key={s} className="chip">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Topics</h3>
                    <ul className="mt-2.5 flex flex-wrap gap-1.5">
                      {projectTags(project).map((t) => (
                        <li key={t} className="chip">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {repo && (
                    <div className="flex flex-col gap-2">
                      <a href={repo.html_url} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-accent px-4 text-sm font-medium text-accent-ink transition-shadow hover:shadow-glow">
                        <Github className="h-4 w-4" aria-hidden="true" /> Open repository
                      </a>
                      {project.meta.pr && (
                        <a href={`${repo.html_url}/pull/${project.meta.pr}`} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm text-ink transition-colors hover:border-accent/60">
                          <GitPullRequest className="h-4 w-4" aria-hidden="true" /> Review PR #{project.meta.pr}
                        </a>
                      )}
                      {(project.meta.website || repo.homepage) && (
                        <a href={project.meta.website || repo.homepage} target="_blank" rel="noreferrer noopener" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-4 text-sm text-ink hover:border-accent/60">
                          <ExternalLink className="h-4 w-4" aria-hidden="true" /> {project.meta.website ? 'Product website' : 'Homepage'}
                        </a>
                      )}
                    </div>
                  )}
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
