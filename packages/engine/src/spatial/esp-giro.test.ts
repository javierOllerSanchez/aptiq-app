import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';
import { decodeCells, encodeCells, mirror, rotate, sameShape } from '../figures/grid';

import { espGiro } from './esp-giro';
import { espGiroSolver } from './esp-giro.solver';

// Pocas figuras posibles con 4–6 cuadros: la no repetición por usuario la da la semilla.
generatorSuite(espGiro, espGiroSolver, { 1: 40, 2: 150 });

test('el modelo nunca coincide con su espejo (si no, habría dos correctas)', () => {
  for (let i = 0; i < 300; i++)
    for (const level of [1, 3, 5] as const) {
      const model = decodeCells(espGiro.generate(`m${i}`, level, 4).stem.model);
      expect(sameShape(model, mirror(model)), `semilla m${i}`).toBe(false);
    }
});

test('la correcta está girada: nunca es el modelo tal cual', () => {
  for (let i = 0; i < 300; i++) {
    const item = espGiro.generate(`g${i}`, 2, 4);
    expect(item.options[item.answerIndex]).not.toBe(encodeCells(decodeCells(item.stem.model)));
  }
});

test('el solucionador acepta un giro y rechaza el espejo', () => {
  const L = decodeCells('0.0,0.1,0.2,1.2');
  const item = espGiro.generate('x', 1, 3);
  const fake = {
    ...item,
    stem: { ...item.stem, model: encodeCells(L) },
    options: [encodeCells(rotate(L, 1)), encodeCells(mirror(L)), encodeCells(rotate(mirror(L), 2))],
  };
  expect(espGiroSolver.validOptions(fake)).toEqual([0]);
});

test('cada opción se puede dibujar y describir', () => {
  const item = espGiro.generate('d', 5, 4);
  const { drawings, alt } = espGiro.draw!.stem(item.stem);
  expect(drawings).toHaveLength(1);
  expect(alt).toMatch(/^Modelo: fila 1/);
  for (const o of item.options) {
    expect(espGiro.draw!.option(o).shapes).toHaveLength(decodeCells(o).length);
    expect(espGiro.describe!(o)).toMatch(/^fila 1: cuadros? /);
  }
});
