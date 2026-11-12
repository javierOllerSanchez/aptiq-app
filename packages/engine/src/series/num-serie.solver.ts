import type { Item, Solver, Stem } from '../types';

export interface NumSerieStem extends Stem {
  terms: number[];
}

/**
 * Solucionador independiente de series numéricas. No conoce la regla del generador:
 * ajusta a los términos visibles TODAS las reglas razonables que estudia un opositor y
 * reúne los siguientes términos que predicen. Una opción es válida si alguna regla la predice.
 * Cada regla exige términos de sobra para confirmarse (no vale «ajustar» con lo justo).
 */
type Rule = (t: number[]) => number | null;
/** Una regla de varias lecturas (series intercaladas) puede predecir más de un valor. */
type MultiRule = (t: number[]) => number | number[] | null;

const diffs = (t: number[]) => t.slice(1).map((x, i) => x - t[i]!);
const allEqual = (xs: number[]) => xs.length > 0 && xs.every((x) => x === xs[0]);
const last = (t: number[]) => t[t.length - 1]!;

const arithmetic: Rule = (t) => {
  const d = diffs(t);
  return d.length >= 3 && allEqual(d) ? last(t) + d[0]! : null;
};

const geometric: Rule = (t) => {
  if (t.length < 4 || t[0] === 0) return null;
  // Razón exacta t1/t0, comprobada sin decimales: t[i+1]·t0 = t[i]·t1.
  for (let i = 1; i < t.length - 1; i++) if (t[i + 1]! * t[0]! !== t[i]! * t[1]!) return null;
  const next = (last(t) * t[1]!) / t[0]!;
  return Number.isInteger(next) && t[1] !== t[0] ? next : null;
};

/** x(n+1) = a·x(n) + b con a, b enteros; se ajusta con tres términos y se confirma con el resto. */
const affine: Rule = (t) => {
  if (t.length < 5 || t[1] === t[0]) return null;
  const a = (t[2]! - t[1]!) / (t[1]! - t[0]!);
  if (!Number.isInteger(a) || a === 1 || a === 0) return null;
  const b = t[1]! - a * t[0]!;
  for (let i = 0; i < t.length - 1; i++) if (a * t[i]! + b !== t[i + 1]) return null;
  return a * last(t) + b;
};

/** Las diferencias forman a su vez una serie aritmética o geométrica. */
const differencesOf =
  (inner: Rule): Rule =>
  (t) => {
    const d = diffs(t);
    const nextDiff = inner(d);
    return nextDiff === null ? null : last(t) + nextDiff;
  };

/** Dos series intercaladas (posiciones impares y pares), cada una con su propia regla. */
const interleaved: MultiRule = (t) => {
  if (t.length < 6) return null;
  const sub = t.filter((_, i) => i % 2 === t.length % 2);
  const other = t.filter((_, i) => i % 2 !== t.length % 2);
  // Las subseries son cortas (3 a 5 términos): se aceptan reglas con menos confirmación.
  const otherFits = shortRules.some((r) => r(other) !== null);
  const preds = new Set(shortRules.map((r) => r(sub)).filter((x): x is number => x !== null));
  // Varias lecturas razonables de la subserie: se devuelven todas para que la pregunta se descarte.
  return otherFits && preds.size > 0 ? [...preds] : null;
};

// Reglas para subseries cortas: suma constante, multiplicación constante y diferencias que crecen.
const shortArithmetic: Rule = (t) => {
  const d = diffs(t);
  return d.length >= 2 && allEqual(d) ? last(t) + d[0]! : null;
};
const shortGeometric: Rule = (t) => {
  if (t.length < 3 || t[0] === 0 || t[1] === t[0]) return null;
  for (let i = 1; i < t.length - 1; i++) if (t[i + 1]! * t[0]! !== t[i]! * t[1]!) return null;
  const next = (last(t) * t[1]!) / t[0]!;
  return Number.isInteger(next) ? next : null;
};
const shortQuadratic: Rule = (t) => {
  const d = diffs(t);
  const dd = diffs(d);
  // Basta una segunda diferencia: con «6, 12, 24» ya es razonable leer «+6, +12, +18».
  return dd.length >= 1 && allEqual(dd) && dd[0] !== 0 ? last(t) + last(d) + dd[0]! : null;
};
const shortRules = [shortArithmetic, shortGeometric, shortQuadratic];

/** Cada término es la suma de los dos anteriores. */
const fibonacci: Rule = (t) => {
  if (t.length < 5) return null;
  for (let i = 2; i < t.length; i++) if (t[i] !== t[i - 1]! + t[i - 2]!) return null;
  return last(t) + t[t.length - 2]!;
};

/** Dos operaciones que se alternan (+c o ×c en cada paso), p. ej. +3, ×2, +3, ×2… */
const alternating: Rule = (t) => {
  if (t.length < 5) return null;
  const opsFor = (x: number, y: number) => {
    const ops: ((v: number) => number)[] = [(v) => v + (y - x)];
    if (x !== 0 && y % x === 0 && y / x !== 1) ops.push((v) => v * (y / x));
    return ops;
  };
  const results = new Set<number>();
  for (const f of opsFor(t[0]!, t[1]!))
    for (const g of opsFor(t[1]!, t[2]!)) {
      const steps = [f, g];
      let ok = true;
      for (let i = 0; i < t.length - 1 && ok; i++) ok = steps[i % 2]!(t[i]!) === t[i + 1];
      if (ok) results.add(steps[(t.length - 1) % 2]!(last(t)));
    }
  return results.size === 1 ? [...results][0]! : null;
};

export const numSerieRules: Record<string, MultiRule> = {
  arithmetic,
  geometric,
  affine,
  quadratic: differencesOf(arithmetic),
  differencesGeometric: differencesOf(geometric),
  cubic: differencesOf(differencesOf(arithmetic)),
  interleaved,
  fibonacci,
  alternating,
};

export function predictNext(terms: number[]): Set<number> {
  const out = new Set<number>();
  for (const rule of Object.values(numSerieRules)) {
    const next = rule(terms);
    for (const v of next === null ? [] : [next].flat()) if (Number.isFinite(v)) out.add(v);
  }
  return out;
}

export const numSerieSolver: Solver<NumSerieStem> = {
  type: 'NUM.SERIE',
  validOptions: (item: Item<NumSerieStem>) => {
    const predicted = predictNext(item.stem.terms);
    return item.options.flatMap((o, i) => (predicted.has(Number(o)) ? [i] : []));
  },
};
