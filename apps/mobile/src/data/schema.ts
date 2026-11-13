import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { SavedQuestion } from './store';

export const ajustes = sqliteTable('ajustes', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
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
});

/**
 * Creación de tablas. Se ejecuta al abrir la base. Debe coincidir con el esquema de arriba;
 * cuando haya más migraciones se pasa a drizzle-kit.
 */
export const createTablesSql = [
  'CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY NOT NULL, valor TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS semilla_usada (semilla TEXT PRIMARY KEY NOT NULL)',
  'CREATE TABLE IF NOT EXISTS sesion (id TEXT PRIMARY KEY NOT NULL, creada INTEGER NOT NULL, preguntas TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS intento_simulacro (id TEXT PRIMARY KEY NOT NULL, empezado INTEGER NOT NULL, duracion_ms INTEGER NOT NULL, fin INTEGER, preguntas TEXT NOT NULL)',
];
