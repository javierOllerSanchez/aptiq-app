import type { SupabaseClient } from '@supabase/supabase-js';

import { createMemoryStore } from '@/data/memory-store';
import type { Remote } from '@/sync/remote';
import { createSync } from '@/sync/sync';

import { createAuth, type LinkStore } from './session';
import { createChunkedStorage, type KeyValue } from './secure-storage';
import { createSupabaseRemote } from './supabase-remote';

// Fase 5 · T4 (ONB-03). Cliente de Supabase simulado: nada sale a la red.

const q = { type: 'NUM.SERIE' as const, level: 2 as const, seed: 'x', answer: 0, marked: false };

function createFakeKeyValue(): KeyValue & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    async getItemAsync(k) {
      return data.get(k) ?? null;
    },
    async setItemAsync(k, v) {
      data.set(k, v);
    },
    async deleteItemAsync(k) {
      data.delete(k);
    },
  };
}

describe('almacén seguro por trozos', () => {
  test('guarda y lee un valor más largo que el límite de un trozo', async () => {
    const kv = createFakeKeyValue();
    const storage = createChunkedStorage(kv, 100);
    const value = 'x'.repeat(250);
    await storage.setItem('sb-token', value);
    expect([...kv.data.values()].every((v) => v.length <= 100)).toBe(true);
    expect(await storage.getItem('sb-token')).toBe(value);
  });

  test('al guardar un valor más corto se borran los trozos sobrantes', async () => {
    const kv = createFakeKeyValue();
    const storage = createChunkedStorage(kv, 100);
    await storage.setItem('sb-token', 'x'.repeat(250));
    await storage.setItem('sb-token', 'corto');
    expect(await storage.getItem('sb-token')).toBe('corto');
    expect(kv.data.size).toBe(2); // contador + 1 trozo
  });

  test('borrar quita todos los trozos; sin valor devuelve null', async () => {
    const kv = createFakeKeyValue();
    const storage = createChunkedStorage(kv, 100);
    await storage.setItem('sb-token', 'x'.repeat(250));
    await storage.removeItem('sb-token');
    expect(kv.data.size).toBe(0);
    expect(await storage.getItem('sb-token')).toBeNull();
  });
});

/** Imita lo justo de `supabase.from(tabla)`: upsert y select paginado con range. */
function createFakeDb(rowsPerTable: Record<string, unknown[]> = {}) {
  const upserts: { table: string; rows: unknown[]; options: unknown }[] = [];
  const ranges: { table: string; from: number; to: number }[] = [];
  const client = {
    from(table: string) {
      return {
        async upsert(rows: unknown[], options: unknown) {
          upserts.push({ table, rows, options });
          return { error: null };
        },
        select() {
          return {
            order() {
              return this;
            },
            async range(from: number, to: number) {
              ranges.push({ table, from, to });
              return { data: (rowsPerTable[table] ?? []).slice(from, to + 1), error: null };
            },
          };
        },
      };
    },
  };
  return { client: client as unknown as SupabaseClient, upserts, ranges };
}

describe('servidor con Supabase', () => {
  test('sube con los nombres de columna del servidor y fechas ISO, sin user_id', async () => {
    const db = createFakeDb();
    const remote = createSupabaseRemote(db.client);
    await remote.upsertAjustes([{ clave: 'fecha', valor: '2027-03-01', actualizado: 0 }]);
    await remote.upsertIntentos([
      { id: 'i1', empezado: 0, durationMs: 60, finishedAt: 1_000, questions: [q] },
    ]);
    expect(db.upserts[0]).toEqual({
      table: 'ajuste',
      rows: [{ clave: 'fecha', valor: '2027-03-01', actualizado: '1970-01-01T00:00:00.000Z' }],
      options: { onConflict: 'user_id,clave' },
    });
    expect(db.upserts[1]?.rows).toEqual([
      {
        id: 'i1',
        empezado: '1970-01-01T00:00:00.000Z',
        duracion_ms: 60,
        fin: '1970-01-01T00:00:01.000Z',
        preguntas: [q],
      },
    ]);
  });

  test('las semillas ya subidas se ignoran en lugar de dar error', async () => {
    const db = createFakeDb();
    await createSupabaseRemote(db.client).upsertSemillas(['a1']);
    expect(db.upserts[0]?.options).toEqual({ onConflict: 'user_id,semilla', ignoreDuplicates: true });
  });

  test('al traer, pide por páginas hasta que no quedan filas (el servidor da 1.000 como máximo)', async () => {
    const semillas = Array.from({ length: 2_500 }, (_, i) => ({ semilla: `s${i}` }));
    const db = createFakeDb({ semilla_usada: semillas });
    const data = await createSupabaseRemote(db.client).pull();
    expect(data.semillas).toHaveLength(2_500);
    expect(db.ranges.filter((r) => r.table === 'semilla_usada').map((r) => r.from)).toEqual([0, 1_000, 2_000]);
  });

  test('convierte lo que llega del servidor al formato de la app', async () => {
    const db = createFakeDb({
      ajuste: [{ clave: 'fecha', valor: 'v', actualizado: '1970-01-01T00:00:02.000Z' }],
      sesion: [{ id: 's1', creada: '1970-01-01T00:00:01.000Z', preguntas: [q] }],
    });
    const data = await createSupabaseRemote(db.client).pull();
    expect(data.ajustes).toEqual([{ clave: 'fecha', valor: 'v', actualizado: 2_000 }]);
    expect(data.sesiones).toEqual([{ id: 's1', creada: 1_000, questions: [q] }]);
  });
});

