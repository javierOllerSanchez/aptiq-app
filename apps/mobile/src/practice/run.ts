import {
  availableTypes,
  type Breakdown,
  breakdown,
  buildPractice,
  type Item,
  type Level,
  registry,
  type Result,
  type Tally,
  type TypeCode,
  typeCodes,
} from '@aptiq/engine';

import { perfil } from '@/content/content';
import type { SavedQuestion, Store } from '@/data/store';

/** Opciones por pregunta del perfil de la Guardia Civil (base 7.3, N = 4). */
export const OPTION_COUNT = 4 as const;
export const LETTERS = ['A', 'B', 'C', 'D'] as const;

/** Una opción en palabras: el texto, o la descripción de la figura en los tipos espaciales. */
export function textoOpcion(item: Item, i: number) {
  const describe = registry[item.type].generator.describe;
  return describe ? describe(item.options[i]!) : item.options[i]!;
}
/** «la B · 63», o solo «la B» si la opción es una figura (se ve encima). */
export const nombreOpcion = (item: Item, i: number) =>
  registry[item.type].generator.draw ? `${LETTERS[i]}` : `${LETTERS[i]} · ${item.options[i]}`;

/** Cita de las bases que respaldan el formato (para `SourceNote`): solo lo que el perfil vigente acredita. */
export function cita() {
  const bases = perfil().sources.find((s) => s.tipo === 'bases');
  return bases
    ? `${bases.url.match(/id=([A-Z0-9-]+)/)?.[1] ?? bases.organismo}, ${bases.apartado ?? ''}`
    : 'pendiente de confirmar';
}

/** Aviso de la decisión de la fase 3: mientras la proporción de tipos no tenga fuente, se dice. */
export const avisoMezcla = () =>
  perfil().pendiente.includes('mix')
    ? `Mezcla de entrenamiento: los ${availableTypes().length} tipos a partes casi iguales. La proporción no es oficial: la Guardia Civil no publica el cuestionario de aptitudes.`
    : null;

/** «0,13» con coma y signo menos tipográfico. */
export const formatNota = (n: number) => n.toFixed(2).replace('.', ',').replace('-', '−');

/** Nombres de las aptitudes del motor, en español para la pantalla. */
export const APTITUDE_LABELS: Record<string, string> = {
  numerica: 'Numérica',
  verbal: 'Verbal',
  atencion: 'Atención y percepción',
  abstracta: 'Abstracta',
  espacial: 'Espacial',
};

export interface StartOptions {
  count: number;
  reparto: 'equitativo' | 'prioritario';
  /** Aptitud del engine («numerica», «verbal», «atencion», «abstracta»). Sin ella, todos los tipos. */
  aptitude?: string;
  /** Solo estos tipos (plan gratuito, fase 7). */
  types?: readonly TypeCode[];
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
    ...(opts.types !== undefined ? { types: opts.types } : {}),
    usedSeeds: await store.usedSeeds(),
    fallos: await failuresByType(store),
    levelFor: opts.levelFor,
  });
  return generarSinRepetir(store, specs);
}

/**
 * Genera las preguntas y reserva sus semillas (CON-02). Una semilla distinta puede dar el mismo
 * enunciado (p. ej. series de letras): dentro de la sesión se cambia por otra derivada, sin repetir
 * semillas usadas. Lo usan la práctica y la Sesión de hoy.
 */
export async function generarSinRepetir(
  store: Store,
  specs: readonly { type: TypeCode; level: Level; seed: string }[],
): Promise<Item[]> {
  const used = await store.usedSeeds();
  const seen = new Set<string>();
  const items = specs.map((s) => {
    let item = registry[s.type].generator.generate(s.seed, s.level, OPTION_COUNT);
    // ponytail: 50 intentos; si un tipo y nivel tienen menos enunciados que preguntas, se acepta la repetición.
    // El enunciado entero: en los tipos con figuras el texto es siempre la misma pregunta.
    for (let k = 1; seen.has(JSON.stringify(item.stem)) && k <= 50; k++) {
      const seed = `${s.seed}${k.toString(36)}`;
      if (!used.has(seed)) item = registry[s.type].generator.generate(seed, s.level, OPTION_COUNT);
    }
    seen.add(JSON.stringify(item.stem));
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
  ms: readonly (number | undefined)[] = [],
): SavedQuestion[] =>
  items.map((it, i) => ({
    type: it.type,
    level: it.level,
    seed: it.seed,
    answer: answers[i] ?? null,
    marked: marked[i] ?? false,
    correct: answers[i] != null && answers[i] === it.answerIndex,
    family: it.meta.family,
    version: it.meta.generatorVersion,
    ...(ms[i] !== undefined ? { ms: Math.round(ms[i]!) } : {}),
  }));

/**
 * La pregunta guardada, regenerada con el motor; null si ya no se puede: una verbal retirada que
 * este móvil nunca descargó (p. ej., historial llegado de otro dispositivo).
 */
export function regenerar(q: SavedQuestion): Item | null {
  try {
    return registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
  } catch {
    return null;
  }
}

// Respuesta correcta de las preguntas antiguas sin `correct`: se regenera una sola vez por pregunta.
const respuestaCorrecta = new Map<string, number>();

/** ¿Se acertó? Usa `correct` si está guardado; si no (datos anteriores a la fase 6), regenera y lo recuerda. */
export function isCorrect(q: SavedQuestion): boolean {
  if (q.answer === null) return false;
  if (q.correct !== undefined) return q.correct;
  const k = `${q.type}:${q.level}:${q.seed}`;
  let idx = respuestaCorrecta.get(k);
  if (idx === undefined) {
    idx = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT).answerIndex;
    respuestaCorrecta.set(k, idx);
  }
  return q.answer === idx;
}

export const fromSaved = (questions: readonly SavedQuestion[]): Item[] =>
  questions.map((q) => registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT));

/** Preguntas respondidas en sesiones y simulacros terminados, corregidas con el motor. */
async function historyResults(store: Store): Promise<Result[]> {
  const questions = [
    ...(await store.sessions()).flatMap((s) => s.questions),
    ...(await store.attempts()).filter((a) => a.finishedAt !== null).flatMap((a) => a.questions),
  ];
  return questions.map((q) => ({ type: q.type, correct: isCorrect(q), blank: q.answer === null }));
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

/** Mínimo de preguntas y de diferencia con la mejor aptitud para señalar una «a reforzar». */
const REFORZAR = { preguntas: 3, puntos: 10 };

/**
 * La aptitud a reforzar solo se señala si hay datos y una diferencia real: con todas al 0 % o con
 * una sola pregunta, marcar una en rojo sería inventar un punto débil.
 */
export function aReforzar(d: Breakdown): string | null {
  const pct = (t: Tally) => (t.total ? Math.round((t.correct / t.total) * 100) : 0);
  const w = d.weakest ? d.byAptitude[d.weakest] : undefined;
  if (!d.weakest || !w || w.total < REFORZAR.preguntas) return null;
  const mejor = Math.max(...Object.values(d.byAptitude).map((t) => (t.total ? pct(t) : 0)));
  return mejor - pct(w) >= REFORZAR.puntos ? d.weakest : null;
}
