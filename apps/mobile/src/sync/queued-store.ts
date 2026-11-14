import type { Store } from '@/data/store';

/**
 * Envuelve el almacén para que cada cambio que deba subirse deje una operación en la cola.
 * Las pantallas no cambian: siguen llamando a `setSetting`, `saveSession`…
 * El simulacro abierto no se encola: solo se sube al entregarse (`finishedAt` con valor).
 */
export function withSyncQueue(store: Store, now: () => number = Date.now): Store {
  return {
    ...store,
    async setSetting(key, value, actualizado = now()) {
      await store.setSetting(key, value, actualizado);
      await store.enqueue('ajuste', key, actualizado);
    },
    async addUsedSeeds(list) {
      await store.addUsedSeeds(list);
      const t = now();
      for (const s of list) await store.enqueue('semilla', s, t);
    },
    async saveSession(s) {
      await store.saveSession(s);
      await store.enqueue('sesion', s.id, now());
    },
    async saveAttempt(a) {
      await store.saveAttempt(a);
      if (a.finishedAt !== null) await store.enqueue('intento', a.id, now());
    },
  };
}
