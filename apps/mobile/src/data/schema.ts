import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const ajustes = sqliteTable('ajustes', {
  clave: text('clave').primaryKey(),
  valor: text('valor').notNull(),
});

export const semillasUsadas = sqliteTable('semilla_usada', {
  semilla: text('semilla').primaryKey(),
});

export const sesiones = sqliteTable('sesion', {
  id: text('id').primaryKey(),
  tipo: text('tipo').notNull(),
  nivel: integer('nivel').notNull(),
  semilla: text('semilla').notNull(),
  respuestas: text('respuestas', { mode: 'json' }).$type<(number | null)[]>().notNull(),
  marcas: text('marcas', { mode: 'json' }).$type<boolean[]>().notNull(),
  creada: integer('creada').notNull(),
});

export const intentos = sqliteTable('intento_simulacro', {
  id: text('id').primaryKey(),
  empezado: integer('empezado').notNull(),
  duracionMs: integer('duracion_ms').notNull(),
  respuestas: text('respuestas', { mode: 'json' }).$type<(number | null)[]>().notNull(),
  marcas: text('marcas', { mode: 'json' }).$type<boolean[]>().notNull(),
  fin: integer('fin'),
});

/**
 * Creación de tablas. Se ejecuta al abrir la base. Debe coincidir con el esquema de arriba;
 * cuando haya más migraciones se pasa a drizzle-kit.
 */
export const createTablesSql = [
  'CREATE TABLE IF NOT EXISTS ajustes (clave TEXT PRIMARY KEY NOT NULL, valor TEXT NOT NULL)',
  'CREATE TABLE IF NOT EXISTS semilla_usada (semilla TEXT PRIMARY KEY NOT NULL)',
  'CREATE TABLE IF NOT EXISTS sesion (id TEXT PRIMARY KEY NOT NULL, tipo TEXT NOT NULL, nivel INTEGER NOT NULL, semilla TEXT NOT NULL, respuestas TEXT NOT NULL, marcas TEXT NOT NULL, creada INTEGER NOT NULL)',
  'CREATE TABLE IF NOT EXISTS intento_simulacro (id TEXT PRIMARY KEY NOT NULL, empezado INTEGER NOT NULL, duracion_ms INTEGER NOT NULL, respuestas TEXT NOT NULL, marcas TEXT NOT NULL, fin INTEGER)',
];
