import type { Item, Solver, Stem } from '../types';

/** Elementos de cada figura: flecha (dirección 0–7, de 45° en 45°), punto y aro (casilla 0–7 del borde). */
export type Part = 'f' | 'p' | 'a';
export const PARTS: Part[] = ['f', 'p', 'a'];
export type Term = Partial<Record<Part, number>>;

export interface AbsFigurasStem extends Stem {
  /** Figuras visibles de la serie, codificadas («f3 p5»). */
  terms: string[];
}

export const encodeTerm = (t: Term) =>
  PARTS.filter((p) => t[p] !== undefined)
    .map((p) => `${p}${t[p]}`)
    .join(' ');

export const decodeTerm = (code: string): Term =>
  Object.fromEntries(code.split(' ').map((c) => [c[0], Number(c.slice(1))]));

export const mod8 = (n: number) => ((n % 8) + 8) % 8;

/**
 * Siguiente valor de una secuencia en un ciclo de 8: con el mismo paso siempre, o con dos pasos
 * que se alternan (hace falta verlos repetidos). Sin regla clara, null.
 */
export function nextValue(values: number[]): number | null {
  const d = values.slice(1).map((v, i) => mod8(v - values[i]!));
  if (d.every((x) => x === d[0])) return mod8(values.at(-1)! + d[0]!);
  if (d.length >= 4 && d.every((x, i) => x === d[i % 2])) return mod8(values.at(-1)! + d[d.length % 2]!);
  return null;
}

/** Solucionador independiente: deduce la regla de cada elemento a partir de la serie visible. */
export const absFigurasSolver: Solver<AbsFigurasStem> = {
  type: 'ABS.FIGURAS',
  validOptions: (item: Item<AbsFigurasStem>) => {
    const terms = item.stem.terms.map(decodeTerm);
    const next: Term = {};
    for (const p of PARTS) {
      if (terms[0]![p] === undefined) continue;
      const v = nextValue(terms.map((t) => t[p]!));
      if (v === null) return [];
      next[p] = v;
    }
    const target = encodeTerm(next);
    return item.options.flatMap((o, i) => (o === target ? [i] : []));
  },
};
