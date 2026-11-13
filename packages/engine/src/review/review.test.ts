import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

import type { ExamProfile } from '../profile';
import { score } from '../score';
import { numSerie } from '../series/num-serie';
import { breakdown, reviewOf } from './review';

const gc = JSON.parse(
  readFileSync(new URL('../../profiles/guardia-civil-2026.json', import.meta.url), 'utf8'),
) as ExamProfile;

const item = numSerie.generate('revision-1', 2, 4);

test('acierto: correcta, sin error que explicar', () => {
  const r = reviewOf(item, item.answerIndex);
  expect(r.correct).toBe(true);
  expect(r.blank).toBe(false);
  expect(r.wrongReason).toBeNull();
  expect(r.tip).toBe(item.explanation.tip);
  expect(r.explanation).toEqual(item.explanation);
});

test('fallo: explica el error típico de la opción elegida (EXP-02)', () => {
  const wrong = item.options.findIndex((_, i) => i !== item.answerIndex);
  const r = reviewOf(item, wrong);
  const expected = item.explanation.distractors.find((d) => d.optionIndex === wrong)?.error;
  expect(r.correct).toBe(false);
  expect(r.wrongReason).toBe(expected);
  expect(r.wrongReason).toBeTruthy();
});

test('en blanco: sin error asociado y marcado como blanco', () => {
  const r = reviewOf(item, null);
  expect(r.blank).toBe(true);
  expect(r.correct).toBe(false);
  expect(r.wrongReason).toBeNull();
});

test('todas las opciones erróneas de cada ítem tienen su error explicado', () => {
  for (let i = 0; i < item.options.length; i++) {
    if (i === item.answerIndex) continue;
    expect(reviewOf(item, i).wrongReason).toBeTruthy();
  }
});

test('el desglose cuadra con la puntuación oficial (RES-01, RES-02)', () => {
  const results = [
    { type: 'NUM.SERIE' as const, correct: true, blank: false },
    { type: 'NUM.SERIE' as const, correct: false, blank: false },
    { type: 'COD.CRIPTO' as const, correct: false, blank: true },
    { type: 'VER.ORDEN' as const, correct: true, blank: false },
  ];
  const b = breakdown(results);
  expect(b.total).toEqual({ aciertos: 2, fallos: 1, enBlanco: 1 });
  expect(b.byAptitude.numerica).toEqual({ correct: 1, wrong: 1, blank: 0, total: 2 });
  expect(b.byAptitude.atencion).toEqual({ correct: 0, wrong: 0, blank: 1, total: 1 });
  // Atención: 0 de 1 (en blanco) es más floja que Numérica: 1 de 2.
  expect(b.weakest).toBe('atencion');

  expect(b.total.aciertos + b.total.fallos + b.total.enBlanco).toBe(results.length);
  // score() cuenta sobre las 80 preguntas del examen: las no respondidas en el desglose cuentan como en blanco.
  const s = score(gc, { aciertos: b.total.aciertos, fallos: b.total.fallos });
  expect(s.enBlanco).toBe(80 - b.total.aciertos - b.total.fallos);
});

test('sin intentos, la aptitud a reforzar es null', () => {
  expect(breakdown([]).weakest).toBeNull();
});

test('a reforzar usa el mismo porcentaje que la pantalla (aciertos ÷ total, con blancos)', () => {
  const r = (type: 'NUM.SERIE' | 'COD.CRIPTO', correct: boolean, blank: boolean) => ({
    type,
    correct,
    blank,
  });
  // Numérica 1 de 4 (25 %), con 3 en blanco; Atención 2 de 4 (50 %), con 2 fallos.
  const b = breakdown([
    r('NUM.SERIE', true, false),
    r('NUM.SERIE', false, true),
    r('NUM.SERIE', false, true),
    r('NUM.SERIE', false, true),
    r('COD.CRIPTO', true, false),
    r('COD.CRIPTO', true, false),
    r('COD.CRIPTO', false, false),
    r('COD.CRIPTO', false, false),
  ]);
  expect(b.weakest).toBe('numerica');
});

test('una aptitud toda en blanco también puede salir a reforzar', () => {
  const b = breakdown([
    { type: 'NUM.SERIE', correct: false, blank: true },
    { type: 'COD.CRIPTO', correct: true, blank: false },
  ]);
  expect(b.weakest).toBe('numerica');
});

test('sin diferencias entre aptitudes no hay «a reforzar» (todo al 100 %)', () => {
  const b = breakdown([
    { type: 'NUM.SERIE', correct: true, blank: false },
    { type: 'COD.CRIPTO', correct: true, blank: false },
  ]);
  expect(b.weakest).toBeNull();
});
