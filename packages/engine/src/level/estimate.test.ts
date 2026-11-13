import { expect, test } from 'vitest';

import type { Level } from '../types';
import { estimateLevels, type LevelAnswer } from './estimate';

const a = (correct: boolean, blank = false, level: Level = 2): LevelAnswer => ({
  type: 'NUM.CALC',
  level,
  correct,
  blank,
});

test('sin preguntas de un tipo, ese tipo no tiene nivel estimado', () => {
  const e = estimateLevels([a(true)]);
  expect(e['LET.SERIE']).toBeNull();
  expect(e['NUM.CALC']).not.toBeNull();
});

test('todo fallado da el nivel 1', () => {
  expect(estimateLevels([a(false), a(false)])['NUM.CALC']).toBe(1);
});

test('no se estima más de un nivel por encima del probado', () => {
  expect(estimateLevels([a(true), a(true)])['NUM.CALC']).toBe(3);
  expect(estimateLevels([a(true, false, 4), a(true, false, 4)])['NUM.CALC']).toBe(5);
});

test('«No lo sé» (en blanco) cuenta como no acertada: no sube el nivel', () => {
  const conBlanco = estimateLevels([a(true), a(false, true)])['NUM.CALC'];
  const conFallo = estimateLevels([a(true), a(false)])['NUM.CALC'];
  expect(conBlanco).toBe(conFallo);
  expect(estimateLevels([a(false, true), a(false, true)])['NUM.CALC']).toBe(1);
});

test('la mitad de aciertos no sube por encima del nivel probado', () => {
  expect(estimateLevels([a(true), a(false)])['NUM.CALC']).toBe(2);
});
