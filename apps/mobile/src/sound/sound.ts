import { type AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

import type { Store } from '@/data/store';

/** Ajuste local: «0» apaga los sonidos; sin valor, encendidos. */
export const AJUSTE_SONIDOS = 'sonidos';

// Sonidos propios generados con scripts/sonidos.py (sin licencias de terceros).
const FUENTES = {
  objetivo: require('../../assets/sonidos/objetivo.wav'),
  acierto: require('../../assets/sonidos/acierto.wav'),
  simulacro: require('../../assets/sonidos/simulacro.wav'),
} as const;

export type Sonido = keyof typeof FUENTES;

const reproductores: Partial<Record<Sonido, AudioPlayer>> = {};
let modoListo: Promise<void> | null = null;

export async function sonidosActivos(store: Store) {
  return (await store.getSetting(AJUSTE_SONIDOS)) !== '0';
}

/**
 * Suena una recompensa si el ajuste lo permite. Respeta el modo silencio en iOS; en Android suena
 * con el volumen multimedia (el sistema no deja saber si está en silencio). Se mezcla con la
 * música del móvil en vez de cortarla. Un fallo de audio nunca rompe la pantalla.
 */
export async function sonar(store: Store, sonido: Sonido) {
  try {
    if (!(await sonidosActivos(store))) return;
    modoListo ??= setAudioModeAsync({
      playsInSilentMode: false,
      interruptionMode: 'mixWithOthers',
    });
    await modoListo;
    const p = (reproductores[sonido] ??= createAudioPlayer(FUENTES[sonido]));
    await p.seekTo(0);
    p.play();
  } catch {
    // shortcut: sin registro del error; si un sonido falla, la app sigue igual. Añadir Sentry si se repite.
  }
}
