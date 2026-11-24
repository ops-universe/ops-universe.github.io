import { cn } from '@/lib/cn';

/**
 * Ops Universe brand mark: the code planet with its orbit ring.
 * The PNG/WebP has a transparent background with soft glow, so it reads on every palette and theme.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-mark.webp"
      alt=""
      aria-hidden="true"
      width={32}
      height={32}
      decoding="async"
      className={cn('h-8 w-8 select-none object-contain', className)}
    />
  );
}

/** Compact header lockup: mark + live wordmark that follows the active theme tokens. */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="h-9 w-9" />
      <span className="text-[16px] font-bold tracking-tight">
        <span className="text-ink">Ops</span> <span className="brand-gradient-text">Universe</span>
      </span>
    </span>
  );
}

/**
 * Full brand lockup (planet, wordmark and tagline). Two artworks are rendered and CSS shows the one
 * that matches `data-theme`, so it works without JS (prerendered HTML defaults to dark).
 */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn('brand-lockup relative inline-block', className)}>
      <img
        src="/brand/logo-lockup-dark.webp"
        alt="Ops Universe: AI, DevOps, Cloud, Automation"
        width={432}
        height={310}
        loading="lazy"
        decoding="async"
        className="brand-lockup-dark h-auto w-full select-none"
      />
      <img
        src="/brand/logo-lockup-light.webp"
        alt="Ops Universe: AI, DevOps, Cloud, Automation"
        width={560}
        height={319}
        loading="lazy"
        decoding="async"
        className="brand-lockup-light h-auto w-full select-none"
      />
    </span>
  );
}
