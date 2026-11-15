import fc from 'fast-check';
import { expect, test } from 'vitest';

import type { TypeCode } from '../taxonomy';
import { addDays, type DayResult, daysBetween, dueTypes, INTERVALOS } from './spaced';

// Fase 6 · T2 (REP-01): 1, 3, 7 y 14 días; ≥ 70 % en el día de repaso avanza; por debajo vuelve a 1 día.

const r = (dia: string, type: TypeCode, ok: number, mal: number): DayResult[] => [
  ...Array.from({ length: ok }, () => ({ dia, type, correct: true, blank: false })),
  ...Array.from({ length: mal }, () => ({ dia, type, correct: false, blank: false })),
];

test('los intervalos son los aprobados', () => {
  expect(INTERVALOS).toEqual([1, 3, 7, 14]);
});

test('sumar días cruza meses, años y años bisiestos', () => {
  expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
  expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  expect(addDays('2027-02-28', 1)).toBe('2027-03-01');
  expect(daysBetween('2026-11-15', '2027-06-15')).toBe(212);
});

test('propiedad: sumar n días y medir la distancia devuelve n', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 40_000 }), fc.integer({ min: -5_000, max: 5_000 }), (base, n) => {
      const dia = addDays('1990-01-01', base);
      expect(daysBetween(dia, addDays(dia, n))).toBe(n);
      expect(dia).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }),
  );
});

test('un tipo sin fallos nunca entra en repaso', () => {
  expect(dueTypes(r('2026-11-01', 'NUM.CALC', 5, 0), '2026-11-02')).toEqual([]);
});

test('un fallo pone el tipo en repaso para el día siguiente, no antes', () => {
  const h = r('2026-11-01', 'NUM.CALC', 4, 1);
  expect(dueTypes(h, '2026-11-01')).toEqual([]);
  expect(dueTypes(h, '2026-11-02')).toEqual(['NUM.CALC']);
  expect(dueTypes(h, '2026-11-09')).toEqual(['NUM.CALC']); // sigue pendiente si no se repasa
});

test('repasos bien hechos lo llevan por 1, 3, 7 y 14 días y después sale del repaso', () => {
  const h = [
    ...r('2026-11-01', 'NUM.CALC', 0, 2), // entra: toca el 02
    ...r('2026-11-02', 'NUM.CALC', 7, 3), // 70 %: siguiente intervalo, 3 días → 05
    ...r('2026-11-05', 'NUM.CALC', 8, 2), // → 7 días → 12
    ...r('2026-11-12', 'NUM.CALC', 9, 1), // → 14 días → 26
  ];
  expect(dueTypes(h, '2026-11-04')).toEqual([]);
  expect(dueTypes(h.slice(0, 20), '2026-11-11')).toEqual([]);
  expect(dueTypes(h, '2026-11-25')).toEqual([]);
  expect(dueTypes(h, '2026-11-26')).toEqual(['NUM.CALC']);
  const fin = [...h, ...r('2026-11-26', 'NUM.CALC', 10, 0)];
  expect(dueTypes(fin, '2027-06-01')).toEqual([]);
});

test('un repaso por debajo del 70 % vuelve a 1 día', () => {
  const h = [...r('2026-11-01', 'NUM.CALC', 0, 1), ...r('2026-11-02', 'NUM.CALC', 7, 3), ...r('2026-11-05', 'NUM.CALC', 6, 4)];
  expect(dueTypes(h, '2026-11-06')).toEqual(['NUM.CALC']);
});

test('practicar antes de tiempo con fallos lo devuelve a 1 día; sin fallos no cambia nada', () => {
  const base = [...r('2026-11-01', 'NUM.CALC', 0, 1), ...r('2026-11-02', 'NUM.CALC', 10, 0)]; // toca el 05
  expect(dueTypes([...base, ...r('2026-11-03', 'NUM.CALC', 5, 0)], '2026-11-04')).toEqual([]);
  expect(dueTypes([...base, ...r('2026-11-03', 'NUM.CALC', 3, 2)], '2026-11-04')).toEqual(['NUM.CALC']);
});

test('en blanco cuenta como fallo y cada tipo lleva su propio calendario', () => {
  const h: DayResult[] = [
    { dia: '2026-11-01', type: 'LET.SERIE', correct: false, blank: true },
    ...r('2026-11-01', 'NUM.CALC', 3, 0),
  ];
  expect(dueTypes(h, '2026-11-02')).toEqual(['LET.SERIE']);
});

test('el resultado no depende del orden de entrada dentro de la lista', () => {
  const h = [...r('2026-11-02', 'NUM.CALC', 10, 0), ...r('2026-11-01', 'NUM.CALC', 0, 1)];
  expect(dueTypes(h, '2026-11-04')).toEqual([]);
  expect(dueTypes(h, '2026-11-05')).toEqual(['NUM.CALC']);
});
