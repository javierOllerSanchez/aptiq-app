// Vitest expone el modo (--mode stress) en import.meta.env.
declare global {
  interface ImportMeta {
    env: { MODE: string };
  }
}

import { describe, expect, test } from 'vitest';

import type { Generator, OptionCount, Solver, Stem } from '../src/types';

/** `pnpm test`: 1.000 por tipo, nivel y número de opciones. `pnpm test:stress`: 10.000. */
const N = import.meta.env.MODE === 'stress' ? 10_000 : 1_000;
const TIMEOUT = 600_000;

/**
 * Pruebas obligatorias de la skill aptiq-generator, iguales para todos los generadores:
 * unicidad, opciones, coherencia, distractores, posición uniforme, determinismo e instantáneas.
 */
export function generatorSuite<S extends Stem>(gen: Generator<S>, solver: Solver<S>) {
  describe(`${gen.type} v${gen.version}`, () => {
    for (const level of gen.levels) {
      for (const oc of [3, 4] as OptionCount[]) {
        test(
          `nivel ${level}, ${oc} opciones: ${N} preguntas sin ambigüedad`,
          () => {
            const positions = new Array<number>(oc).fill(0);
            const stems = new Set<string>();
            for (let i = 0; i < N; i++) {
              const item = gen.generate(`s${i}`, level, oc);
              const ctx = `semilla s${i}, nivel ${level}`;
              expect(item.options, ctx).toHaveLength(oc);
              expect(new Set(item.options).size, `opciones repetidas: ${ctx}`).toBe(oc);
              expect(solver.validOptions(item), `ambigua o errónea: ${ctx}`).toEqual([
                item.answerIndex,
              ]);
              expect(item.explanation.apply, `la explicación no llega a la respuesta: ${ctx}`).toContain(
                item.options[item.answerIndex],
              );
              const explained = item.explanation.distractors.map((d) => d.optionIndex).sort();
              const wrong = item.options.map((_, j) => j).filter((j) => j !== item.answerIndex);
              expect(explained, `distractor sin explicar: ${ctx}`).toEqual(wrong);
              for (const d of item.explanation.distractors) expect(d.error.length, ctx).toBeGreaterThan(10);
              for (const t of [item.explanation.observe, item.explanation.rule, item.explanation.tip])
                expect(t.length, ctx).toBeGreaterThan(10);
              positions[item.answerIndex]!++;
              stems.add(item.stem.text);
            }
            // La correcta no puede delatarse por su posición.
            for (const p of positions) expect(Math.abs(p - N / oc)).toBeLessThan((N / oc) * 0.2);
            // Variedad: las semillas distintas no repiten el mismo enunciado.
            expect(stems.size).toBeGreaterThan(N * 0.5);
          },
          TIMEOUT,
        );
      }

      test(`nivel ${level}: determinista`, () => {
        for (let i = 0; i < 50; i++) {
          expect(gen.generate(`d${i}`, level, 4)).toEqual(gen.generate(`d${i}`, level, 4));
        }
      });

      test(`nivel ${level}: instantánea de una semilla fija (si cambia, subir version)`, () => {
        expect(gen.generate('muestra', level, 4)).toMatchSnapshot();
      });
    }
  });
}
