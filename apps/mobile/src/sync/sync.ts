import type { Store, SyncEntity, SyncOp } from '@/data/store';

import type { Remote } from './remote';

interface SyncDeps {
  /** Almacén sin envolver: lo que llega del servidor no se vuelve a encolar. */
  store: Store;
  remote: Remote;
}

/**
 * Sincronización con el servidor (fase 5 · T3, NFR-01, PRO-02).
 * Ninguna función lanza: un fallo devuelve `false` y deja la cola para el siguiente intento.
 */
export function createSync({ store, remote }: SyncDeps) {
  /** Sube la cola en orden fijo: ajustes, semillas, sesiones, intentos. */
  async function push(): Promise<boolean> {
    const ops = await store.pendingOps();
    if (ops.length === 0) return true;
    const ids = (e: SyncEntity) => new Set(ops.filter((o) => o.entidad === e).map((o) => o.id));

    try {
      const aj = ids('ajuste');
      if (aj.size) await remote.upsertAjustes((await store.settings()).filter((s) => aj.has(s.clave)));

      const sem = ids('semilla');
      if (sem.size) await remote.upsertSemillas([...sem]);

      const ses = ids('sesion');
      if (ses.size) await remote.upsertSesiones((await store.sessions()).filter((s) => ses.has(s.id)));

      const int = ids('intento');
      if (int.size) {
        const done = (await store.attempts()).filter((a) => int.has(a.id) && a.finishedAt !== null);
        if (done.length) await remote.upsertIntentos(done);
      }
    } catch {
      await store.markFailed(ops);
      return false;
    }
    await store.removeOps(ops);
    return true;
  }

  /** Trae lo del servidor y lo une por id; en los ajustes gana el cambio más reciente. */
  async function pull(): Promise<boolean> {
    try {
      const data = await remote.pull();
      await store.addUsedSeeds(data.semillas);

      const sessionIds = new Set((await store.sessions()).map((s) => s.id));
      for (const s of data.sesiones) if (!sessionIds.has(s.id)) await store.saveSession(s);

      const attemptIds = new Set((await store.attempts()).map((a) => a.id));
      for (const a of data.intentos) if (!attemptIds.has(a.id)) await store.saveAttempt(a);

      const local = new Map((await store.settings()).map((s) => [s.clave, s]));
      for (const r of data.ajustes) {
        const l = local.get(r.clave);
        if (!l || r.actualizado > l.actualizado) await store.setSetting(r.clave, r.valor, r.actualizado);
      }
      return true;
    } catch {
      return false;
    }
  }

  /** Subir y después traer. Es lo que se llama al abrir la app y al recuperar la red. */
  async function sync(): Promise<boolean> {
    const pushed = await push();
    const pulled = await pull();
    return pushed && pulled;
  }

  /**
   * Primer inicio de sesión: encola todo lo guardado sin cuenta (salvo el simulacro abierto)
   * y sincroniza. Si la cuenta ya tenía datos, se unen por id.
   */
  async function uploadAll(): Promise<boolean> {
    const ops: Pick<SyncOp, 'entidad' | 'id' | 'creada'>[] = [
      ...(await store.settings()).map((s) => ({ entidad: 'ajuste' as const, id: s.clave, creada: s.actualizado })),
      ...[...(await store.usedSeeds())].map((id) => ({ entidad: 'semilla' as const, id, creada: 0 })),
      ...(await store.sessions()).map((s) => ({ entidad: 'sesion' as const, id: s.id, creada: s.creada })),
      ...(await store.attempts())
        .filter((a) => a.finishedAt !== null)
        .map((a) => ({ entidad: 'intento' as const, id: a.id, creada: a.finishedAt ?? 0 })),
    ];
    for (const o of ops) await store.enqueue(o.entidad, o.id, o.creada);
    return sync();
  }

  return { push, pull, sync, uploadAll };
}
