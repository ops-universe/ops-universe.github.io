import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { staggerItem } from './Reveal';

interface Props {
  icon: LucideIcon;
  label: string;
  value: number | string;
  note?: string;
}

export function StatCounter({ icon: Icon, label, value, note }: Props) {
  const numeric = typeof value === 'number';
  const { ref, value: n } = useCountUp<HTMLParagraphElement>(numeric ? value : 0);
  return (
    <motion.div variants={staggerItem} className="card group relative overflow-hidden p-5 transition-colors hover:border-accent/40">
      <div className="flex items-center justify-between">
        <dt className="text-sm text-muted">{label}</dt>
        <Icon className="h-4 w-4 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:text-accent" aria-hidden="true" />
      </div>
      <dd>
        <p ref={ref} className={numeric ? 'mt-4 font-mono text-3xl font-medium tracking-tight text-ink sm:text-4xl' : 'mt-4 font-mono text-lg font-medium leading-[2.25rem] tracking-tight text-ink sm:leading-[2.5rem]'}>
          {numeric ? n : value}
        </p>
        {note && <p className="mt-1.5 truncate font-mono text-[11px] text-muted/80">{note}</p>}
      </dd>
    </motion.div>
  );
}
