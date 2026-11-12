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
  expect(solveCalc({ kind: 'reverse', p: 20, final: 120, up: true })).toBeCloseTo(100);
  expect(solveCalc({ kind: 'reverse', p: 25, final: 60, up: false })).toBeCloseTo(80);
});

test('formato español de números', () => {
  expect(fmt(1250)).toBe('1250');
  expect(fmt(12500)).toBe('12.500');
  expect(parseOption('12.500')).toBe(12500);
});

test('reglas de tres: «sumas» o «restas» la diferencia coincide con el valor de la opción', () => {
  // Bloqueante del revisor de contenido (versión 3): el texto decía lo contrario la mitad de las veces.
  let checked = 0;
  let matched = 0;
  for (let i = 0; i < 2_000; i++)
    for (const level of [3, 4] as const) {
      const item = numCalc.generate(`t${i}`, level, 4);
      const d = item.stem.data;
      if (d.kind !== 'rule3') continue;
      checked += item.explanation.distractors.length;
      for (const e of item.explanation.distractors) {
        const m = e.error.match(
          /^(Sumas|Restas) (?:a los días|al peso) la diferencia de (?:cajas|operarios) \((\d+)\)/,
        );
        if (!m) continue;
        matched++;
        const base = d.b;
        const delta = Number(m[2]) * (m[1] === 'Sumas' ? 1 : -1);
        expect(
          Number(item.options[e.optionIndex]),
          `semilla t${i}, nivel ${level}: ${e.error}`,
        ).toBe(base + delta);
      }
    }
  // La prueba debe haber comprobado de verdad textos de los dos tipos.
  expect(matched).toBeGreaterThan(200);
  expect(checked).toBeGreaterThan(matched);
});
