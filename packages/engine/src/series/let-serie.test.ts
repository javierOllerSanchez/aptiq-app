import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { ALPHABET } from './alphabet';
import { letSerie } from './let-serie';
import { letSerieSolver, predictNextLetter } from './let-serie.solver';

// Con 27 letras hay pocas series posibles en los niveles bajos (medido: 72, 164 y 36 distintas
// en 1.000 semillas). Los opositores que practiquen mucho este tipo verán repeticiones ahí.
generatorSuite(letSerie, letSerieSolver, { 1: 60, 2: 120, 3: 30 });

test('el alfabeto tiene 27 letras con Ñ después de la N', () => {
  expect(ALPHABET).toHaveLength(27);
  expect(ALPHABET.indexOf('Ñ')).toBe(ALPHABET.indexOf('N') + 1);
});

test.each([
  [['A', 'C', 'E', 'G', 'I'], 'K'],
  [['L', 'M', 'N', 'Ñ', 'O'], 'P'],
  [['A', 'B', 'D', 'G', 'K'], 'O'],
  [['Z', 'X', 'V', 'T', 'R'], 'P'],
])('el solucionador reconoce %j → %s', (letters, next) => {
  expect(predictNextLetter(letters)).toContain(next);
});

test('cuenta la Ñ: después de N, O, va P saltando de uno en uno desde M', () => {
  expect(predictNextLetter(['J', 'K', 'L', 'M', 'N'])).toEqual(new Set(['Ñ']));
});

test('los niveles 4 y 5 nunca son, en realidad, un salto fijo (nivel 1)', () => {
  for (const level of [4, 5] as const)
    for (let i = 0; i < 1_000; i++) {
      const p = letSerie.generate(`n${i}`, level, 4).stem.letters.map((l) => ALPHABET.indexOf(l));
      const d = p.slice(1).map((x, j) => x - p[j]!);
      expect(new Set(d).size, `semilla n${i}, nivel ${level}`).toBeGreaterThan(1);
    }
});
