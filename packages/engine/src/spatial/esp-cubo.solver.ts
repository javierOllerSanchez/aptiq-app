import type { Item, Solver, Stem } from '../types';

import { allViews, decodeNet, fold } from './cube';

export interface EspCuboStem extends Stem {
  /** Desarrollo codificado (`encodeNet`). */
  net: string;
}

/** Solucionador: pliega el desarrollo y prueba los 24 giros del cubo. Vale la opción que aparezca. */
export const espCuboSolver: Solver<EspCuboStem> = {
  type: 'ESP.CUBO',
  validOptions: (item: Item<EspCuboStem>) => {
    const views = allViews(fold(decodeNet(item.stem.net)));
    return item.options.flatMap((o, i) => (views.has(o) ? [i] : []));
  },
};
