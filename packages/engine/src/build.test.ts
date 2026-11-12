import { expect, test } from 'vitest';

import { buildItem, byNumber, MAX_RETRIES, type Draft } from './build';
import type { Solver, Stem } from './types';

const draft = (answer: string): Draft<Stem> => ({
  stem: { text: '¿2 + 2?' },
  answer,
  distractors: [
    { value: '5', error: 'Sumas uno de más.' },
    { value: '3', error: 'Sumas uno de menos.' },
    { value: '22', error: 'Juntas las cifras en vez de sumar.' },
    { value: '0', error: 'Restas en lugar de sumar.' },
    { value: '6', error: 'Sumas dos de más.' },
    { value: '2', error: 'Te quedas con uno de los sumandos.' },
  ],
  observe: 'Son dos números iguales.',
  rule: 'Se suman los dos números.',
  apply: `2 + 2 = ${answer}`,
});

const solverOk: Solver<Stem> = {
  type: 'NUM.CALC',
  validOptions: (item) => item.options.flatMap((o, i) => (o === '4' ? [i] : [])),
};
const families = (make: () => Draft<Stem> | null) => ({
  1: { suma: make },
  2: { suma: make },
  3: { suma: make },
  4: { suma: make },
  5: { suma: make },
});
const spec = { type: 'NUM.CALC' as const, version: '1', tip: 'Calcula antes de mirar las opciones.' };

test('monta la pregunta con la correcta, un error por distractor y la familia', () => {
  const item = buildItem({ ...spec, solver: solverOk, families: families(() => draft('4')) }, 'x', 1, 4);
  expect(item.options).toHaveLength(4);
  expect(item.options[item.answerIndex]).toBe('4');
  expect(item.explanation.distractors).toHaveLength(3);
  expect(item.id).toBe('NUM.CALC:1:x:1');
  expect(item.meta.family).toBe('suma');
});

test('sin orden por valor usa los distractores más plausibles (los primeros)', () => {
  const item = buildItem({ ...spec, solver: solverOk, families: families(() => draft('4')) }, 'x', 1, 3);
  expect([...item.options].sort()).toEqual(['3', '4', '5']);
});

test('con orden por valor, la correcta ocupa cualquier puesto con frecuencia parecida', () => {
  const ranks = [0, 0, 0, 0];
  for (let i = 0; i < 4000; i++) {
    const item = buildItem(
      { ...spec, solver: solverOk, families: families(() => draft('4')), compare: byNumber },
      `s${i}`,
      1,
      4,
    );
    ranks[item.options.filter((o) => byNumber(o, '4') < 0).length]!++;
  }
  for (const r of ranks) expect(r).toBeGreaterThan(800);
});

test('reintenta con otra semilla si el solucionador ve ambigüedad', () => {
  let calls = 0;
  const flaky: Solver<Stem> = {
    type: 'NUM.CALC',
    validOptions: (item) => (++calls < 3 ? [0, 1] : solverOk.validOptions(item)),
  };
  const item = buildItem({ ...spec, solver: flaky, families: families(() => draft('4')) }, 'x', 1, 4);
  expect(calls).toBe(3);
  expect(item.options[item.answerIndex]).toBe('4');
});

test('agotar los reintentos es un error del generador', () => {
  const never: Solver<Stem> = { type: 'NUM.CALC', validOptions: () => [] };
  expect(() => buildItem({ ...spec, solver: never, families: families(() => draft('4')) }, 'x', 1, 4)).toThrow(
    `${MAX_RETRIES} reintentos agotados`,
  );
});

test('descarta distractores repetidos o iguales a la respuesta', () => {
  const d = draft('4');
  d.distractors.unshift({ value: '4', error: 'Igual a la respuesta.' }, { value: '5', error: 'Repetido.' });
  const item = buildItem({ ...spec, solver: solverOk, families: families(() => d) }, 'x', 1, 4);
  expect(new Set(item.options).size).toBe(4);
});

test('byNumber ordena números con separador de miles', () => {
  expect(['12.500', '900', '1250'].sort(byNumber)).toEqual(['900', '1250', '12.500']);
});
