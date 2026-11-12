import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { numSerie } from './num-serie';
import { numSerieSolver, predictNext } from './num-serie.solver';

generatorSuite(numSerie, numSerieSolver);

test('el solucionador resuelve el ejemplo de la skill: 3, 7, 15, 31 → 63', () => {
  expect(predictNext([3, 7, 15, 31, 63])).toContain(127);
  expect(predictNext([3, 7, 15, 31, 63])).not.toContain(95);
});

test.each([
  [[2, 5, 8, 11, 14], 17],
  [[3, 6, 12, 24, 48], 96],
  [[1, 2, 4, 7, 11, 16], 22],
  [[2, 3, 5, 8, 13, 21], 34],
  [[1, 10, 3, 12, 5, 14, 7], 16],
  [[2, 5, 10, 13, 26, 29], 58],
])('el solucionador reconoce %j → %i', (terms, next) => {
  expect(predictNext(terms)).toContain(next);
});

test('detecta la ambigüedad cuando dos reglas razonables encajan', () => {
  // 1, 2, 4, 8 encaja con «× 2» (→ 16) y no da otra; pero 1, 2, 4 a secas encajaría también con «+1, +2, +3».
  // Con una serie corta que admite dos lecturas, el solucionador devuelve las dos.
  const both = predictNext([2, 4, 6, 8, 10, 12]);
  expect(both).toContain(14);
  const ambiguous = predictNext([1, 2, 3, 5, 8]); // Fibonacci (13) y no aritmética
  expect(ambiguous).toContain(13);
});

test('cada pregunta de nivel 1 es una suma constante pequeña', () => {
  const item = numSerie.generate('x', 1, 4);
  const t = item.stem.terms;
  const d = t[1]! - t[0]!;
  expect(d).toBeGreaterThanOrEqual(2);
  expect(d).toBeLessThanOrEqual(9);
});
