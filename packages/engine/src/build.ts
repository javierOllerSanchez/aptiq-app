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
  distractors: Distractor[];
  observe: string;
  rule: string;
  /** Debe contener la respuesta: es el cálculo que lleva a ella. */
  apply: string;
  /**
   * El puesto por valor de la correcta ES la solución («¿qué palabra va primera?»): no se sortea,
   * para no desequilibrar el sorteo de las demás preguntas del mismo nivel.
   */
  rankIsSolution?: boolean;
}

/**
 * `generic`: error de cálculo genérico (una unidad, una decena…), no ligado a la regla. Se usa
 * como mucho dos por pregunta: más alrededor de la respuesta la delatarían por estar en medio.
 */
export type Distractor = { value: string; error: string; generic?: boolean };

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
    /** Rechazar repartos con la correcta en el centro de los errores (por defecto, con números). */
    avoidCenter?: boolean;
  },
  seed: string,
  level: Level,
  optionCount: OptionCount,
): Item<S> {
  // Puesto por valor que debe ocupar la correcta: se sortea una vez por pregunta y se mantiene en
  // los reintentos. (Sortearlo en cada intento favorecería los puestos centrales, que son posibles
  // con más borradores.)
  const need = optionCount - 1;
  // Lo mismo con la familia: elegirla en cada intento favorecería a las que se descartan menos.
  const fixed = createRng(`${spec.type}:${spec.version}:${seed}:${level}:${optionCount}:puesto`);
  const target = fixed.int(0, need);
  const [family, make] = fixed.pick(Object.entries(spec.families[level]));
  for (let n = 0; n <= MAX_RETRIES; n++) {
    const attemptSeed = n === 0 ? seed : `${seed}:retry:${n}`;
    const rng = createRng(`${spec.type}:${spec.version}:${attemptSeed}:${level}:${optionCount}`);
    const draft = make(rng);
    if (!draft) continue;

    const seen = new Set([draft.answer]);
    const candidates = draft.distractors.filter((d) => !seen.has(d.value) && seen.add(d.value));
    const avoidCenter = spec.avoidCenter ?? spec.compare === byNumber;
    const strict = n < STRICT_ATTEMPTS && !draft.rankIsSolution;
    const chosen = choose(candidates, draft.answer, need, rng, spec.compare, strict ? target : null, avoidCenter);
    if (!chosen) continue;

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

const MAX_GENERIC = 2;
/** Intentos en los que se exige el puesto sorteado para la correcta (de MAX_RETRIES). */
const STRICT_ATTEMPTS = 15;

/**
 * Elige `need` distractores con tres condiciones:
 *  1. primero los errores de la regla (por orden de plausibilidad); genéricos, como mucho dos;
 *  2. con `compare`, cuántas opciones quedan por debajo de la correcta se elige al azar entre los
 *     repartos posibles (la correcta no se delata por ser la del medio o la más baja);
 *  3. con opciones numéricas, se rechaza todo reparto en que la correcta sea el centro único de
 *     las opciones a 1, 2 o 10 de distancia (se adivinaría sin resolver).
 */
function choose(
  candidates: Distractor[],
  answer: string,
  need: number,
  rng: Rng,
  compare?: (a: string, b: string) => number,
  /** Puesto exigido para la correcta (cuántas opciones por debajo), o null si vale cualquiera. */
  target: number | null = null,
  avoidCenter = false,
): Distractor[] | null {
  const rule = candidates.filter((d) => !d.generic);
  const generic = rng.shuffle(candidates.filter((d) => d.generic));
  if (!compare) {
    const out = [...rule.slice(0, need), ...generic.slice(0, MAX_GENERIC)].slice(0, need);
    return out.length === need ? out : null;
  }
  const side = (xs: Distractor[], below: boolean) =>
    xs.filter((d) => (compare(d.value, answer) < 0) === below);
  const [rb, ra, gb, ga] = [side(rule, true), side(rule, false), side(generic, true), side(generic, false)];
  const planFor = (k: number) => {
    const up = need - k;
    const below = [...rb.slice(0, k), ...gb.slice(0, Math.max(0, k - rb.length))];
    const above = [...ra.slice(0, up), ...ga.slice(0, Math.max(0, up - ra.length))];
    const plan = [...below, ...above];
    if (below.length !== k || above.length !== up) return null;
    if (plan.filter((d) => d.generic).length > MAX_GENERIC) return null;
    if (avoidCenter && isUniqueCenter(answer, plan)) return null;
    return plan;
  };
  // Con puesto exigido, si este borrador no lo permite se prueba otro (buildItem). Solo en los
  // últimos intentos se acepta cualquier puesto posible.
  if (target !== null) return planFor(target);
  const plans = Array.from({ length: need + 1 }, (_, k) => planFor(k)).filter((p) => p !== null);
  return plans.length === 0 ? null : rng.pick(plans);
}

/** ¿Es la correcta la única opción con más vecinas a 1, 2 o 10 de distancia? */
function isUniqueCenter(answer: string, plan: Distractor[]) {
  const values = [answer, ...plan.map((d) => d.value)].map(toNumber);
  const near = values.map((v) => values.filter((w) => [1, 2, 10].includes(Math.abs(v - w))).length);
  const best = Math.max(...near);
  return best > 0 && near[0] === best && near.filter((n) => n === best).length === 1;
}

/** Orden numérico de opciones como «1.250» o «12,5». */
export const byNumber = (a: string, b: string) => toNumber(a) - toNumber(b);
const toNumber = (o: string) => Number(o.replace(/\./g, '').replace(',', '.'));
