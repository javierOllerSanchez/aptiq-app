import type { Breakdown, Tally } from '@aptiq/engine';

import { aReforzar } from '@/practice/run';

// Parte C de la fase 9: la aptitud a reforzar solo se marca con datos y una diferencia real (RES-02).

const t = (correct: number, total: number): Tally => ({
  correct,
  wrong: total - correct,
  blank: 0,
  total,
});
const d = (byAptitude: Record<string, Tally>, weakest: string | null): Breakdown =>
  ({
    total: { aciertos: 0, fallos: 0, enBlanco: 0 },
    byType: {},
    byAptitude,
    weakest,
  }) as Breakdown;

test('todas al 0 %: no se inventa un punto débil', () => {
  expect(aReforzar(d({ numerica: t(0, 16), verbal: t(0, 16) }, 'numerica'))).toBeNull();
});

test('con pocas preguntas no se señala', () => {
  expect(aReforzar(d({ numerica: t(8, 10), verbal: t(0, 2) }, 'verbal'))).toBeNull();
});

test('con datos y 10 puntos o más por debajo de la mejor, sí', () => {
  expect(aReforzar(d({ numerica: t(8, 10), verbal: t(3, 10) }, 'verbal'))).toBe('verbal');
});

test('si la diferencia es pequeña, no', () => {
  expect(aReforzar(d({ numerica: t(8, 10), verbal: t(75, 100) }, 'verbal'))).toBeNull();
});

test('si empata en el peor porcentaje con otra aptitud, no se señala', () => {
  expect(
    aReforzar(d({ numerica: t(0, 16), verbal: t(0, 16), abstracta: t(2, 16) }, 'numerica')),
  ).toBeNull();
});
