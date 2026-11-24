import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, FolderGit2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/Button';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

/** On-brand 404: the unknown route is treated like an unknown action — denied. */
export function NotFound() {
  useDocumentMeta({ title: 'Page not found', description: 'This route is not in the policy. Head back to the Ops Universe home page or project directory.', noindex: true });
  const { pathname } = useLocation();
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden pb-16 pt-32">
      <div className="bg-grid mask-radial absolute inset-0 animate-grid-pan" aria-hidden="true" />
      <div className="container relative grid items-center gap-12 lg:grid-cols-2">
        <div className="relative mx-auto aspect-square w-full max-w-[380px]" aria-hidden="true">
          {[1, 0.72, 0.44].map((s, i) => (
            <motion.div
              key={s}
              className="absolute inset-0 m-auto rounded-full border border-line"
              style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
              animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
              transition={{ duration: 30 + i * 12, repeat: Infinity, ease: 'linear' }}
            >
              <span className={`absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full ${i === 0 ? 'bg-danger shadow-[0_0_20px_rgb(var(--danger))]' : i === 1 ? 'bg-signal' : 'bg-accent'}`} />
            </motion.div>
          ))}
          <div className="absolute inset-0 grid place-items-center">
            <motion.span
              className="font-mono text-7xl font-semibold tracking-tighter text-ink sm:text-8xl"
              animate={reduce ? undefined : { opacity: [1, 0.55, 1, 1, 0.8, 1] }}
              transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.05, 0.1, 0.7, 0.72, 0.75] }}
            >
              4<span className="text-danger">0</span>4
            </motion.span>
          </div>
        </div>

        <div>
          <p className="eyebrow text-danger">Route denied</p>
          <h1 className="mt-4 text-display-lg font-semibold text-ink">This page isn't in the policy.</h1>
          <p className="mt-4 max-w-md text-muted sm:text-lg">Unknown actions are denied by default — and so are unknown routes. The page may have moved, or never existed.</p>
          <pre className="card mt-8 overflow-x-auto p-4 font-mono text-xs leading-relaxed sm:text-[13px]">
            <code>
              <span className="text-muted">&gt; </span>
              <span className="text-ink">decide</span>
              <span className="text-muted">({'{'} name: </span>
              <span className="text-signal">"{pathname.length > 40 ? `${pathname.slice(0, 40)}…` : pathname}"</span>
              <span className="text-muted"> {'}'}, routes)</span>
              {'\n'}
              <span className="text-danger">'deny'</span>
            </code>
          </pre>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/" magnetic>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back home
            </Button>
            <Button to="/projects" variant="secondary" magnetic>
              <FolderGit2 className="h-4 w-4" aria-hidden="true" /> Browse projects
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
