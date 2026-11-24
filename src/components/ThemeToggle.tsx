import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

const ICONS = { system: Monitor, dark: Moon, light: Sun } as const;
const NEXT = { system: 'dark', dark: 'light', light: 'system' } as const;

export function ThemeToggle() {
  const { preference, cycle } = useTheme();
  const Icon = ICONS[preference];
  return (
    <button
      type="button"
      onClick={cycle}
      className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl border border-line bg-surface/60 text-muted transition-colors hover:border-accent/50 hover:text-ink active:scale-95"
      aria-label={`Theme: ${preference}. Switch to ${NEXT[preference]}.`}
      title={`Theme: ${preference}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={preference}
          initial={{ y: 14, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.2 }}
        >
          <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
