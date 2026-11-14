import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { createChunkedStorage, type KeyValue } from './secure-storage';
import type { LinkStore } from './session';

const secureStore: KeyValue = SecureStore;

/**
 * Cliente de Supabase con la URL y la clave PÚBLICA (NFR-06). La sesión se guarda cifrada en
 * SecureStore. Si faltan las variables (p. ej. `.env` sin copiar), devuelve null y la app
 * sigue funcionando sin cuenta.
 */
export function createSupabaseClient(): SupabaseClient | null {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn('Supabase sin configurar: copia apps/mobile/.env.example a .env');
    return null;
  }
  return createClient(url, key, {
    auth: {
      storage: createChunkedStorage(secureStore),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

const LINK_KEY = 'aptiq.cuenta_vinculada';

/** Cuenta vinculada a los datos de este móvil. Fuera de la base local para que nunca se sincronice. */
export const secureLink: LinkStore = {
  get: () => SecureStore.getItemAsync(LINK_KEY),
  set: (userId) => SecureStore.setItemAsync(LINK_KEY, userId),
};
