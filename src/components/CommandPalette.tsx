import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BookOpen, CornerDownLeft, FileText, FolderGit2, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '@/data/projects';
import { posts } from '@/data/posts';
import { nav } from '@/lib/site';
import { cn } from '@/lib/cn';

interface Item {
  id: string;
  label: string;
  hint: string;
  to: string;
  group: 'Pages' | 'Projects' | 'Insights';
}

const ITEMS: Item[] = [
  ...nav.map((n) => ({ id: `page:${n.to}`, label: n.label, hint: n.to, to: n.to, group: 'Pages' as const })),
  ...projects.map((p) => ({ id: `proj:${p.name}`, label: p.name, hint: p.summary, to: `/projects?open=${encodeURIComponent(p.name)}`, group: 'Projects' as const })),
  ...posts.map((p) => ({ id: `post:${p.slug}`, label: p.title, hint: p.tags.join(' · '), to: `/blog/${p.slug}`, group: 'Insights' as const })),
];

const GROUP_ICON = { Pages: FileText, Projects: FolderGit2, Insights: BookOpen } as const;

/** Cmd/Ctrl+K search across pages, projects and articles. */
export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const go = (item: Item | undefined) => {
    if (!item) return;
    onClose();
    navigate(item.to);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.getElementById(`cmd-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search the site"
            className="card w-full max-w-xl overflow-hidden"
            initial={{ y: -12, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search pages, projects, insights…"
                className="h-14 flex-1 bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-list"
                aria-activedescendant={results[active] ? `cmd-${active}` : undefined}
                aria-label="Search"
              />
              <kbd className="chip">esc</kbd>
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”.</li>}
              {results.map((item, i) => {
                const Icon = GROUP_ICON[item.group];
                const showGroup = i === 0 || results[i - 1]?.group !== item.group;
                return (
                  <li key={item.id} role="presentation">
                    {showGroup && <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">{item.group}</p>}
                    <div
                      id={`cmd-${i}`}
                      role="option"
                      aria-selected={i === active}
                      onMouseMove={() => setActive(i)}
                      onClick={() => go(item)}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                        i === active ? 'bg-accent/10 text-ink' : 'text-muted',
                      )}
                    >
                      <Icon className={cn('h-4 w-4 shrink-0', i === active && 'text-accent')} aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{item.label}</span>
                        <span className="block truncate text-xs text-muted/80">{item.hint}</span>
                      </span>
                      {i === active ? <CornerDownLeft className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> : <ArrowRight className="h-3.5 w-3.5 opacity-0" aria-hidden="true" />}
                    </div>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
