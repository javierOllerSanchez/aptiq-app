import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

import { validateVerbal, type VerbalEntry } from './bank';

// Borradores redactados por IA (fase 8 · T8): se suben como «borrador» y solo llegan a la app si una persona los aprueba.
const borradores = JSON.parse(
  readFileSync(new URL('../../../../content/verbales/borradores.json', import.meta.url), 'utf8'),
) as Omit<VerbalEntry, 'id' | 'version'>[];

test('30 borradores por tipo, 6 por nivel', () => {
  for (const tipo of ['VER.SINON', 'VER.ANALOG'])
    for (const nivel of [1, 2, 3, 4, 5])
      expect(borradores.filter((b) => b.tipo === tipo && b.nivel === nivel), `${tipo} nivel ${nivel}`).toHaveLength(6);
});

test.each(borradores.map((b, i) => [i + 1, b] as const))('el borrador %i se puede aprobar (validador del panel)', (_, b) => {
  expect(validateVerbal({ ...b, id: 'x', version: 1 })).toEqual([]);
});

test('ningún enunciado se repite', () => {
  expect(new Set(borradores.map((b) => b.enunciado)).size).toBe(borradores.length);
});
