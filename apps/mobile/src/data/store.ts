import type { Level, TypeCode } from '@aptiq/engine';

/** Respuestas de una sesión de práctica (una fila por pregunta). */
export interface SavedSession {
  id: string;
  type: TypeCode;
  level: Level;
  seed: string;
  answers: (number | null)[];
  marked: boolean[];
  creada: number;
}

export interface SavedAttempt {
  id: string;
  empezado: number;
  durationMs: number;
  answers: (number | null)[];
  marked: boolean[];
  /** null mientras el simulacro sigue abierto. */
  finishedAt: number | null;
}

/** Almacenamiento local (sin cuenta, fase 4). La implementación de SQLite va en `sqlite-store.ts`. */
export interface Store {
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  addUsedSeeds(seeds: string[]): Promise<void>;
  usedSeeds(): Promise<Set<string>>;
  saveSession(s: SavedSession): Promise<void>;
  sessions(): Promise<SavedSession[]>;
  saveAttempt(a: SavedAttempt): Promise<void>;
  attempts(): Promise<SavedAttempt[]>;
}
