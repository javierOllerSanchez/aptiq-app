import type { Level, TypeCode } from '@aptiq/engine';
import { asc, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import { ajustes, createTablesSql, intentos, semillasUsadas, sesiones } from './schema';
import type { SavedAttempt, SavedSession, Store } from './store';

/** Abre la base local y crea las tablas si no existen. Verificado en dispositivo (T9), no con Jest. */
export function createSqliteStore(name = 'aptiq.db'): Store {
  const raw = openDatabaseSync(name);
  for (const sql of createTablesSql) raw.execSync(sql);
  const db = drizzle(raw);

  return {
    async getSetting(key) {
      const [row] = await db.select().from(ajustes).where(eq(ajustes.clave, key));
      return row?.valor ?? null;
    },
    async setSetting(key, value) {
      await db
        .insert(ajustes)
        .values({ clave: key, valor: value })
        .onConflictDoUpdate({
          target: ajustes.clave,
          set: { valor: value },
        });
    },
    async addUsedSeeds(list) {
      for (const semilla of list) {
        await db.insert(semillasUsadas).values({ semilla }).onConflictDoNothing();
      }
    },
    async usedSeeds() {
      const rows = await db.select().from(semillasUsadas);
      return new Set(rows.map((r) => r.semilla));
    },
    async saveSession(s) {
      await db.insert(sesiones).values({
        id: s.id,
        tipo: s.type,
        nivel: s.level,
        semilla: s.seed,
        respuestas: s.answers,
        marcas: s.marked,
        creada: s.creada,
      });
    },
    async sessions() {
      const rows = await db.select().from(sesiones).orderBy(asc(sesiones.creada));
      return rows.map((r): SavedSession => ({
        id: r.id,
        type: r.tipo as TypeCode,
        level: r.nivel as Level,
        seed: r.semilla,
        answers: r.respuestas,
        marked: r.marcas,
        creada: r.creada,
      }));
    },
    async saveAttempt(a) {
      await db.insert(intentos).values({
        id: a.id,
        empezado: a.empezado,
        duracionMs: a.durationMs,
        respuestas: a.answers,
        marcas: a.marked,
        fin: a.finishedAt,
      });
    },
    async attempts() {
      const rows = await db.select().from(intentos).orderBy(asc(intentos.empezado));
      return rows.map((r): SavedAttempt => ({
        id: r.id,
        empezado: r.empezado,
        durationMs: r.duracionMs,
        answers: r.respuestas,
        marked: r.marcas,
        finishedAt: r.fin,
      }));
    },
  };
}
