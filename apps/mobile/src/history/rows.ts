import { guardiaCivil2026, score, taxonomy } from '@aptiq/engine';

import type { SavedAttempt, SavedSession } from '@/data/store';
import { APTITUDE_LABELS, formatNota, isCorrect } from '@/practice/run';

export interface HistoryRow {
  id: string;
  label: string;
  detail: string;
  value: string;
  valueLabel: string;
  /** Simulacro que no llega a la nota mínima (se pinta en rojo y se dice con texto). */
  weak: boolean;
}

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** «14 nov». Sin Intl: Hermes no garantiza los nombres de mes en español. */
export function fechaCorta(ms: number): string {
  const d = new Date(ms);
  return `${d.getDate()} ${MESES[d.getMonth()]}`;
}

/** Filas del Historial (PRO-02): simulacros terminados y sesiones, lo más reciente primero. */
export function historyRows(sessions: SavedSession[], attempts: SavedAttempt[]) {
  const simulacros: HistoryRow[] = attempts
    .filter((a): a is SavedAttempt & { finishedAt: number } => a.finishedAt !== null)
    .sort((a, b) => b.empezado - a.empezado)
    .map((a) => {
      let aciertos = 0;
      let fallos = 0;
      for (const q of a.questions) {
        if (q.answer === null) continue;
        if (isCorrect(q)) aciertos++;
        else fallos++;
      }
      const nota = score(guardiaCivil2026, { aciertos, fallos });
      const puntos = formatNota(nota.puntos);
      const min = Math.round(Math.min(a.finishedAt - a.empezado, a.durationMs) / 60_000);
      return {
        id: a.id,
        label: 'Simulacro',
        detail: `${fechaCorta(a.empezado)} · ${min} min`,
        value: `${puntos} / ${nota.maxima}`,
        valueLabel: `${puntos} sobre ${nota.maxima}`,
        weak: nota.supera === false,
      };
    });

  const practica: HistoryRow[] = [...sessions]
    .sort((a, b) => b.creada - a.creada)
    .map((s) => {
      const ok = s.questions.filter(isCorrect).length;
      const n = s.questions.length;
      const aptitudes = [...new Set(s.questions.map((q) => taxonomy[q.type].aptitud))]
        .map((id) => APTITUDE_LABELS[id] ?? id)
        .join(', ');
      return {
        id: s.id,
        label: `Práctica · ${n} ${n === 1 ? 'pregunta' : 'preguntas'}`,
        detail: aptitudes ? `${fechaCorta(s.creada)} · ${aptitudes}` : fechaCorta(s.creada),
        value: `${ok} / ${n}`,
        valueLabel: `${ok} ${ok === 1 ? 'acierto' : 'aciertos'} de ${n}`,
        weak: false,
      };
    });

  return { simulacros, practica };
}
