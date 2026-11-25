import {
  type Allowance,
  adaptLevels,
  allowance,
  buildToday,
  type DatedAnswer,
  daysToExam,
  dueTypes,
  type Item,
  type Level,
  levelHistory,
  streak,
  type TypeCode,
  typeCodes,
  type WeekLevel,
} from '@aptiq/engine';

import type { SavedQuestion, Store } from '@/data/store';
import { generarSinRepetir, isCorrect } from '@/practice/run';

/** Día LOCAL del móvil, «AAAA-MM-DD» (el motor no usa relojes: la app le pasa el día). */
export function diaLocal(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Ajuste donde se apunta el día de la última Sesión de hoy terminada. */
export const AJUSTE_HOY = 'sesion_hoy';
const SEMANAS = 4;

export interface Progress {
  hoy: string;
  /** Nivel adaptativo por tipo (ENT-03). */
  levels: Record<TypeCode, Level>;
  semanas: WeekLevel[];
  /** Tipos que tocan repaso hoy (REP-01). */
  due: TypeCode[];
  fallos: Record<TypeCode, number>;
  racha: number;
  /** null si no hay fecha de examen o ya pasó. */
  diasExamen: number | null;
  hoyHecha: boolean;
  /** Días en que se empezó un simulacro que se ha guardado (terminado o abierto). */
  diasSimulacro: string[];
  /** Días con alguna respuesta guardada (tira de la semana de Inicio). */
  diasPractica: string[];
  /** Preguntas respondidas hoy en sesiones y simulacros terminados (objetivo diario). */
  hoyRespondidas: number;
}

/** Respuestas de sesiones y simulacros terminados, de la más antigua a la más reciente, con su día local. */
async function datedAnswers(store: Store): Promise<DatedAnswer[]> {
  const bloques: { t: number; qs: SavedQuestion[] }[] = [
    ...(await store.sessions()).map((s) => ({ t: s.creada, qs: s.questions })),
    ...(await store.attempts())
      .filter((a) => a.finishedAt !== null)
      .map((a) => ({ t: a.empezado, qs: a.questions })),
  ].sort((a, b) => a.t - b.t);
  return bloques.flatMap(({ t, qs }) =>
    qs.map((q) => ({
      dia: diaLocal(t),
      type: q.type,
      level: q.level,
      correct: isCorrect(q),
      blank: q.answer === null,
    })),
  );
}

/** Todo lo de la fase 6 calculado a partir del historial que ya se sincroniza. */
export async function loadProgress(store: Store, now: number = Date.now()): Promise<Progress> {
  const hoy = diaLocal(now);
  const raw = await store.getSetting('niveles');
  const start = {
    ...Object.fromEntries(typeCodes.map((c) => [c, null])),
    ...(raw ? JSON.parse(raw) : {}),
  } as Record<TypeCode, Level | null>;
  const answers = await datedAnswers(store);
  const fallos = Object.fromEntries(typeCodes.map((c) => [c, 0])) as Record<TypeCode, number>;
  for (const a of answers) if (!a.correct && !a.blank) fallos[a.type]++;
  return {
    hoy,
    levels: adaptLevels(start, answers),
    semanas: levelHistory(start, answers, hoy, SEMANAS),
    due: dueTypes(answers, hoy),
    fallos,
    racha: streak(
      answers.map((a) => a.dia),
      hoy,
    ),
    diasExamen: daysToExam(hoy, await store.getSetting('fecha')),
    hoyHecha: (await store.getSetting(AJUSTE_HOY)) === hoy,
    diasSimulacro: (await store.attempts()).map((a) => diaLocal(a.empezado)),
    diasPractica: [...new Set(answers.map((a) => a.dia))],
    hoyRespondidas: answers.filter((a) => a.dia === hoy).length,
  };
}

/** Qué permite el plan hoy (tabla «Monetización»). */
export function permiso(p: Progress, premium: boolean): Allowance {
  return allowance({
    premium,
    hoy: p.hoy,
    sesionHoyHecha: p.hoyHecha,
    diasSimulacro: p.diasSimulacro,
  });
}

/** Aptitud claramente más floja: la única con el nivel más bajo. Con empate en el mínimo, ninguna. */
export function aptitudFloja(porAptitud: Record<string, number>): string | null {
  const vals = Object.entries(porAptitud);
  if (vals.length < 2) return null;
  const min = Math.min(...vals.map(([, v]) => v));
  const enMin = vals.filter(([, v]) => v === min);
  return enMin.length === 1 ? enMin[0]![0] : null;
}

/**
 * Preguntas de la Sesión de hoy (ENT-02), reservando sus semillas (CON-02).
 * La repetición espaciada (REP-01) es de Premium: en el plan gratuito no hay tipos de repaso.
 */
export async function startToday(store: Store, now: number, premium: boolean): Promise<Item[]> {
  const p = await loadProgress(store, now);
  const due = premium ? p.due : [];
  const specs = buildToday({
    dia: p.hoy,
    due,
    fallos: p.fallos,
    levels: p.levels,
    usedSeeds: await store.usedSeeds(),
  });
  return generarSinRepetir(store, specs);
}
