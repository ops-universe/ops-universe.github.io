import { motion } from 'framer-motion';
import { ArrowRight, Clock, FlaskConical } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Stagger, staggerItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { posts, postText } from '@/data/posts';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/lib/cn';
import { readingMinutes } from '@/lib/format';

export function ExampleLabel({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border border-warn/40 bg-warn/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-warn', className)}>
      <FlaskConical className="h-3 w-3" aria-hidden="true" /> Example article
    </span>
  );
}

export function Blog() {
  useDocumentMeta({
    title: 'Insights',
    description: 'Example articles on trusted policy, release gates, safe scaffolding and honest case studies, drawn from the ops-universe repositories.',
  });
  const [tag, setTag] = useState<string | null>(null);
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags))].sort(), []);
  const list = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
  const [lead, ...rest] = list;

  return (
    <div className="container pb-10 pt-32 sm:pt-36">
      <SectionHeading as="h1" eyebrow="Insights" title="Notes on building automation you can trust.">
        These are example articles that demonstrate the blog layout. Each one explains an idea found in an ops-universe repository; none has been formally
        published.
      </SectionHeading>

      <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        {[null, ...tags].map((t) => (
          <button
            key={t ?? 'all'}
            type="button"
            aria-pressed={tag === t}
            onClick={() => setTag(t)}
            className={cn(
              'min-h-9 rounded-full border px-3.5 text-xs transition-colors active:scale-95',
              tag === t ? 'border-accent bg-accent text-accent-ink' : 'border-line bg-surface/60 text-muted hover:border-accent/40 hover:text-ink',
            )}
          >
            {t ?? 'All'}
          </button>
        ))}
      </div>

      {lead && (
        <motion.article key={lead.slug} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card glow-border group relative mt-8 overflow-hidden p-6 sm:p-10">
          <div className="bg-grid mask-radial absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <ExampleLabel />
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {readingMinutes(postText(lead))} min read
                </span>
              </div>
              <h2 className="mt-5 text-display-md font-semibold text-ink">
                <Link to={`/blog/${lead.slug}`} className="after:absolute after:inset-0">
                  {lead.title}
                </Link>
              </h2>
              <p className="mt-3 text-muted sm:text-lg">{lead.excerpt}</p>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {lead.tags.map((t) => (
                  <li key={t} className="chip">
                    #{t}
                  </li>
                ))}
              </ul>
            </div>
            <span className="inline-flex items-center gap-2 text-sm text-accent">
              Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </motion.article>
      )}

      <Stagger key={tag ?? 'all'} className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <motion.article key={p.slug} variants={staggerItem} className="card glow-border group relative flex flex-col p-6">
            <div className="flex items-center justify-between gap-2">
              <ExampleLabel />
              <span className="font-mono text-xs text-muted">{readingMinutes(postText(p))} min</span>
            </div>
            <h2 className="mt-5 text-xl font-semibold leading-snug text-ink">
              <Link to={`/blog/${p.slug}`} className="after:absolute after:inset-0">
                {p.title}
              </Link>
            </h2>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted">{p.excerpt}</p>
            <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4">
              <span className="font-mono text-xs text-muted">from {p.basedOn}</span>
              <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
          </motion.article>
        ))}
      </Stagger>
    </div>
  );
}
