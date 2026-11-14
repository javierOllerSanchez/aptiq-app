import { createMemoryStore } from '@/data/memory-store';
import type { SavedAttempt, SavedSession, SavedSetting } from '@/data/store';

import { createRetrier, retryDelay } from './backoff';
import { withSyncQueue } from './queued-store';
import type { Remote } from './remote';
import { createSync } from './sync';

// Fase 5 · T3 (NFR-01, PRO-02). Servidor y reloj simulados; nada sale a la red.

const q = { type: 'NUM.SERIE' as const, level: 2 as const, seed: 'x', answer: 0, marked: false };

/** Servidor falso compartido por varios dispositivos. Imita la regla del servidor: un ajuste más antiguo no pisa uno más reciente. */
function createFakeServer() {
  const ajustes = new Map<string, SavedSetting>();
  const semillas = new Set<string>();
  const sesiones = new Map<string, SavedSession>();
  const intentos = new Map<string, SavedAttempt>();
  const calls: string[] = [];
  let online = true;

  const check = (name: string) => {
    calls.push(name);
    if (!online) throw new Error('sin red');
  };

  const remote: Remote = {
    async upsertAjustes(rows) {
      check('ajustes');
      for (const r of rows) {
        const prev = ajustes.get(r.clave);
        if (!prev || r.actualizado >= prev.actualizado) ajustes.set(r.clave, r);
      }
    },
    async upsertSemillas(list) {
      check('semillas');
      for (const s of list) semillas.add(s);
    },
    async upsertSesiones(rows) {
      check('sesiones');
      for (const r of rows) sesiones.set(r.id, r);
    },
    async upsertIntentos(rows) {
      check('intentos');
      for (const r of rows) intentos.set(r.id, r);
    },
    async pull() {
      check('pull');
      return {
        ajustes: [...ajustes.values()],
        semillas: [...semillas],
        sesiones: [...sesiones.values()],
        intentos: [...intentos.values()],
      };
    },
  };

  return {
    remote,
    calls,
    ajustes,
    semillas,
    sesiones,
    intentos,
    setOnline(v: boolean) {
      online = v;
    },
  };
}

function createClock(start = 1_000) {
  let t = start;
  return {
    now: () => t,
    advance(ms: number) {
      t += ms;
    },
  };
}

function createDevice(server: ReturnType<typeof createFakeServer>, clock = createClock()) {
  const base = createMemoryStore(clock.now);
  const store = withSyncQueue(base, clock.now);
  const sync = createSync({ store: base, remote: server.remote });
  return { base, store, sync, clock };
}

test('cada cambio guardado deja una operación pendiente; el simulacro abierto no', async () => {
  const server = createFakeServer();
  const { base, store } = createDevice(server);

  await store.setSetting('oposicion', 'guardia-civil-2026');
  await store.addUsedSeeds(['a1', 'b2']);
  await store.saveSession({ id: 's1', creada: 10, questions: [q] });
  await store.saveAttempt({ id: 'i1', empezado: 10, durationMs: 60, finishedAt: null, questions: [q] });

  const ops = await base.pendingOps();
  expect(ops.map((o) => `${o.entidad}:${o.id}`).sort()).toEqual([
    'ajuste:oposicion',
    'semilla:a1',
    'semilla:b2',
    'sesion:s1',
  ]);

  await store.saveAttempt({ id: 'i1', empezado: 10, durationMs: 60, finishedAt: 70, questions: [q] });
  expect((await base.pendingOps()).some((o) => o.entidad === 'intento' && o.id === 'i1')).toBe(true);
});

test('cambiar el mismo ajuste varias veces deja una sola operación', async () => {
  const server = createFakeServer();
  const { base, store, clock } = createDevice(server);
  await store.setSetting('fecha', '2027-03-01');
  clock.advance(5);
  await store.setSetting('fecha', '2027-04-01');
  const ops = await base.pendingOps();
  expect(ops).toHaveLength(1);
  expect(ops[0]?.creada).toBe(1_005);
});

test('sube en orden fijo (ajustes, semillas, sesiones, intentos) y vacía la cola', async () => {
  const server = createFakeServer();
  const { base, store, sync } = createDevice(server);
  await store.saveSession({ id: 's1', creada: 10, questions: [q] });
  await store.saveAttempt({ id: 'i1', empezado: 10, durationMs: 60, finishedAt: 70, questions: [q] });
  await store.addUsedSeeds(['a1']);
  await store.setSetting('oposicion', 'guardia-civil-2026');

  expect(await sync.push()).toBe(true);
  expect(server.calls).toEqual(['ajustes', 'semillas', 'sesiones', 'intentos']);
  expect(await base.pendingOps()).toHaveLength(0);
  expect(server.sesiones.get('s1')?.questions).toEqual([q]);
  expect(server.intentos.get('i1')?.finishedAt).toBe(70);
});

test('sin red no se pierde nada ni se lanza error; al volver la red se sube', async () => {
  const server = createFakeServer();
  const { base, store, sync } = createDevice(server);
  await store.saveSession({ id: 's1', creada: 10, questions: [q] });

  server.setOnline(false);
  expect(await sync.sync()).toBe(false);
  const [op] = await base.pendingOps();
  expect(op?.intentos).toBe(1);
  expect(server.sesiones.size).toBe(0);

  server.setOnline(true);
  expect(await sync.sync()).toBe(true);
  expect(await base.pendingOps()).toHaveLength(0);
  expect(server.sesiones.size).toBe(1);
});

