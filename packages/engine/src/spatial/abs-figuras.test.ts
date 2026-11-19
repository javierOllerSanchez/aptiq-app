import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { absFiguras } from './abs-figuras';
import { absFigurasSolver, decodeTerm, nextValue } from './abs-figuras.solver';

// Nivel 1 y 2: una flecha o un punto con pocos giros posibles; la semilla evita repetir por usuario.
generatorSuite(absFiguras, absFigurasSolver, { 1: 50, 2: 80 });

test('el solucionador deduce un giro constante y uno alterno', () => {
  expect(nextValue([0, 2, 4, 6])).toBe(0); // +2 cada vez
  expect(nextValue([7, 6, 5, 4])).toBe(3); // −1 cada vez
  expect(nextValue([0, 1, 3, 4, 6])).toBe(7); // +1, +2, +1, +2 → +1
  expect(nextValue([0, 1, 3, 6])).toBeNull(); // sin regla
});

test('los niveles altos muestran más elementos que los bajos', () => {
  const count = (level: 1 | 5) => absFiguras.generate('c', level, 4).stem.terms[0]!.split(' ').length;
  expect(count(1)).toBe(1);
  expect(count(5)).toBeGreaterThan(1);
});

test('cada figura de la serie y cada opción se puede dibujar y describir', () => {
  const item = absFiguras.generate('d', 4, 4);
  const { drawings, alt } = absFiguras.draw!.stem(item.stem);
  expect(drawings).toHaveLength(item.stem.terms.length);
  expect(alt).toMatch(/^Serie: 1\) /);
  for (const o of item.options) {
    expect(absFiguras.draw!.option(o).shapes.length).toBeGreaterThan(1);
    expect(absFiguras.describe!(o)).toMatch(/^(flecha|punto|aro)/);
  }
});

test('con varios elementos, elegir «el valor que más se repite» no delata la correcta', () => {
  for (const oc of [3, 4] as const) {
    let hits = 0;
    const N = 600;
    for (let i = 0; i < N; i++) {
      const item = absFiguras.generate(`k${i}`, ([3, 4, 5] as const)[i % 3]!, oc);
      const opts = item.options.map(decodeTerm);
      const parts = Object.keys(opts[0]!) as ('f' | 'p' | 'a')[];
      // Puntos de cada opción: elementos cuyo valor es el único más repetido.
      const score = opts.map((o) =>
        parts.filter((p) => {
          const count = (v: number) => opts.filter((x) => x[p] === v).length;
          const best = Math.max(...opts.map((x) => count(x[p]!)));
          return count(o[p]!) === best && opts.filter((x) => count(x[p]!) === best && x[p] !== o[p]).length === 0;
        }).length,
      );
      const top = Math.max(...score);
      const winners = score.flatMap((s, j) => (s === top ? [j] : []));
      if (winners.includes(item.answerIndex)) hits += 1 / winners.length;
    }
    expect(hits / N, `${oc} opciones`).toBeLessThan(1.5 / oc);
  }
});

test('no se acierta eligiendo la opción «del medio» (vecinas a 45° o a una casilla)', () => {
  const N = 600;
  for (const oc of [3, 4] as const)
    for (const level of [1, 2, 3, 4, 5] as const) {
      let hits = 0;
      for (let i = 0; i < N; i++) {
        const item = absFiguras.generate(`h${i}`, level, oc);
        const opts = item.options.map(decodeTerm);
        const part = Object.keys(opts[0]!)[0] as 'f' | 'p' | 'a';
        const near = (x: number, y: number) => Math.min((x - y + 8) % 8, (y - x + 8) % 8) === 1;
        const nb = opts.map((o, j) => opts.filter((q, k) => k !== j && near(o[part]!, q[part]!)).length);
        const top = Math.max(...nb);
        const winners = nb.flatMap((n, j) => (n === top ? [j] : []));
        if (winners.includes(item.answerIndex)) hits += 1 / winners.length;
      }
      expect(hits / N, `nivel ${level}, ${oc} opciones`).toBeLessThan(1.5 / oc);
    }
});

test('con varios elementos y 4 opciones, resolver solo uno no basta', () => {
  for (let i = 0; i < 300; i++) {
    const item = absFiguras.generate(`u${i}`, ([3, 4, 5] as const)[i % 3]!, 4);
    const opts = item.options.map(decodeTerm);
    const answer = opts[item.answerIndex]!;
    if (Object.keys(answer).length === 1) continue;
    for (const p of Object.keys(answer) as ('f' | 'p' | 'a')[])
      expect(opts.filter((o) => o[p] === answer[p]).length, `semilla u${i}`).toBeGreaterThanOrEqual(2);
  }
});
