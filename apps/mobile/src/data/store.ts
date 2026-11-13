import type { Level, TypeCode } from '@aptiq/engine';

/** Una pregunta tal como se respondió: lo justo para regenerarla con el motor (semilla) y saber qué se contestó. */
export interface SavedQuestion {
  type: TypeCode;
  level: Level;
  seed: string;
  /** Opción elegida, o null si quedó en blanco. */
  answer: number | null;
  marked: boolean;
}

export interface SavedSession {
  id: string;
  creada: number;
  questions: SavedQuestion[];
}

export interface SavedAttempt {
  id: string;
  empezado: number;
  durationMs: number;
  /** null mientras el simulacro sigue abierto. */
  finishedAt: number | null;
  questions: SavedQuestion[];
}

/** Almacenamiento local (sin cuenta, fase 4). La implementación de SQLite va en `sqlite-store.ts`. */
export interface Store {
  getSetting(key: string): Promise<string | null>;
  setSetting(key: string, value: string): Promise<void>;
  addUsedSeeds(seeds: string[]): Promise<void>;
  usedSeeds(): Promise<Set<string>>;
  saveSession(s: SavedSession): Promise<void>;
  sessions(): Promise<SavedSession[]>;
  /** Crea o actualiza por id: el simulacro en curso se guarda tras cada cambio (NFR-03). */
  saveAttempt(a: SavedAttempt): Promise<void>;
  deleteAttempt(id: string): Promise<void>;
  attempts(): Promise<SavedAttempt[]>;
}
