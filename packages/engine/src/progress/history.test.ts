import { expect, test } from 'vitest';

import { type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';
import { type DatedAnswer, levelHistory, mondayOf } from './history';

// Fase 6 · T5 (PRO-01): nivel por aptitud y global, semana a semana.

const start = Object.fromEntries(typeCodes.map((c) => [c, 2])) as Record<TypeCode, Level | null>;
const bloque = (dia: string, type: TypeCode, level: Level, ok: number): DatedAnswer[] =>
  Array.from({ length: 10 }, (_, i) => ({ dia, type, level, correct: i < ok, blank: false }));

test('el lunes de la semana de una fecha', () => {
  expect(mondayOf('2026-11-15')).toBe('2026-11-09'); // domingo
  expect(mondayOf('2026-11-16')).toBe('2026-11-16'); // lunes
  expect(mondayOf('2026-11-01')).toBe('2026-10-26');
});

test('devuelve las últimas semanas pedidas, de la más antigua a la actual', () => {
  const h = levelHistory(start, [], '2026-11-15', 4);
  expect(h.map((s) => s.semana)).toEqual(['2026-10-19', '2026-10-26', '2026-11-02', '2026-11-09']);
});

test('sin respuestas el nivel es el del test en todas las semanas', () => {
  const h = levelHistory(start, [], '2026-11-15', 2);
  for (const s of h) {
    expect(s.global).toBe(2);
    expect(s.porAptitud.numerica).toBe(2);
  }
});

test('el nivel de cada semana solo usa las respuestas hasta el final de esa semana', () => {
  const tipo = typeCodes.find((c) => c.startsWith('NUM'))!;
  const h = levelHistory(start, bloque('2026-11-12', tipo, 2, 10), '2026-11-15', 2);
  expect(h[0]!.porAptitud.numerica).toBe(2); // semana del 2: aún no había respuestas
  expect(h[1]!.porAptitud.numerica).toBeGreaterThan(2);
  expect(h[1]!.global).toBeGreaterThan(h[0]!.global);
});

test('la aptitud es la media de sus tipos y el global la media de todos', () => {
  const h = levelHistory({ ...start, [typeCodes[0]!]: 5 }, [], '2026-11-15', 1)[0]!;
  const media = (typeCodes.length * 2 + 3) / typeCodes.length;
  expect(h.global).toBeCloseTo(media, 5);
});

test('sin test de un tipo, ese tipo no entra en la media: no se inventa un nivel', () => {
  const sinTest = Object.fromEntries(typeCodes.map((c) => [c, null])) as Record<TypeCode, Level | null>;
  expect(levelHistory(sinTest, [], '2026-11-15', 4)).toEqual([]);
  const num = typeCodes.filter((c) => c.startsWith('NUM'));
  const parcial = { ...sinTest, ...Object.fromEntries(num.map((c) => [c, 4])) } as Record<TypeCode, Level | null>;
  const [s] = levelHistory(parcial, [], '2026-11-15', 1);
  expect(s!.global).toBe(4);
  expect(Object.keys(s!.porAptitud)).toEqual(['numerica']);
});
