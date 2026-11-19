/**
 * Geometría de los desarrollos de cubos: plegar un desarrollo, girar el cubo y ver tres caras.
 * El desarrollo está en el plano con x a la derecha e y hacia arriba (norte), visto por la cara
 * impresa; al plegarlo, las caras se doblan hacia atrás y lo impreso queda por fuera.
 */
import { polygon, regular, transform, type Drawing, type Point, type Poly, type Shape } from '../figures/draw';

export type V3 = readonly [number, number, number];
const neg = (v: V3): V3 => [-v[0], -v[1], -v[2]];
const eq = (a: V3, b: V3) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

// --- Símbolos de las caras. `period`: cuartos de vuelta tras los que el símbolo se ve igual.
export const SYMBOLS = {
  circulo: { name: 'círculo', the: 'el círculo', period: 1 },
  cuadro: { name: 'cuadrado negro', the: 'el cuadrado negro', period: 1 },
  aro: { name: 'aro', the: 'el aro', period: 1 },
  marco: { name: 'cuadrado blanco', the: 'el cuadrado blanco', period: 1 },
  cruz: { name: 'cruz', the: 'la cruz', period: 1 },
  equis: { name: 'aspa', the: 'el aspa', period: 1 },
  raya: { name: 'raya', the: 'la raya', period: 2 },
  flecha: { name: 'flecha', the: 'la flecha', period: 4 },
  triangulo: { name: 'triángulo', the: 'el triángulo', period: 4 },
  media: { name: 'cuadrado', the: 'el cuadrado a medio rellenar', period: 4 },
} as const;
export type Sym = keyof typeof SYMBOLS;

/** Cara del desarrollo: casilla, símbolo y cuartos de vuelta del dibujo (sentido horario). */
export interface NetFace {
  x: number;
  y: number;
  sym: Sym;
  rho: number;
}

/** Cara plegada: normal hacia fuera y hacia dónde apunta la parte de arriba de su dibujo. */
export interface CubeFace {
  sym: Sym;
  normal: V3;
  up: V3;
}

