import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useMagnetic } from '@/hooks/useMagnetic';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-ink border border-primary shadow-float hover:-translate-y-0.5 hover:shadow-glow active:brightness-95',
  secondary:
    'border border-line bg-surface/70 text-ink hover:border-accent/60 hover:bg-surface hover:-translate-y-0.5 active:bg-surface backdrop-blur',
  ghost: 'text-muted hover:text-ink hover:bg-elevated/70 active:bg-elevated',
};

interface Props {
  to?: string;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: Variant;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}

const base =
  'group relative inline-flex min-h-11 select-none items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-[background,box-shadow,border-color,color,filter,transform] duration-300 disabled:pointer-events-none disabled:opacity-50';

/** Button / internal link / external link with optional magnetic pull (desktop only). */
export function Button({ to, href, onClick, type = 'button', variant = 'primary', magnetic = false, className, children, disabled }: Props) {
  const m = useMagnetic(magnetic ? 0.3 : 0);
  const cls = cn(base, styles[variant], className);
  const motionProps = magnetic
    ? { style: { x: m.x, y: m.y }, onPointerMove: m.onPointerMove, onPointerLeave: m.onPointerLeave }
    : {};
  const tap = { whileTap: { scale: 0.97 } };

  if (to) {
    return (
      <motion.span className="inline-flex" {...motionProps} {...tap}>
        <Link to={to} className={cls}>
          {children}
        </Link>
      </motion.span>
    );
  }
  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noreferrer noopener" className={cls} {...motionProps} {...tap}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </motion.a>
    );
  }
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled} className={cls} {...motionProps} {...tap}>
      {children}
    </motion.button>
  );
}
