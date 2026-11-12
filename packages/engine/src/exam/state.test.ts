import { expect, test } from 'vitest';

import { answer, createExam, finish, goTo, mark, remainingMs, tick } from './state';

const MIN = 60_000;
const start = 1_000_000;

test('al empezar quedan todos los minutos y ninguna respuesta', () => {
  const s = createExam(80, start, 55 * MIN);
  expect(remainingMs(s, start)).toBe(55 * MIN);
  expect(s.answers).toHaveLength(80);
  expect(s.answers.every((a) => a === null)).toBe(true);
});

test('el tiempo sale de las marcas de reloj, no de contar ticks (NFR-03)', () => {
  const s = createExam(80, start, 55 * MIN);
  // La app pasó 10 minutos en segundo plano sin llamar a nada.
  expect(remainingMs(s, start + 10 * MIN)).toBe(45 * MIN);
  // Varias llamadas seguidas no cambian el resultado.
  let t = tick(s, start + 10 * MIN);
  t = tick(t, start + 10 * MIN);
  expect(remainingMs(t, start + 10 * MIN)).toBe(45 * MIN);
});

test('al llegar a cero el examen se cierra solo, con la hora de fin exacta', () => {
  const s = createExam(80, start, 55 * MIN);
  const after = tick(s, start + 70 * MIN);
  expect(after.finishedAt).toBe(start + 55 * MIN);
  expect(remainingMs(after, start + 70 * MIN)).toBe(0);
});

test('responder y cambiar de respuesta; navegar no toca las respuestas', () => {
  let s = createExam(80, start, 55 * MIN);
  s = answer(s, 0, 2, start + MIN);
  s = answer(s, 0, 1, start + 2 * MIN);
  s = goTo(s, 40);
  s = goTo(s, 0);
  expect(s.answers[0]).toBe(1);
  expect(s.answers[40]).toBeNull();
  expect(s.current).toBe(0);
});

test('marcar para revisar alterna y no responde la pregunta', () => {
  let s = createExam(80, start, 55 * MIN);
  s = mark(s, 5);
  expect(s.marked[5]).toBe(true);
  expect(s.answers[5]).toBeNull();
  s = mark(s, 5);
  expect(s.marked[5]).toBe(false);
});

test('una opción fuera de rango o una pregunta inexistente lanzan error', () => {
  const s = createExam(80, start, 55 * MIN);
  expect(() => answer(s, 0, 4, start)).toThrow();
  expect(() => answer(s, 80, 0, start)).toThrow();
  expect(() => goTo(s, -1)).toThrow();
});

test('después de terminar no se puede responder', () => {
  let s = createExam(80, start, 55 * MIN);
  s = finish(s, start + MIN);
  const frozen = answer(s, 0, 0, start + 2 * MIN);
  expect(frozen.answers[0]).toBeNull();
  expect(frozen.finishedAt).toBe(start + MIN);
});
