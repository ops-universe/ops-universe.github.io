import { CircleDot, GitPullRequest, Hourglass, Radio, Database } from 'lucide-react';
import type { ProjectStatus } from '@/data/projects';
import type { DataSource } from '@/lib/github';
import { cn } from '@/lib/cn';
import { LANGUAGE_COLORS } from '@/lib/projects';

const STATUS: Record<ProjectStatus, { cls: string; Icon: typeof CircleDot }> = {
  Foundation: { cls: 'text-accent border-accent/40 bg-accent/10', Icon: CircleDot },
  'In review': { cls: 'text-signal border-signal/40 bg-signal/10', Icon: GitPullRequest },
  Planned: { cls: 'text-warn border-warn/40 bg-warn/10', Icon: Hourglass },
};

export function StatusBadge({ status, className }: { status: ProjectStatus; className?: string }) {
  const { cls, Icon } = STATUS[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] leading-none', cls, className)}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {status}
    </span>
  );
}

export function LanguageDot({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-2.5 w-2.5 rounded-full ring-1 ring-ink/10" style={{ background: LANGUAGE_COLORS[language] ?? '#8a9a7b' }} aria-hidden="true" />
      {language}
    </span>
  );
}

/** Tells the reader whether numbers come from the live API or the build-time snapshot. */
export function DataSourceBadge({ source, fetchedAt, loading }: { source?: DataSource; fetchedAt?: string; loading?: boolean }) {
  if (loading) {
    return (
      <span className="chip" role="status">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted" aria-hidden="true" /> Fetching GitHub data…
      </span>
    );
  }
  const live = source === 'live';
  const when = fetchedAt ? new Date(fetchedAt).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' }) : '';
  return (
    <span className="chip" title={live ? 'Fetched from api.github.com in your browser' : `Build-time snapshot from ${when}`}>
      {live ? (
        <Radio className="h-3 w-3 text-accent" aria-hidden="true" />
      ) : (
        <Database className="h-3 w-3 text-warn" aria-hidden="true" />
      )}
      {live ? 'Live from GitHub API' : `Snapshot · ${when}`}
    </span>
  );
}
