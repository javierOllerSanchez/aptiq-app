import { expect, test } from 'vitest';

import { buildItem, MAX_RETRIES, type Draft } from './build';
import type { Solver, Stem } from './types';

const draft = (answer: string): Draft<Stem> => ({
  stem: { text: '¿2 + 2?' },
  answer,
  distractors: [
    { value: '5', error: 'Sumas uno de más.' },
    { value: '3', error: 'Sumas uno de menos.' },
    { value: '22', error: 'Juntas las cifras en vez de sumar.' },
  ],
  observe: 'Son dos números iguales.',
  rule: 'Se suman los dos números.',
  apply: `2 + 2 = ${answer}`,
});

const solverOk: Solver<Stem> = {
  type: 'NUM.CALC',
  validOptions: (item) => item.options.flatMap((o, i) => (o === '4' ? [i] : [])),
};
const spec = { type: 'NUM.CALC' as const, version: '1', tip: 'Calcula antes de mirar las opciones.' };

test('monta la pregunta con la correcta y un error explicado por distractor', () => {
  const item = buildItem({ ...spec, solver: solverOk }, 'x', 1, 4, () => draft('4'));
  expect(item.options).toHaveLength(4);
  expect(item.options[item.answerIndex]).toBe('4');
  expect(item.explanation.distractors).toHaveLength(3);
  expect(item.id).toBe('NUM.CALC:1:x:1');
});

test('con 3 opciones usa los distractores más plausibles (los primeros)', () => {
  const item = buildItem({ ...spec, solver: solverOk }, 'x', 1, 3, () => draft('4'));
  expect([...item.options].sort()).toEqual(['3', '4', '5']);
});

test('reintenta con otra semilla si el solucionador ve ambigüedad', () => {
  let calls = 0;
  const flaky: Solver<Stem> = {
    type: 'NUM.CALC',
    validOptions: (item) => (++calls < 3 ? [0, 1] : solverOk.validOptions(item)),
  };
  const item = buildItem({ ...spec, solver: flaky }, 'x', 1, 4, () => draft('4'));
  expect(calls).toBe(3);
  expect(item.options[item.answerIndex]).toBe('4');
});

test('agotar los reintentos es un error del generador', () => {
  const never: Solver<Stem> = { type: 'NUM.CALC', validOptions: () => [] };
  expect(() => buildItem({ ...spec, solver: never }, 'x', 1, 4, () => draft('4'))).toThrow(
    `${MAX_RETRIES} reintentos agotados`,
  );
});

test('descarta distractores repetidos o iguales a la respuesta', () => {
  const d = draft('4');
  d.distractors.unshift({ value: '4', error: 'Igual a la respuesta.' }, { value: '5', error: 'Repetido.' });
  const item = buildItem({ ...spec, solver: solverOk }, 'x', 1, 4, () => d);
  expect(new Set(item.options).size).toBe(4);
});
