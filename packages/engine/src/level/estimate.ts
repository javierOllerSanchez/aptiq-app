import { type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';

export interface LevelAnswer {
  type: TypeCode;
  correct: boolean;
  blank: boolean;
}

/**
 * Nivel orientativo por tipo a partir de los aciertos del test de nivel (ONB-02).
 * Lineal: 0 % de aciertos → nivel 1; 100 % → nivel 5. Las preguntas en blanco no cuentan.
 * Sin respuestas de un tipo, devuelve null: no se inventa un nivel.
 * Es una estimación con pocas preguntas: la app lo muestra como «orientativo».
 */
export function estimateLevels(answers: readonly LevelAnswer[]): Record<TypeCode, Level | null> {
  const out = Object.fromEntries(typeCodes.map((c) => [c, null])) as Record<TypeCode, Level | null>;
  for (const code of typeCodes) {
    const answered = answers.filter((a) => a.type === code && !a.blank);
    if (answered.length === 0) continue;
    const pct = answered.filter((a) => a.correct).length / answered.length;
    out[code] = (1 + Math.round(pct * 4)) as Level;
  }
  return out;
}
