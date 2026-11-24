import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Reveal } from './Reveal';

interface Props {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
}

export function SectionHeading({ eyebrow, title, children, align = 'left', className, as: H = 'h2' }: Props) {
  return (
    <Reveal className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      <p className={cn('eyebrow', align === 'center' && 'justify-center')}>
        <span className="h-px w-6 bg-accent/60" aria-hidden="true" />
        {eyebrow}
      </p>
      <H className={cn('mt-4 font-semibold text-ink', H === 'h1' ? 'text-display-lg' : 'text-display-md')}>{title}</H>
      {children && <div className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{children}</div>}
    </Reveal>
  );
}
