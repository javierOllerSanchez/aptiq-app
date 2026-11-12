import { expect, test } from 'vitest';

import { estimateLevels } from './estimate';

test('sin respuestas de un tipo, ese tipo no tiene nivel estimado', () => {
  const e = estimateLevels([{ type: 'NUM.SERIE', correct: true, blank: false }]);
  expect(e['LET.SERIE']).toBeNull();
  expect(e['NUM.SERIE']).not.toBeNull();
});

test('todo acertado da el nivel 5; todo fallado, el 1', () => {
  const allRight = Array.from({ length: 4 }, () => ({ type: 'NUM.CALC' as const, correct: true, blank: false }));
  const allWrong = Array.from({ length: 4 }, () => ({ type: 'NUM.CALC' as const, correct: false, blank: false }));
  expect(estimateLevels(allRight)['NUM.CALC']).toBe(5);
  expect(estimateLevels(allWrong)['NUM.CALC']).toBe(1);
});

test('la mitad de aciertos da el nivel 3, y las preguntas en blanco no cuentan', () => {
  const half = [
    { type: 'COD.CRIPTO' as const, correct: true, blank: false },
    { type: 'COD.CRIPTO' as const, correct: false, blank: false },
    { type: 'COD.CRIPTO' as const, correct: false, blank: true },
  ];
  expect(estimateLevels(half)['COD.CRIPTO']).toBe(3);
});
