import { cn } from '@/lib/cn';

/** Infinite CSS marquee (pauses on hover; stops under reduced motion via globals.css). */
export function Marquee({ items, className, reverse = false }: { items: string[]; className?: string; reverse?: boolean }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-3 whitespace-nowrap rounded-full border border-line/80 bg-surface/60 px-4 py-2 text-sm text-muted">
          <span className="h-1 w-1 rounded-full bg-accent" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn('group mask-fade-x flex overflow-hidden', className)}>
      <div className={cn('flex w-max animate-marquee group-hover:[animation-play-state:paused]', reverse && '[animation-direction:reverse]')}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
