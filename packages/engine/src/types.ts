import type { TypeCode } from './taxonomy';

export type Level = 1 | 2 | 3 | 4 | 5;
export const levels: readonly Level[] = [1, 2, 3, 4, 5];
export type OptionCount = 3 | 4;

/** Enunciado: texto para mostrar y datos estructurados propios de cada tipo. */
export interface Stem {
  text: string;
}

export interface Item<S extends Stem = Stem> {
  /** `${type}:${version}:${seed}:${level}` */
  id: string;
  type: TypeCode;
  level: Level;
  seed: string;
  stem: S;
  /** Longitud = opciones del perfil de examen (3 o 4). */
  options: string[];
  answerIndex: number;
  explanation: {
    observe: string;
    rule: string;
    apply: string;
    distractors: { optionIndex: number; error: string }[];
    tip: string;
  };
  meta: { expectedSeconds: number; generatorVersion: string };
}

export interface Generator<S extends Stem = Stem> {
  type: TypeCode;
  /** Subir si cambia la salida para una misma semilla. */
  version: string;
  levels: readonly Level[];
  generate(seed: string, level: Level, optionCount: OptionCount): Item<S>;
}

export interface Solver<S extends Stem = Stem> {
  type: TypeCode;
  /** Resuelve SIN datos internos del generador: solo enunciado y opciones. */
  validOptions(item: Item<S>): number[];
}
