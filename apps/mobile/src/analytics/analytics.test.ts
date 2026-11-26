import { createMemoryStore } from '@/data/memory-store';

import { HOST, permisoAnalitica, setPermisoAnalitica, track } from './analytics';

const fetchMock = jest.fn(async () => new Response('{}'));
const enviados = () => fetchMock.mock.calls.map((c) => JSON.parse((c as unknown as [string, RequestInit])[1].body as string));

beforeEach(() => {
  fetchMock.mockClear();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  process.env.EXPO_PUBLIC_POSTHOG_KEY = 'phc_prueba';
});

test('sin contestar o sin permiso no se envía nada', async () => {
  const store = createMemoryStore();
  expect(await permisoAnalitica(store)).toBeNull();
  await track(store, 'simulacro_entregado');
  await setPermisoAnalitica(store, false);
  await track(store, 'simulacro_entregado');
  expect(fetchMock).not.toHaveBeenCalled();
});

test('sin clave no se envía nada aunque haya permiso', async () => {
  delete process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const store = createMemoryStore();
  await setPermisoAnalitica(store, true);
  await track(store, 'muro_visto');
  expect(fetchMock).not.toHaveBeenCalled();
});

test('con permiso envía el evento a la UE con un id anónimo y sin datos personales', async () => {
  const store = createMemoryStore();
  await setPermisoAnalitica(store, true);
  await track(store, 'simulacro_empezado');
  await track(store, 'simulacro_entregado');

  expect((fetchMock.mock.calls[0] as unknown as [string])[0]).toBe(`${HOST}/i/v0/e/`);
  expect(HOST).toMatch(/^https:\/\/eu\./);
  const [a, b] = enviados();
  expect(a.event).toBe('simulacro_empezado');
  expect(a.distinct_id).toBe(b.distinct_id); // el mismo id en este móvil
  expect(Object.keys(a.properties).sort()).toEqual(['$geoip_disable', '$process_person_profile', 'os', 'version']);
  expect(a.properties.$process_person_profile).toBe(false);
});

test('retirar el permiso olvida el id: al volver a aceptar es otro', async () => {
  const store = createMemoryStore();
  await setPermisoAnalitica(store, true);
  await track(store, 'muro_visto');
  await setPermisoAnalitica(store, false);
  await setPermisoAnalitica(store, true);
  await track(store, 'muro_visto');
  const [a, b] = enviados();
  expect(a.distinct_id).not.toBe(b.distinct_id);
});

test('un fallo de red no rompe la app', async () => {
  fetchMock.mockRejectedValueOnce(new Error('sin red'));
  const store = createMemoryStore();
  await setPermisoAnalitica(store, true);
  await expect(track(store, 'compra_hecha')).resolves.toBeUndefined();
});
