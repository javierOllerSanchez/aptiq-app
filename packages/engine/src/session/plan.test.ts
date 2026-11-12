import { expect, test } from 'vitest';

import { taxonomy, type TypeCode, typeCodes } from '../taxonomy';
import { buildPractice, type PracticeInput } from './plan';

const base: PracticeInput = {
  sessionSeed: 'sesion-de-prueba',
  count: 60,
  reparto: 'equitativo',
  levelFor: () => 2,
};

test('devuelve exactamente count elementos con tipo, nivel y semilla', () => {
  const out = buildPractice(base);
  expect(out).toHaveLength(60);
  for (const it of out) {
    expect(typeCodes).toContain(it.type);
    expect(it.level).toBe(2);
    expect(it.seed).toMatch(/^[0-9a-z]+$/);
  }
});

test('es determinista: la misma sesión da la misma lista', () => {
  expect(buildPractice(base)).toEqual(buildPractice(base));
});

test('no repite semillas ya usadas por el usuario ni dentro de la sesión', () => {
  const first = buildPractice(base);
  const usedSeeds = new Set(first.map((it) => it.seed));
  const second = buildPractice({ ...base, usedSeeds });
  for (const it of second) expect(usedSeeds.has(it.seed)).toBe(false);
  expect(new Set(second.map((it) => it.seed)).size).toBe(second.length);
});

test('con aptitud solo sale ese tipo de ejercicio', () => {
  const out = buildPractice({ ...base, aptitude: 'numerica' });
  expect(out.length).toBe(60);
  for (const it of out) expect(taxonomy[it.type as TypeCode].aptitud).toBe('numerica');
});

test('la mezcla equitativa reparte a partes iguales entre los 6 tipos', () => {
  const out = buildPractice({ ...base, count: 60 });
  for (const code of typeCodes) {
    expect(out.filter((it) => it.type === code)).toHaveLength(10);
  }
});

test('el reparto prioritario da más preguntas a los tipos con más fallos', () => {
  const out = buildPractice({
    ...base,
    count: 600,
    reparto: 'prioritario',
    fallos: { 'LET.SERIE': 12 },
  });
  const weak = out.filter((it) => it.type === 'LET.SERIE').length;
  expect(weak).toBeGreaterThan(600 / typeCodes.length);
  for (const code of typeCodes) {
    expect(out.filter((it) => it.type === code).length).toBeGreaterThan(0);
  }
});

test('lanza error si la aptitud no tiene tipos', () => {
  expect(() => buildPractice({ ...base, aptitude: 'inexistente' })).toThrow();
});

test('el reparto equitativo no sigue un ciclo fijo de tipos', () => {
  const out = buildPractice({ ...base, count: 12 });
  const first = out.slice(0, 6).map((it) => it.type);
  const second = out.slice(6, 12).map((it) => it.type);
  expect(first).not.toEqual(second);
});
