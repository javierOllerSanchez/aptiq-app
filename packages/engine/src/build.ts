import { createRng, type Rng } from './rng';
import { taxonomy, type TypeCode } from './taxonomy';
import type { Item, Level, OptionCount, Solver, Stem } from './types';

/** Lo que produce cada generador antes de barajar y validar. */
export interface Draft<S extends Stem> {
  stem: S;
  answer: string;
  /** Errores típicos, del más al menos plausible. Se usan los primeros que hagan falta. */
  distractors: { value: string; error: string }[];
  observe: string;
  rule: string;
  /** Debe contener la respuesta: es el cálculo que lleva a ella. */
  apply: string;
}

export const MAX_RETRIES = 20;

/**
 * Paso común a todos los generadores (skill aptiq-generator):
 * borrador → distractores distintos → barajar con el PRNG → validar con el solucionador.
 * Si el solucionador no encuentra exactamente una opción válida, se reintenta con
 * `${seed}:retry:${n}`. Agotar los reintentos es un error del generador.
 */
export function buildItem<S extends Stem>(
  spec: { type: TypeCode; version: string; tip: string; solver: Solver<S> },
  seed: string,
  level: Level,
  optionCount: OptionCount,
  make: (rng: Rng, level: Level) => Draft<S> | null,
): Item<S> {
  for (let n = 0; n <= MAX_RETRIES; n++) {
    const attemptSeed = n === 0 ? seed : `${seed}:retry:${n}`;
    const rng = createRng(`${spec.type}:${spec.version}:${attemptSeed}:${level}:${optionCount}`);
    const draft = make(rng, level);
    if (!draft) continue;

    const seen = new Set([draft.answer]);
    const chosen = draft.distractors.filter((d) => !seen.has(d.value) && seen.add(d.value));
    if (chosen.length < optionCount - 1) continue;

    const options = rng.shuffle([
      { value: draft.answer, error: '' },
      ...chosen.slice(0, optionCount - 1),
    ]);
    const answerIndex = options.findIndex((o) => o.value === draft.answer);
    const item: Item<S> = {
      id: `${spec.type}:${spec.version}:${seed}:${level}`,
      type: spec.type,
      level,
      seed,
      stem: draft.stem,
      options: options.map((o) => o.value),
      answerIndex,
      explanation: {
        observe: draft.observe,
        rule: draft.rule,
        apply: draft.apply,
        distractors: options
          .map((o, optionIndex) => ({ optionIndex, error: o.error }))
          .filter((d) => d.optionIndex !== answerIndex),
        tip: spec.tip,
      },
      meta: {
        expectedSeconds: taxonomy[spec.type].segundosEsperados[level - 1]!,
        generatorVersion: spec.version,
      },
    };
    const valid = spec.solver.validOptions(item);
    if (valid.length === 1 && valid[0] === answerIndex) return item;
  }
  throw new Error(`${spec.type}: ${MAX_RETRIES} reintentos agotados (semilla ${seed}, nivel ${level})`);
}