function createFakeAuthClient(opts: { sendError?: unknown; verifyError?: unknown; userId?: string } = {}) {
  const calls: { method: string; args: unknown }[] = [];
  const auth = {
    async signInWithOtp(args: unknown) {
      calls.push({ method: 'signInWithOtp', args });
      return { error: opts.sendError ?? null };
    },
    async verifyOtp(args: unknown) {
      calls.push({ method: 'verifyOtp', args });
      if (opts.verifyError) return { data: { user: null }, error: opts.verifyError };
      return { data: { user: { id: opts.userId ?? 'user-a' } }, error: null };
    },
    async signOut() {
      calls.push({ method: 'signOut', args: null });
      return { error: null };
    },
  };
  return { client: { auth } as unknown as SupabaseClient, calls };
}

function createEmptyRemote(): Remote & { uploaded: string[] } {
  const uploaded: string[] = [];
  return {
    uploaded,
    async upsertAjustes(rows) {
      uploaded.push(...rows.map((r) => `ajuste:${r.clave}`));
    },
    async upsertSemillas(s) {
      uploaded.push(...s.map((x) => `semilla:${x}`));
    },
    async upsertSesiones(rows) {
      uploaded.push(...rows.map((r) => `sesion:${r.id}`));
    },
    async upsertIntentos(rows) {
      uploaded.push(...rows.map((r) => `intento:${r.id}`));
    },
    async pull() {
      return { ajustes: [], semillas: [], sesiones: [], intentos: [] };
    },
  };
}

function createMemoryLink(initial: string | null = null): LinkStore {
  let v = initial;
  return {
    async get() {
      return v;
    },
    async set(id) {
      v = id;
    },
    async clear() {
      v = null;
    },
  };
}

function authError(code: string, status = 400) {
  return Object.assign(new Error(code), { __isAuthError: true, name: 'AuthApiError', code, status });
}

