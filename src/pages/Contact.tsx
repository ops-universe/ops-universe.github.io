import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowUpRight, Bug, CheckCircle2, Coffee, ExternalLink, GitPullRequest, Github, Heart, Lightbulb, Loader2, MessagesSquare, ShieldAlert } from 'lucide-react';
import { useId, useState, type FormEvent, type ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Reveal, Stagger, staggerItem } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { contributeSteps } from '@/data/content';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { cn } from '@/lib/cn';
import { site } from '@/lib/site';

type Topic = 'question' | 'bug' | 'feature' | 'contribution' | 'security';

const TOPICS: Array<{ value: Topic; label: string; label_: string }> = [
  { value: 'question', label: 'Question', label_: 'question' },
  { value: 'feature', label: 'Feature or standard proposal', label_: 'enhancement' },
  { value: 'bug', label: 'Bug report', label_: 'bug' },
  { value: 'contribution', label: 'I want to contribute', label_: 'contribution' },
  { value: 'security', label: 'Security vulnerability', label_: '' },
];

const REPOS = ['.github', 'ops-standards', 'ops-template', 'ops-cli', 'ops-ui', 'ops-universe.github.io'];

interface Values {
  name: string;
  repo: string;
  topic: Topic | '';
  subject: string;
  message: string;
}
type Errors = Partial<Record<keyof Values, string>>;

const MAX_URL = 7000; // GitHub rejects very long prefilled issue URLs

function validate(v: Values): Errors {
  const e: Errors = {};
  if (!v.topic) e.topic = 'Choose what this is about.';
  else if (v.topic === 'security') e.topic = 'Please do not report vulnerabilities publicly. Use the private security policy instead.';
  if (v.subject.trim().length < 6) e.subject = 'Add a short title (at least 6 characters).';
  else if (v.subject.length > 120) e.subject = 'Keep the title under 120 characters.';
  if (v.message.trim().length < 30) e.message = 'Describe the problem and what “done” looks like (at least 30 characters).';
  if (v.name && !/^[\w\s.@-]{1,60}$/.test(v.name)) e.name = 'Use letters, numbers, spaces, “.”, “-” or “@” (max 60).';
  return e;
}

function buildIssueUrl(v: Values) {
  const topic = TOPICS.find((t) => t.value === v.topic);
  const body = [
    v.message.trim(),
    '',
    '---',
    `Topic: ${topic?.label ?? ''}`,
    v.name ? `From: ${v.name.trim()}` : null,
    'Sent via the ops-universe website contact form.',
  ]
    .filter((l) => l !== null)
    .join('\n');
  const params = new URLSearchParams({ title: v.subject.trim(), body });
  if (topic?.label_) params.set('labels', topic.label_);
  return `https://github.com/ops-universe/${v.repo}/issues/new?${params.toString()}`;
}

