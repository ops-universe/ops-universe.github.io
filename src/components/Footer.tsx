import { Coffee, Github, Heart, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { nav, site } from '@/lib/site';
import { BrandLockup } from './Logo';

const community = [
  { label: 'Contributing', href: site.links.contributing },
  { label: 'Code of conduct', href: site.links.codeOfConduct },
  { label: 'Support', href: site.links.support },
  { label: 'Security policy', href: site.links.security },
  { label: 'Engineering standards', href: site.links.standards },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line/70 bg-surface/40">
      <div className="container grid gap-12 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <BrandLockup className="w-56 -ml-2" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
          <p className="mt-5 inline-flex items-center gap-2 font-mono text-xs text-muted">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-warn" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-warn" />
            </span>
            {site.maturity} · foundations under development
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Site</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="link-underline text-ink/80 hover:text-ink">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Community</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {community.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noreferrer noopener" className="link-underline text-ink/80 hover:text-ink">
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted/80">Support the work</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href={site.links.sponsor} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-ink/80 hover:text-ink">
                  <Heart className="h-4 w-4 text-danger" aria-hidden="true" /> GitHub Sponsors
                </a>
              </li>
              <li>
                <a href={site.links.coffee} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-ink/80 hover:text-ink">
                  <Coffee className="h-4 w-4 text-warn" aria-hidden="true" /> Buy me a coffee
                </a>
              </li>
              <li>
                <a href={site.links.github} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-ink/80 hover:text-ink">
                  <Github className="h-4 w-4" aria-hidden="true" /> GitHub
                </a>
              </li>
              <li>
                <a href={site.links.security} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 text-ink/80 hover:text-ink">
                  <ShieldAlert className="h-4 w-4 text-signal" aria-hidden="true" /> Report a vulnerability
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="border-t border-line/60">
        <div className="container flex flex-col gap-2 py-6 font-mono text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ops Universe contributors. Licenses are set per repository.</p>
          <p>
            Maintained by{' '}
            <a href={site.links.maintainer} target="_blank" rel="noreferrer noopener" className="link-underline text-ink/80">
              @AnkitParekh007
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
