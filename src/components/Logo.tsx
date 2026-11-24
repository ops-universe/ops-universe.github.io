import { cn } from '@/lib/cn';

/** Ops Universe mark: a core node held by an orbit — "operations around a trusted center". */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('h-8 w-8', className)}>
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" className="fill-elevated stroke-line" />
      <ellipse cx="16" cy="16" rx="10.5" ry="5" transform="rotate(-28 16 16)" className="stroke-accent" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="3.6" className="fill-accent" />
      <circle cx="24.6" cy="10.6" r="1.7" className="fill-signal" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">
        ops<span className="text-accent">/</span>universe
      </span>
    </span>
  );
}
