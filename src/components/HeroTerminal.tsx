import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type Line = { kind: 'cmd' | 'out' | 'ok' | 'warn' | 'deny' | 'gap'; text: string };

/**
 * Commands and output taken from the repositories' READMEs:
 * ops-template `npm run demo` prints exactly these three decisions.
 * ops-cli commands are from its README on the open PR; lines starting with "#"
 * are annotations paraphrasing that README, not captured CLI output.
 */
const SCRIPT: Line[] = [
  { kind: 'cmd', text: 'npm run demo   # ops-template' },
  { kind: 'ok', text: '{"name":"read","decision":"allow"}' },
  { kind: 'warn', text: '{"name":"update","decision":"review"}' },
  { kind: 'deny', text: '{"name":"delete","decision":"deny"}' },
  { kind: 'gap', text: '' },
  { kind: 'cmd', text: 'node src/cli.mjs init evalOps --template ../ops-template' },
  { kind: 'out', text: '# skips Git metadata, build dirs, local secrets' },
  { kind: 'out', text: '# rejects symlinks · makes no remote writes' },
  { kind: 'cmd', text: 'node src/cli.mjs validate ../evalOps' },
  { kind: 'out', text: '# structural baseline — not a certification' },
];

const COLORS: Record<Line['kind'], string> = {
  cmd: 'text-ink',
  out: 'text-muted',
  ok: 'text-accent',
  warn: 'text-warn',
  deny: 'text-danger',
  gap: '',
};

export function HeroTerminal({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(reduce ? SCRIPT.length : 0);
  const [typed, setTyped] = useState(0);

  useEffect(() => {
    if (reduce) {
      setShown(SCRIPT.length);
      return;
    }
    if (shown >= SCRIPT.length) {
      const t = window.setTimeout(() => {
        setShown(0);
        setTyped(0);
      }, 6000);
      return () => window.clearTimeout(t);
    }
    const line = SCRIPT[shown]!;
    if (line.kind === 'cmd' && typed < line.text.length) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), 22 + Math.random() * 30);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(
      () => {
        setShown((n) => n + 1);
        setTyped(0);
      },
      line.kind === 'cmd' ? 380 : 160,
    );
    return () => window.clearTimeout(t);
  }, [shown, typed, reduce]);

  const current = SCRIPT[shown];

  return (
    <div className={cn('card overflow-hidden font-mono text-[12px] leading-relaxed sm:text-[13px]', className)}>
      <div className="flex items-center gap-2 border-b border-line/80 bg-elevated/50 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent/70" aria-hidden="true" />
        <span className="ml-2 truncate text-[11px] text-muted">~/ops-universe — zsh</span>
      </div>
      {/* Static transcript for assistive tech; the animated copy is hidden from it. */}
      <pre className="sr-only">{SCRIPT.map((l) => (l.kind === 'cmd' ? `$ ${l.text}` : l.text)).join('\n')}</pre>
      <div aria-hidden="true" className="h-[268px] overflow-hidden px-4 py-4 sm:h-[288px]">
        {SCRIPT.slice(0, shown).map((l, i) => (
          <motion.div
            key={i}
            initial={reduce ? false : { opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn('whitespace-pre-wrap break-all', COLORS[l.kind], l.kind === 'gap' && 'h-3')}
          >
            {l.kind === 'cmd' && <span className="mr-2 text-accent">$</span>}
            {l.text}
          </motion.div>
        ))}
        {current && current.kind === 'cmd' && (
          <div className="whitespace-pre-wrap break-all text-ink">
            <span className="mr-2 text-accent">$</span>
            {current.text.slice(0, typed)}
            <span className="ml-px inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-blink bg-accent" />
          </div>
        )}
        {shown >= SCRIPT.length && (
          <div className="text-ink">
            <span className="mr-2 text-accent">$</span>
            <span className="inline-block h-[1.05em] w-[0.55em] translate-y-[2px] animate-blink bg-accent" />
          </div>
        )}
      </div>
    </div>
  );
}
