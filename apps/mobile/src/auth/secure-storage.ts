/** Lo justo de `expo-secure-store` (inyectable para pruebas). */
export interface KeyValue {
  getItemAsync(key: string): Promise<string | null>;
  setItemAsync(key: string, value: string): Promise<void>;
  deleteItemAsync(key: string): Promise<void>;
}

/** Contrato de almacenamiento que espera Supabase Auth. */
export interface AuthStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * La sesión de Supabase puede pasar de 2 KB, el límite práctico de un valor en SecureStore.
 * Se guarda en trozos (`clave.0`, `clave.1`…) y un contador (`clave.n`). Todo cifrado por el sistema.
 */
export function createChunkedStorage(kv: KeyValue, chunkSize = 1_800): AuthStorage {
  const countKey = (k: string) => `${k}.n`;
  const partKey = (k: string, i: number) => `${k}.${i}`;

  async function count(key: string): Promise<number> {
    const n = Number(await kv.getItemAsync(countKey(key)));
    return Number.isInteger(n) && n > 0 ? n : 0;
  }

  async function removeParts(key: string, from: number, to: number) {
    for (let i = from; i < to; i++) await kv.deleteItemAsync(partKey(key, i));
  }

  return {
    async getItem(key) {
      const n = await count(key);
      if (n === 0) return null;
      const parts: string[] = [];
      for (let i = 0; i < n; i++) {
        const p = await kv.getItemAsync(partKey(key, i));
        if (p === null) return null; // guardado a medias: se trata como sin sesión
        parts.push(p);
      }
      return parts.join('');
    },
    async setItem(key, value) {
      const old = await count(key);
      const n = Math.max(1, Math.ceil(value.length / chunkSize));
      for (let i = 0; i < n; i++) {
        await kv.setItemAsync(partKey(key, i), value.slice(i * chunkSize, (i + 1) * chunkSize));
      }
      await kv.setItemAsync(countKey(key), String(n));
      await removeParts(key, n, old);
    },
    async removeItem(key) {
      await removeParts(key, 0, await count(key));
      await kv.deleteItemAsync(countKey(key));
    },
  };
}
