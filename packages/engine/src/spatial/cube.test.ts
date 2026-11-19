import { expect, test } from 'vitest';

import { allViews, fold, NETS, ROTATIONS, viewOf, type NetFace } from './cube';

const key = (v: readonly number[]) => v.join(',');

test('hay 24 giros del cubo, todos distintos', () => {
  expect(ROTATIONS).toHaveLength(24);
  expect(new Set(ROTATIONS.map((r) => key(r([1, 2, 3])))).size).toBe(24);
});

test('los 11 desarrollos se pliegan en un cubo (6 caras distintas)', () => {
  expect(NETS).toHaveLength(11);
  for (const net of NETS) {
    const faces = fold(net.map(([x, y]) => ({ x, y, sym: 'circulo', rho: 0 })));
    expect(new Set(faces.map((f) => key(f.normal))).size).toBe(6);
  }
});

test('en la cruz, las caras separadas por una en línea recta son opuestas', () => {
  // Fila del medio 0..3 y una cara arriba y otra abajo de la segunda.
  const cells = [[0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [1, 0]] as const;
  const faces = fold(cells.map(([x, y]) => ({ x, y, sym: 'circulo', rho: 0 })));
  const opposite = (i: number, j: number) => faces[i]!.normal.every((n, k) => n === -faces[j]!.normal[k]!);
  expect(opposite(0, 2)).toBe(true);
  expect(opposite(1, 3)).toBe(true);
  expect(opposite(4, 5)).toBe(true);
  expect(opposite(0, 1)).toBe(false);
});

test('la cara de partida queda arriba y su vecina de la derecha, a la derecha, con el dibujo igual', () => {
  const net: NetFace[] = [
    { x: 0, y: 0, sym: 'flecha', rho: 0 },
    { x: 1, y: 0, sym: 'triangulo', rho: 0 },
    { x: 0, y: -1, sym: 'cruz', rho: 0 },
    { x: 0, y: 1, sym: 'aro', rho: 0 },
    { x: 0, y: 2, sym: 'marco', rho: 0 },
    { x: -1, y: 0, sym: 'cuadro', rho: 0 },
  ];
  // Sin girar: arriba la flecha (apunta hacia el fondo = arriba en el dibujo), delante la cruz
  // (la cara de abajo del desarrollo se pliega hacia delante) y a la derecha el triángulo, que al
  // plegarse sigue apuntando hacia el fondo: en el dibujo, hacia la derecha.
  const identity = ROTATIONS.find((r) => key(r([1, 2, 3])) === '1,2,3')!;
  expect(viewOf(fold(net), identity)).toBe('flecha0 cruz0 triangulo1');
});

test('ver las caras de delante y derecha intercambiadas (espejo) nunca es posible', () => {
  const syms = ['circulo', 'cruz', 'flecha', 'triangulo', 'raya', 'media'] as const;
  for (const net of NETS)
    for (let rho = 0; rho < 4; rho++) {
      const faces = fold(net.map(([x, y], i) => ({ x, y, sym: syms[i]!, rho: (rho + i) % 4 })));
      const views = allViews(faces);
      expect(views.size).toBe(24);
      for (const v of views) {
        const [t, f, r] = v.split(' ');
        // Intercambiar dos caras invierte el orden alrededor de la esquina.
        expect(views.has(`${t} ${r} ${f}`)).toBe(false);
      }
    }
});
