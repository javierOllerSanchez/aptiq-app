import { polygon, transform, type Drawing } from './draw';

/** Celda de una figura hecha de cuadros: [columna, fila], con la fila hacia abajo (pantalla). */
export type Cell = readonly [number, number];

/** Gira `turns` cuartos de vuelta en el sentido de las agujas del reloj. */
export function rotate(cells: readonly Cell[], turns: number): Cell[] {
  let out = cells.map(([x, y]) => [x, y] as Cell);
  for (let i = 0; i < ((turns % 4) + 4) % 4; i++) out = out.map(([x, y]) => [0 - y, x] as Cell);
  return out;
}

/** Espejo izquierda-derecha (darle la vuelta al papel). */
export const mirror = (cells: readonly Cell[]): Cell[] => cells.map(([x, y]) => [0 - x, y] as Cell);

/** Lleva la figura a la esquina (0, 0) y ordena sus celdas: dos figuras iguales quedan idénticas. */
export function normalize(cells: readonly Cell[]): Cell[] {
  const minX = Math.min(...cells.map((c) => c[0]));
  const minY = Math.min(...cells.map((c) => c[1]));
  return cells
    .map(([x, y]) => [x - minX + 0, y - minY + 0] as Cell)
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** «0.0,1.0,1.1»: la figura normalizada como texto (es lo que se guarda en las opciones). */
export const encodeCells = (cells: readonly Cell[]) => normalize(cells).map(([x, y]) => `${x}.${y}`).join(',');

export const decodeCells = (code: string): Cell[] =>
  code.split(',').map((c) => c.split('.').map(Number) as unknown as Cell);

/** ¿Es la misma figura girada (sin espejo)? */
export const sameShape = (a: readonly Cell[], b: readonly Cell[]) => {
  const target = encodeCells(b);
  return [0, 1, 2, 3].some((t) => encodeCells(rotate(a, t)) === target);
};

/** Dibujo de la figura centrada en una caja de `size` cuadros (igual para todas las opciones). */
export function cellsDrawing(cells: readonly Cell[], size: number): Drawing {
  const n = normalize(cells);
  const w = Math.max(...n.map((c) => c[0])) + 1;
  const h = Math.max(...n.map((c) => c[1])) + 1;
  const [ox, oy] = [(size - w) / 2, (size - h) / 2];
  const square = polygon([[0, 0], [1, 0], [1, 1], [0, 1]], 'ink', 'paper', 0.06);
  return {
    size,
    shapes: n.map(([x, y]) => transform(square, (px, py) => [ox + x + px, oy + y + py])),
  };
}

/** «Fila 1: cuadros 1 y 2; fila 2: cuadro 2»: la figura en palabras, para el lector de pantalla. */
export function describeCells(cells: readonly Cell[]): string {
  const n = normalize(cells);
  const rows = new Map<number, number[]>();
  for (const [x, y] of n) rows.set(y, [...(rows.get(y) ?? []), x + 1]);
  return [...rows.entries()]
    .map(([y, xs]) => {
      const list = xs.length === 1 ? `cuadro ${xs[0]}` : `cuadros ${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}`;
      return `fila ${y + 1}: ${list}`;
    })
    .join('; ');
}
