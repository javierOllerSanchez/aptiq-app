import { tokens } from '@aptiq/tokens';
import { useEffect, useState } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { Text, type TextProps } from './text';

/**
 * Cifra que cuenta desde 0 hasta `value` en 600 ms ease-out (guía §8).
 * Con «reducir movimiento», la cifra aparece ya en su valor. El lector de pantalla oye solo el final.
 */
export function CountUp({
  value,
  format,
  delay = 0,
  ...rest
}: Omit<TextProps, 'children'> & { value: number; format: (n: number) => string; delay?: number }) {
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const timer = setTimeout(() => {
      const t0 = performance.now();
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / tokens.motion.countUp);
        setShown(value * (1 - (1 - k) ** 3));
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [value, delay, reduce]);
  return (
    <Text accessibilityLabel={format(value)} {...rest}>
      {format(reduce ? value : shown)}
    </Text>
  );
}
