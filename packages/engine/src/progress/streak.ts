import { addDays, daysBetween } from '../review/spaced';

/**
 * Racha (PRO-03): días seguidos con al menos una sesión o simulacro terminado, contando hasta hoy o,
 * si hoy aún no se ha practicado, hasta ayer. `dias` son fechas locales «AAAA-MM-DD».
 */
export function streak(dias: readonly string[], hoy: string): number {
  const hechos = new Set(dias);
  let d = hechos.has(hoy) ? hoy : addDays(hoy, -1);
  let n = 0;
  while (hechos.has(d)) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

/**
 * Días que faltan para el examen (PRO-03). null si no hay fecha, si no es una fecha válida
 * «AAAA-MM-DD» o si ya ha pasado: no se inventa ni se muestra un número negativo.
 */
export function daysToExam(hoy: string, examen: string | null): number | null {
  if (!examen || !/^\d{4}-\d{2}-\d{2}$/.test(examen)) return null;
  // Una fecha imposible (30 de febrero) no sobrevive a la ida y vuelta.
  if (addDays(examen, 0) !== examen) return null;
  const n = daysBetween(hoy, examen);
  return n < 0 ? null : n;
}
