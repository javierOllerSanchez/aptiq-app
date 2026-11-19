import type { SupabaseClient } from '@supabase/supabase-js';

import type { Store } from '@/data/store';

/** Mismos motivos que el panel y que la tabla `reporte` (SOP-01). */
export const MOTIVOS = {
  dos_correctas: 'Hay más de una respuesta correcta',
  correcta_mal: 'La respuesta marcada como correcta está mal',
  explicacion: 'La explicación tiene un error',
  no_se_entiende: 'No se entiende el enunciado o el dibujo',
  otro: 'Otro',
} as const;
export type Motivo = keyof typeof MOTIVOS;

/** Lo justo para reproducir la pregunta con el motor. Sin usuario ni correo: también sin cuenta. */
export interface Reporte {
  id: string;
  tipo: string;
  nivel: number;
  semilla: string;
  version: string;
  opciones: number;
  respuesta: number | null;
  motivo: Motivo;
  comentario: string | null;
}

export interface ReportRemote {
  enviar(r: Reporte): Promise<void>;
}

const K_PENDIENTES = 'reportes:pendientes';
const K_HECHOS = 'reportes:hechos';
const clave = (tipo: string, semilla: string) => `${tipo}|${semilla}`;

const leer = async (store: Store, k: string) => JSON.parse((await store.getContent(k)) ?? '[]') as unknown[];

/** Id v4 para que reenviar el mismo reporte no lo duplique (no es un secreto: basta con Math.random). */
export const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r % 4) + 8).toString(16);
  });

export function nuevoReporte(datos: Omit<Reporte, 'id' | 'comentario'> & { comentario: string }, id: () => string): Reporte {
  const comentario = datos.comentario.trim().slice(0, 500);
  return { ...datos, id: id(), comentario: comentario || null };
}

/** ¿Ya se reportó esta pregunta desde este móvil? (no se reporta dos veces). */
export const yaReportada = async (store: Store, tipo: string, semilla: string) =>
  (await leer(store, K_HECHOS)).includes(clave(tipo, semilla));

/** Guarda el reporte y lo intenta enviar; sin red queda pendiente (se reintenta al recuperarla). */
export async function reportar(store: Store, remote: ReportRemote, r: Reporte) {
  await store.setContent(K_PENDIENTES, JSON.stringify([...(await leer(store, K_PENDIENTES)), r]));
  await store.setContent(K_HECHOS, JSON.stringify([...(await leer(store, K_HECHOS)), clave(r.tipo, r.semilla)]));
  await enviarPendientes(store, remote);
}

/** Envía los pendientes en orden; se para en el primero que falla y lo deja para la próxima vez. */
export async function enviarPendientes(store: Store, remote: ReportRemote) {
  const pendientes = (await leer(store, K_PENDIENTES)) as Reporte[];
  let enviados = 0;
  for (const r of pendientes) {
    try {
      await remote.enviar(r);
      enviados++;
    } catch {
      break;
    }
  }
  if (enviados) await store.setContent(K_PENDIENTES, JSON.stringify(pendientes.slice(enviados)));
}

/** Envío a Supabase. La app solo puede crear reportes (RLS); reenviar uno ya recibido no es un error. */
export function createSupabaseReports(client: SupabaseClient): ReportRemote {
  return {
    async enviar(r) {
      const { error } = await client.from('reporte').insert(r);
      if (error && error.code !== '23505') throw error;
    },
  };
}
