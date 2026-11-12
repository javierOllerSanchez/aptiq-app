import fc from 'fast-check';
import { expect, test } from 'vitest';

import { createRng } from './rng';

test('la misma semilla produce la misma secuencia', () => {
  fc.assert(
    fc.property(fc.string(), (seed) => {
      const a = createRng(seed);
      const b = createRng(seed);
      for (let i = 0; i < 20; i++) expect(a.next()).toBe(b.next());
    }),
  );
});

test('semillas distintas producen secuencias distintas', () => {
  const a = Array.from({ length: 5 }, createRng('a').next);
  const b = Array.from({ length: 5 }, createRng('b').next);
  expect(a).not.toEqual(b);
});

test('next() está en [0, 1) e int() respeta los límites', () => {
  fc.assert(
    fc.property(fc.string(), fc.integer({ min: -50, max: 50 }), fc.nat(100), (seed, min, span) => {
      const rng = createRng(seed);
      const x = rng.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      const n = rng.int(min, min + span);
      expect(n).toBeGreaterThanOrEqual(min);
      expect(n).toBeLessThanOrEqual(min + span);
      expect(Number.isInteger(n)).toBe(true);
    }),
  );
});

test('int() reparte de forma aproximadamente uniforme', () => {
  const rng = createRng('uniforme');
  const counts = [0, 0, 0, 0];
  for (let i = 0; i < 40_000; i++) counts[rng.int(0, 3)]!++;
  for (const c of counts) expect(Math.abs(c - 10_000)).toBeLessThan(500);
});

test('shuffle() es una permutación y no modifica el original', () => {
  fc.assert(
    fc.property(fc.string(), fc.array(fc.integer()), (seed, arr) => {
      const copy = [...arr];
      const out = createRng(seed).shuffle(arr);
      expect(arr).toEqual(copy);
      expect([...out].sort((x, y) => x - y)).toEqual([...arr].sort((x, y) => x - y));
    }),
  );
});

test('pick() devuelve un elemento de la lista', () => {
  fc.assert(
    fc.property(fc.string(), fc.array(fc.integer(), { minLength: 1 }), (seed, arr) => {
      expect(arr).toContain(createRng(seed).pick(arr));
    }),
  );
});
