import fc from 'fast-check';
import { expect, test } from 'vitest';

import { cellsDrawing, decodeCells, encodeCells, mirror, normalize, rotate, sameShape, type Cell } from './grid';
import { polygon, transform } from './draw';

const cells = fc
  .uniqueArray(fc.tuple(fc.integer({ min: -4, max: 4 }), fc.integer({ min: -4, max: 4 })), {
    minLength: 1,
    maxLength: 9,
    selector: ([x, y]) => `${x},${y}`,
  })
  .map((cs) => cs as Cell[]);

test('girar cuatro veces 90° deja la figura igual', () => {
  fc.assert(fc.property(cells, (cs) => {
    expect(normalize(rotate(cs, 4))).toEqual(normalize(cs));
  }));
});

test('el espejo dos veces deja la figura igual', () => {
  fc.assert(fc.property(cells, (cs) => {
    expect(normalize(mirror(mirror(cs)))).toEqual(normalize(cs));
  }));
});

test('girar 90° lleva la derecha hacia abajo (pantalla, y hacia abajo)', () => {
  expect(normalize(rotate([[0, 0], [1, 0]], 1))).toEqual([[0, 0], [0, 1]]);
});

test('una L y su espejo no son la misma figura girada; dos giros sí', () => {
  const L: Cell[] = [[0, 0], [0, 1], [0, 2], [1, 2]];
  expect(sameShape(L, rotate(L, 3))).toBe(true);
  expect(sameShape(L, mirror(L))).toBe(false);
});

test('codificar y decodificar conserva la figura normalizada', () => {
  fc.assert(fc.property(cells, (cs) => {
    expect(decodeCells(encodeCells(cs))).toEqual(normalize(cs));
  }));
});

test('el dibujo de una figura tiene un cuadro por celda dentro de su caja', () => {
  const d = cellsDrawing([[0, 0], [1, 0], [1, 1]], 4);
  expect(d.size).toBe(4);
  expect(d.shapes).toHaveLength(3);
  for (const s of d.shapes) expect(s.d).toMatch(/^M[\d. -]+(L[\d. -]+)+Z$/);
});

test('los trazos son deterministas y con dos decimales como mucho', () => {
  const t = transform(polygon([[0, 0], [1, 0], [0.5, 1 / 3]], 'ink'), (x, y) => [x * 2, y * 2]);
  expect(t.d).toBe('M0 0L2 0L1 0.67Z');
});
