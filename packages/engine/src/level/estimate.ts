import { type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';

export interface LevelAnswer {
  type: TypeCode;
  /** Nivel de la pregunta que se respondió. */
  level: Level;
  correct: boolean;
  /** En blanco o «No lo sé»: cuenta como no acertada. */
  blank: boolean;
}

/**
 * Nivel orientativo por tipo a partir del test de nivel (ONB-02).
 * Lineal sobre todas las preguntas del tipo (0 % → 1; 100 % → 5), sin pasar del nivel más alto probado
 * (o uno más si se acierta todo): con pocas preguntas no se puede afirmar más.
 * Sin preguntas de un tipo, devuelve null: no se inventa un nivel.
 */
export function estimateLevels(answers: readonly LevelAnswer[]): Record<TypeCode, Level | null> {
  const out = Object.fromEntries(typeCodes.map((c) => [c, null])) as Record<TypeCode, Level | null>;
  for (const code of typeCodes) {
    const all = answers.filter((a) => a.type === code);
    if (all.length === 0) continue;
    const pct = all.filter((a) => a.correct).length / all.length;
    // Solo se sube un nivel por encima del probado si se acierta todo; si no, como mucho el probado.
    const probado = Math.max(...all.map((a) => a.level));
    const tope = pct === 1 ? probado + 1 : probado;
    out[code] = Math.min(1 + Math.round(pct * 4), tope, 5) as Level;
  }
  return out;
}
