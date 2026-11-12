import type { Item, Solver, Stem } from '../types';

export interface DatComparaStem extends Stem {
  rows: { left: string; right: string }[];
}

/** Solucionador independiente: cuenta las filas idénticas carácter a carácter. */
export const countEqual = (rows: DatComparaStem['rows']) => rows.filter((r) => r.left === r.right).length;

export const datComparaSolver: Solver<DatComparaStem> = {
  type: 'DAT.COMPARA',
  validOptions: (item: Item<DatComparaStem>) => {
    const n = countEqual(item.stem.rows);
    return item.options.flatMap((o, i) => (Number(o) === n ? [i] : []));
  },
};
