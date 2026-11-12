import { createMemoryStore } from './memory-store';

// Este contrato lo cumplen la implementación en memoria (pruebas) y la de SQLite (dispositivo).

test('guarda y lee ajustes; una clave sin valor devuelve null', async () => {
  const store = createMemoryStore();
  expect(await store.getSetting('oposicion')).toBeNull();
  await store.setSetting('oposicion', 'guardia-civil-2026');
  await store.setSetting('oposicion', 'guardia-civil-2026-b');
  expect(await store.getSetting('oposicion')).toBe('guardia-civil-2026-b');
});

test('acumula las semillas usadas sin duplicarlas (CON-02)', async () => {
  const store = createMemoryStore();
  await store.addUsedSeeds(['a1', 'b2']);
  await store.addUsedSeeds(['b2', 'c3']);
  expect([...(await store.usedSeeds())].sort()).toEqual(['a1', 'b2', 'c3']);
});

test('lista las sesiones guardadas en orden de creación', async () => {
  const store = createMemoryStore();
  const base = {
    type: 'NUM.SERIE' as const,
    level: 2 as const,
    answers: [0, null],
    marked: [false, true],
  };
  await store.saveSession({ ...base, id: 's2', seed: 'x', creada: 200 });
  await store.saveSession({ ...base, id: 's1', seed: 'y', creada: 100 });
  expect((await store.sessions()).map((s) => s.id)).toEqual(['s1', 's2']);
});

test('guarda un intento de simulacro, terminado o no', async () => {
  const store = createMemoryStore();
  await store.saveAttempt({
    id: 'i1',
    empezado: 1_000,
    durationMs: 55 * 60_000,
    answers: [1, null],
    marked: [false, false],
    finishedAt: null,
  });
  const [a] = await store.attempts();
  expect(a?.finishedAt).toBeNull();
  expect(a?.answers).toEqual([1, null]);
});
