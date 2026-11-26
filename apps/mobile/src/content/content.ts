import {
  guardiaCivil2026,
  loadBank,
  validateProfile,
  validateVerbal,
  type ExamProfile,
  type VerbalEntry,
} from '@aptiq/engine';

import type { Store } from '@/data/store';

/**
 * Contenido que llega del servidor sin publicar otra versión de la app (fase 8):
 * verbales aprobadas (ADM-01) y el perfil de examen vigente (ADM-03). Se guarda en el móvil
 * para usarlo sin conexión (CON-03).
 */
export interface ContentRemote {
  verbalesAprobadas(): Promise<VerbalEntry[]>;
  ultimoPerfil(id: string): Promise<ExamProfile | null>;
}

const K_VERBALES = 'verbales';
const K_PERFIL = `perfil:${guardiaCivil2026.id}`;

let actual: ExamProfile = guardiaCivil2026;
/** Perfil vigente: el último válido del servidor o, si no hay, el que trae la app. */
export const perfil = () => actual;

/** Lo que un simulacro guarda del perfil con que empezó (ADM-03): con eso se puntúa siempre. */
export type PerfilUsado = Pick<ExamProfile, 'id' | 'version' | 'format'>;
export const instantanea = (): PerfilUsado => ({ id: actual.id, version: actual.version, format: actual.format });
/** Perfil de un simulacro. Sin instantánea (anteriores a la fase 9), el que trae la app: no se había publicado otro. */
export const perfilDe = (a: { perfil?: PerfilUsado }): ExamProfile => ({ ...guardiaCivil2026, ...a.perfil });

/** Solo un perfil del mismo examen, válido y no más antiguo que el de la app. */
const aceptable = (p: ExamProfile) =>
  p.id === guardiaCivil2026.id && p.version >= guardiaCivil2026.version && validateProfile(p).length === 0;

/** Al abrir la app: lo último que se descargó. */
export async function cargarContenido(store: Store) {
  const v = await store.getContent(K_VERBALES);
  if (v) loadBank(JSON.parse(v) as VerbalEntry[]);
  const p = await store.getContent(K_PERFIL);
  if (p && aceptable(JSON.parse(p) as ExamProfile)) actual = JSON.parse(p) as ExamProfile;
}

/** Con red: descarga, valida y guarda. Devuelve false si no se pudo (se sigue con lo que había). */
export async function actualizarContenido(store: Store, remote: ContentRemote): Promise<boolean> {
  try {
    const nuevas = (await remote.verbalesAprobadas()).filter((e) => validateVerbal(e).length === 0);
    const antes = JSON.parse((await store.getContent(K_VERBALES)) ?? '[]') as VerbalEntry[];
    const ids = new Set(nuevas.map((e) => e.id));
    // Las que ya no están aprobadas se quedan como retiradas: el historial las regenera.
    const todas = [
      ...nuevas.map((e) => ({ ...e, retirada: false })),
      ...antes.filter((e) => !ids.has(e.id)).map((e) => ({ ...e, retirada: true })),
    ];
    await store.setContent(K_VERBALES, JSON.stringify(todas));
    loadBank(todas);

    const p = await remote.ultimoPerfil(guardiaCivil2026.id);
    if (p && aceptable(p)) {
      await store.setContent(K_PERFIL, JSON.stringify(p));
      actual = p;
    }
    return true;
  } catch {
    return false;
  }
}
