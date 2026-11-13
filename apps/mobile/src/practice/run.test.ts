import { createMemoryStore } from '@/data/memory-store';

import {
  AVISO_MEZCLA,
  CITA,
  failuresByType,
  fromSaved,
  OPTION_COUNT,
  startRun,
  toSaved,
} from './run';

test('una sesión nueva no repite semillas de sesiones anteriores (CON-02)', async () => {
  const store = createMemoryStore();
  const first = await startRun(store, {
    count: 12,
    reparto: 'equitativo',
    sessionSeed: 's1',
    levelFor: () => 2,
  });
  const second = await startRun(store, {
    count: 12,
    reparto: 'equitativo',
    sessionSeed: 's1',
    levelFor: () => 2,
  });
  const seedsA = new Set(first.map((it) => it.seed));
  for (const it of second) expect(seedsA.has(it.seed)).toBe(false);
});

test('las preguntas llevan respuesta y cuatro opciones', async () => {
  const store = createMemoryStore();
  const items = await startRun(store, {
    count: 6,
    reparto: 'equitativo',
    sessionSeed: 's2',
    levelFor: () => 1,
  });
  expect(items).toHaveLength(6);
  for (const it of items) {
    expect(it.options).toHaveLength(OPTION_COUNT);
    expect(it.answerIndex).toBeGreaterThanOrEqual(0);
  }
});

test('cuenta los fallos por tipo a partir de las sesiones guardadas', async () => {
  const store = createMemoryStore();
  const [item] = await startRun(store, {
    count: 1,
    reparto: 'equitativo',
    sessionSeed: 's3',
    levelFor: () => 1,
  });
  if (!item) throw new Error('sin pregunta');
  const wrong = item.answerIndex === 0 ? 1 : 0;
  await store.saveSession({
    id: 'a',
    creada: 1,
    questions: [
      { type: item.type, level: item.level, seed: item.seed, answer: wrong, marked: false },
    ],
  });
  const fallos = await failuresByType(store);
  expect(fallos[item.type]).toBe(1);
});

test('toSaved y fromSaved regeneran las mismas preguntas (reanudar un simulacro)', async () => {
  const store = createMemoryStore();
  const items = await startRun(store, {
    count: 6,
    reparto: 'equitativo',
    sessionSeed: 's4',
    levelFor: () => 3,
  });
  const saved = toSaved(items, [1, null], [false, true]);
  expect(saved[0]?.answer).toBe(1);
  expect(saved[1]?.marked).toBe(true);
  expect(saved[5]?.answer).toBeNull();
  expect(fromSaved(saved)).toEqual(items);
});

test('un simulacro sin terminar no cuenta en los fallos', async () => {
  const store = createMemoryStore();
  const [item] = await startRun(store, {
    count: 1,
    reparto: 'equitativo',
    sessionSeed: 's5',
    levelFor: () => 1,
  });
  if (!item) throw new Error('sin pregunta');
  const wrong = item.answerIndex === 0 ? 1 : 0;
  await store.saveAttempt({
    id: 'a',
    empezado: 1,
    durationMs: 1,
    finishedAt: null,
    questions: toSaved([item], [wrong]),
  });
  expect((await failuresByType(store))[item.type]).toBe(0);
});

test('ningún enunciado se repite dentro de un simulacro (CON-02)', async () => {
  for (const sessionSeed of ['s-0', 's-1', 's-2']) {
    const items = await startRun(createMemoryStore(), {
      count: 80,
      reparto: 'equitativo',
      sessionSeed,
      levelFor: () => 3,
    });
    expect(new Set(items.map((it) => it.stem.text)).size).toBe(80);
  }
});

test('la cita de la fuente sale del perfil y no habla de exámenes publicados', () => {
  expect(CITA).toBe('BOE-A-2026-9982, bases 6.1.2.a, 7.3 y 7.8');
  expect(AVISO_MEZCLA).toMatch(/no es oficial/);
});
