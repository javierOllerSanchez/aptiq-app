import {
  adaptLevels,
  buildToday,
  type DatedAnswer,
  daysToExam,
  dueTypes,
  type Item,
  type Level,
  levelHistory,
  registry,
  streak,
  type TypeCode,
  typeCodes,
  type WeekLevel,
} from '@aptiq/engine';

import type { SavedQuestion, Store } from '@/data/store';
import { isCorrect, OPTION_COUNT } from '@/practice/run';

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
    qs.map((q) => ({ dia: diaLocal(t), type: q.type, level: q.level, correct: isCorrect(q), blank: q.answer === null })),
  );
}

/** Todo lo de la fase 6 calculado a partir del historial que ya se sincroniza. */
export async function loadProgress(store: Store, now: number = Date.now()): Promise<Progress> {
  const hoy = diaLocal(now);
  const raw = await store.getSetting('niveles');
  const start = { ...Object.fromEntries(typeCodes.map((c) => [c, null])), ...(raw ? JSON.parse(raw) : {}) } as Record<
    TypeCode,
    Level | null
  >;
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
  };
}

/** Preguntas de la Sesión de hoy (ENT-02), reservando sus semillas (CON-02). */
export async function startToday(store: Store, now: number = Date.now()): Promise<Item[]> {
  const p = await loadProgress(store, now);
  const specs = buildToday({ dia: p.hoy, due: p.due, fallos: p.fallos, levels: p.levels, usedSeeds: await store.usedSeeds() });
  const items = specs.map((s) => registry[s.type].generator.generate(s.seed, s.level, OPTION_COUNT));
  await store.addUsedSeeds(items.map((it) => it.seed));
  return items;
}
