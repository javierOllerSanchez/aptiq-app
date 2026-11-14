import type { SavedAttempt, SavedSession, SavedSetting } from '@/data/store';

/** Lo que hay en el servidor para el usuario con sesión. Solo simulacros terminados. */
export interface RemoteData {
  ajustes: SavedSetting[];
  semillas: string[];
  sesiones: SavedSession[];
  intentos: SavedAttempt[];
}

/**
 * Servidor visto por la sincronización. Todas las subidas son `upsert` por id: repetirlas no duplica.
 * La implementación con Supabase llega con el inicio de sesión (T4); las pruebas usan una falsa.
 */
export interface Remote {
  upsertAjustes(rows: SavedSetting[]): Promise<void>;
  upsertSemillas(seeds: string[]): Promise<void>;
  upsertSesiones(rows: SavedSession[]): Promise<void>;
  upsertIntentos(rows: SavedAttempt[]): Promise<void>;
  pull(): Promise<RemoteData>;
}
