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

test('no se acierta buscando la figura distinta ni la pareja de figuras iguales', () => {
  const N = 600;
  for (const oc of [3, 4] as const) {
    let odd = 0; // la única figura que no coincide (girando) con ninguna otra opción
    let pair = 0; // entre las que coinciden con otra si se permite el espejo
    for (let i = 0; i < N; i++) {
      const item = espGiro.generate(`o${i}`, ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, oc);
      const shapes = item.options.map(decodeCells);
      const guess = (match: (a: typeof shapes[0], b: typeof shapes[0]) => boolean, wantAlone: boolean) => {
        const alone = shapes.map((s, j) => shapes.every((t, k) => k === j || !match(s, t)));
        const picks = alone.flatMap((a, j) => (a === wantAlone ? [j] : []));
        return picks.length === 0 ? 1 / oc : picks.includes(item.answerIndex) ? 1 / picks.length : 0;
      };
      odd += guess(sameShape, true);
      pair += guess((a, b) => sameShape(a, b) || sameShape(a, mirror(b)), false);
    }
    // Con 3 opciones, la correcta y su espejo forman pareja: elegir entre las dos es justo la habilidad
    // que se evalúa (girar o dar la vuelta), así que se admite hasta 1/2.
    expect(odd / N, `figura distinta, ${oc} opciones`).toBeLessThanOrEqual(1.5 / oc);
    expect(pair / N, `pareja, ${oc} opciones`).toBeLessThanOrEqual(oc === 3 ? 0.5 : 1.5 / oc);
  }
});

test('semillas que agotaban los reintentos en el nivel 1 (revisor-contenido)', () => {
  for (const seed of ['s5090', 'k2297', 's5842', 'k116', 'k2359', 'k6315', 'k9829'])
    for (const oc of [3, 4] as const) expect(() => espGiro.generate(seed, 1, oc)).not.toThrow();
});

test('todas las figuras de una pregunta ocupan la misma caja (no se descarta por tamaño)', () => {
  const box = (code: string) => {
    const c = decodeCells(code);
    return [Math.max(...c.map((x) => x[0])), Math.max(...c.map((x) => x[1]))].sort().join('x');
  };
  for (let i = 0; i < 300; i++) {
    const item = espGiro.generate(`b${i}`, ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, 4);
    const model = box(item.stem.model);
    for (const o of item.options) expect(box(o), `semilla b${i}`).toBe(model);
  }
});
