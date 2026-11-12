import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';
import { WORDS } from '../data/words';

import { verOrden } from './ver-orden';
import { verOrdenSolver } from './ver-orden.solver';

generatorSuite(verOrden, verOrdenSolver);

test('la lista de palabras no tiene repetidas ni tildes', () => {
  expect(new Set(WORDS).size).toBe(WORDS.length);
  for (const w of WORDS) expect(w, w).toMatch(/^[A-ZÑ]+$/);
});

test('la Ñ va después de la N: CANAL, CANTO, CAÑA', () => {
  const item = verOrden.generate('x', 1, 4);
  const sorted = [...item.stem.words].sort(new Intl.Collator('es').compare);
  expect(sorted[item.stem.position - 1]).toBe(item.options[item.answerIndex]);
  expect(['CAÑA', 'CANTO', 'CANAL'].sort(new Intl.Collator('es').compare)).toEqual(['CANAL', 'CANTO', 'CAÑA']);
});
