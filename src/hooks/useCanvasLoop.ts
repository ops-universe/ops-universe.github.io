import { useEffect, type RefObject } from 'react';

/** Reads a CSS colour token as an `r,g,b` string for canvas fills. */
export const readToken = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim().split(/\s+/).join(',');

/**
 * Calls `onThemeChange` whenever the palette or light/dark mode changes, so canvas
 * drawings can re-read their colours.
 */
export function observeTheme(onThemeChange: () => void): () => void {
  const mo = new MutationObserver(onThemeChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] });
  return () => mo.disconnect();
}

/**
 * Runs `frame(time)` on every animation frame while `target` is on screen and the tab
 * is visible. With `still`, it draws one frame and stops (reduced motion).
 */
export function useVisibleLoop(target: RefObject<Element | null>, frame: (t: number) => void, still: boolean, deps: unknown[] = []) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;
    let raf = 0;
    let onScreen = false;
    const tick = (t: number) => {
      frame(t);
      raf = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (still) {
        frame(0);
        return;
      }
      if (onScreen && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = !!e?.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, ...deps]);
}
