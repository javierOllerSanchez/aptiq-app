import type { SavedAttempt, SavedSession, Store } from './store';

/** Implementación en memoria del contrato `Store`, para pruebas. */
export function createMemoryStore(): Store {
  const settings = new Map<string, string>();
  const seeds = new Set<string>();
  const sessionList: SavedSession[] = [];
  const attemptList: SavedAttempt[] = [];

  return {
    async getSetting(key) {
      return settings.get(key) ?? null;
    },
    async setSetting(key, value) {
      settings.set(key, value);
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
  };
}
