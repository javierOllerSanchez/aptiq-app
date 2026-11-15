import fc from 'fast-check';
import { expect, test } from 'vitest';

import { type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';
import { buildToday, HOY_PREGUNTAS } from './today';

// Fase 6 · T3 (ENT-02, REP-01, ENT-03). Criterio de aceptación: la Sesión de hoy prioriza el tipo más flojo.

const niveles = Object.fromEntries(typeCodes.map((c) => [c, 2])) as Record<TypeCode, Level>;
const base = { dia: '2026-11-15', due: [] as TypeCode[], fallos: {}, levels: niveles };
const cuenta = (out: { type: TypeCode }[]) =>
  Object.fromEntries(typeCodes.map((c) => [c, out.filter((x) => x.type === c).length])) as Record<TypeCode, number>;

test('tiene 12 preguntas y es determinista para el mismo día y las mismas semillas usadas', () => {
  expect(HOY_PREGUNTAS).toBe(12);
  expect(buildToday(base)).toHaveLength(12);
  expect(buildToday(base)).toEqual(buildToday(base));
  expect(buildToday(base)).not.toEqual(buildToday({ ...base, dia: '2026-11-16' }));
});

test('criterio de aceptación: el tipo con más fallos recibe más preguntas que ningún otro', () => {
  const out = cuenta(buildToday({ ...base, fallos: { 'LET.SERIE': 20, 'NUM.CALC': 3 } }));
  for (const c of typeCodes) if (c !== 'LET.SERIE') expect(out['LET.SERIE']).toBeGreaterThan(out[c]);
});

test('la mitad de la sesión es para los tipos que tocan repaso', () => {
  const out = cuenta(buildToday({ ...base, due: ['NUM.CALC'] }));
  expect(out['NUM.CALC']).toBeGreaterThanOrEqual(6);
});

test('cada pregunta va al nivel adaptativo de su tipo', () => {
  const levels = { ...niveles, 'NUM.CALC': 5 as Level, 'LET.SERIE': 1 as Level };
  for (const it of buildToday({ ...base, levels, fallos: { 'NUM.CALC': 5, 'LET.SERIE': 5 } })) {
    expect(it.level).toBe(levels[it.type]);
  }
});

test('sin fallos ni repasos reparte entre todos los tipos', () => {
  const out = cuenta(buildToday(base));
  const n = typeCodes.map((c) => out[c]);
  expect(Math.max(...n) - Math.min(...n)).toBeLessThanOrEqual(1);
});

test('no repite semillas usadas ni dentro de la sesión', () => {
  const primera = buildToday(base);
  const usedSeeds = new Set(primera.map((x) => x.seed));
  const segunda = buildToday({ ...base, usedSeeds });
  for (const x of segunda) expect(usedSeeds.has(x.seed)).toBe(false);
  expect(new Set(segunda.map((x) => x.seed)).size).toBe(12);
});

test('propiedad: siempre 12 preguntas y el tipo más fallado nunca recibe menos que otro sin repaso', () => {
  fc.assert(
    fc.property(
      fc.dictionary(fc.constantFrom(...typeCodes), fc.integer({ min: 0, max: 50 })),
      fc.subarray([...typeCodes]),
      (fallos, due) => {
        const out = buildToday({ ...base, fallos, due });
        expect(out).toHaveLength(12);
        const n = cuenta(out);
        const peor = [...typeCodes].sort((a, b) => (fallos[b] ?? 0) - (fallos[a] ?? 0))[0]!;
        for (const c of typeCodes) {
          if (!due.includes(c) && !due.includes(peor) && (fallos[c] ?? 0) < (fallos[peor] ?? 0)) {
            expect(n[peor]).toBeGreaterThanOrEqual(n[c]);
          }
        }
      },
    ),
  );
});
