import type { Item, Solver, Stem } from '../types';

/** Datos estructurados de cada tipo de cálculo: el solucionador recalcula desde aquí. */
export type CalcData =
  | { kind: 'expr'; expr: string }
  | { kind: 'percent'; p: number; n: number }
  | { kind: 'change'; p: number; n: number; up: boolean }
  | { kind: 'rule3'; a: number; b: number; c: number; inverse: boolean }
  | { kind: 'fraction'; num: number; den: number; n: number }
  | { kind: 'chain'; n: number; p1: number; p2: number }
  | { kind: 'reverse'; p: number; final: number; up: boolean };

export interface NumCalcStem extends Stem {
  data: CalcData;
}

/**
 * Evaluador de expresiones con prioridad de operadores (× y ÷ antes que + y −).
 * Es independiente del generador, que construye la operación paso a paso.
 */
export function evaluate(expr: string): number {
  const tokens = expr.match(/\d+|[+\-×÷()]/g) ?? [];
  let i = 0;
  const peek = () => tokens[i];
  const atom = (): number => {
    const t = tokens[i++];
    if (t === '(') {
      const v = sum();
      i++; // ')'
      return v;
    }
    return Number(t);
  };
  const product = (): number => {
    let v = atom();
    while (peek() === '×' || peek() === '÷') v = tokens[i++] === '×' ? v * atom() : v / atom();
    return v;
  };
  const sum = (): number => {
    let v = product();
    while (peek() === '+' || peek() === '-') v = tokens[i++] === '+' ? v + product() : v - product();
    return v;
  };
  return sum();
}

export function solveCalc(d: CalcData): number {
  switch (d.kind) {
    case 'expr':
      return evaluate(d.expr);
    case 'percent':
      return (d.n * d.p) / 100;
    case 'change':
      return d.n * (1 + ((d.up ? 1 : -1) * d.p) / 100);
    case 'rule3':
      // Directa: a → b, c → ?  ·  Inversa: a tardan b, c tardarán ?
      return d.inverse ? (d.a * d.b) / d.c : (d.b * d.c) / d.a;
    case 'fraction':
      return (d.n / d.den) * d.num;
    case 'chain':
      return d.n * (1 + d.p1 / 100) * (1 - d.p2 / 100);
    case 'reverse':
      // Precio de antes: el final es el (100 ± p) % de él.
      return d.final / (1 + ((d.up ? 1 : -1) * d.p) / 100);
  }
}

/** Lee un número de una opción: «1.250 €» → 1250; «12,5» → 12,5. */
export const parseOption = (o: string) => Number(o.replace(/[^\d,-]/g, '').replace(',', '.'));

export const numCalcSolver: Solver<NumCalcStem> = {
  type: 'NUM.CALC',
  validOptions: (item: Item<NumCalcStem>) => {
    const value = solveCalc(item.stem.data);
    return item.options.flatMap((o, i) => (Math.abs(parseOption(o) - value) < 1e-9 ? [i] : []));
  },
};
