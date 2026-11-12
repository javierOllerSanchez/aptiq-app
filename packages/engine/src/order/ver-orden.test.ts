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

test.each([2, 3, 4, 5] as const)(
  'nivel %i: en «puesto N» la correcta no es casi siempre la del medio alfabéticamente',
  (level) => {
    const ranks = [0, 0, 0, 0];
    const collator = new Intl.Collator('es');
    for (let i = 0; i < 4_000; i++) {
      const item = verOrden.generate(`r${i}`, level, 4);
      const n = item.stem.position;
      if (n === 1 || n === item.stem.words.length) continue; // primera o última: es la solución
      const answer = item.options[item.answerIndex]!;
      ranks[item.options.filter((o) => collator.compare(o, answer) < 0).length]!++;
    }
    const total = ranks.reduce((a, b) => a + b, 0);
    // Los dos puestos centrales, como mucho un 60 % (al azar sería el 50 %).
    expect((ranks[1]! + ranks[2]!) / total).toBeLessThan(0.6);
  },
);
