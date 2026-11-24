import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Github, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { nav, site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12));
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'border-b transition-[background,border-color,backdrop-filter] duration-300',
          scrolled || open ? 'border-line/70 bg-bg/75 backdrop-blur-xl' : 'border-transparent bg-transparent',
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="rounded-lg text-ink" aria-label={`${site.name} home`}>
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn('relative block rounded-lg px-3.5 py-2 text-sm transition-colors', isActive ? 'text-ink' : 'text-muted hover:text-ink')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-x-3 -bottom-px h-px bg-accent shadow-[0_0_12px_rgb(var(--accent))]"
                            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSearch}
              className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface/60 pl-3 pr-2 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink sm:inline-flex"
              aria-label="Search the site"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="hidden md:inline">Search</span>
              <kbd className="ml-2 hidden rounded-md border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10px] md:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>
            <button
              type="button"
              onClick={onSearch}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface/60 text-muted hover:text-ink sm:hidden"
              aria-label="Search the site"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <ThemeToggle />
            <a
              href={site.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-surface/60 px-3 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink lg:inline-flex"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface/60 text-ink lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={open ? 'x' : 'm'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto border-t border-line/70 bg-bg/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.ul
              className="container flex flex-col gap-1 py-6"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
            >
              {nav.map((item, i) => (
                <motion.li key={item.to} variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0 } }}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-14 items-center justify-between rounded-xl border px-4 text-2xl font-medium tracking-tight transition-colors',
                        isActive ? 'border-accent/40 bg-accent/5 text-ink' : 'border-transparent text-muted hover:text-ink',
                      )
                    }
                  >
                    {item.label}
                    <span className="font-mono text-xs text-muted/60">0{i + 1}</span>
                  </NavLink>
                </motion.li>
              ))}
              <motion.li variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="mt-6">
                <a href={site.links.github} target="_blank" rel="noreferrer noopener" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-surface text-sm">
                  <Github className="h-4 w-4" aria-hidden="true" /> github.com/ops-universe
                </a>
              </motion.li>
            </motion.ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
