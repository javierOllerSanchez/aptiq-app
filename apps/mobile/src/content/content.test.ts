import { availableTypes, guardiaCivil2026, loadBank, type ExamProfile, type VerbalEntry } from '@aptiq/engine';

import { createMemoryStore } from '@/data/memory-store';

import { actualizarContenido, cargarContenido, perfil, type ContentRemote } from './content';

const verbal = (id: string): VerbalEntry => ({
  id,
  tipo: 'VER.SINON',
  nivel: 2,
  version: 1,
  enunciado: '¿Qué palabra significa lo mismo que «rápido»?',
  opciones: ['veloz', 'lento', 'pesado', 'tardío'],
  correcta: 0,
  explicacion: {
    observe: 'Busca la palabra que podrías poner en su lugar.',
    rule: 'Un sinónimo significa lo mismo.',
    apply: 'Un coche rápido es un coche veloz.',
    distractors: [
      { optionIndex: 1, error: 'Lento es lo contrario.' },
      { optionIndex: 2, error: 'Pesado habla del peso.' },
      { optionIndex: 3, error: 'Tardío es que llega tarde.' },
    ],
    tip: 'Prueba cada opción en una frase corta.',
  },
});
const diez = Array.from({ length: 10 }, (_, i) => verbal(`v${i}`));

const remote = (over: Partial<ContentRemote> = {}): ContentRemote => ({
  verbalesAprobadas: async () => diez,
  ultimoPerfil: async () => null,
  ...over,
});

afterEach(() => loadBank([]));

test('descarga las verbales aprobadas, las guarda y las usa sin conexión', async () => {
  const store = createMemoryStore();
  await actualizarContenido(store, remote());
  expect(availableTypes()).toContain('VER.SINON');

  loadBank([]);
  await cargarContenido(store); // sin red: desde la copia del móvil
  expect(availableTypes()).toContain('VER.SINON');
});

test('una verbal que deja de estar aprobada se retira, pero sigue en el historial', async () => {
  const store = createMemoryStore();
  await actualizarContenido(store, remote());
  await actualizarContenido(store, remote({ verbalesAprobadas: async () => diez.slice(1) }));
  expect(availableTypes()).not.toContain('VER.SINON');
  const guardadas = JSON.parse((await store.getContent('verbales'))!) as VerbalEntry[];
  expect(guardadas.find((e) => e.id === 'v0')?.retirada).toBe(true);
});

test('una verbal mal formada no entra en el banco', async () => {
  const store = createMemoryStore();
  const rota = { ...verbal('rota'), opciones: ['a', 'a', 'b', 'c'] };
  await actualizarContenido(store, remote({ verbalesAprobadas: async () => [...diez.slice(1), rota] }));
  expect(availableTypes()).not.toContain('VER.SINON');
});

test('usa un perfil nuevo del servidor solo si es válido y del mismo examen', async () => {
  const store = createMemoryStore();
  const nuevo: ExamProfile = { ...guardiaCivil2026, version: 2, format: { ...guardiaCivil2026.format, minutos: 50 } };
  const invalido = { ...nuevo, version: 3, fieldSources: {} } as ExamProfile;

  await actualizarContenido(store, remote({ ultimoPerfil: async () => invalido }));
  expect(perfil().version).toBe(1);

  await actualizarContenido(store, remote({ ultimoPerfil: async () => nuevo }));
  expect(perfil().format.minutos).toBe(50);
});

test('sin red no rompe nada: sigue con lo que tenía', async () => {
  const store = createMemoryStore();
  const caida = remote({
    verbalesAprobadas: async () => {
      throw new Error('sin red');
    },
  });
  await expect(actualizarContenido(store, caida)).resolves.toBe(false);
});
