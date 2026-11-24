import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Github, Heart, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/Button';
import { Reveal, Stagger, staggerItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { practices, principles, timeline } from '@/data/content';
import { useAsync } from '@/hooks/useAsync';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useOrgData } from '@/hooks/useOrgData';
import { cn } from '@/lib/cn';
import { fetchOrgContributors } from '@/lib/github';
import { site } from '@/lib/site';

function Contributors() {
  const state = useOrgData();
  const repos = state.data?.repos;
  const result = useAsync(repos ? `contributors:${repos.map((r) => r.name).join(',')}` : null, () => fetchOrgContributors(repos ?? []));
  const loading = result.status === 'idle' || result.status === 'loading';
  const list = result.status === 'success' ? result.value : [];

  return (
    <section className="container py-20" aria-labelledby="people-title">
      <SectionHeading eyebrow="People" title={<span id="people-title">Maintainers and contributors.</span>}>
        Ops Universe is founded and maintained by Ankit Parekh. Contributors below come straight from the GitHub contributors API.
      </SectionHeading>
      <div className="mt-10 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <article className="card flex h-full flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <img
              src="https://github.com/AnkitParekh007.png?size=192"
              alt=""
              width={96}
              height={96}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-2xl border border-line bg-elevated object-cover"
            />
            <div>
              <p className="eyebrow">Founder · Maintainer</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">Ankit Parekh</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">Approves merges and sets the standards. Reach out through GitHub issues on any repository.</p>
              <a href={site.links.maintainer} target="_blank" rel="noreferrer noopener" className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs text-accent hover:underline">
                <Github className="h-3.5 w-3.5" aria-hidden="true" /> @AnkitParekh007
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </article>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="card h-full p-6 sm:p-8">
            <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Contributors</h3>
            {loading ? (
              <div className="mt-5 flex gap-3" role="status" aria-label="Loading contributors">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="skeleton h-12 w-12 rounded-full" />
                ))}
              </div>
            ) : list.length ? (
              <ul className="mt-5 flex flex-wrap gap-3">
                {list.map((c) => (
                  <li key={c.login}>
                    <a href={c.html_url} target="_blank" rel="noreferrer noopener" className="group flex items-center gap-3 rounded-xl border border-line bg-elevated/40 py-2 pl-2 pr-4 transition-colors hover:border-accent/50">
                      <img src={`${c.avatar_url}&s=80`} alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full" />
                      <span>
                        <span className="block text-sm text-ink">@{c.login}</span>
                        <span className="block font-mono text-[11px] text-muted">{c.contributions} commits</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-sm leading-relaxed text-muted">
                No contributor data is available yet — repositories with only an initial commit may not report contributors.{' '}
                <a href={site.links.contributing} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">
                  Be the first.
                </a>
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function About() {
  useDocumentMeta({
    title: 'About',
    description: 'Mission, principles, engineering standards and roadmap of Ops Universe — open-source AI engineering and responsible automation.',
  });

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-32 sm:pt-40">
        <div className="bg-grid mask-radial absolute inset-0" aria-hidden="true" />
        <div className="container relative grid gap-12 lg:grid-cols-2 lg:items-end">
          <SectionHeading as="h1" eyebrow="About" title={<>Make the safe path <span className="text-gradient">the easy path.</span></>}>
            Ops Universe builds open-source foundations for AI engineering and forward-deployed work: standards, starters and tools that make governed automation
            the default instead of an afterthought.
          </SectionHeading>
          <Reveal delay={0.1}>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="card p-6">
                <dt className="eyebrow">Mission</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink/85">
                  Give teams reusable, inspectable building blocks for automation that is authorized explicitly, tested on its failure paths and documented end to
                  end.
                </dd>
              </div>
              <div className="card p-6">
                <dt className="eyebrow">Vision</dt>
                <dd className="mt-3 text-sm leading-relaxed text-ink/85">
                  An ecosystem where every project ships with its threat model, rollback plan and release evidence — so confidence is earned, not claimed.
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="container py-20" aria-labelledby="values-title">
        <SectionHeading eyebrow="Core values" title={<span id="values-title">Four principles, stated in the org profile.</span>} />
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <motion.article key={p.title} variants={staggerItem} className="card group p-6 transition-colors hover:border-accent/40">
              <p.icon className="h-6 w-6 text-accent transition-transform duration-300 group-hover:-translate-y-1" aria-hidden="true" />
              <h3 className="mt-5 text-lg font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
            </motion.article>
          ))}
        </Stagger>
      </section>

      <section className="container py-20" aria-labelledby="practice-title">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Engineering principles" title={<span id="practice-title">Written down, then enforced.</span>}>
            Quoted from{' '}
            <a href={site.links.standards} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">
              ops-standards
            </a>
            . Every project is held to the same rules and stays a Developer Preview until its release gates are verified.
          </SectionHeading>
          <Stagger as="ul" className="grid gap-3">
            {practices.map((p) => (
              <motion.li key={p} variants={staggerItem} className="card flex items-start gap-4 p-4 sm:p-5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="text-sm leading-relaxed text-ink/90 sm:text-[15px]">{p}</span>
              </motion.li>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="container py-20" aria-labelledby="timeline-title">
        <SectionHeading eyebrow="Timeline & roadmap" title={<span id="timeline-title">Where we are, and what is next.</span>}>
          Drawn from GitHub history and each repository's ROADMAP. Future items are intentions, not commitments.
        </SectionHeading>
        <div className="relative mt-12">
        <span className="absolute left-[11px] top-0 hidden h-full w-px bg-gradient-to-b from-accent via-line to-transparent sm:block" aria-hidden="true" />
        <ol className="relative ml-3 border-l border-line sm:ml-0 sm:border-l-0">
          {timeline.map((m, i) => (
            <Reveal as="li" key={m.title} delay={i * 0.05} className="relative pb-10 pl-8 sm:pl-14">
              <span
                className={cn(
                  'absolute -left-[7px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 sm:left-[5px]',
                  m.state === 'done' && 'border-accent bg-accent',
                  m.state === 'active' && 'border-signal bg-bg',
                  m.state === 'next' && 'border-line bg-bg',
                )}
                aria-hidden="true"
              >
                {m.state === 'active' && <span className="absolute inset-0 animate-pulse-ring rounded-full bg-signal" />}
              </span>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                {m.label}
                <span className="sr-only"> — {m.state === 'done' ? 'completed' : m.state === 'active' ? 'in progress' : 'upcoming'}</span>
              </p>
              <h3 className="mt-1.5 text-lg font-semibold text-ink">{m.title}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{m.body}</p>
            </Reveal>
          ))}
        </ol>
        </div>
      </section>

      <Contributors />

      <section className="container py-20" aria-labelledby="community-title">
        <Reveal>
          <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow">Community</p>
              <h2 id="community-title" className="mt-3 text-display-md font-semibold text-ink">
                Contribute, ask, or support.
              </h2>
              <p className="mt-3 max-w-xl text-muted">
                Use issues for reproducible bugs and Discussions where enabled for questions. There is no guaranteed SLA — but every focused, tested pull request gets
                read.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to="/contact">
                <MessageSquareText className="h-4 w-4" aria-hidden="true" /> Get involved
              </Button>
              <Button href={site.links.sponsor} variant="secondary">
                <Heart className="h-4 w-4 text-danger" aria-hidden="true" /> Sponsor
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
