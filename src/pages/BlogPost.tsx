import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, FolderGit2, Info } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Reveal } from '@/components/Reveal';
import { postBySlug, posts, postText, type Block } from '@/data/posts';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/lib/cn';
import { readingMinutes } from '@/lib/format';
import { ExampleLabel } from './Blog';
import { NotFound } from './NotFound';

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case 'p':
      return <p key={i}>{b.text}</p>;
    case 'list':
      return (
        <ul key={i}>
          {b.items.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      );
    case 'code':
      return (
        <figure key={i} className="my-6 overflow-hidden rounded-xl border border-line bg-bg/80">
          <figcaption className="flex items-center justify-between border-b border-line/70 bg-elevated/50 px-4 py-2 font-mono text-[11px] text-muted">
            <span>{b.lang}</span>
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
              <span className="h-2 w-2 rounded-full bg-line" />
            </span>
          </figcaption>
          <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-ink/90">
            <code>{b.code}</code>
          </pre>
        </figure>
      );
    case 'callout':
      return (
        <aside key={i} className="my-6 flex gap-3 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm leading-relaxed text-ink/90">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <p className="!my-0">{b.text}</p>
        </aside>
      );
  }
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '');
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -65% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function BlogPost() {
  const { slug = '' } = useParams();
  const post = postBySlug(slug);
  useDocumentMeta({ title: post?.title ?? 'Article not found', description: post?.excerpt, type: 'article', noindex: !post });
  const ids = useMemo(() => post?.sections.map((s) => s.id) ?? [], [post]);
  const active = useActiveHeading(ids);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  if (!post) return <NotFound />;

  const minutes = readingMinutes(postText(post));
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.p);

  return (
    <article className="pb-10 pt-32 sm:pt-36">
      <header className="container max-w-4xl">
        <Reveal>
          <Link to="/blog" className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> All insights
          </Link>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ExampleLabel />
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {minutes} min read
            </span>
            <Link to={`/projects?open=${encodeURIComponent(post.basedOn)}`} className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-accent">
              <FolderGit2 className="h-3.5 w-3.5" aria-hidden="true" /> based on {post.basedOn}
            </Link>
          </div>
          <h1 className="mt-5 text-display-lg font-semibold text-ink">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted sm:text-xl">{post.excerpt}</p>
          <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t} className="chip">
                #{t}
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      <div className="container mt-14 grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:order-none">
          <nav aria-label="Table of contents" className="lg:sticky lg:top-28">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80">On this page</p>
            <div className="relative mt-4 hidden h-px bg-line lg:block" aria-hidden="true">
              <motion.div className="absolute inset-0 origin-left bg-accent" style={{ scaleX: progress }} />
            </div>
            <ol className="mt-4 space-y-1 border-l border-line">
              {post.sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={active === s.id ? 'location' : undefined}
                    className={cn(
                      '-ml-px block border-l py-1.5 pl-4 text-sm transition-colors',
                      active === s.id ? 'border-accent text-ink' : 'border-transparent text-muted hover:text-ink',
                    )}
                  >
                    <span className="mr-2 font-mono text-[11px] text-muted/60">0{i + 1}</span>
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="prose-ou max-w-[68ch] text-[17px]">
          {post.sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              {s.blocks.map(renderBlock)}
            </section>
          ))}
          <p className="!mt-14 rounded-xl border border-line bg-surface/60 p-4 font-mono text-xs leading-relaxed text-muted">
            Example article: written to demonstrate this layout and summarize public repository content. Not an official publication; no author or date is claimed.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container mt-20 max-w-6xl" aria-labelledby="related-title">
          <h2 id="related-title" className="text-display-md font-semibold text-ink">
            Related
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {related.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="card glow-border group flex flex-col p-6 transition-transform hover:-translate-y-1">
                <span className="font-mono text-xs text-muted">{p.tags.map((t) => `#${t}`).join(' ')}</span>
                <span className="mt-3 text-lg font-semibold text-ink">{p.title}</span>
                <span className="mt-2 text-sm text-muted">{p.excerpt}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent">
                  Read <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
