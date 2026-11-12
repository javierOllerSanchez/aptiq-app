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
export function generatorSuite<S extends Stem>(
  gen: Generator<S>,
  solver: Solver<S>,
  /** Enunciados distintos mínimos en 1.000 semillas, por nivel (por defecto 300). */
  minDistinct: Partial<Record<number, number>> = {},
) {
  describe(`${gen.type} v${gen.version}`, () => {
    for (const level of gen.levels) {
      for (const oc of [3, 4] as OptionCount[]) {
        test(
          `nivel ${level}, ${oc} opciones: ${N} preguntas sin ambigüedad`,
          () => {
            const positions = new Array<number>(oc).fill(0);
            const ranks = new Array<number>(oc).fill(0);
            const families = new Map<string, number>();
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
              if (gen.compareOptions) {
                const answer = item.options[item.answerIndex]!;
                ranks[item.options.filter((o) => gen.compareOptions!(o, answer) < 0).length]!++;
              }
              families.set(item.meta.family, (families.get(item.meta.family) ?? 0) + 1);
              if (i < 1_000) stems.add(item.stem.text);
            }
            // La correcta no puede delatarse por su posición (A, B, C, D)…
            for (const p of positions) expect(Math.abs(p - N / oc)).toBeLessThan((N / oc) * 0.2);
            // …ni por su valor: ordenadas de menor a mayor, no puede ser casi siempre la del medio.
            if (gen.compareOptions)
              for (const [r, count] of ranks.entries())
                expect(count, `la correcta ocupa el puesto ${r + 1} por valor en ${count} de ${N}`).toBeGreaterThan(
                  (N / oc) * 0.5,
                );
            // Cada familia de reglas declarada aparece de verdad.
            const declared = gen.families[level];
            for (const f of declared)
              expect(families.get(f) ?? 0, `la familia «${f}» casi no aparece`).toBeGreaterThan(
                (N / declared.length) * 0.4,
              );
            // Variedad (CON-02): al menos 300 enunciados distintos en las primeras 1.000 semillas. Los niveles bajos tienen
            // menos combinaciones posibles; la no repetición por usuario se garantiza con la semilla.
            expect(stems.size, `poca variedad en el nivel ${level}`).toBeGreaterThanOrEqual(
              minDistinct[level] ?? 300,
            );
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
