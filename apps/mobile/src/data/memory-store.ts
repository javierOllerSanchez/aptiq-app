import type { SavedAttempt, SavedSession, SavedSetting, Store, SyncOp } from './store';

const opKey = (o: Pick<SyncOp, 'entidad' | 'id'>) => `${o.entidad}:${o.id}`;

/** Implementación en memoria del contrato `Store`, para pruebas. `now` permite fijar el reloj. */
export function createMemoryStore(now: () => number = Date.now): Store {
  const settings = new Map<string, SavedSetting>();
  const seeds = new Set<string>();
  const sessionList: SavedSession[] = [];
  const attemptList: SavedAttempt[] = [];
  const queue = new Map<string, SyncOp>();
  const content = new Map<string, string>();

  return {
    async getContent(key) {
      return content.get(key) ?? null;
    },
    async setContent(key, value) {
      content.set(key, value);
    },
    async getSetting(key) {
      return settings.get(key)?.valor ?? null;
    },
    async setSetting(key, value, actualizado = now()) {
      settings.set(key, { clave: key, valor: value, actualizado });
    },
    async settings() {
      return [...settings.values()];
    },
    async addUsedSeeds(list) {
      for (const s of list) seeds.add(s);
    },
    async usedSeeds() {
      return new Set(seeds);
    },
    async saveSession(s) {
      sessionList.push(s);
    },
    async sessions() {
      return [...sessionList].sort((a, b) => a.creada - b.creada);
    },
    async saveAttempt(a) {
      const i = attemptList.findIndex((x) => x.id === a.id);
      if (i === -1) attemptList.push(a);
      else attemptList[i] = a;
    },
    async deleteAttempt(id) {
      const i = attemptList.findIndex((x) => x.id === id);
      if (i !== -1) attemptList.splice(i, 1);
    },
    async attempts() {
      return [...attemptList];
    },
    async enqueue(entidad, id, creada) {
      const prev = queue.get(opKey({ entidad, id }));
      queue.set(opKey({ entidad, id }), { entidad, id, creada, intentos: prev?.intentos ?? 0 });
    },
    async pendingOps() {
      return [...queue.values()].map((o) => ({ ...o })).sort((a, b) => a.creada - b.creada);
    },
    async removeOps(ops) {
      for (const o of ops) {
        if (queue.get(opKey(o))?.creada === o.creada) queue.delete(opKey(o));
      }
    },
    async markFailed(ops) {
      for (const o of ops) {
        const cur = queue.get(opKey(o));
        if (cur) cur.intentos += 1;
      }
    },
    async clearAll() {
      settings.clear();
      seeds.clear();
      sessionList.length = 0;
      attemptList.length = 0;
      queue.clear();
    },
  };
}
