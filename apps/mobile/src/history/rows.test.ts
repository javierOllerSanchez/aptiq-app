import { registry } from '@aptiq/engine';

import type { SavedQuestion } from '@/data/store';
import { OPTION_COUNT } from '@/practice/run';

import { fechaCorta, historyRows } from './rows';

// Fase 5 · T5 (PRO-02). Las filas se calculan regenerando cada pregunta con su semilla.

/** Pregunta guardada respondida bien o mal, sin depender de qué opción es la correcta. */
function answered(type: SavedQuestion['type'], seed: string, ok: boolean): SavedQuestion {
  const item = registry[type].generator.generate(seed, 2, OPTION_COUNT);
  const answer = ok ? item.answerIndex : (item.answerIndex + 1) % OPTION_COUNT;
  return { type, level: 2, seed, answer, marked: false };
}

const types = Object.keys(registry) as SavedQuestion['type'][];
const day = (d: number) => Date.UTC(2026, 10, d, 10);

test('fecha corta en español: día y mes abreviado', () => {
  expect(fechaCorta(Date.UTC(2026, 10, 14, 12))).toBe('14 nov');
  expect(fechaCorta(Date.UTC(2027, 0, 3, 12))).toBe('3 ene');
});

test('lista simulacros terminados y sesiones, de la más reciente a la más antigua', () => {
  const t = types[0]!;
  const rows = historyRows(
    [
      { id: 's-vieja', creada: day(10), questions: [answered(t, 'a', true)] },
      { id: 's-nueva', creada: day(13), questions: [answered(t, 'b', true), answered(t, 'c', false)] },
    ],
    [
      { id: 'i-1', empezado: day(9), durationMs: 55 * 60_000, finishedAt: day(9) + 42 * 60_000, questions: [] },
      { id: 'i-2', empezado: day(14), durationMs: 55 * 60_000, finishedAt: day(14) + 70 * 60_000, questions: [] },
      { id: 'abierto', empezado: day(15), durationMs: 55 * 60_000, finishedAt: null, questions: [] },
    ],
  );
  expect(rows.simulacros.map((r) => r.id)).toEqual(['i-2', 'i-1']);
  expect(rows.practica.map((r) => r.id)).toEqual(['s-nueva', 's-vieja']);
  // El tiempo empleado nunca pasa del tiempo del examen.
  expect(rows.simulacros[0]?.detail).toBe('14 nov · 55 min');
  expect(rows.simulacros[1]?.detail).toBe('9 nov · 42 min');
});

test('la práctica cuenta aciertos sobre el total y nombra las aptitudes', () => {
  const t = types[0]!;
  const [row] = historyRows(
    [{ id: 's', creada: day(14), questions: [answered(t, 'a', true), answered(t, 'b', false), { ...answered(t, 'c', true), answer: null }] }],
    [],
  ).practica;
  expect(row?.label).toBe('Práctica · 3 preguntas');
  expect(row?.value).toBe('1 / 3');
  expect(row?.valueLabel).toBe('1 acierto de 3');
  expect(row?.detail).toMatch(/^14 nov · /);
});

test('un simulacro por debajo de la nota mínima se marca', () => {
  const t = types[0]!;
  const malas = Array.from({ length: 20 }, (_, i) => answered(t, `m${i}`, false));
  const [row] = historyRows([], [
    { id: 'i', empezado: day(14), durationMs: 60_000, finishedAt: day(14) + 60_000, questions: malas },
  ]).simulacros;
  expect(row?.weak).toBe(true);
  expect(row?.value).toMatch(/\/ \d+$/);
});
