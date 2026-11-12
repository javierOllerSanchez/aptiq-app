import type { Item, Solver, Stem } from '../types';

export interface VerOrdenStem extends Stem {
  words: string[];
  /** Puesto pedido, desde 1. */
  position: number;
}

/**
 * Solucionador independiente: ordena con la intercalación del español de Intl (ñ después de n,
 * ll como dos eles), que es un método distinto del comparador propio del generador.
 */
const collator = new Intl.Collator('es', { sensitivity: 'base' });

export const verOrdenSolver: Solver<VerOrdenStem> = {
  type: 'VER.ORDEN',
  validOptions: (item: Item<VerOrdenStem>) => {
    const sorted = [...item.stem.words].sort(collator.compare);
    const expected = sorted[item.stem.position - 1];
    return item.options.flatMap((o, i) => (o === expected ? [i] : []));
  },
};
