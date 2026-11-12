import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { type ExamState, remainingMs } from '@aptiq/engine';

/**
 * Tiempo restante del simulacro en ms. Se calcula con el reloj en cada actualización,
 * así que si la app estuvo en segundo plano el valor sale bien al volver (NFR-03).
 */
export function useExamClock(state: ExamState): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') setNow(Date.now());
    });
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);

  return remainingMs(state, now);
}