describe('inicio de sesión con código por correo', () => {
  test('envía el código al correo sin espacios ni mayúsculas', async () => {
    const fake = createFakeAuthClient();
    const auth = createAuth({ client: fake.client, store: createMemoryStore(), remote: createEmptyRemote(), link: createMemoryLink() });
    expect(await auth.sendCode('  Ana@Ejemplo.ES ')).toEqual({ ok: true });
    expect(fake.calls[0]?.args).toEqual({ email: 'ana@ejemplo.es', options: { shouldCreateUser: true } });
  });

  test('rechaza un correo mal escrito sin llamar al servidor', async () => {
    const fake = createFakeAuthClient();
    const auth = createAuth({ client: fake.client, store: createMemoryStore(), remote: createEmptyRemote(), link: createMemoryLink() });
    expect(await auth.sendCode('ana@')).toEqual({ ok: false, error: 'correo_no_valido' });
    expect(fake.calls).toHaveLength(0);
  });

  test('traduce los errores del servidor a motivos que la pantalla puede explicar', async () => {
    const cases: [unknown, string][] = [
      [authError('over_email_send_rate_limit', 429), 'demasiados_intentos'],
      [authError('otp_expired', 403), 'codigo_no_valido'],
      [Object.assign(new Error('fetch'), { __isAuthError: true, name: 'AuthRetryableFetchError', status: 0 }), 'sin_red'],
      [new Error('raro'), 'desconocido'],
    ];
    for (const [err, motivo] of cases) {
      const auth = createAuth({
        client: createFakeAuthClient({ verifyError: err }).client,
        store: createMemoryStore(),
        remote: createEmptyRemote(),
        link: createMemoryLink(),
      });
      expect(await auth.verifyCode('ana@ejemplo.es', '123456')).toEqual({ ok: false, error: motivo });
    }
  });

  test('un código que no son 6 cifras no llega al servidor', async () => {
    const fake = createFakeAuthClient();
    const auth = createAuth({ client: fake.client, store: createMemoryStore(), remote: createEmptyRemote(), link: createMemoryLink() });
    expect(await auth.verifyCode('ana@ejemplo.es', '12a4')).toEqual({ ok: false, error: 'codigo_no_valido' });
    expect(fake.calls).toHaveLength(0);
  });

  test('primer inicio de sesión: sube lo guardado sin cuenta y recuerda la cuenta', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's1', creada: 1, questions: [q] });
    await store.setSetting('oposicion', 'guardia-civil-2026');
    const remote = createEmptyRemote();
    const link = createMemoryLink();
    const fake = createFakeAuthClient({ userId: 'user-a' });
    const auth = createAuth({ client: fake.client, store, remote, link });

    expect(await auth.verifyCode('ana@ejemplo.es', '123456')).toEqual({ ok: true, firstLink: true });
    expect(fake.calls[0]?.args).toEqual({ email: 'ana@ejemplo.es', token: '123456', type: 'email' });
    expect(remote.uploaded.sort()).toEqual(['ajuste:oposicion', 'sesion:s1']);
    expect(await link.get()).toBe('user-a');
  });

  test('volver a entrar con la misma cuenta no vuelve a subirlo todo', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's1', creada: 1, questions: [q] });
    const remote = createEmptyRemote();
    const auth = createAuth({
      client: createFakeAuthClient({ userId: 'user-a' }).client,
      store,
      remote,
      link: createMemoryLink('user-a'),
    });
    expect(await auth.verifyCode('ana@ejemplo.es', '123456')).toEqual({ ok: true, firstLink: false });
    expect(remote.uploaded).toEqual([]);
  });

  test('otra cuenta en el mismo móvil no recibe los datos de la anterior', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's-de-a', creada: 1, questions: [q] });
    await store.enqueue('sesion', 's-de-a', 1);
    const remote = createEmptyRemote();
    const auth = createAuth({
      client: createFakeAuthClient({ userId: 'user-b' }).client,
      store,
      remote,
      link: createMemoryLink('user-a'),
    });
    expect(await auth.verifyCode('bea@ejemplo.es', '123456')).toEqual({ ok: true, firstLink: false });
    expect(remote.uploaded).toEqual([]);
    expect(await store.pendingOps()).toHaveLength(0);
    // Decisión del propietario (2026-11-15): el móvil se vacía para no mezclar datos de dos personas.
    expect(await store.sessions()).toHaveLength(0);
  });

  test('al entrar con otra cuenta, una sincronización lanzada durante la comprobación no sube lo de la anterior', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's-de-a', creada: 1, questions: [q] });
    await store.enqueue('sesion', 's-de-a', 1);
    const remote = createEmptyRemote();
    const fake = createFakeAuthClient({ userId: 'user-b' });
    const auth = createAuth({ client: fake.client, store, remote, link: createMemoryLink('user-a') });
    // Como hace AuthProvider: el cambio de sesión dispara una sincronización antes de que verifyCode termine.
    const verify = fake.client.auth.verifyOtp.bind(fake.client.auth);
    let enCurso: Promise<boolean> | null = null;
    fake.client.auth.verifyOtp = (async (args: Parameters<typeof verify>[0]) => {
      const r = await verify(args);
      enCurso = auth.sync.sync();
      return r;
    }) as typeof verify;

    await auth.verifyCode('bea@ejemplo.es', '123456');
    expect(await enCurso).toBe(false);
    await auth.sync.sync();
    expect(remote.uploaded).toEqual([]);
  });

  test('un fallo de red al llamar a una función se explica como sin red', async () => {
    const fake = createFakeAuthClient();
    (fake.client as unknown as { functions: unknown }).functions = {
      async invoke() {
        return { data: null, error: Object.assign(new Error('fetch'), { name: 'FunctionsFetchError' }) };
      },
    };
    const auth = createAuth({ client: fake.client, store: createMemoryStore(), remote: createEmptyRemote(), link: createMemoryLink('user-a') });
    expect(await auth.deleteAccount()).toEqual({ ok: false, error: 'sin_red' });
  });

  test('cerrar sesión intenta subir antes lo pendiente', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's1', creada: 1, questions: [q] });
    await store.enqueue('sesion', 's1', 1);
    const remote = createEmptyRemote();
    const fake = createFakeAuthClient();
    const auth = createAuth({ client: fake.client, store, remote, link: createMemoryLink('user-a') });
    await auth.signOut();
    expect(remote.uploaded).toEqual(['sesion:s1']);
    expect(fake.calls.at(-1)?.method).toBe('signOut');
  });

  test('createSync se puede usar con el remoto de Supabase', () => {
    expect(() => createSync({ store: createMemoryStore(), remote: createSupabaseRemote(createFakeDb().client) })).not.toThrow();
  });
});

