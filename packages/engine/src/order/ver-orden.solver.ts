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

/**
 * Orden tradicional (anterior a 1994): CH y LL como letras propias, después de C y de L.
 * Muchos opositores lo aprendieron así; si con él cambia la respuesta, la pregunta es discutible.
 */
function traditionalKey(w: string) {
  return w.replace(/CH/g, 'C￿').replace(/LL/g, 'L￿');
}
const traditional = (a: string, b: string) => collator.compare(traditionalKey(a), traditionalKey(b));

export const verOrdenSolver: Solver<VerOrdenStem> = {
  type: 'VER.ORDEN',
  validOptions: (item: Item<VerOrdenStem>) => {
    const n = item.stem.position - 1;
    const expected = new Set([
      [...item.stem.words].sort(collator.compare)[n],
      [...item.stem.words].sort(traditional)[n],
    ]);
    return item.options.flatMap((o, i) => (expected.has(o) ? [i] : []));
  },
};
