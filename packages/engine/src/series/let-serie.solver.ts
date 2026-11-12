import type { Item, Solver, Stem } from '../types';

import { letterAt, position } from './alphabet';

export interface LetSerieStem extends Stem {
  letters: string[];
}

/**
 * Solucionador independiente de series de letras. Pasa las letras a su posición en el alfabeto
 * y ajusta las reglas razonables con letras (todas aditivas: con letras no se multiplica).
 * Una opción es válida si alguna regla la predice.
 */
type Rule = (p: number[]) => number | null;

const diffs = (p: number[]) => p.slice(1).map((x, i) => x - p[i]!);
const constant = (xs: number[]) => xs.length > 0 && xs.every((x) => x === xs[0]);
const last = (p: number[]) => p[p.length - 1]!;

const fixedStep: Rule = (p) => {
  const d = diffs(p);
  return d.length >= 3 && constant(d) ? last(p) + d[0]! : null;
};

/** Los saltos crecen o decrecen de forma constante (+1, +2, +3…). */
const growingStep: Rule = (p) => {
  const d = diffs(p);
  const dd = diffs(d);
  return d.length >= 4 && constant(dd) && dd[0] !== 0 ? last(p) + last(d) + dd[0]! : null;
};

/** Dos saltos que se alternan (+2, +3, +2, +3…). */
const alternatingStep: Rule = (p) => {
  const d = diffs(p);
  if (d.length < 4 || d[0] === d[1]) return null;
  for (let i = 2; i < d.length; i++) if (d[i] !== d[i % 2]) return null;
  return last(p) + d[d.length % 2]!;
};

/** Dos series intercaladas, cada una con su salto fijo. */
const interleaved: Rule = (p) => {
  if (p.length < 6) return null;
  const mine = p.filter((_, i) => i % 2 === p.length % 2);
  const other = p.filter((_, i) => i % 2 !== p.length % 2);
  const step = (s: number[]) => (s.length >= 3 && constant(diffs(s)) ? s[1]! - s[0]! : null);
  const a = step(mine);
  return a !== null && step(other) !== null ? last(mine) + a : null;
};

const rules = [fixedStep, growingStep, alternatingStep, interleaved];

export function predictNextLetter(letters: string[]): Set<string> {
  const p = letters.map(position);
  const out = new Set<string>();
  for (const rule of rules) {
    const next = rule(p);
    const letter = next === null ? undefined : letterAt(next);
    if (letter && next! >= 1) out.add(letter);
  }
  return out;
}

export const letSerieSolver: Solver<LetSerieStem> = {
  type: 'LET.SERIE',
  validOptions: (item: Item<LetSerieStem>) => {
    const predicted = predictNextLetter(item.stem.letters);
    return item.options.flatMap((o, i) => (predicted.has(o) ? [i] : []));
  },
};
