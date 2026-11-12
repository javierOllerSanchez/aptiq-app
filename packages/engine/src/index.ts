// Motor de contenido de Aptiq: generadores deterministas con solucionador independiente.
import guardiaCivil2026Json from '../profiles/guardia-civil-2026.json';
import type { ExamProfile } from './profile';
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
export { validateProfile, type ExamProfile } from './profile';

/** Perfil oficial de la Guardia Civil (fase 3): datos con su fuente en el propio JSON. */
export const guardiaCivil2026 = guardiaCivil2026Json as ExamProfile;
export { score, type ScoreResult } from './score';
export {
  createExam,
  answer,
  mark,
  goTo,
  finish,
  tick,
  remainingMs,
  type ExamState,
} from './exam/state';
export { buildPractice, type PracticeInput, type PracticeItemSpec } from './session/plan';
export {
  reviewOf,
  breakdown,
  type ReviewResult,
  type Breakdown,
  type Result,
} from './review/review';
export { estimateLevels, type LevelAnswer } from './level/estimate';

/** Un generador y su solucionador por cada tipo de la taxonomía. */
export const registry: Record<TypeCode, { generator: Generator; solver: Solver }> = {
  'NUM.SERIE': { generator: numSerie, solver: numSerieSolver },
  'LET.SERIE': { generator: letSerie, solver: letSerieSolver },
  'NUM.CALC': { generator: numCalc, solver: numCalcSolver },
  'COD.CRIPTO': { generator: codCripto, solver: codCriptoSolver },
  'VER.ORDEN': { generator: verOrden, solver: verOrdenSolver },
  'DAT.COMPARA': { generator: datCompara, solver: datComparaSolver },
};
