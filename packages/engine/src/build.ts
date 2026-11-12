import { createRng, type Rng } from './rng';
import { taxonomy, type TypeCode } from './taxonomy';
import type { Item, Level, OptionCount, Solver, Stem } from './types';

/** Lo que produce cada generador antes de barajar y validar. */
export interface Draft<S extends Stem> {
  stem: S;
  answer: string;
  /**
   * Errores típicos, del más al menos plausible. Conviene dar varios por encima y por debajo
   * de la respuesta: el montaje elige entre ellos para que la correcta no se delate por su valor.
   */
  distractors: { value: string; error: string }[];
  observe: string;
  rule: string;
  /** Debe contener la respuesta: es el cálculo que lleva a ella. */
  apply: string;
}

/** Familias de reglas de cada nivel, con nombre: `{ 1: { aritmetica: fn }, … }`. */
export type Families<F> = Record<Level, Record<string, F>>;

export const familyNames = <F>(families: Families<F>) =>
  Object.fromEntries(Object.entries(families).map(([level, fs]) => [level, Object.keys(fs)])) as Record<
    Level,
    string[]
  >;

/** Aplica a cada familia el paso final común de un generador (enunciado, filtros…). */
export function finishFamilies<R, S extends Stem>(
  families: Families<(rng: Rng) => R | null>,
  finish: (raw: R) => Draft<S> | null,
): Families<(rng: Rng) => Draft<S> | null> {
  const out = {} as Families<(rng: Rng) => Draft<S> | null>;
  for (const [level, fs] of Object.entries(families))
    out[Number(level) as Level] = Object.fromEntries(
      Object.entries(fs).map(([name, make]) => [
        name,
        (rng: Rng) => {
          const raw = make(rng);
          return raw === null ? null : finish(raw);
        },
      ]),
    );
  return out;
}

export const MAX_RETRIES = 20;

/**
 * Paso común a todos los generadores (skill aptiq-generator):
 * familia → borrador → distractores → barajar con el PRNG → validar con el solucionador.
 *
 * Si las opciones se pueden ordenar por valor (`compare`), se elige al azar cuántas quedan por
 * debajo de la correcta y se toman los distractores más plausibles de cada lado: así la correcta
 * no es siempre la del medio ni la más baja.
 *
 * Si el solucionador no encuentra exactamente una opción válida, se reintenta con
 * `${seed}:retry:${n}`. Agotar los reintentos es un error del generador.
 */
export function buildItem<S extends Stem, F extends (rng: Rng) => Draft<S> | null>(
  spec: {
    type: TypeCode;
    version: string;
    tip: string;
    solver: Solver<S>;
    families: Families<F>;
    compare?: (a: string, b: string) => number;
  },
  seed: string,
  level: Level,
  optionCount: OptionCount,
): Item<S> {
  for (let n = 0; n <= MAX_RETRIES; n++) {
    const attemptSeed = n === 0 ? seed : `${seed}:retry:${n}`;
    const rng = createRng(`${spec.type}:${spec.version}:${attemptSeed}:${level}:${optionCount}`);
    const [family, make] = rng.pick(Object.entries(spec.families[level]));
    const draft = make(rng);
    if (!draft) continue;

    const seen = new Set([draft.answer]);
    const candidates = draft.distractors.filter((d) => !seen.has(d.value) && seen.add(d.value));
    const need = optionCount - 1;
    let chosen: typeof candidates;
    if (spec.compare) {
      const below = candidates.filter((d) => spec.compare!(d.value, draft.answer) < 0);
      const above = candidates.filter((d) => spec.compare!(d.value, draft.answer) > 0);
      const lo = Math.max(0, need - above.length);
      const hi = Math.min(need, below.length);
      if (lo > hi) continue;
      const k = rng.int(lo, hi);
      chosen = [...below.slice(0, k), ...above.slice(0, need - k)];
    } else {
      if (candidates.length < need) continue;
      chosen = candidates.slice(0, need);
    }

    const options = rng.shuffle([{ value: draft.answer, error: '' }, ...chosen]);
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
        family,
      },
    };
    const valid = spec.solver.validOptions(item);
    if (valid.length === 1 && valid[0] === answerIndex) return item;
  }
  throw new Error(`${spec.type}: ${MAX_RETRIES} reintentos agotados (semilla ${seed}, nivel ${level})`);
}

/** Orden numérico de opciones como «1.250» o «12,5». */
export const byNumber = (a: string, b: string) => toNumber(a) - toNumber(b);
const toNumber = (o: string) => Number(o.replace(/\./g, '').replace(',', '.'));
