import { and, asc, eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import {
  addedColumns,
  ajustes,
  colaSync,
  createTablesSql,
  intentos,
  semillasUsadas,
  sesiones,
} from './schema';
import type { Store } from './store';

/** Abre la base local y crea las tablas si no existen. Verificado en dispositivo (T9), no con Jest. */
export function createSqliteStore(name = 'aptiq.db', now: () => number = Date.now): Store {
  const raw = openDatabaseSync(name);
  for (const stmt of createTablesSql) raw.execSync(stmt);
  for (const c of addedColumns) {
    const cols = raw.getAllSync<{ name: string }>(`PRAGMA table_info(${c.table})`);
    if (!cols.some((x) => x.name === c.column)) raw.execSync(c.sql);
  }
  const db = drizzle(raw);

  return {
    async getSetting(key) {
      const [row] = await db.select().from(ajustes).where(eq(ajustes.clave, key));
      return row?.valor ?? null;
    },
    async setSetting(key, value, actualizado = now()) {
      await db
        .insert(ajustes)
        .values({ clave: key, valor: value, actualizado })
        .onConflictDoUpdate({ target: ajustes.clave, set: { valor: value, actualizado } });
    },
    async settings() {
      return db.select().from(ajustes);
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
      await db.insert(sesiones).values({ id: s.id, creada: s.creada, preguntas: s.questions });
    },
    async sessions() {
      const rows = await db.select().from(sesiones).orderBy(asc(sesiones.creada));
      return rows.map((r) => ({ id: r.id, creada: r.creada, questions: r.preguntas }));
    },
    async saveAttempt(a) {
      const row = {
        id: a.id,
        empezado: a.empezado,
        duracionMs: a.durationMs,
        fin: a.finishedAt,
        preguntas: a.questions,
        perfil: a.perfil ?? null,
      };
      await db.insert(intentos).values(row).onConflictDoUpdate({ target: intentos.id, set: row });
    },
    async deleteAttempt(id) {
      await db.delete(intentos).where(eq(intentos.id, id));
    },
    async attempts() {
      const rows = await db.select().from(intentos).orderBy(asc(intentos.empezado));
      return rows.map((r) => ({
        id: r.id,
        empezado: r.empezado,
        durationMs: r.duracionMs,
        finishedAt: r.fin,
        questions: r.preguntas,
        ...(r.perfil && { perfil: r.perfil }),
      }));
    },
    async enqueue(entidad, id, creada) {
      await db
        .insert(colaSync)
        .values({ entidad, id, creada })
        .onConflictDoUpdate({ target: [colaSync.entidad, colaSync.id], set: { creada } });
    },
    async pendingOps() {
      return db.select().from(colaSync).orderBy(asc(colaSync.creada));
    },
    async removeOps(ops) {
      for (const o of ops) {
        await db
          .delete(colaSync)
          .where(and(eq(colaSync.entidad, o.entidad), eq(colaSync.id, o.id), eq(colaSync.creada, o.creada)));
      }
    },
    async markFailed(ops) {
      for (const o of ops) {
        await db
          .update(colaSync)
          .set({ intentos: sql`${colaSync.intentos} + 1` })
          .where(and(eq(colaSync.entidad, o.entidad), eq(colaSync.id, o.id)));
      }
    },
    async getContent(key) {
      return raw.getFirstSync<{ valor: string }>('SELECT valor FROM contenido WHERE clave = ?', key)?.valor ?? null;
    },
    async setContent(key, value) {
      raw.runSync('INSERT INTO contenido (clave, valor) VALUES (?, ?) ON CONFLICT (clave) DO UPDATE SET valor = excluded.valor', key, value);
    },
    async clearAll() {
      // Todo o nada: tras borrar la cuenta en el servidor no hay reintento si se queda a medias.
      raw.withTransactionSync(() => {
        for (const t of ['ajustes', 'semilla_usada', 'sesion', 'intento_simulacro', 'cola_sync']) {
          raw.execSync(`DELETE FROM ${t}`);
        }
      });
    },
  };
}
