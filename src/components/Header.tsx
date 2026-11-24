import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { ArrowUpRight, Github, Menu, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { nav, site } from '@/lib/site';
import { cn } from '@/lib/cn';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Floating card header. It drops in on load, tightens once the page scrolls,
 * tucks away while scrolling down and returns on the way up. The bottom edge
 * doubles as the reading-progress bar; on mobile the card expands into the menu.
 */
export function Header({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 420 && y > prev + 2);
  });
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

  const tucked = hidden && !open && !reduce;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="scrim"
            className="fixed inset-0 z-40 bg-bg/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        initial={reduce ? false : { y: -90, opacity: 0 }}
        animate={{ y: tucked ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.div
          className={cn(
            'glass-card pointer-events-auto relative mx-auto w-full rounded-[22px] transition-[background-color,box-shadow] duration-500',
            scrolled || open ? 'bg-surface/75' : 'bg-surface/45 shadow-none',
          )}
          initial={false}
          animate={{ maxWidth: scrolled && !open ? 1080 : 1288 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.div
            className="flex items-center justify-between gap-3 pl-4 pr-2.5"
            initial={false}
            animate={{ height: scrolled ? 58 : 66 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Link to="/" className="shrink-0 rounded-lg text-ink" aria-label={`${site.name} home`}>
              <Logo />
            </Link>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 rounded-full border border-line/70 bg-elevated/40 p-1" onPointerLeave={() => setHovered(null)}>
                {nav.map((item) => (
                  <li key={item.to} onPointerEnter={() => setHovered(item.to)}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn('relative block rounded-full px-4 py-1.5 text-[13.5px] font-medium transition-colors duration-200', isActive ? 'text-primary-ink' : 'text-muted hover:text-ink')
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {hovered === item.to && !isActive && (
                            <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-surface/90 shadow-sm" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />
                          )}
                          {isActive && (
                            <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full bg-primary shadow-float" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                          )}
                          <span className="relative">{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={onSearch}
                className="hidden h-10 items-center gap-2 rounded-full border border-line/80 bg-surface/60 pl-3.5 pr-1.5 text-sm text-muted transition-colors hover:border-accent/50 hover:text-ink sm:inline-flex"
                aria-label="Search the site"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                <span className="hidden xl:inline">Search</span>
                <kbd className="rounded-full border border-line bg-elevated px-2 py-0.5 font-mono text-[10px] text-muted">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
              </button>
              <button
                type="button"
                onClick={onSearch}
                className="grid h-10 w-10 place-items-center rounded-full border border-line/80 bg-surface/60 text-muted transition-colors hover:text-ink sm:hidden"
                aria-label="Search the site"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
              <ThemeToggle />
              <a
                href={site.links.github}
                target="_blank"
                rel="noreferrer noopener"
                className="group hidden h-10 items-center gap-2 rounded-full bg-primary pl-3.5 pr-2 text-sm font-semibold text-primary-ink shadow-float transition-transform hover:-translate-y-0.5 lg:inline-flex"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                GitHub
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary-ink/15 transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-ink lg:hidden"
                aria-controls="mobile-menu"
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={open ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
                    {open ? <X className="h-[18px] w-[18px]" aria-hidden="true" /> : <Menu className="h-[18px] w-[18px]" aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.nav
                id="mobile-menu"
                aria-label="Mobile"
                className="overflow-hidden lg:hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <motion.ul
                  className="space-y-1 border-t border-line/60 px-2.5 pb-3 pt-3"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                >
                  {nav.map((item, i) => (
                    <motion.li key={item.to} variants={{ hidden: { opacity: 0, x: -14 }, show: { opacity: 1, x: 0 } }}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center justify-between rounded-2xl px-4 py-3.5 text-xl font-semibold tracking-tight transition-colors',
                            isActive ? 'bg-primary text-primary-ink' : 'text-ink hover:bg-elevated/70',
                          )
                        }
                      >
                        {item.label}
                        <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                      </NavLink>
                    </motion.li>
                  ))}
                  <motion.li variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="pt-2">
                    <a href={site.links.github} target="_blank" rel="noreferrer noopener" className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-muted">
                      <Github className="h-4 w-4" aria-hidden="true" /> {site.links.github.replace('https://', '')}
                    </a>
                  </motion.li>
                </motion.ul>
              </motion.nav>
            )}
          </AnimatePresence>

          {/* Reading progress along the card's bottom edge */}
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-5 bottom-0 h-[2px] origin-left rounded-full bg-gradient-to-r from-glow-3 via-glow-1 to-glow-2"
            style={{ scaleX: progress }}
          />
        </motion.div>
      </motion.header>
    </>
  );
}
