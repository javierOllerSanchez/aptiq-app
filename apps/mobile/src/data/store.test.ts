import { createMemoryStore } from './memory-store';

// Este contrato lo cumplen la implementación en memoria (pruebas) y la de SQLite (dispositivo).

const q = { type: 'NUM.SERIE' as const, level: 2 as const, seed: 'x', marked: false };

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

test('lista las sesiones guardadas en orden de creación, con sus preguntas', async () => {
  const store = createMemoryStore();
  await store.saveSession({ id: 's2', creada: 200, questions: [{ ...q, answer: 0 }] });
  await store.saveSession({
    id: 's1',
    creada: 100,
    questions: [{ ...q, answer: null, marked: true }],
  });
  const list = await store.sessions();
  expect(list.map((s) => s.id)).toEqual(['s1', 's2']);
  expect(list[0]?.questions[0]?.marked).toBe(true);
});

test('guarda un intento de simulacro, terminado o no', async () => {
  const store = createMemoryStore();
  await store.saveAttempt({
    id: 'i1',
    empezado: 1_000,
    durationMs: 55 * 60_000,
    finishedAt: null,
    questions: [{ ...q, answer: 1 }],
  });
  const [a] = await store.attempts();
  expect(a?.finishedAt).toBeNull();
  expect(a?.questions[0]?.answer).toBe(1);
});

test('guardar un intento con el mismo id lo actualiza (simulacro en curso, NFR-03)', async () => {
  const store = createMemoryStore();
  const base = { id: 'i1', empezado: 1_000, durationMs: 55 * 60_000, finishedAt: null };
  await store.saveAttempt({ ...base, questions: [{ ...q, answer: null }] });
  await store.saveAttempt({ ...base, finishedAt: 2_000, questions: [{ ...q, answer: 2 }] });
  const list = await store.attempts();
  expect(list).toHaveLength(1);
  expect(list[0]?.finishedAt).toBe(2_000);
  expect(list[0]?.questions[0]?.answer).toBe(2);
});

test('borrar un intento lo quita (salir sin entregar)', async () => {
  const store = createMemoryStore();
  await store.saveAttempt({
    id: 'i1',
    empezado: 1,
    durationMs: 1,
    finishedAt: null,
    questions: [],
  });
  await store.deleteAttempt('i1');
  expect(await store.attempts()).toHaveLength(0);
});
