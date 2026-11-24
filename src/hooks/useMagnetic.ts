import { useMotionValue, useReducedMotion, useSpring, type MotionValue } from 'framer-motion';
import { useCallback, type PointerEvent } from 'react';
import { useFinePointer } from './useMediaQuery';

interface Magnetic {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (e: PointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}

/** Pulls an element toward the cursor. Inert on touch devices and with reduced motion. */
export function useMagnetic(strength = 0.25): Magnetic {
  const enabled = useFinePointer() && !useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 250, damping: 18, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 250, damping: 18, mass: 0.4 });

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - (r.left + r.width / 2)) * strength);
      rawY.set((e.clientY - (r.top + r.height / 2)) * strength);
    },
    [enabled, rawX, rawY, strength],
  );
  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}
