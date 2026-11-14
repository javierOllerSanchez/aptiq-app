import {
  type Breakdown,
  breakdown,
  buildPractice,
  guardiaCivil2026,
  type Item,
  type Level,
  registry,
  type Result,
  type TypeCode,
  typeCodes,
} from '@aptiq/engine';

import type { SavedQuestion, Store } from '@/data/store';

/** Opciones por pregunta del perfil de la Guardia Civil (base 7.3, N = 4). */
export const OPTION_COUNT = 4 as const;
export const LETTERS = ['A', 'B', 'C', 'D'] as const;

const bases = guardiaCivil2026.sources.find((s) => s.tipo === 'bases');
/** Cita de las bases que respaldan el formato (para `SourceNote`): solo lo que el perfil acredita. */
export const CITA = bases
  ? `${bases.url.match(/id=([A-Z0-9-]+)/)?.[1] ?? bases.organismo}, ${bases.apartado ?? ''}`
  : 'pendiente de confirmar';

/** Aviso de la decisión de la fase 3: mientras la proporción de tipos no tenga fuente, se dice. */
export const AVISO_MEZCLA = guardiaCivil2026.pendiente.includes('mix')
  ? 'Mezcla de entrenamiento: los 6 tipos a partes casi iguales. La proporción no es oficial: la Guardia Civil no publica el cuestionario de aptitudes.'
  : null;

/** «0,13» con coma y signo menos tipográfico. */
export const formatNota = (n: number) => n.toFixed(2).replace('.', ',').replace('-', '−');

/** Nombres de las aptitudes del motor, en español para la pantalla. */
export const APTITUDE_LABELS: Record<string, string> = {
  numerica: 'Numérica',
  verbal: 'Verbal',
  atencion: 'Atención y percepción',
  abstracta: 'Abstracta',
};

export interface StartOptions {
  count: number;
  reparto: 'equitativo' | 'prioritario';
  /** Aptitud del engine («numerica», «verbal», «atencion», «abstracta»). Sin ella, todos los tipos. */
  aptitude?: string;
  sessionSeed: string;
  levelFor: (type: TypeCode) => Level;
}

/**
 * Crea las preguntas de una sesión y reserva sus semillas, para que no vuelvan a salir (CON-02).
 * Las preguntas se generan con el motor, que es determinista por semilla (NFR-09).
 */
export async function startRun(store: Store, opts: StartOptions): Promise<Item[]> {
  const specs = buildPractice({
    sessionSeed: opts.sessionSeed,
    count: opts.count,
    reparto: opts.reparto,
    ...(opts.aptitude !== undefined ? { aptitude: opts.aptitude } : {}),
    usedSeeds: await store.usedSeeds(),
    fallos: await failuresByType(store),
    levelFor: opts.levelFor,
  });
  // Una semilla distinta puede dar el mismo enunciado (p. ej. series de letras): dentro de la sesión
  // se cambia por otra derivada, sin repetir semillas usadas (CON-02).
  const used = await store.usedSeeds();
  const seen = new Set<string>();
  const items = specs.map((s) => {
    let item = registry[s.type].generator.generate(s.seed, s.level, OPTION_COUNT);
    // ponytail: 50 intentos; si un tipo y nivel tienen menos enunciados que preguntas, se acepta la repetición.
    for (let k = 1; seen.has(item.stem.text) && k <= 50; k++) {
      const seed = `${s.seed}${k.toString(36)}`;
      if (!used.has(seed)) item = registry[s.type].generator.generate(seed, s.level, OPTION_COUNT);
    }
    seen.add(item.stem.text);
    return item;
  });
  await store.addUsedSeeds(items.map((it) => it.seed));
  return items;
}

/** Lo justo para guardar una pregunta respondida: el enunciado se regenera con la semilla. */
export const toSaved = (
  items: readonly Item[],
  answers: readonly (number | null | undefined)[],
  marked: readonly boolean[] = [],
): SavedQuestion[] =>
  items.map((it, i) => ({
    type: it.type,
    level: it.level,
    seed: it.seed,
    answer: answers[i] ?? null,
    marked: marked[i] ?? false,
  }));

export const fromSaved = (questions: readonly SavedQuestion[]): Item[] =>
  questions.map((q) => registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT));

/** Preguntas respondidas en sesiones y simulacros terminados, corregidas con el motor. */
async function historyResults(store: Store): Promise<Result[]> {
  const questions = [
    ...(await store.sessions()).flatMap((s) => s.questions),
    ...(await store.attempts()).filter((a) => a.finishedAt !== null).flatMap((a) => a.questions),
  ];
  return questions.map((q) => {
    const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
    return { type: q.type, correct: q.answer === item.answerIndex, blank: q.answer === null };
  });
}

/** Fallos por tipo en sesiones y simulacros terminados: alimenta el reparto prioritario (ENT-02). */
export async function failuresByType(store: Store): Promise<Record<TypeCode, number>> {
  const out = Object.fromEntries(typeCodes.map((c) => [c, 0])) as Record<TypeCode, number>;
  for (const r of await historyResults(store)) if (!r.correct && !r.blank) out[r.type]++;
  return out;
}

/** Acierto acumulado por aptitud y tipo para Inicio (mismo cálculo que Resultado). */
export async function historyBreakdown(store: Store): Promise<Breakdown> {
  return breakdown(await historyResults(store));
}
