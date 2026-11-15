import { adaptLevels } from '../level/adapt';
import type { LevelAnswer } from '../level/estimate';
import { addDays, daysBetween } from '../review/spaced';
import { taxonomy, type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';

/** Una respuesta con su día local «AAAA-MM-DD». */
export type DatedAnswer = LevelAnswer & { dia: string };

export interface WeekLevel {
  /** Lunes de la semana. */
  semana: string;
  /** Media de los niveles adaptativos de todos los tipos (1–5, con decimales). */
  global: number;
  porAptitud: Record<string, number>;
}

/** Lunes de la semana de `dia` (semana de lunes a domingo, como en España). */
export function mondayOf(dia: string): string {
  const deUnLunes = daysBetween('1970-01-05', dia); // 1970-01-05 fue lunes
  return addDays(dia, -(((deUnLunes % 7) + 7) % 7));
}

const media = (xs: readonly number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * Evolución del nivel (PRO-01): para cada una de las últimas `semanas`, el nivel adaptativo con
 * las respuestas hasta el domingo de esa semana, por aptitud y global. `answers` en orden de respuesta.
 */
export function levelHistory(
  start: Record<TypeCode, Level | null>,
  answers: readonly DatedAnswer[],
  hoy: string,
  semanas: number,
): WeekLevel[] {
  const actual = mondayOf(hoy);
  const out: WeekLevel[] = [];
  for (let k = semanas - 1; k >= 0; k--) {
    const semana = addDays(actual, -7 * k);
    const domingo = addDays(semana, 6);
    const niveles = adaptLevels(start, answers.filter((a) => a.dia <= domingo));
    const grupos: Record<string, number[]> = {};
    for (const c of typeCodes) (grupos[taxonomy[c].aptitud] ??= []).push(niveles[c]);
    out.push({
      semana,
      global: media(typeCodes.map((c) => niveles[c])),
      porAptitud: Object.fromEntries(Object.entries(grupos).map(([apt, xs]) => [apt, media(xs)])),
    });
  }
  return out;
}
