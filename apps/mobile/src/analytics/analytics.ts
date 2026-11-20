import Constants from 'expo-constants';
import { Platform } from 'react-native';

import type { Store } from '@/data/store';

/**
 * Datos de uso con permiso (NFR-05). Prototipo aprobado: docs/prototipos/consentimiento.html.
 * Sin permiso no sale nada; sin clave tampoco. Lista cerrada de eventos, sin correo ni respuestas.
 * Se usa la API de captura de PostHog (servidor en la UE) directamente, sin su SDK.
 */
export const EVENTOS = [
  'onboarding_terminado',
  'sesion_terminada',
  'simulacro_empezado',
  'simulacro_entregado',
  'muro_visto',
  'compra_hecha',
  'error_reportado',
] as const;
export type Evento = (typeof EVENTOS)[number];

export const HOST = 'https://eu.i.posthog.com';
// Caché local que no se sincroniza: el permiso y el identificador anónimo son de este móvil.
const K_PERMISO = 'analitica:permiso';
const K_ID = 'analitica:id';

/** null: aún no ha contestado (cuenta como «no»). */
export async function permisoAnalitica(store: Store): Promise<boolean | null> {
  const v = await store.getContent(K_PERMISO);
  return v === null ? null : v === '1';
}

/** Retirar el permiso también olvida el identificador: si vuelve a aceptar, es otro. */
export async function setPermisoAnalitica(store: Store, si: boolean) {
  await store.setContent(K_PERMISO, si ? '1' : '0');
  if (!si) await store.setContent(K_ID, '');
}

const nuevoId = () =>
  'a-' + Array.from({ length: 4 }, () => Math.floor(Math.random() * 0x100000000).toString(36)).join('');

/** Envía un evento si hay permiso y clave. Nunca lanza: la analítica no puede romper la app. */
export async function track(store: Store, evento: Evento) {
  try {
    const clave = process.env.EXPO_PUBLIC_POSTHOG_KEY;
    if (!clave || (await permisoAnalitica(store)) !== true) return;
    let id = await store.getContent(K_ID);
    if (!id) await store.setContent(K_ID, (id = nuevoId()));
    // shortcut: sin red el evento se pierde (no hay cola); basta para la beta, añadir cola si faltan datos.
    await fetch(`${HOST}/i/v0/e/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: clave,
        event: evento,
        distinct_id: id,
        properties: {
          version: Constants.expoConfig?.version ?? null,
          os: Platform.OS,
          $process_person_profile: false,
          $geoip_disable: true,
        },
      }),
    });
  } catch {
    // Sin red o sin servidor: se ignora.
  }
}
