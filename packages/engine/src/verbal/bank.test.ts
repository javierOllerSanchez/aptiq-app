import { afterEach, expect, test } from 'vitest';

import { buildPractice } from '../session/plan';
import { buildToday } from '../session/today';
import type { TypeCode } from '../taxonomy';
import type { Level } from '../types';

import { availableTypes, bankGenerator, bankSolver, loadBank, MIN_APROBADAS, validateVerbal, type VerbalEntry } from './bank';

/** Pregunta de ejemplo de las pruebas (no es contenido de la app). */
const entry = (id: string, nivel: Level = 2, tipo: VerbalEntry['tipo'] = 'VER.SINON'): VerbalEntry => ({
  id,
  tipo,
  nivel,
  version: 1,
  enunciado: '¿Qué palabra significa lo mismo que «rápido»?',
  opciones: ['veloz', 'lento', 'pesado', 'tardío'],
  correcta: 0,
  explicacion: {
    observe: 'Busca la palabra que podrías poner en lugar de «rápido» en una frase.',
    rule: 'Un sinónimo significa lo mismo y es de la misma clase de palabra.',
    apply: '«Un coche rápido» equivale a «un coche veloz»: la respuesta es veloz.',
    distractors: [
      { optionIndex: 1, error: 'Lento significa lo contrario: es un antónimo.' },
      { optionIndex: 2, error: 'Pesado habla del peso, no de la velocidad.' },
      { optionIndex: 3, error: 'Tardío significa que llega tarde, no que va despacio o deprisa.' },
    ],
    tip: 'Prueba cada opción dentro de una frase corta: el sinónimo no cambia el sentido.',
  },
});
const bank = (n: number) => Array.from({ length: n }, (_, i) => entry(`id-${i}`, ((i % 5) + 1) as Level));

afterEach(() => loadBank([]));

test('una pregunta del banco se reproduce igual con la misma semilla y baraja las opciones', () => {
  loadBank([entry('a')]);
  const gen = bankGenerator('VER.SINON');
  const one = gen.generate('a~1', 2, 4);
  expect(gen.generate('a~1', 2, 4)).toEqual(one);
  expect(one.options[one.answerIndex]).toBe('veloz');
  expect(bankSolver('VER.SINON').validOptions(one)).toEqual([one.answerIndex]);
  const positions = new Set(Array.from({ length: 40 }, (_, k) => gen.generate(`a~${k}`, 2, 4).answerIndex));
  expect(positions.size).toBe(4);
});

test('con 3 opciones se quita el último distractor y los errores siguen a sus opciones', () => {
  loadBank([entry('a')]);
  const item = bankGenerator('VER.SINON').generate('a~2', 2, 3);
  expect(item.options).toHaveLength(3);
  expect(item.options).not.toContain('tardío');
  for (const d of item.explanation.distractors) expect(d.error).toContain(item.options[d.optionIndex]!.replace(/^./, (c) => c.toUpperCase()));
});

test('una pregunta que no está en el banco da un error claro', () => {
  expect(() => bankGenerator('VER.SINON').generate('no-existe~1', 2, 4)).toThrow(/no está en el banco/);
});

test('los tipos verbales solo aparecen con suficientes preguntas aprobadas', () => {
  loadBank(bank(MIN_APROBADAS - 1));
  expect(availableTypes()).not.toContain('VER.SINON');
  loadBank(bank(MIN_APROBADAS));
  expect(availableTypes()).toContain('VER.SINON');
  expect(availableTypes()).not.toContain('VER.ANALOG');
});

const levelFor = () => 3 as Level;

test('la práctica elige preguntas del banco sin repetir y del nivel más cercano', () => {
  loadBank(bank(MIN_APROBADAS));
  const specs = buildPractice({ sessionSeed: 'x', count: 5, reparto: 'equitativo', types: ['VER.SINON'], levelFor });
  const ids = specs.map((s) => s.seed.split('~')[0]);
  expect(new Set(ids).size).toBe(5);
  // Hay 2 preguntas de nivel 3: salen primero.
  expect(specs.filter((s) => bankGenerator('VER.SINON').generate(s.seed, 3, 4).level === 3)).toHaveLength(2);
  const used = new Set(specs.map((s) => s.seed));
  const next = buildPractice({ sessionSeed: 'y', count: 5, reparto: 'equitativo', types: ['VER.SINON'], levelFor, usedSeeds: used });
  for (const s of next) expect(ids).not.toContain(s.seed.split('~')[0]);
});

test('sin banco, la práctica y la Sesión de hoy no proponen tipos verbales', () => {
  const specs = buildPractice({ sessionSeed: 'z', count: 200, reparto: 'equitativo', levelFor });
  expect(specs.some((s) => s.type === 'VER.SINON' || s.type === 'VER.ANALOG')).toBe(false);
  const levels = Object.fromEntries(availableTypes().map((t) => [t, 2])) as Record<TypeCode, Level>;
  const hoy = buildToday({ dia: '2026-11-19', due: [], fallos: {}, levels });
  expect(hoy.some((s) => s.type === 'VER.SINON')).toBe(false);
});

test('el validador rechaza preguntas incompletas o incoherentes', () => {
  expect(validateVerbal(entry('a'))).toEqual([]);
  expect(validateVerbal({ ...entry('a'), opciones: ['veloz', 'veloz', 'pesado', 'tardío'] })).toContain('Hay opciones repetidas.');
  expect(validateVerbal({ ...entry('a'), explicacion: { ...entry('a').explicacion, apply: 'Es la primera.' } })).toContain(
    'El paso «Aplica» debe llegar a la respuesta correcta.',
  );
  const sinError = { ...entry('a'), explicacion: { ...entry('a').explicacion, distractors: [] } };
  expect(validateVerbal(sinError)).toContain('Falta explicar por qué falla cada opción incorrecta.');
});

test('una pregunta retirada se regenera para el historial, pero no se propone ni cuenta', () => {
  loadBank([...bank(MIN_APROBADAS - 1), { ...entry('vieja'), retirada: true }]);
  expect(availableTypes()).not.toContain('VER.SINON');
  expect(bankGenerator('VER.SINON').generate('vieja~1', 2, 4).options).toContain('veloz');
});
