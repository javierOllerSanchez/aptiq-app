import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Cliente de Supabase del panel, solo en el navegador y con la clave publicable.
 * Lo que puede ver o cambiar lo decide la base de datos (RLS + `app_metadata.rol = 'admin'`).
 */
export function supabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key)
      throw new Error(
        'Falta la configuración de Supabase: el panel usa EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY del archivo .env de apps/mobile.',
      );
    // Enlace mágico con el flujo implícito: la sesión llega en la propia URL al volver del correo.
    client = createClient(url, key, { auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true } });
  }
  return client;
}

/** Solo una pista para la pantalla: lo que de verdad protege los datos es RLS. */
export const esAdmin = (s: Session | null) => s?.user.app_metadata?.rol === 'admin';
