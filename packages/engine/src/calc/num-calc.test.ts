import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { fmt, numCalc } from './num-calc';
import { evaluate, numCalcSolver, parseOption, solveCalc } from './num-calc.solver';

generatorSuite(numCalc, numCalcSolver);

test.each([
  ['12 + 8 × 3 - 5', 31],
  ['(10 + 6) × 3 ÷ 4', 12],
  ['7 × 23', 161],
  ['40 + 25 - 12', 53],
])('el evaluador respeta la prioridad: %s = %i', (expr, v) => {
  expect(evaluate(expr)).toBe(v);
});

test('casos calculados a mano', () => {
  expect(solveCalc({ kind: 'percent', p: 15, n: 240 })).toBe(36);
  expect(solveCalc({ kind: 'change', p: 25, n: 80, up: true })).toBe(100);
  expect(solveCalc({ kind: 'change', p: 20, n: 150, up: false })).toBe(120);
  expect(solveCalc({ kind: 'rule3', a: 4, b: 36, c: 7, inverse: false })).toBe(63);
  expect(solveCalc({ kind: 'rule3', a: 6, b: 10, c: 4, inverse: true })).toBe(15);
  expect(solveCalc({ kind: 'fraction', num: 3, den: 5, n: 240 })).toBe(144);
  expect(solveCalc({ kind: 'chain', n: 400, p1: 25, p2: 20 })).toBe(400);
});

test('formato español de números', () => {
  expect(fmt(1250)).toBe('1250');
  expect(fmt(12500)).toBe('12.500');
  expect(parseOption('12.500')).toBe(12500);
});
