import { taxonomy, type TypeCode, typeCodes } from '../taxonomy';
import type { Item } from '../types';

export interface ReviewResult {
  correct: boolean;
  blank: boolean;
  /** Explicación completa de la pregunta (EXP-01). */
  explanation: Item['explanation'];
  /** Error típico de la opción elegida; null si acertó o dejó en blanco (EXP-02). */
  wrongReason: string | null;
  /** Truco de examen del tipo (EXP-03). */
  tip: string;
}

export function reviewOf(item: Item, answerIndex: number | null): ReviewResult {
  const blank = answerIndex === null;
  const correct = !blank && answerIndex === item.answerIndex;
  const wrongReason =
    blank || correct
      ? null
      : (item.explanation.distractors.find((d) => d.optionIndex === answerIndex)?.error ?? null);
  return { correct, blank, explanation: item.explanation, wrongReason, tip: item.explanation.tip };
}

export interface Tally {
  correct: number;
  wrong: number;
  blank: number;
  total: number;
}

export interface Result {
  type: TypeCode;
  correct: boolean;
  blank: boolean;
}

export interface Breakdown {
  total: { aciertos: number; fallos: number; enBlanco: number };
  byType: Record<TypeCode, Tally>;
  byAptitude: Record<string, Tally>;
  /** Aptitud con peor porcentaje de aciertos entre las que tienen respuestas (RES-02). */
  weakest: string | null;
}

const empty = (): Tally => ({ correct: 0, wrong: 0, blank: 0, total: 0 });

function add(t: Tally, r: Result): void {
  t.total++;
  if (r.blank) t.blank++;
  else if (r.correct) t.correct++;
  else t.wrong++;
}

/** Totales, desglose por tipo y por aptitud, y la aptitud a reforzar. */
export function breakdown(results: readonly Result[]): Breakdown {
  const byType = Object.fromEntries(typeCodes.map((c) => [c, empty()])) as Record<TypeCode, Tally>;
  const byAptitude: Record<string, Tally> = {};
  const total = { aciertos: 0, fallos: 0, enBlanco: 0 };

  for (const r of results) {
    add(byType[r.type], r);
    const apt = taxonomy[r.type].aptitud;
    byAptitude[apt] ??= empty();
    add(byAptitude[apt], r);
    if (r.blank) total.enBlanco++;
    else if (r.correct) total.aciertos++;
    else total.fallos++;
  }

  let weakest: string | null = null;
  let worst = Infinity;
  for (const [apt, t] of Object.entries(byAptitude)) {
    const answered = t.correct + t.wrong;
    if (answered === 0) continue;
    const pct = t.correct / answered;
    if (pct < worst) {
      worst = pct;
      weakest = apt;
    }
  }
  return { total, byType, byAptitude, weakest };
}
