import { AnimatePresence, motion } from 'framer-motion';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { PALETTES, useTheme, type ThemePreference } from '@/hooks/useTheme';
import { cn } from '@/lib/cn';

const MODES: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'Auto', icon: Monitor },
];

/** Theme picker: light / dark / system mode plus a colour palette, in a glass popover. */
export function ThemeToggle() {
  const { preference, resolved, palette, setPreference, setPalette } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const Icon = resolved === 'dark' ? Moon : Sun;
  const current = PALETTES.find((p) => p.id === palette) ?? PALETTES[0]!;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Theme settings (${current.name}, ${preference})`}
        className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-line/80 bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:text-ink active:scale-95"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={resolved}
            initial={{ y: 14, opacity: 0, rotate: -60 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -14, opacity: 0, rotate: 60 }}
            transition={{ duration: 0.22 }}
          >
            <Icon className="h-[17px] w-[17px]" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
        <span
          className="absolute bottom-1.5 right-1.5 h-2 w-2 rounded-full ring-2 ring-surface"
          style={{ background: `conic-gradient(${current.swatch.join(',')}, ${current.swatch[0]})` }}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Theme settings"
            initial={{ opacity: 0, y: -8, scale: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card absolute right-0 top-[calc(100%+12px)] z-50 w-[288px] origin-top-right rounded-2xl !bg-surface/90 p-3"
          >
            <p className="px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Mode</p>
            <div className="relative mt-2 grid grid-cols-3 gap-1 rounded-xl border border-line/70 bg-elevated/50 p-1" role="radiogroup" aria-label="Colour mode">
              {MODES.map((m) => {
                const active = preference === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPreference(m.id)}
                    className={cn('relative flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors', active ? 'text-primary-ink' : 'text-muted hover:text-ink')}
                  >
                    {active && <motion.span layoutId="mode-pill" className="absolute inset-0 rounded-lg bg-primary shadow-float" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <m.icon className="relative h-3.5 w-3.5" aria-hidden="true" />
                    <span className="relative">{m.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">Palette</p>
            <ul className="mt-2 space-y-1" role="radiogroup" aria-label="Colour palette">
              {PALETTES.map((p) => {
                const active = palette === p.id;
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPalette(p.id)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-xl border px-2.5 py-2 text-left transition-colors',
                        active ? 'border-accent/50 bg-accent/10' : 'border-transparent hover:bg-elevated/70',
                      )}
                    >
                      <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-line/60" aria-hidden="true">
                        <span className="absolute inset-0 transition-transform duration-500 group-hover:rotate-180" style={{ background: `conic-gradient(${p.swatch.join(',')}, ${p.swatch[0]})` }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{p.name}</span>
                        <span className="block truncate text-[11px] text-muted">{p.note}</span>
                      </span>
                      {active && <Check className="h-4 w-4 text-accent" aria-hidden="true" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
