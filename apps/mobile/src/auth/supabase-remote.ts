import type { SupabaseClient } from '@supabase/supabase-js';

import type { SavedQuestion } from '@/data/store';
import type { Remote } from '@/sync/remote';

/** Máximo de filas que devuelve la API de Supabase por petición. */
const PAGE = 1_000;

const iso = (ms: number) => new Date(ms).toISOString();
const ms = (s: string) => new Date(s).getTime();

/**
 * Servidor real (tablas de `supabase/migrations`). No se envía `user_id`: lo pone el servidor
 * con `auth.uid()` y RLS impide escribir a nombre de otro.
 */
export function createSupabaseRemote(client: SupabaseClient): Remote {
  async function upsert(table: string, rows: object[], onConflict: string, ignoreDuplicates = false) {
    if (rows.length === 0) return;
    const { error } = await client
      .from(table)
      .upsert(rows, ignoreDuplicates ? { onConflict, ignoreDuplicates } : { onConflict });
    if (error) throw error;
  }

  async function all<T>(table: string, columns: string, orderBy: string): Promise<T[]> {
    const out: T[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await client
        .from(table)
        .select(columns)
        .order(orderBy)
        .range(from, from + PAGE - 1);
      if (error) throw error;
      const rows = (data ?? []) as T[];
      out.push(...rows);
      if (rows.length < PAGE) return out;
    }
  }

  return {
    upsertAjustes: (rows) =>
      upsert(
        'ajuste',
        rows.map((r) => ({ clave: r.clave, valor: r.valor, actualizado: iso(r.actualizado) })),
        'user_id,clave',
      ),
    upsertSemillas: (seeds) => upsert('semilla_usada', seeds.map((semilla) => ({ semilla })), 'user_id,semilla', true),
    upsertSesiones: (rows) =>
      upsert(
        'sesion',
        rows.map((s) => ({ id: s.id, creada: iso(s.creada), preguntas: s.questions })),
        'user_id,id',
      ),
    upsertIntentos: (rows) =>
      upsert(
        'intento_simulacro',
        rows
          .filter((a) => a.finishedAt !== null)
          .map((a) => ({
            id: a.id,
            empezado: iso(a.empezado),
            duracion_ms: a.durationMs,
            fin: iso(a.finishedAt ?? a.empezado),
            preguntas: a.questions,
          })),
        'user_id,id',
      ),

    async pull() {
      const [ajustes, semillas, sesiones, intentos] = await Promise.all([
        all<{ clave: string; valor: string; actualizado: string }>('ajuste', 'clave, valor, actualizado', 'clave'),
        all<{ semilla: string }>('semilla_usada', 'semilla', 'semilla'),
        all<{ id: string; creada: string; preguntas: SavedQuestion[] }>('sesion', 'id, creada, preguntas', 'id'),
        all<{ id: string; empezado: string; duracion_ms: number; fin: string; preguntas: SavedQuestion[] }>(
          'intento_simulacro',
          'id, empezado, duracion_ms, fin, preguntas',
          'id',
        ),
      ]);
      return {
        ajustes: ajustes.map((r) => ({ clave: r.clave, valor: r.valor, actualizado: ms(r.actualizado) })),
        semillas: semillas.map((r) => r.semilla),
        sesiones: sesiones.map((r) => ({ id: r.id, creada: ms(r.creada), questions: r.preguntas })),
        intentos: intentos.map((r) => ({
          id: r.id,
          empezado: ms(r.empezado),
          durationMs: r.duracion_ms,
          finishedAt: ms(r.fin),
          questions: r.preguntas,
        })),
      };
    },
  };
}
