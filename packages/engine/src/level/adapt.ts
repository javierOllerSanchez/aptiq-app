import { type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';
import type { LevelAnswer } from './estimate';

const BLOQUE = 10;
const SUBE = 8;
const BAJA = 4;
/** Sin test de nivel de un tipo, se empieza en el 2 (el mismo que usa hoy la práctica). */
const SIN_TEST: Level = 2;

/**
 * Dificultad adaptativa por tipo (ENT-03, decisión del propietario 2026-11-15).
 * Recorre las respuestas en orden: cada 10 respuestas al nivel actual, con 8 o más aciertos sube un
 * nivel y con 4 o menos baja uno. Las de otros niveles no cuentan y en blanco es no acertada.
 * `answers` va de la más antigua a la más reciente.
 */
export function adaptLevels(
  start: Record<TypeCode, Level | null>,
  answers: readonly LevelAnswer[],
): Record<TypeCode, Level> {
  const out = Object.fromEntries(typeCodes.map((c) => [c, start[c] ?? SIN_TEST])) as Record<TypeCode, Level>;
  const aciertos = Object.fromEntries(typeCodes.map((c) => [c, [] as boolean[]])) as Record<TypeCode, boolean[]>;

  for (const a of answers) {
    if (a.level !== out[a.type]) continue;
    const bloque = aciertos[a.type];
    bloque.push(a.correct && !a.blank);
    if (bloque.length < BLOQUE) continue;
    const ok = bloque.filter(Boolean).length;
    if (ok >= SUBE && out[a.type] < 5) out[a.type] = (out[a.type] + 1) as Level;
    else if (ok <= BAJA && out[a.type] > 1) out[a.type] = (out[a.type] - 1) as Level;
    bloque.length = 0;
  }
  return out;
}
