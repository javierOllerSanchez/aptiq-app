import type { ExamProfile } from './profile';

export interface ScoreResult {
  /** Sin recortar: las bases no dicen si una nota negativa se queda en 0 (pendiente de confirmar). */
  puntos: number;
  maxima: number;
  minima: number;
  supera: boolean;
  enBlanco: number;
  /** Para la pantalla de Resultado: «60 aciertos − 12 fallos ÷ 3». */
  formula: string;
}

/**
 * Nota de un intento con la fórmula de las bases (BOE-A-2026-9982, base 7.3):
 * P = Y/T × (A − E/(N − 1)). Las preguntas en blanco no restan.
 * Si el perfil tiene pendiente algún dato necesario, no se inventa: se lanza un error.
 */
export function score(profile: ExamProfile, attempt: { aciertos: number; fallos: number }): ScoreResult {
  const { preguntas: T, opciones: N } = profile.format;
  const { maxima: Y, minima } = profile.format.puntuacion;
  if (T === null || N === null || Y === null || minima === null)
    throw new Error(`El perfil ${profile.id} tiene datos de puntuación pendientes de confirmar`);
  const { aciertos: A, fallos: E } = attempt;
  if (!Number.isInteger(A) || !Number.isInteger(E) || A < 0 || E < 0)
    throw new Error('Aciertos y fallos deben ser enteros no negativos');
  if (A + E > T) throw new Error(`Hay más respuestas que preguntas (${A + E} de ${T})`);

  const puntos = (Y / T) * (A - E / (N - 1));
  return {
    puntos,
    maxima: Y,
    minima,
    supera: puntos >= minima,
    enBlanco: T - A - E,
    formula: `${A} aciertos − ${E} fallos ÷ ${N - 1}`,
  };
}
