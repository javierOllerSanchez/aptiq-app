import { createRng } from '../rng';
import { type TypeCode } from '../taxonomy';
import { availableTypes } from '../verbal/bank';
import type { Level } from '../types';
import { nextSeed, type PracticeItemSpec } from './plan';

/** Preguntas de la Sesión de hoy (decisión del propietario 2026-11-15). */
export const HOY_PREGUNTAS = 12;

export interface TodayInput {
  /** Día local «AAAA-MM-DD»: semilla de la sesión. Las semillas ya usadas se saltan (CON-02), así que repetirla el mismo día da preguntas nuevas. */
  dia: string;
  /** Tipos que tocan repaso hoy (`dueTypes`, REP-01). */
  due: readonly TypeCode[];
  /** Fallos por tipo en el historial (ENT-02). */
  fallos: Partial<Record<TypeCode, number>>;
  /** Nivel adaptativo por tipo (`adaptLevels`, ENT-03). */
  levels: Record<TypeCode, Level>;
  usedSeeds?: ReadonlySet<string>;
}

/**
 * Reparte `n` preguntas en proporción a los pesos, con el método del mayor resto: el reparto es
 * exacto y determinista, y a más peso nunca le tocan menos preguntas.
 */
function repartir(n: number, pesos: readonly number[]): number[] {
  const total = pesos.reduce((a, b) => a + b, 0);
  const cuotas = pesos.map((p) => (p / total) * n);
  const out = cuotas.map(Math.floor);
  const orden = cuotas.map((c, i) => [c - Math.floor(c), pesos[i]!, i] as const).sort((a, b) => b[0] - a[0] || b[1] - a[1] || a[2] - b[2]);
  const faltan = n - out.reduce((a, b) => a + b, 0);
  for (let k = 0; k < faltan; k++) out[orden[k]![2]]!++;
  return out;
}

/**
 * Sesión de hoy (ENT-02): la mitad para los tipos que tocan repaso y el resto en proporción a los
 * fallos (1 + fallos por tipo), cada pregunta al nivel adaptativo de su tipo. Sin repasos, toda la
 * sesión va por fallos.
 */
export function buildToday(input: TodayInput): PracticeItemSpec[] {
  const tiposHoy = availableTypes();
  // Un tipo del banco que se ha quedado sin preguntas aprobadas no se repasa.
  const due = input.due.filter((t) => tiposHoy.includes(t));
  const repaso = due.length ? Math.floor(HOY_PREGUNTAS / 2) : 0;
  const tipos: TypeCode[] = [];
  repartir(repaso, due.map(() => 1)).forEach((k, i) => tipos.push(...Array<TypeCode>(k).fill(due[i]!)));
  repartir(HOY_PREGUNTAS - repaso, tiposHoy.map((c) => 1 + (input.fallos[c] ?? 0))).forEach((k, i) =>
    tipos.push(...Array<TypeCode>(k).fill(tiposHoy[i]!)),
  );

  const rng = createRng(`hoy:${input.dia}`);
  const taken = new Set(input.usedSeeds ?? []);
  const out = tipos.map((type) => ({ type, level: input.levels[type], seed: nextSeed(type, input.levels[type], rng, taken) }));
  return rng.shuffle(out);
}
