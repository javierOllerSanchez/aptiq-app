import fc from 'fast-check';
import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';
import { levels, type Level, type OptionCount } from '../types';

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

test('detecta la ambigüedad: una subserie «6, 12, 24» admite × 2 (48) y diferencias +6 (42)', () => {
  // Caso del revisor de contenido (semilla x1, nivel 5, versión 1).
  const p = predictNext([18, 6, 24, 12, 30, 24, 36]);
  expect(p).toContain(48);
  expect(p).toContain(42);
});

test('con 4 términos en la subserie que multiplica, la lectura es única', () => {
  const p = predictNext([18, 6, 24, 12, 30, 24, 36, 48, 42]);
  expect(p).toEqual(new Set([96]));
});

test('operaciones alternas: tras + a toca × b', () => {
  // 2 +3 5 ×2 10 +3 13 ×2 26 +3 29 → × 2 = 58
  expect(predictNext([2, 5, 10, 13, 26, 29])).toContain(58);
});

test('cada pregunta de nivel 1 es una suma constante pequeña', () => {
  const item = numSerie.generate('x', 1, 4);
  const t = item.stem.terms;
  const d = t[1]! - t[0]!;
  expect(d).toBeGreaterThanOrEqual(2);
  expect(d).toBeLessThanOrEqual(9);
});

const diffs = (t: number[]) => t.slice(1).map((x, j) => x - t[j]!);

// Caso del emulador (v3, semilla r13, nivel 3): «3, 3, 3, 3, 3» con «× 2 − 3».
test('ninguna serie repite un término seguido ni es constante (punto fijo de × a + b)', () => {
  fc.assert(
    fc.property(fc.string(), fc.constantFrom(...levels), fc.constantFrom(3, 4), (seed, level, oc) => {
      const item = numSerie.generate(seed, level as Level, oc as OptionCount);
      const all = [...item.stem.terms, Number(item.options[item.answerIndex])];
      expect(diffs(all), `${seed}, nivel ${level}: ${all.join(', ')}`).not.toContain(0);
    }),
    { numRuns: 5_000 },
  );
});

test('en «× a + b», «Observa» cita las diferencias reales y estas crecen de verdad', () => {
  fc.assert(
    fc.property(fc.string(), fc.constantFrom(3, 4), (seed, oc) => {
      const item = numSerie.generate(seed, 3, oc as OptionCount);
      if (item.meta.family !== 'multiplicaYSuma') return;
      const d = diffs(item.stem.terms);
      expect(item.explanation.observe).toContain(`(${d.join(', ')})`);
      d.slice(1).forEach((x, j) => expect(Math.abs(x), item.stem.text).toBeGreaterThan(Math.abs(d[j]!)));
    }),
    { numRuns: 5_000 },
  );
});

test('los niveles 4 y 5 nunca son, en realidad, una suma constante (nivel 1)', () => {
  for (const level of [4, 5] as const)
    for (let i = 0; i < 1_000; i++) {
      const t = numSerie.generate(`n${i}`, level, 4).stem.terms;
      const d = t.slice(1).map((x, j) => x - t[j]!);
      expect(new Set(d).size, `semilla n${i}, nivel ${level}: ${t.join(', ')}`).toBeGreaterThan(1);
    }
});
