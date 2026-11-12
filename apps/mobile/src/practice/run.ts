import {
  buildPractice,
  type Item,
  type Level,
  registry,
  type TypeCode,
  typeCodes,
} from '@aptiq/engine';

import type { Store } from '@/data/store';

/** Opciones por pregunta del perfil de la Guardia Civil (base 7.3, N = 4). */
export const OPTION_COUNT = 4 as const;

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
  await store.addUsedSeeds(specs.map((s) => s.seed));
  return specs.map((s) => registry[s.type].generator.generate(s.seed, s.level, OPTION_COUNT));
}

/** Fallos por tipo en las sesiones guardadas: alimenta el reparto prioritario (ENT-02). */
export async function failuresByType(store: Store): Promise<Record<TypeCode, number>> {
  const out = Object.fromEntries(typeCodes.map((c) => [c, 0])) as Record<TypeCode, number>;
  const questions = [
    ...(await store.sessions()).flatMap((s) => s.questions),
    ...(await store.attempts()).flatMap((a) => a.questions),
  ];
  for (const q of questions) {
    if (q.answer === null) continue;
    const item = registry[q.type].generator.generate(q.seed, q.level, OPTION_COUNT);
    if (q.answer !== item.answerIndex) out[q.type]++;
  }
  return out;
}
