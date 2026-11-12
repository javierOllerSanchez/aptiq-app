import { createMemoryStore } from '@/data/memory-store';

import { failuresByType, OPTION_COUNT, startRun } from './run';

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
