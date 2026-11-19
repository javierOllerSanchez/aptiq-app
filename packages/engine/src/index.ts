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
import { absFiguras } from './spatial/abs-figuras';
import { absFigurasSolver } from './spatial/abs-figuras.solver';
import { espCubo } from './spatial/esp-cubo';
import { espCuboSolver } from './spatial/esp-cubo.solver';
import { espGiro } from './spatial/esp-giro';
import { espGiroSolver } from './spatial/esp-giro.solver';
import type { TypeCode } from './taxonomy';
import { bankGenerator, bankSolver } from './verbal/bank';
import type { Generator, Solver } from './types';

export { createRng, type Rng } from './rng';
export { taxonomy, typeCodes, type TypeCode } from './taxonomy';
export * from './types';
export type { Drawing, Paint, Shape } from './figures/draw';
export { validateProfile, type ExamProfile } from './profile';

/** Perfil oficial de la Guardia Civil (fase 3): datos con su fuente en el propio JSON. */
export const guardiaCivil2026 = guardiaCivil2026Json as ExamProfile;
export { score, type ScoreResult } from './score';
export {
  createExam,
  answer,
  clear,
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
  type Tally,
  type Result,
} from './review/review';
export { adaptLevels } from './level/adapt';
export { estimateLevels, type LevelAnswer } from './level/estimate';
export { type DatedAnswer, levelHistory, mondayOf, type WeekLevel } from './progress/history';
export { daysToExam, streak } from './progress/streak';
export { type Allowance, allowance, type PlanInput, TIPOS_GRATIS } from './plan/limits';
export { buildToday, HOY_PREGUNTAS, type TodayInput } from './session/today';
export { addDays, type DayResult, daysBetween, dueTypes, INTERVALOS } from './review/spaced';

/** Un generador y su solucionador por cada tipo de la taxonomía. */
export const registry: Record<TypeCode, { generator: Generator; solver: Solver }> = {
  'NUM.SERIE': { generator: numSerie, solver: numSerieSolver },
  'LET.SERIE': { generator: letSerie, solver: letSerieSolver },
  'NUM.CALC': { generator: numCalc, solver: numCalcSolver },
  'COD.CRIPTO': { generator: codCripto, solver: codCriptoSolver },
  'VER.ORDEN': { generator: verOrden, solver: verOrdenSolver },
  'DAT.COMPARA': { generator: datCompara, solver: datComparaSolver },
  'ESP.GIRO': { generator: espGiro, solver: espGiroSolver },
  'ABS.FIGURAS': { generator: absFiguras, solver: absFigurasSolver },
  'ESP.CUBO': { generator: espCubo, solver: espCuboSolver },
  'VER.SINON': { generator: bankGenerator('VER.SINON'), solver: bankSolver('VER.SINON') },
  'VER.ANALOG': { generator: bankGenerator('VER.ANALOG'), solver: bankSolver('VER.ANALOG') },
};
export {
  availableTypes,
  isBankType,
  loadBank,
  MIN_APROBADAS,
  validateVerbal,
  type VerbalEntry,
  type VerbalType,
} from './verbal/bank';
