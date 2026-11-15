import { registry, type TypeCode } from '@aptiq/engine';

import { createMemoryStore } from '@/data/memory-store';
import type { SavedQuestion } from '@/data/store';
import { OPTION_COUNT } from '@/practice/run';

import { AJUSTE_HOY, diaLocal, loadProgress, startToday } from './data';

// Fase 6 · T3–T5 en la app: el historial guardado alimenta al motor.

const respuesta = (type: TypeCode, seed: string, ok: boolean, level: 2 | 3 = 2): SavedQuestion => {
  const item = registry[type].generator.generate(seed, level, OPTION_COUNT);
  return { type, level, seed, answer: ok ? item.answerIndex : (item.answerIndex + 1) % OPTION_COUNT, marked: false };
};
const at = (y: number, m: number, d: number) => new Date(y, m - 1, d, 12).getTime();

test('el día local se escribe AAAA-MM-DD y cambia a la medianoche local, no a la UTC', () => {
  expect(diaLocal(at(2026, 3, 7))).toBe('2026-03-07');
  expect(diaLocal(new Date(2026, 11, 31, 23, 59).getTime())).toBe('2026-12-31');
  expect(diaLocal(new Date(2027, 0, 1, 0, 0).getTime())).toBe('2027-01-01');
});

test('racha, cuenta atrás y sesión de hoy hecha salen del historial y los ajustes', async () => {
  const store = createMemoryStore();
  await store.saveSession({ id: 'a', creada: at(2026, 11, 14), questions: [respuesta('NUM.CALC', 'x', true)] });
  await store.saveSession({ id: 'b', creada: at(2026, 11, 15), questions: [respuesta('NUM.CALC', 'y', true)] });
  await store.setSetting('niveles', JSON.stringify({ 'NUM.CALC': 2 }));
  await store.setSetting('fecha', '2026-11-25');
  await store.setSetting(AJUSTE_HOY, '2026-11-15');
  const p = await loadProgress(store, at(2026, 11, 15));
  expect(p.racha).toBe(2);
  expect(p.diasExamen).toBe(10);
  expect(p.hoyHecha).toBe(true);
  expect(p.semanas).toHaveLength(4);
});

test('el nivel sube con 10 aciertos seguidos y un fallo pone el tipo en repaso', async () => {
  const store = createMemoryStore();
  await store.setSetting('niveles', JSON.stringify({ 'NUM.CALC': 2 }));
  await store.saveSession({
    id: 'a',
    creada: at(2026, 11, 14),
    questions: [
      ...Array.from({ length: 10 }, (_, i) => respuesta('NUM.CALC', `ok${i}`, true)),
      respuesta('LET.SERIE', 'mal', false),
    ],
  });
  const p = await loadProgress(store, at(2026, 11, 15));
  expect(p.levels['NUM.CALC']).toBe(3);
  expect(p.due).toEqual(['LET.SERIE']);
  expect(p.fallos['LET.SERIE']).toBe(1);
});

test('la Sesión de hoy tiene 12 preguntas y reserva sus semillas', async () => {
  const store = createMemoryStore();
  const items = await startToday(store, at(2026, 11, 15));
  expect(items).toHaveLength(12);
  const used = await store.usedSeeds();
  for (const it of items) expect(used.has(it.seed)).toBe(true);
});

test('la Sesión de hoy no repite el mismo enunciado aunque el tipo flojo reciba muchas preguntas', async () => {
  for (let d = 1; d <= 20; d++) {
    const store = createMemoryStore();
    await store.setSetting('niveles', JSON.stringify({ 'LET.SERIE': 3 }));
    await store.saveSession({
      id: 'a',
      creada: at(2026, 10, d),
      questions: Array.from({ length: 30 }, (_, i) => respuesta('LET.SERIE', `f${d}-${i}`, false, 3)),
    });
    const items = await startToday(store, at(2026, 11, d));
    expect(new Set(items.map((it) => it.stem.text)).size).toBe(items.length);
  }
});
