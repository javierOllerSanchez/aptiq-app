// Motor de contenido de Aptiq: generadores deterministas con solucionador independiente.
import { datCompara } from './compare/dat-compara';
import { datComparaSolver } from './compare/dat-compara.solver';
import { numCalc } from './calc/num-calc';
import { numCalcSolver } from './calc/num-calc.solver';
import { codCripto } from './codes/cod-cripto';
import { codCriptoSolver } from './codes/cod-cripto.solver';
import { verOrden } from './order/ver-orden';
import { verOrdenSolver } from './order/ver-orden.solver';
import { letSerie } from './series/let-serie';
import { letSerieSolver } from './series/let-serie.solver';
import { numSerie } from './series/num-serie';
import { numSerieSolver } from './series/num-serie.solver';
import type { TypeCode } from './taxonomy';
import type { Generator, Solver } from './types';

export { createRng, type Rng } from './rng';
export { taxonomy, typeCodes, type TypeCode } from './taxonomy';
export * from './types';

/** Un generador y su solucionador por cada tipo de la taxonomía. */
export const registry: Record<TypeCode, { generator: Generator; solver: Solver }> = {
  'NUM.SERIE': { generator: numSerie, solver: numSerieSolver },
  'LET.SERIE': { generator: letSerie, solver: letSerieSolver },
  'NUM.CALC': { generator: numCalc, solver: numCalcSolver },
  'COD.CRIPTO': { generator: codCripto, solver: codCriptoSolver },
  'VER.ORDEN': { generator: verOrden, solver: verOrdenSolver },
  'DAT.COMPARA': { generator: datCompara, solver: datComparaSolver },
};