/** Los 11 desarrollos del cubo (casillas [x, y]). */
export const NETS: [number, number][][] = [
  ...[[0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 2]].map(([a, b]) => [
    [0, 1], [1, 1], [2, 1], [3, 1], [a!, 2], [b!, 0],
  ] as [number, number][]),
  ...[1, 2, 3].map((b) => [[0, 2], [1, 2], [1, 1], [2, 1], [3, 1], [b, 0]] as [number, number][]),
  [[0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [3, 0]],
  [[0, 1], [1, 1], [2, 1], [2, 0], [3, 0], [4, 0]],
];
/** Los 6 desarrollos en forma de cruz alargada (una fila de 4 y una cara a cada lado). */
export const CROSS_NETS = NETS.slice(0, 6);

/** Pliega el desarrollo. Cada casilla vecina se dobla 90° sobre el lado que comparte. */
export function fold(net: readonly NetFace[]): CubeFace[] {
  type Frame = { u: V3; v: V3; inward: V3 };
  const frames = new Map<number, Frame>([[0, { u: [1, 0, 0], v: [0, 1, 0], inward: [0, 0, -1] }]]);
  const queue = [0];
  while (queue.length) {
    const i = queue.shift()!;
    const p = frames.get(i)!;
    net.forEach((c, j) => {
      if (frames.has(j)) return;
      const [dx, dy] = [c.x - net[i]!.x, c.y - net[i]!.y];
      let f: Frame | null = null;
      if (dx === 1 && dy === 0) f = { u: p.inward, v: p.v, inward: neg(p.u) };
      if (dx === -1 && dy === 0) f = { u: neg(p.inward), v: p.v, inward: p.u };
      if (dx === 0 && dy === 1) f = { u: p.u, v: p.inward, inward: neg(p.v) };
      if (dx === 0 && dy === -1) f = { u: p.u, v: neg(p.inward), inward: p.v };
      if (f) {
        frames.set(j, f);
        queue.push(j);
      }
    });
  }
  return net.map((c, i) => {
    const f = frames.get(i);
    if (!f) throw new Error('Desarrollo sin conectar');
    // Girar el dibujo en sentido horario lleva su «arriba» de v (norte) a u (este), y así.
    const up = [f.v, f.u, neg(f.v), neg(f.u)][((c.rho % 4) + 4) % 4]!;
    return { sym: c.sym, normal: neg(f.inward), up };
  });
}

/** Los 24 giros del cubo: permutaciones de los ejes con signos y determinante +1. */
export const ROTATIONS: ((v: V3) => V3)[] = (() => {
  const perms = [[0, 1, 2, 1], [1, 2, 0, 1], [2, 0, 1, 1], [0, 2, 1, -1], [2, 1, 0, -1], [1, 0, 2, -1]];
  const out: ((v: V3) => V3)[] = [];
  for (const [a, b, c, parity] of perms)
    for (const sx of [1, -1])
      for (const sy of [1, -1])
        for (const sz of [1, -1])
          if (parity! * sx * sy * sz === 1) out.push((v) => [sx * v[a!]!, sy * v[b!]!, sz * v[c!]!]);
  return out;
})();

/** Caras visibles del dibujo y sus ejes en pantalla: arriba, delante y derecha. */
const VIEW: { normal: V3; up: V3; right: V3 }[] = [
  { normal: [0, 0, 1], up: [0, 1, 0], right: [1, 0, 0] },
  { normal: [0, -1, 0], up: [0, 0, 1], right: [1, 0, 0] },
  { normal: [1, 0, 0], up: [0, 0, 1], right: [0, 1, 0] },
];

/** «flecha0 cruz0 raya1»: símbolo y cuartos de vuelta (normalizados) de las caras de arriba, delante y derecha. */
export function viewOf(faces: readonly CubeFace[], rot: (v: V3) => V3): string {
  return VIEW.map((slot) => {
    const f = faces.find((x) => eq(rot(x.normal), slot.normal))!;
    const up = rot(f.up);
    const r = [slot.up, slot.right, neg(slot.up), neg(slot.right)].findIndex((d) => eq(d, up));
    return `${f.sym}${r % SYMBOLS[f.sym].period}`;
  }).join(' ');
}

export const allViews = (faces: readonly CubeFace[]) => new Set(ROTATIONS.map((r) => viewOf(faces, r)));

export const parseView = (view: string) =>
  view.split(' ').map((s) => ({ sym: s.slice(0, -1) as Sym, r: Number(s.slice(-1)) }));

export const encodeNet = (net: readonly NetFace[]) => net.map((f) => `${f.x}.${f.y}:${f.sym}:${f.rho}`).join(',');
export const decodeNet = (code: string): NetFace[] =>
  code.split(',').map((s) => {
    const [xy, sym, rho] = s.split(':');
    const [x, y] = xy!.split('.').map(Number);
    return { x: x!, y: y!, sym: sym as Sym, rho: Number(rho) };
  });

// --- Textos. En la cara de arriba del cubo, «arriba» del dibujo es el fondo.
const DIRS = ['hacia arriba', 'hacia la derecha', 'hacia abajo', 'hacia la izquierda'];
const DIRS_TOP = ['hacia el fondo', 'hacia la derecha', 'hacia delante', 'hacia la izquierda'];
const HALF = ['de arriba', 'derecha', 'de abajo', 'izquierda'];
const HALF_TOP = ['del fondo', 'derecha', 'de delante', 'izquierda'];
/** Orientación del dibujo en palabras («hacia la derecha», «horizontal»…); vacía si no tiene. */
export function orientation(sym: Sym, r: number, onTop = false) {
  if (SYMBOLS[sym].period === 1) return '';
  if (sym === 'raya') return onTop ? (r % 2 === 0 ? 'de delante a atrás' : 'de lado a lado') : r % 2 === 0 ? 'vertical' : 'horizontal';
  if (sym === 'media') return `con la mitad ${(onTop ? HALF_TOP : HALF)[r]} rellena`;
  return (onTop ? DIRS_TOP : DIRS)[r]!;
}
export const describeSym = (sym: Sym, r: number, onTop = false) =>
  [SYMBOLS[sym].name, orientation(sym, r, onTop)].filter(Boolean).join(' ');
export const describeView = (view: string) => {
  const [t, f, r] = parseView(view);
  return `arriba ${describeSym(t!.sym, t!.r, true)}, delante ${describeSym(f!.sym, f!.r)}, a la derecha ${describeSym(r!.sym, r!.r)}`;
};

// --- Dibujo. Los símbolos se definen en un cuadro unidad con y hacia arriba.
const sq = (a: number, b: number): Point[] => [[a, a], [b, a], [b, b], [a, b]];
const CROSS: Point[] = [[0.42, 0.18], [0.58, 0.18], [0.58, 0.42], [0.82, 0.42], [0.82, 0.58], [0.58, 0.58], [0.58, 0.82], [0.42, 0.82], [0.42, 0.58], [0.18, 0.58], [0.18, 0.42], [0.42, 0.42]];
const turn45 = (pts: Point[]): Point[] =>
  pts.map(([x, y]) => [0.5 + (x - 0.5 - (y - 0.5)) * Math.SQRT1_2, 0.5 + (x - 0.5 + (y - 0.5)) * Math.SQRT1_2]);
const SHAPES: Record<Sym, Poly[]> = {
  circulo: [polygon(regular(0.5, 0.5, 0.28, 24), 'ink')],
  cuadro: [polygon(sq(0.24, 0.76), 'ink')],
  aro: [polygon(regular(0.5, 0.5, 0.27, 24), 'none', 'ink', 0.08)],
  marco: [polygon(sq(0.25, 0.75), 'none', 'ink', 0.08)],
  cruz: [polygon(CROSS, 'ink')],
  equis: [polygon(turn45(CROSS), 'ink')],
  raya: [polygon([[0.42, 0.16], [0.58, 0.16], [0.58, 0.84], [0.42, 0.84]], 'ink')],
  flecha: [polygon([[0.5, 0.86], [0.8, 0.52], [0.6, 0.52], [0.6, 0.14], [0.4, 0.14], [0.4, 0.52], [0.2, 0.52]], 'ink')],
  triangulo: [polygon([[0.5, 0.82], [0.82, 0.2], [0.18, 0.2]], 'ink')],
  media: [polygon([[0.22, 0.5], [0.78, 0.5], [0.78, 0.78], [0.22, 0.78]], 'ink'), polygon(sq(0.22, 0.78), 'none', 'ink', 0.06)],
};
/** Cuartos de vuelta en sentido horario alrededor del centro del cuadro. */
const spin = (r: number) => (x: number, y: number): Point => {
  let [a, b] = [x, y];
  for (let i = 0; i < r; i++) [a, b] = [b, 1 - a];
  return [a, b];
};

const FACE = polygon(sq(0, 1), 'paper', 'ink', 0.03);

/** Desarrollo en una caja cuadrada justa, con la fila de arriba (y mayor) arriba del dibujo. */
export function netDrawing(net: readonly NetFace[]): Drawing {
  const xs = net.map((f) => f.x);
  const ys = net.map((f) => f.y);
  const [minX, maxY] = [Math.min(...xs), Math.max(...ys)];
  const [w, h] = [Math.max(...xs) - minX + 1, maxY - Math.min(...ys) + 1];
  const size = Math.max(w, h);
  const [ox, oy] = [(size - w) / 2, (size - h) / 2];
  const shapes: Shape[] = [];
  for (const f of net) {
    const place = (x: number, y: number): Point => [ox + f.x - minX + x, oy + maxY - f.y + 1 - y];
    shapes.push(transform(FACE, place, 1));
    for (const p of SHAPES[f.sym]) shapes.push(transform(p, (x, y) => place(...spin(f.rho)(x, y))));
  }
  return { size, shapes };
}

/** Cubo en perspectiva caballera: arriba, delante y derecha. */
export function viewDrawing(view: string): Drawing {
  const [k, d, size, pad] = [0.5, 0.45, 1.7, 0.075];
  const project = (x: number, y: number, z: number): Point => [pad + x + k * y, size - pad - (z + d * y) - 0.1];
  const faces: ((s: number, t: number) => Point)[] = [
    (s, t) => project(s, t, 1),
    (s, t) => project(s, 0, t),
    (s, t) => project(1, s, t),
  ];
  const shapes: Shape[] = [];
  parseView(view).forEach(({ sym, r }, i) => {
    shapes.push(transform(FACE, faces[i]!, 1));
    for (const p of SHAPES[sym]) shapes.push(transform(p, (x, y) => faces[i]!(...spin(r)(x, y))));
  });
  return { size, shapes };
}
