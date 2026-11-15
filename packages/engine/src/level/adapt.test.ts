import fc from 'fast-check';
import { expect, test } from 'vitest';

import { typeCodes } from '../taxonomy';
import type { Level } from '../types';
import { adaptLevels } from './adapt';
import type { LevelAnswer } from './estimate';

// Fase 6 · T1 (ENT-03): bloques de 10 respuestas del nivel actual; ≥ 8 sube, ≤ 4 baja (decisión del propietario).

const start = Object.fromEntries(typeCodes.map((c) => [c, null])) as Record<(typeof typeCodes)[number], Level | null>;
const ans = (level: Level, correct: boolean, blank = false): LevelAnswer => ({ type: 'NUM.CALC', level, correct, blank });
/** Un bloque de 10 respuestas a `level` con `ok` aciertos. */
const bloque = (level: Level, ok: number) => Array.from({ length: 10 }, (_, i) => ans(level, i < ok));

test('sin respuestas se queda en el nivel del test, o en 2 si no hay test', () => {
  const out = adaptLevels({ ...start, 'NUM.CALC': 4 }, []);
  expect(out['NUM.CALC']).toBe(4);
  expect(out['LET.SERIE']).toBe(2);
});

test('8 de 10 sube un nivel; 4 de 10 baja uno; 6 de 10 lo deja igual', () => {
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, bloque(3, 8))['NUM.CALC']).toBe(4);
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, bloque(3, 4))['NUM.CALC']).toBe(2);
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, bloque(3, 6))['NUM.CALC']).toBe(3);
});

test('con menos de 10 respuestas del nivel actual todavía no cambia', () => {
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, bloque(3, 9).slice(0, 9))['NUM.CALC']).toBe(3);
});

test('las respuestas de otro nivel no cuentan para el bloque actual', () => {
  const otras = Array.from({ length: 10 }, () => ans(5, true));
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, otras)['NUM.CALC']).toBe(3);
});

test('las preguntas en blanco cuentan como no acertadas', () => {
  const conBlancos = [...Array.from({ length: 7 }, () => ans(3, true)), ...Array.from({ length: 3 }, () => ans(3, false, true))];
  expect(adaptLevels({ ...start, 'NUM.CALC': 3 }, conBlancos)['NUM.CALC']).toBe(3);
});

test('sube y baja en el orden de las respuestas, sin salirse de 1 a 5', () => {
  const historial = [...bloque(4, 10), ...bloque(5, 10), ...bloque(5, 0), ...bloque(4, 0), ...bloque(3, 0), ...bloque(2, 0), ...bloque(1, 0)];
  expect(adaptLevels({ ...start, 'NUM.CALC': 4 }, historial)['NUM.CALC']).toBe(1);
  expect(adaptLevels({ ...start, 'NUM.CALC': 4 }, historial.slice(0, 20))['NUM.CALC']).toBe(5);
  expect(adaptLevels({ ...start, 'NUM.CALC': 4 }, historial.slice(0, 30))['NUM.CALC']).toBe(4);
});

test('propiedad: el nivel está entre 1 y 5 y como mucho cambia uno por cada 10 respuestas', () => {
  fc.assert(
    fc.property(
      fc.constantFrom<Level>(1, 2, 3, 4, 5),
      fc.array(fc.record({ level: fc.constantFrom<Level>(1, 2, 3, 4, 5), correct: fc.boolean() }), { maxLength: 120 }),
      (inicial, rs) => {
        const historial = rs.map((r) => ans(r.level, r.correct));
        const out = adaptLevels({ ...start, 'NUM.CALC': inicial }, historial)['NUM.CALC'];
        expect(out).toBeGreaterThanOrEqual(1);
        expect(out).toBeLessThanOrEqual(5);
        expect(Math.abs(out - inicial)).toBeLessThanOrEqual(Math.floor(historial.length / 10));
      },
    ),
  );
});
