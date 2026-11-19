import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { allViews, decodeNet, fold, parseView } from './cube';
import { espCubo } from './esp-cubo';
import { espCuboSolver } from './esp-cubo.solver';

generatorSuite(espCubo, espCuboSolver);

test('en cada opción incorrecta, ninguna forma de girar el cubo da esa vista', () => {
  for (let i = 0; i < 300; i++) {
    const item = espCubo.generate(`v${i}`, ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, 4);
    const views = allViews(fold(decodeNet(item.stem.net)));
    item.options.forEach((o, j) => expect(views.has(o), `semilla v${i}`).toBe(j === item.answerIndex));
  }
});

test('el nivel 1 solo usa símbolos sin dirección y el 5 usa al menos tres con dirección', () => {
  const directional = (code: string) =>
    decodeNet(code).filter((f) => ['flecha', 'triangulo', 'media'].includes(f.sym)).length;
  for (let i = 0; i < 50; i++) {
    expect(directional(espCubo.generate(`n${i}`, 1, 4).stem.net)).toBe(0);
    expect(directional(espCubo.generate(`n${i}`, 5, 4).stem.net)).toBeGreaterThanOrEqual(3);
  }
});

test('elegir en cada cara el símbolo que más se repite no delata la correcta', () => {
  const N = 600;
  for (const oc of [3, 4] as const) {
    let hits = 0;
    for (let i = 0; i < N; i++) {
      const item = espCubo.generate(`k${i}`, ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5, oc);
      const opts = item.options.map((o) => parseView(o).map((s) => `${s.sym}${s.r}`));
      const score = opts.map((o) =>
        o.filter((v, slot) => {
          const count = (x: string) => opts.filter((p) => p[slot] === x).length;
          const best = Math.max(...opts.map((p) => count(p[slot]!)));
          return count(v) === best && opts.every((p) => count(p[slot]!) < best || p[slot] === v);
        }).length,
      );
      const top = Math.max(...score);
      const winners = score.flatMap((s, j) => (s === top ? [j] : []));
      if (winners.includes(item.answerIndex)) hits += 1 / winners.length;
    }
    expect(hits / N, `${oc} opciones`).toBeLessThan(1.5 / oc);
  }
});

test('el desarrollo y cada opción se pueden dibujar y describir', () => {
  const item = espCubo.generate('d', 4, 4);
  const { drawings, alt } = espCubo.draw!.stem(item.stem);
  expect(drawings).toHaveLength(1);
  expect(alt).toMatch(/^Desarrollo del cubo/);
  for (const o of item.options) {
    expect(espCubo.draw!.option(o).shapes.length).toBeGreaterThanOrEqual(6);
    expect(espCubo.describe!(o)).toMatch(/^arriba .+, delante .+, a la derecha .+/);
  }
});