test('reintentar una subida ya hecha no duplica nada', async () => {
  const server = createFakeServer();
  const { base, store, sync } = createDevice(server);
  await store.saveSession({ id: 's1', creada: 10, questions: [q] });
  await store.addUsedSeeds(['a1']);
  await sync.push();
  // La respuesta se perdió: se vuelve a encolar lo mismo y se reintenta.
  await base.enqueue('sesion', 's1', 20);
  await base.enqueue('semilla', 'a1', 20);
  await sync.push();
  expect(server.sesiones.size).toBe(1);
  expect(server.semillas.size).toBe(1);
});

test('un cambio hecho mientras se sube no se borra de la cola', async () => {
  const server = createFakeServer();
  const { base, store, sync, clock } = createDevice(server);
  await store.setSetting('fecha', '2027-03-01');

  const upsert = server.remote.upsertAjustes;
  server.remote.upsertAjustes = async (rows) => {
    clock.advance(5);
    await store.setSetting('fecha', '2027-04-01');
    await upsert(rows);
  };
  await sync.push();
  server.remote.upsertAjustes = upsert;

  const ops = await base.pendingOps();
  expect(ops.map((o) => o.id)).toEqual(['fecha']);
  await sync.push();
  expect(server.ajustes.get('fecha')?.valor).toBe('2027-04-01');
});

test('dos dispositivos con la misma cuenta acaban con los mismos datos', async () => {
  const server = createFakeServer();
  const clock = createClock();
  const a = createDevice(server, clock);
  const b = createDevice(server, clock);

  await a.store.saveSession({ id: 'sa', creada: 10, questions: [q] });
  await a.store.addUsedSeeds(['a1']);
  await a.store.setSetting('fecha', '2027-03-01');
  clock.advance(10);
  await b.store.saveSession({ id: 'sb', creada: 20, questions: [q] });
  await b.store.saveAttempt({ id: 'ib', empezado: 20, durationMs: 60, finishedAt: 80, questions: [q] });
  await b.store.addUsedSeeds(['b1']);
  await b.store.setSetting('fecha', '2027-04-01');

  await a.sync.sync();
  await b.sync.sync();
  await a.sync.sync();

  for (const d of [a, b]) {
    expect((await d.base.sessions()).map((s) => s.id).sort()).toEqual(['sa', 'sb']);
    expect((await d.base.attempts()).map((x) => x.id)).toEqual(['ib']);
    expect([...(await d.base.usedSeeds())].sort()).toEqual(['a1', 'b1']);
    expect(await d.base.getSetting('fecha')).toBe('2027-04-01');
    expect(await d.base.pendingOps()).toHaveLength(0);
  }
});

test('un ajuste antiguo de otro dispositivo no pisa uno más reciente', async () => {
  const server = createFakeServer();
  const clockA = createClock(1_000);
  const clockB = createClock(5_000);
  const a = createDevice(server, clockA);
  const b = createDevice(server, clockB);

  await b.store.setSetting('fecha', 'nueva');
  await b.sync.sync();
  await a.store.setSetting('fecha', 'vieja'); // cambiado antes (reloj 1.000), subido después
  await a.sync.sync();

  expect(server.ajustes.get('fecha')?.valor).toBe('nueva');
  expect(await a.base.getSetting('fecha')).toBe('nueva');
});

test('primer inicio de sesión: sube lo guardado sin cuenta y lo une con lo que ya había', async () => {
  const server = createFakeServer();
  const clock = createClock();
  const other = createDevice(server, clock);
  await other.store.saveSession({ id: 'previa', creada: 5, questions: [q] });
  await other.sync.sync();

  // Datos guardados antes de tener cuenta: no pasaron por la cola.
  const local = createMemoryStore(clock.now);
  await local.saveSession({ id: 'sin-cuenta', creada: 10, questions: [q] });
  await local.saveAttempt({ id: 'abierto', empezado: 10, durationMs: 60, finishedAt: null, questions: [q] });
  await local.saveAttempt({ id: 'hecho', empezado: 10, durationMs: 60, finishedAt: 70, questions: [q] });
  await local.addUsedSeeds(['x1']);
  await local.setSetting('oposicion', 'guardia-civil-2026');

  const sync = createSync({ store: local, remote: server.remote });
  expect(await sync.uploadAll()).toBe(true);

  expect([...server.sesiones.keys()].sort()).toEqual(['previa', 'sin-cuenta']);
  expect([...server.intentos.keys()]).toEqual(['hecho']);
  expect(server.semillas.has('x1')).toBe(true);
  expect(server.ajustes.get('oposicion')?.valor).toBe('guardia-civil-2026');
  expect((await local.sessions()).map((s) => s.id).sort()).toEqual(['previa', 'sin-cuenta']);
  // El simulacro abierto sigue en el dispositivo.
  expect((await local.attempts()).map((x) => x.id).sort()).toEqual(['abierto', 'hecho']);
});

test('la espera entre reintentos crece y tiene tope', () => {
  expect(retryDelay(0)).toBe(5_000);
  expect(retryDelay(1)).toBe(10_000);
  expect(retryDelay(3)).toBe(40_000);
  expect(retryDelay(20)).toBe(15 * 60_000);
});

test('el reintentador espera más tras cada fallo y se reinicia al acertar', async () => {
  const results = [false, false, true];
  const delays: number[] = [];
  let pending: (() => void) | null = null;
  const retrier = createRetrier({
    run: async () => results.shift() ?? true,
    schedule: (fn, ms) => {
      delays.push(ms);
      pending = fn;
      return () => {
        pending = null;
      };
    },
  });

  await retrier.trigger();
  expect(delays).toEqual([5_000]);
  await (pending as unknown as () => Promise<void>)();
  expect(delays).toEqual([5_000, 10_000]);
  await (pending as unknown as () => Promise<void>)();
  expect(delays).toEqual([5_000, 10_000]);

  results.push(false);
  await retrier.trigger();
  expect(delays.at(-1)).toBe(5_000);
});
