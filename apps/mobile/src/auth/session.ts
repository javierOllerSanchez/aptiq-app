import { isAuthApiError, isAuthRetryableFetchError, type SupabaseClient } from '@supabase/supabase-js';

import type { Store } from '@/data/store';
import type { Remote } from '@/sync/remote';
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
  const sync = createSync({ store, remote });
  const normalize = (email: string) => email.trim().toLowerCase();

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
      const { data, error } = await client.auth.verifyOtp({ email: normalize(email), token, type: 'email' });
      if (error || !data.user) return { ok: false, error: reason(error) };

      const userId = data.user.id;
      const linked = await link.get();
      if (linked === userId) {
        void sync.sync();
        return { ok: true, firstLink: false };
      }
      if (linked !== null) {
        await store.removeOps(await store.pendingOps());
        await link.set(userId);
        void sync.pull();
        return { ok: true, firstLink: false };
      }
      await link.set(userId);
      await sync.uploadAll(); // si falla, queda en la cola y se reintenta
      return { ok: true, firstLink: true };
    },

    /** Sube lo pendiente si puede y cierra la sesión solo en este móvil. */
    async signOut(): Promise<void> {
      await sync.push();
      await client.auth.signOut({ scope: 'local' });
    },

    sync,
  };
}
