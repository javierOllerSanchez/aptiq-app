import { readFileSync } from 'node:fs';

import fc from 'fast-check';
import { expect, test } from 'vitest';

import type { ExamProfile } from './profile';
import { score } from './score';

const gc = JSON.parse(
  readFileSync(new URL('../profiles/guardia-civil-2026.json', import.meta.url), 'utf8'),
) as ExamProfile;

// Casos calculados a mano con la fórmula de la base 7.3: P = 30/80 × (A − E/3).
test.each([
  [80, 0, 30, true],
  [60, 12, 21, true],
  [32, 0, 12, true],
  [40, 30, 11.25, false],
  [10, 60, -3.75, false],
  [0, 0, 0, false],
])('%i aciertos y %i fallos → %d puntos (¿supera el mínimo? %s)', (aciertos, fallos, puntos, apto) => {
  const r = score(gc, { aciertos, fallos });
  expect(r.puntos).toBeCloseTo(puntos, 10);
  expect(r.supera).toBe(apto);
  expect(r.enBlanco).toBe(80 - aciertos - fallos);
});

test('la fórmula se muestra con los datos del intento', () => {
  const r = score(gc, { aciertos: 60, fallos: 12 });
  expect(r.formula).toBe('60 aciertos − 12 fallos ÷ 3');
  expect(r.maxima).toBe(30);
  expect(r.minima).toBe(12);
});

test('un fallo resta siempre un tercio de acierto (en blanco no resta: no entra en la fórmula)', () => {
  fc.assert(
    fc.property(fc.nat(70), fc.nat(9), (a, e) => {
      const base = score(gc, { aciertos: a, fallos: e }).puntos;
      // Un fallo más resta exactamente 30/80 × 1/3.
      expect(base - score(gc, { aciertos: a, fallos: e + 1 }).puntos).toBeCloseTo(30 / 80 / 3, 10);
    }),
  );
});

test('rechaza intentos imposibles', () => {
  expect(() => score(gc, { aciertos: 70, fallos: 20 })).toThrow('más respuestas que preguntas');
  expect(() => score(gc, { aciertos: -1, fallos: 0 })).toThrow();
});

test('con datos pendientes en el perfil, no inventa: lanza un error', () => {
  const sinMinimo: ExamProfile = {
    ...gc,
    format: { ...gc.format, puntuacion: { ...gc.format.puntuacion, minima: null } },
  };
  expect(() => score(sinMinimo, { aciertos: 10, fallos: 0 })).toThrow('pendiente');
});

test('la fórmula concuerda en singular («1 acierto − 1 fallo»)', () => {
  expect(score(gc, { aciertos: 1, fallos: 1 }).formula).toBe('1 acierto − 1 fallo ÷ 3');
  expect(score(gc, { aciertos: 0, fallos: 2 }).formula).toBe('0 aciertos − 2 fallos ÷ 3');
});
