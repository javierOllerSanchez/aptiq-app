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

test('si el orden antiguo (LL como letra propia) cambia la respuesta, la pregunta se descarta', () => {
  // Moderno: LIBRO, LLAVE, LOMA. Antiguo: LIBRO, LOMA, LLAVE. Puesto 2 → dos respuestas.
  const item = {
    ...verOrden.generate('x', 1, 3),
    stem: { text: '', words: ['LOMA', 'LLAVE', 'LIBRO'], position: 2 },
    options: ['LLAVE', 'LOMA', 'LIBRO'],
  };
  expect(verOrdenSolver.validOptions(item)).toEqual([0, 1]);
});

test('en «puesto N» la correcta no es casi siempre la del medio alfabéticamente', () => {
  const ranks = [0, 0, 0, 0];
  const collator = new Intl.Collator('es');
  for (let i = 0; i < 2_000; i++) {
    const item = verOrden.generate(`r${i}`, 4, 4);
    const answer = item.options[item.answerIndex]!;
    ranks[item.options.filter((o) => collator.compare(o, answer) < 0).length]!++;
  }
  for (const r of ranks) expect(r).toBeGreaterThan(250);
});