describe('borrar la cuenta y exportar (T6, SOP-02)', () => {
  function clientWithFunctions(result: { error: unknown }) {
    const fake = createFakeAuthClient();
    const invoked: string[] = [];
    (fake.client as unknown as { functions: unknown }).functions = {
      async invoke(name: string) {
        invoked.push(name);
        return { data: result.error ? null : { ok: true }, error: result.error };
      },
    };
    return { ...fake, invoked };
  }

  test('borrar llama a la función del servidor, vacía el móvil y cierra la sesión', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's1', creada: 1, questions: [q] });
    await store.setSetting('oposicion', 'guardia-civil-2026');
    await store.enqueue('sesion', 's1', 1);
    const link = createMemoryLink('user-a');
    const fake = clientWithFunctions({ error: null });
    const auth = createAuth({ client: fake.client, store, remote: createEmptyRemote(), link });

    expect(await auth.deleteAccount()).toEqual({ ok: true });
    expect(fake.invoked).toEqual(['borrar-cuenta']);
    expect(await store.sessions()).toHaveLength(0);
    expect(await store.getSetting('oposicion')).toBeNull();
    expect(await store.pendingOps()).toHaveLength(0);
    expect(await link.get()).toBeNull();
    expect(fake.calls.at(-1)?.method).toBe('signOut');
  });

  test('si el servidor falla, no se borra nada del móvil', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 's1', creada: 1, questions: [q] });
    const fake = clientWithFunctions({ error: new Error('500') });
    const auth = createAuth({ client: fake.client, store, remote: createEmptyRemote(), link: createMemoryLink('user-a') });

    expect(await auth.deleteAccount()).toEqual({ ok: false, error: 'desconocido' });
    expect(await store.sessions()).toHaveLength(1);
    expect(fake.calls.some((c) => c.method === 'signOut')).toBe(false);
  });

  test('exportar junta lo del servidor y lo local sin duplicar, sin el texto de las preguntas', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 'local', creada: 2, questions: [q] });
    await store.saveSession({ id: 'ambos', creada: 1, questions: [q] });
    const remote = createEmptyRemote();
    remote.pull = async () => ({
      ajustes: [{ clave: 'fecha', valor: '2027-03-01', actualizado: 5 }],
      semillas: ['a1'],
      sesiones: [{ id: 'ambos', creada: 1, questions: [q] }, { id: 'servidor', creada: 3, questions: [q] }],
      intentos: [],
    });
    const auth = createAuth({ client: createFakeAuthClient().client, store, remote, link: createMemoryLink('user-a') });

    const r = await auth.exportData(10_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const data = JSON.parse(r.json);
    expect(data.exportado).toBe('1970-01-01T00:00:10.000Z');
    expect(data.sesiones.map((s: { id: string }) => s.id).sort()).toEqual(['ambos', 'local', 'servidor']);
    expect(data.ajustes).toEqual([{ clave: 'fecha', valor: '2027-03-01', actualizado: '1970-01-01T00:00:00.005Z' }]);
    expect(data.semillasUsadas).toEqual(['a1']);
    expect(r.json).not.toMatch(/"stem"|"options"/);
  });

  test('exportar sin red devuelve solo lo del móvil y lo indica', async () => {
    const store = createMemoryStore();
    await store.saveSession({ id: 'local', creada: 2, questions: [q] });
    const remote = createEmptyRemote();
    remote.pull = async () => {
      throw new Error('sin red');
    };
    const auth = createAuth({ client: createFakeAuthClient().client, store, remote, link: createMemoryLink('user-a') });
    const r = await auth.exportData(0);
    expect(r.ok && JSON.parse(r.json).incluyeServidor).toBe(false);
  });
});
