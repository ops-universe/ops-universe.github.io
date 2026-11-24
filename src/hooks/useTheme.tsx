import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemePreference = 'system' | 'dark' | 'light';
export type Palette = 'aurora' | 'graphite' | 'forest';
type Resolved = 'dark' | 'light';

export const PALETTES: { id: Palette; name: string; note: string; swatch: [string, string, string] }[] = [
  { id: 'aurora', name: 'Aurora', note: 'Lavender, indigo and iridescent glow', swatch: ['#7454F0', '#F496D6', '#6EC8FF'] },
  { id: 'graphite', name: 'Graphite', note: 'Monochrome line-art', swatch: ['#111113', '#8C8C96', '#E4E4E7'] },
  { id: 'forest', name: 'Forest', note: 'Original ops-standards brand', swatch: ['#365C2C', '#D5ED91', '#7DE2D3'] },
];

interface ThemeContextValue {
  preference: ThemePreference;
  resolved: Resolved;
  palette: Palette;
  setPreference: (p: ThemePreference) => void;
  setPalette: (p: Palette) => void;
  cycle: () => void;
}

const MODE_KEY = 'ou-theme';
const PALETTE_KEY = 'ou-palette';
const ThemeContext = createContext<ThemeContextValue | null>(null);

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const v = localStorage.getItem(key) as T | null;
    return v && allowed.includes(v) ? v : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* private mode — the choice lasts for this visit */
  }
}

const systemTheme = (): Resolved =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPref] = useState<ThemePreference>(() => read(MODE_KEY, ['system', 'dark', 'light'] as const, 'system'));
  const [palette, setPal] = useState<Palette>(() => read(PALETTE_KEY, ['aurora', 'graphite', 'forest'] as const, 'aurora'));
  const [system, setSystem] = useState<Resolved>(systemTheme);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => setSystem(mq.matches ? 'light' : 'dark');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const resolved: Resolved = preference === 'system' ? system : preference;

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.palette = palette;
    root.style.colorScheme = resolved;
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim().split(/\s+/).join(',');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', `rgb(${bg})`);
  }, [resolved, palette]);

  const setPreference = useCallback((p: ThemePreference) => {
    setPref(p);
    write(MODE_KEY, p);
  }, []);

  const setPalette = useCallback((p: Palette) => {
    setPal(p);
    write(PALETTE_KEY, p);
  }, []);

  const cycle = useCallback(() => {
    setPreference(preference === 'system' ? 'dark' : preference === 'dark' ? 'light' : 'system');
  }, [preference, setPreference]);

  const value = useMemo(
    () => ({ preference, resolved, palette, setPreference, setPalette, cycle }),
    [preference, resolved, palette, setPreference, setPalette, cycle],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
