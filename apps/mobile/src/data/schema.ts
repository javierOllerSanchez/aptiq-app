import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { PerfilUsado } from '@/content/content';

import type { SavedQuestion, SyncEntity } from './store';

export const ajustes = sqliteTable('ajustes', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
  actualizado: integer('actualizado').notNull().default(0),
});

export const semillasUsadas = sqliteTable('semilla_usada', {
  semilla: text('semilla').primaryKey(),
});

export const sesiones = sqliteTable('sesion', {
  id: text('id').primaryKey(),
  creada: integer('creada').notNull(),
  preguntas: text('preguntas', { mode: 'json' }).$type<SavedQuestion[]>().notNull(),
});

export const intentos = sqliteTable('intento_simulacro', {
  id: text('id').primaryKey(),
  empezado: integer('empezado').notNull(),
  duracionMs: integer('duracion_ms').notNull(),
  fin: integer('fin'),
  preguntas: text('preguntas', { mode: 'json' }).$type<SavedQuestion[]>().notNull(),
  perfil: text('perfil', { mode: 'json' }).$type<PerfilUsado>(),
});

/** Cola de sincronización (fase 5 · T3): una fila por dato pendiente de subir. */
export const colaSync = sqliteTable(
  'cola_sync',
  {
    entidad: text('entidad').$type<SyncEntity>().notNull(),
    id: text('id').notNull(),
    creada: integer('creada').notNull(),
    intentos: integer('intentos').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.entidad, t.id] })],
);

/**
 * Creación de tablas. Se ejecuta al abrir la base. Debe coincidir con el esquema de arriba;
 * cuando haya más migraciones se pasa a drizzle-kit.
 */
export const createTablesSql = [
  'CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY NOT NULL, valor TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS semilla_usada (semilla TEXT PRIMARY KEY NOT NULL)',
  'CREATE TABLE IF NOT EXISTS sesion (id TEXT PRIMARY KEY NOT NULL, creada INTEGER NOT NULL, preguntas TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS intento_simulacro (id TEXT PRIMARY KEY NOT NULL, empezado INTEGER NOT NULL, duracion_ms INTEGER NOT NULL, fin INTEGER, preguntas TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS cola_sync (entidad TEXT NOT NULL, id TEXT NOT NULL, creada INTEGER NOT NULL, intentos INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (entidad, id))',
  // Fase 8: contenido descargado (verbales aprobadas, perfil). No es del usuario: no se sincroniza.
  'CREATE TABLE IF NOT EXISTS contenido (clave TEXT PRIMARY KEY NOT NULL, valor TEXT NOT NULL)',
];

/** Columnas añadidas después de la fase 4: se crean en bases ya existentes si faltan. */
export const addedColumns = [
  { table: 'ajustes', column: 'actualizado', sql: 'ALTER TABLE ajustes ADD COLUMN actualizado INTEGER NOT NULL DEFAULT 0' },
  { table: 'intento_simulacro', column: 'perfil', sql: 'ALTER TABLE intento_simulacro ADD COLUMN perfil TEXT' },
];
