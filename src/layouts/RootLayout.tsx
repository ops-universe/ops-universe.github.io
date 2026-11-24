import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cloneElement, useCallback, useEffect, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CommandPalette } from '@/components/CommandPalette';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

/** Shell: skip link, header, animated route outlet, footer and global search. */
export function RootLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Each route starts at the top; hash links scroll to their target.
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.hash]);

  return (
    <>
      <a href="#main" className="sr-only z-[90] rounded-lg bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Header onSearch={openSearch} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          id="main"
          tabIndex={-1}
          className="min-h-[70vh] focus:outline-none"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none', transform: 'none' } }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: reduce ? 0.15 : 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {outlet && cloneElement(outlet, { key: location.pathname })}
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CommandPalette open={searchOpen} onClose={closeSearch} />
    </>
  );
}
