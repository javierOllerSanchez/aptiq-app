import { isAuthApiError, isAuthRetryableFetchError, type SupabaseClient } from '@supabase/supabase-js';

import type { SavedSetting, Store } from '@/data/store';
import type { Remote, RemoteData } from '@/sync/remote';
import { createSync } from '@/sync/sync';

/** Motivos que la pantalla de inicio de sesión sabe explicar (textos en T5). */
export type AuthErrorReason =
  | 'correo_no_valido'
  | 'codigo_no_valido'
  | 'demasiados_intentos'
  | 'sin_red'
  | 'desconocido';

export type AuthResult<T = object> = ({ ok: true } & T) | { ok: false; error: AuthErrorReason };

/** Qué cuenta se vinculó con los datos de este móvil (en la app, SecureStore; nunca se sincroniza). */
export interface LinkStore {
  get(): Promise<string | null>;
  set(userId: string): Promise<void>;
  clear(): Promise<void>;
}

interface AuthDeps {
  client: SupabaseClient;
  /** Almacén sin envolver: lo que llega del servidor no se vuelve a encolar. */
  store: Store;
  remote: Remote;
  link: LinkStore;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE = /^\d{6}$/;

function reason(error: unknown): AuthErrorReason {
  if (isAuthRetryableFetchError(error)) return 'sin_red';
  if (error instanceof Error && error.name === 'FunctionsFetchError') return 'sin_red';
  if (isAuthApiError(error)) {
    switch (error.code) {
      case 'over_email_send_rate_limit':
      case 'over_request_rate_limit':
        return 'demasiados_intentos';
      case 'otp_expired':
        return 'codigo_no_valido';
      case 'email_address_invalid':
        return 'correo_no_valido';
    }
  }
  return 'desconocido';
}

/**
 * Inicio de sesión con código de un solo uso por correo (decisión del propietario, ONB-03 parcial:
 * Apple y Google llegan cuando existan sus cuentas de desarrollador).
 */
export function createAuth({ client, store, remote, link }: AuthDeps) {
  const base = createSync({ store, remote });
  // Mientras verifyCode decide de quién es la cola, la sincronización automática espera (devuelve false y se reintenta).
  let verificando = false;
  const sync = {
    ...base,
    push: () => (verificando ? Promise.resolve(false) : base.push()),
    sync: () => (verificando ? Promise.resolve(false) : base.sync()),
  };
  const normalize = (email: string) => email.trim().toLowerCase();

  /** Tras comprobar el código: decide de quién es la cola y qué se sube (decisión 4 y regla de otra cuenta). */
  async function vincular(email: string, token: string): Promise<AuthResult<{ firstLink: boolean }>> {
    const { data, error } = await client.auth.verifyOtp({ email: normalize(email), token, type: 'email' });
    if (error || !data.user) return { ok: false, error: reason(error) };

    const userId = data.user.id;
    const linked = await link.get();
    if (linked === userId) {
      void base.sync();
      return { ok: true, firstLink: false };
    }
    if (linked !== null) {
      await store.removeOps(await store.pendingOps());
      await link.set(userId);
      void base.pull();
      return { ok: true, firstLink: false };
    }
    await link.set(userId);
    await base.uploadAll(); // si falla, queda en la cola y se reintenta
    return { ok: true, firstLink: true };
  }

  return {
    async sendCode(email: string): Promise<AuthResult> {
      const e = normalize(email);
      if (!EMAIL.test(e)) return { ok: false, error: 'correo_no_valido' };
      const { error } = await client.auth.signInWithOtp({ email: e, options: { shouldCreateUser: true } });
      return error ? { ok: false, error: reason(error) } : { ok: true };
    },

    /**
     * Comprueba el código. La primera vez que este móvil se vincula a una cuenta, sube lo guardado
     * sin cuenta (con aviso previo en pantalla, decisión 4). Si el móvil ya estaba vinculado a otra
     * cuenta, no sube nada de la anterior.
     */
    async verifyCode(email: string, code: string): Promise<AuthResult<{ firstLink: boolean }>> {
      const token = code.trim();
      if (!CODE.test(token)) return { ok: false, error: 'codigo_no_valido' };
      verificando = true;
      try {
        return await vincular(email, token);
      } finally {
        verificando = false;
      }
    },

    /** Sube lo pendiente si puede y cierra la sesión solo en este móvil. */
    async signOut(): Promise<void> {
      await sync.push();
      await client.auth.signOut({ scope: 'local' });
    },

    /**
     * Borra la cuenta en el servidor (función `borrar-cuenta`, SOP-02). Solo si el servidor confirma
     * se vacía el móvil y se cierra la sesión; si falla, no se borra nada aquí.
     */
    async deleteAccount(): Promise<AuthResult> {
      const { error } = await client.functions.invoke('borrar-cuenta');
      if (error) return { ok: false, error: reason(error) };
      await store.clearAll();
      await link.clear();
      await client.auth.signOut({ scope: 'local' });
      return { ok: true };
    },

    /**
     * Exporta lo que tiene el móvil y, si hay red, lo del servidor, sin duplicados. No incluye el
     * texto de las preguntas: solo semillas, respuestas y fechas.
     */
    async exportData(ahora = Date.now()): Promise<AuthResult<{ json: string }>> {
      const local = {
        ajustes: await store.settings(),
        sesiones: await store.sessions(),
        intentos: await store.attempts(),
        semillas: [...(await store.usedSeeds())],
      };
      let server: RemoteData | null = null;
      try {
        server = await remote.pull();
      } catch {
        server = null; // sin red: solo lo del móvil, y se indica en el archivo
      }

      const ajustes = new Map<string, SavedSetting>();
      for (const a of [...local.ajustes, ...(server?.ajustes ?? [])]) {
        const prev = ajustes.get(a.clave);
        if (!prev || a.actualizado > prev.actualizado) ajustes.set(a.clave, a);
      }
      const porId = <T extends { id: string }>(lista: T[]) => new Map(lista.map((x) => [x.id, x] as const));
      const sesiones = { ...Object.fromEntries(porId(server?.sesiones ?? [])), ...Object.fromEntries(porId(local.sesiones)) };
      const intentos = { ...Object.fromEntries(porId(server?.intentos ?? [])), ...Object.fromEntries(porId(local.intentos)) };

      const json = JSON.stringify(
        {
          exportado: new Date(ahora).toISOString(),
          incluyeServidor: server !== null,
          ajustes: [...ajustes.values()].map((a) => ({ ...a, actualizado: new Date(a.actualizado).toISOString() })),
          semillasUsadas: [...new Set([...local.semillas, ...(server?.semillas ?? [])])].sort(),
          sesiones: Object.values(sesiones),
          intentos: Object.values(intentos),
        },
        null,
        2,
      );
      return { ok: true, json };
    },

    sync,
  };
}
