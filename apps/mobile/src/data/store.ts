import type { Level, TypeCode } from '@aptiq/engine';

/** Una pregunta tal como se respondió: lo justo para regenerarla con el motor (semilla) y saber qué se contestó. */
export interface SavedQuestion {
  type: TypeCode;
  level: Level;
  seed: string;
  /** Opción elegida, o null si quedó en blanco. */
  answer: number | null;
  marked: boolean;
  /**
   * Si se acertó, guardado al responder (desde la fase 6). Evita regenerar todo el historial para
   * calcular niveles y aciertos. Falta en datos antiguos: entonces se regenera la pregunta.
   */
  correct?: boolean;
  /** Familia de reglas y versión del generador (fase 8): métricas por familia y reportes reproducibles. */
  family?: string;
  version?: string;
  /** Milisegundos que tardó en responder (fase 8, métricas ADM-02). */
  ms?: number;
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

export interface SavedSetting {
  clave: string;
  valor: string;
  /** Momento del último cambio (ms). Entre dispositivos gana el más reciente. */
  actualizado: number;
}

/** Qué se sube al servidor (fase 5 · T3). */
export type SyncEntity = 'ajuste' | 'semilla' | 'sesion' | 'intento';

/** Operación pendiente de subir: solo la referencia; el dato se lee del almacén al subir. */
export interface SyncOp {
  entidad: SyncEntity;
  id: string;
  /** Momento del último cambio encolado; sirve para no borrar un cambio hecho durante la subida. */
  creada: number;
  intentos: number;
}

/** Almacenamiento local. La implementación de SQLite va en `sqlite-store.ts`. */
export interface Store {
  getSetting(key: string): Promise<string | null>;
  /** `actualizado` por defecto es ahora; la sincronización pasa la fecha del servidor. */
  setSetting(key: string, value: string, actualizado?: number): Promise<void>;
  settings(): Promise<SavedSetting[]>;
  addUsedSeeds(seeds: string[]): Promise<void>;
  usedSeeds(): Promise<Set<string>>;
  saveSession(s: SavedSession): Promise<void>;
  sessions(): Promise<SavedSession[]>;
  /** Crea o actualiza por id: el simulacro en curso se guarda tras cada cambio (NFR-03). */
  saveAttempt(a: SavedAttempt): Promise<void>;
  deleteAttempt(id: string): Promise<void>;
  attempts(): Promise<SavedAttempt[]>;

  /** Cola de sincronización (`cola_sync`). Encolar dos veces lo mismo deja una sola operación. */
  enqueue(entidad: SyncEntity, id: string, creada: number): Promise<void>;
  /** Pendientes, de la más antigua a la más reciente. */
  pendingOps(): Promise<SyncOp[]>;
  /** Quita las operaciones subidas, salvo las que cambiaron después (otra `creada`). */
  removeOps(ops: SyncOp[]): Promise<void>;
  markFailed(ops: SyncOp[]): Promise<void>;

  /** Borra todo lo guardado en el móvil (cuenta eliminada, SOP-02). */
  clearAll(): Promise<void>;
}
