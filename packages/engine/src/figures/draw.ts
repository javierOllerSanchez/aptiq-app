/**
 * Dibujos de las preguntas espaciales como trazos SVG (polígonos). El móvil (react-native-svg)
 * y el panel web pintan lo mismo. Los colores son nombres de token, nunca valores.
 */
export type Paint = 'ink' | 'paper' | 'none';
export type Point = readonly [number, number];

export interface Shape {
  /** Trazo SVG: solo `M`, `L` y `Z`. */
  d: string;
  fill: Paint;
  stroke: Paint;
  /** Grosor del trazo en unidades de la caja. */
  width: number;
}

/** Caja cuadrada de `size` × `size` unidades, con el origen arriba a la izquierda. */
export interface Drawing {
  size: number;
  shapes: Shape[];
}

const fmt = (n: number) => String(Math.round(n * 100) / 100);

export interface Poly {
  points: Point[];
  fill: Paint;
  stroke: Paint;
  width: number;
}

export const polygon = (points: Point[], fill: Paint, stroke: Paint = 'none', width = 0): Poly => ({
  points,
  fill,
  stroke,
  width,
});

/** Aplica una transformación a los puntos y lo convierte en trazo SVG. */
export function transform(p: Poly, f: (x: number, y: number) => Point, scale = 1): Shape {
  const pts = p.points.map(([x, y]) => f(x, y));
  return {
    d: pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${fmt(x)} ${fmt(y)}`).join('') + 'Z',
    fill: p.fill,
    stroke: p.stroke,
    width: p.width * scale,
  };
}

/** Polígono regular (círculos aproximados) centrado en (cx, cy). */
export const regular = (cx: number, cy: number, r: number, sides: number, start = -Math.PI / 2): Point[] =>
  Array.from({ length: sides }, (_, i) => {
    const a = start + (i * 2 * Math.PI) / sides;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
  });
