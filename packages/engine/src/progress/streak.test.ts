import { expect, test } from 'vitest';

import { daysToExam, streak } from './streak';

// Fase 6 · T4 (PRO-03). Los días llegan como fecha LOCAL «AAAA-MM-DD».

test('sin actividad la racha es 0', () => {
  expect(streak([], '2026-11-15')).toBe(0);
});

test('cuenta días seguidos hasta hoy; varias sesiones el mismo día cuentan una vez', () => {
  expect(streak(['2026-11-13', '2026-11-14', '2026-11-15', '2026-11-15'], '2026-11-15')).toBe(3);
});

test('si hoy aún no has practicado, la racha de ayer sigue viva', () => {
  expect(streak(['2026-11-13', '2026-11-14'], '2026-11-15')).toBe(2);
});

test('un día sin practicar rompe la racha', () => {
  expect(streak(['2026-11-12', '2026-11-13'], '2026-11-15')).toBe(0);
  expect(streak(['2026-11-10', '2026-11-12', '2026-11-13', '2026-11-14', '2026-11-15'], '2026-11-15')).toBe(4);
});

test('cruza el cambio de mes y no depende del orden', () => {
  expect(streak(['2026-12-01', '2026-11-30', '2026-11-29'], '2026-12-01')).toBe(3);
});

test('los días futuros (reloj adelantado en otro móvil) no cuentan', () => {
  expect(streak(['2026-11-15', '2026-11-16'], '2026-11-15')).toBe(1);
});

test('cuenta atrás: días hasta el examen; sin fecha o con fecha mal escrita, nada', () => {
  expect(daysToExam('2026-11-15', '2027-06-15')).toBe(212);
  expect(daysToExam('2026-11-15', '2026-11-15')).toBe(0);
  expect(daysToExam('2026-11-15', null)).toBeNull();
  expect(daysToExam('2026-11-15', '15/06/2027')).toBeNull();
  expect(daysToExam('2026-11-15', '2027-02-30')).toBeNull();
});

test('un examen ya pasado no se cuenta hacia atrás', () => {
  expect(daysToExam('2026-11-15', '2026-11-01')).toBeNull();
});