function Field({ id, label, hint, error, children, optional }: { id: string; label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-sm font-medium text-ink">
        {label}
        {optional && <span className="font-mono text-[11px] font-normal text-muted">optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 flex items-start gap-1.5 overflow-hidden text-xs text-danger"
          >
            <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = (invalid: boolean) =>
  cn(
    'w-full rounded-xl border bg-bg/60 px-3.5 text-sm text-ink transition-[border-color,box-shadow] placeholder:text-muted/60 hover:border-accent/40 focus:outline-none focus:ring-2',
    invalid ? 'border-danger/70 focus:border-danger focus:ring-danger/20' : 'border-line focus:border-accent/60 focus:ring-accent/20',
  );

function ContactForm() {
  const uid = useId();
  const [values, setValues] = useState<Values>({ name: '', repo: '.github', topic: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'preparing' | 'ready' | 'error'>('idle');
  const [issueUrl, setIssueUrl] = useState('');

  const set = <K extends keyof Values>(k: K, v: Values[K]) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Values) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(values));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    setTouched({ name: true, topic: true, subject: true, message: true });
    if (Object.keys(errs).length) {
      const first = (['topic', 'subject', 'message', 'name'] as const).find((k) => errs[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    setStatus('preparing');
    window.setTimeout(() => {
      const url = buildIssueUrl(values);
      if (url.length > MAX_URL) {
        setStatus('error');
        return;
      }
      setIssueUrl(url);
      setStatus('ready');
    }, 450);
  };

  const describedBy = (k: keyof Values, hint = false) => [hint && `${uid}-${k}-hint`, errors[k] && `${uid}-${k}-error`].filter(Boolean).join(' ') || undefined;

  if (status === 'ready') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center p-8 text-center sm:p-12" role="status" aria-live="polite">
        <motion.span initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }} className="grid h-16 w-16 place-items-center rounded-2xl bg-accent/15 text-accent">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </motion.span>
        <h3 className="mt-6 text-2xl font-semibold text-ink">Your issue is ready.</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          We prepared a pre-filled issue on <span className="font-mono text-ink">ops-universe/{values.repo}</span>. Review it on GitHub, then press “Submit new
          issue”. Issues are public.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={issueUrl}>
            <Github className="h-4 w-4" aria-hidden="true" /> Open on GitHub <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
          <Button variant="secondary" onClick={() => setStatus('idle')}>
            Edit message
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8" aria-describedby={`${uid}-about`}>
      <p id={`${uid}-about`} className="rounded-xl border border-line/70 bg-elevated/40 p-3 text-xs leading-relaxed text-muted">
        This site has no backend and stores nothing. Submitting builds a pre-filled <strong className="text-ink">public</strong> GitHub issue you can review before
        posting. Don't include secrets or private data.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${uid}-topic`} label="Topic" error={touched.topic ? errors.topic : undefined}>
          <select
            id={`${uid}-topic`}
            value={values.topic}
            onChange={(e) => set('topic', e.target.value as Topic)}
            onBlur={() => blur('topic')}
            aria-invalid={!!(touched.topic && errors.topic)}
            aria-describedby={describedBy('topic')}
            className={cn(inputCls(!!(touched.topic && errors.topic)), 'h-11 cursor-pointer')}
          >
            <option value="" disabled>
              Choose…
            </option>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${uid}-repo`} label="Repository">
          <select id={`${uid}-repo`} value={values.repo} onChange={(e) => set('repo', e.target.value)} className={cn(inputCls(false), 'h-11 cursor-pointer font-mono')}>
            {REPOS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <AnimatePresence initial={false}>
        {values.topic === 'security' && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="flex gap-3 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-ink">
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <p>
                Report vulnerabilities privately via GitHub private vulnerability reporting where available. See the{' '}
                <a href={site.links.security} target="_blank" rel="noreferrer noopener" className="font-medium text-accent underline">
                  security policy
                </a>
                .
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Field id={`${uid}-subject`} label="Title" error={touched.subject ? errors.subject : undefined}>
        <input
          id={`${uid}-subject`}
          value={values.subject}
          onChange={(e) => set('subject', e.target.value)}
          onBlur={() => blur('subject')}
          aria-invalid={!!(touched.subject && errors.subject)}
          aria-describedby={describedBy('subject')}
          placeholder="e.g. Add a dry-run flag to ops-cli init"
          className={cn(inputCls(!!(touched.subject && errors.subject)), 'h-11')}
          maxLength={140}
        />
      </Field>

      <Field
        id={`${uid}-message`}
        label="Message"
        hint="Describe the problem and acceptance criteria. Include versions and sanitized evidence for bugs."
        error={touched.message ? errors.message : undefined}
      >
        <textarea
          id={`${uid}-message`}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          onBlur={() => blur('message')}
          aria-invalid={!!(touched.message && errors.message)}
          aria-describedby={describedBy('message', true)}
          rows={6}
          className={cn(inputCls(!!(touched.message && errors.message)), 'resize-y py-3 leading-relaxed')}
        />
        <p className="mt-1 text-right font-mono text-[11px] text-muted">{values.message.length} chars</p>
      </Field>

      <Field id={`${uid}-name`} label="Name or GitHub handle" optional error={touched.name ? errors.name : undefined}>
        <input
          id={`${uid}-name`}
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
          onBlur={() => blur('name')}
          aria-invalid={!!(touched.name && errors.name)}
          aria-describedby={describedBy('name')}
          autoComplete="nickname"
          className={cn(inputCls(!!(touched.name && errors.name)), 'h-11')}
        />
      </Field>

      <AnimatePresence>
        {status === 'error' && (
          <motion.p role="alert" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-ink">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            Your message is too long to pre-fill on GitHub. Shorten it, or open a blank issue and paste it there.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <a href={site.links.newIssue} target="_blank" rel="noreferrer noopener" className="text-center text-xs text-muted hover:text-ink">
          Prefer the issue forms? Open them directly →
        </a>
        <Button type="submit" disabled={status === 'preparing'} magnetic>
          {status === 'preparing' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Github className="h-4 w-4" aria-hidden="true" />}
          {status === 'preparing' ? 'Preparing…' : 'Prepare GitHub issue'}
        </Button>
      </div>
    </form>
  );
}

const channels = [
  { icon: Bug, title: 'Issues', body: 'Reproducible bugs with versions and sanitized evidence.', href: site.links.newIssue, cta: 'Open an issue' },
  { icon: GitPullRequest, title: 'Pull requests', body: 'Focused, tested changes to any repository — standards, CLI, UI kit or this website.', href: `${site.links.github}/ops-cli/pulls`, cta: 'Browse pull requests' },
  { icon: MessagesSquare, title: 'Discussions', body: 'Questions and ideas, on repositories where Discussions are enabled. Not enabled yet.', href: site.links.support, cta: 'Read support policy' },
  { icon: ShieldAlert, title: 'Security', body: 'Report vulnerabilities privately — never in a public issue.', href: site.links.security, cta: 'Security policy' },
];

export function Contact() {
  useDocumentMeta({
    title: 'Get involved',
    description: 'Open an issue, review a pull request, propose a standard or sponsor Ops Universe. Learn how to contribute.',
  });

  return (
    <>
      <div className="container pb-10 pt-32 sm:pt-36">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading as="h1" eyebrow="Get involved" title="Bring a problem. Leave a better default.">
              Ops Universe is built in the open on GitHub. The fastest way to reach maintainers is an issue with a clear problem and acceptance criteria.
            </SectionHeading>
            <Stagger className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {channels.map((c) => (
                <motion.a
                  key={c.title}
                  variants={staggerItem}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="card group flex flex-col p-5 transition-colors hover:border-accent/50"
                >
                  <c.icon className="h-5 w-5 text-accent transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
                  <span className="mt-4 font-semibold text-ink">{c.title}</span>
                  <span className="mt-1 flex-1 text-sm text-muted">{c.body}</span>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-accent">
                    {c.cta}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </motion.a>
              ))}
            </Stagger>
          </div>
          <Reveal delay={0.1}>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-ink">
              <Lightbulb className="h-5 w-5 text-accent" aria-hidden="true" /> Send a message
            </h2>
            <ContactForm />
          </Reveal>
        </div>
      </div>

      <section className="container py-20" aria-labelledby="how-title">
        <SectionHeading eyebrow="How to contribute" title={<span id="how-title">Three steps from idea to merge.</span>}>
          From the organization's{' '}
          <a href={site.links.contributing} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">
            CONTRIBUTING.md
          </a>
          . By participating you agree to the{' '}
          <a href={site.links.codeOfConduct} target="_blank" rel="noreferrer noopener" className="text-accent hover:underline">
            code of conduct
          </a>
          .
        </SectionHeading>
        <Stagger as="ol" className="mt-10 grid gap-4 md:grid-cols-3">
          {contributeSteps.map((s, i) => (
            <motion.li key={s.title} variants={staggerItem} className="card relative p-6">
              <span className="font-mono text-5xl font-semibold text-line" aria-hidden="true">
                0{i + 1}
              </span>
              <s.icon className="absolute right-6 top-6 h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.li>
          ))}
        </Stagger>
        <Reveal className="mt-6">
          <pre className="card overflow-x-auto p-5 font-mono text-[13px] leading-relaxed text-muted">
            <code>
              <span className="text-accent">$</span> git clone https://github.com/ops-universe/ops-template && cd ops-template{'\n'}
              <span className="text-accent">$</span> git switch -c fix/short-description{'\n'}
              <span className="text-accent">$</span> npm ci && npm test{'\n'}
              <span className="text-muted/70"># commit focused changes with tests, then open a pull request</span>
            </code>
          </pre>
        </Reveal>
      </section>

      <section className="container pb-10" aria-labelledby="support-title">
        <Reveal>
          <div className="card flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 id="support-title" className="text-xl font-semibold text-ink">
                Support the work
              </h2>
              <p className="mt-1 text-sm text-muted">Funding links from the organization's FUNDING.yml.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={site.links.sponsor} variant="secondary">
                <Heart className="h-4 w-4 text-danger" aria-hidden="true" /> GitHub Sponsors
              </Button>
              <Button href={site.links.coffee} variant="secondary">
                <Coffee className="h-4 w-4 text-warn" aria-hidden="true" /> Buy me a coffee
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
