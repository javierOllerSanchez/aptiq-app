import { decodeCells, sameShape } from '../figures/grid';
import type { Item, Solver, Stem } from '../types';

export interface EspGiroStem extends Stem {
  /** Figura modelo codificada (`encodeCells`). */
  model: string;
}

/** Solucionador independiente: vale toda opción que sea el modelo girado (sin espejo). */
export const espGiroSolver: Solver<EspGiroStem> = {
  type: 'ESP.GIRO',
  validOptions: (item: Item<EspGiroStem>) => {
    const model = decodeCells(item.stem.model);
    return item.options.flatMap((o, i) => (sameShape(model, decodeCells(o)) ? [i] : []));
  },
};
