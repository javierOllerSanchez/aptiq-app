import type { Store } from '@/data/store';
import { AJUSTE_HOY, diaLocal } from '@/progress/data';

/** Horas fijas del recordatorio (prototipo aprobado, docs/prototipos/cuenta-recordatorio.html). */
export const HORAS = ['08:00', '14:00', '19:00', '21:00'] as const;
export type Hora = (typeof HORAS)[number];

/** Hora elegida («HH:MM») o vacío si está desactivado. Es un ajuste: se sincroniza con la cuenta. */
export const AJUSTE_RECORDATORIO = 'recordatorio';
const DIAS = 7;

/** Lo justo del sistema de notificaciones (en la app, `expo-notifications`; en pruebas, uno falso). */
export interface ReminderApi {
  pedirPermiso(): Promise<boolean>;
  cancelarTodo(): Promise<void>;
  programar(fecha: number): Promise<void>;
}

/**
 * Avisos de los próximos 7 días a `hora` (NOT-01). Se programan uno a uno, y no uno diario
 * repetido, para poder saltarse el de hoy si la Sesión de hoy ya está hecha.
 */
export function planReminders(hora: string, ahora: number, hoyHecha: boolean): number[] {
  const [h, m] = hora.split(':').map(Number) as [number, number];
  const d = new Date(ahora);
  const out: number[] = [];
  for (let k = 0; out.length < DIAS; k++) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + k, h, m).getTime();
    if (t <= ahora || (k === 0 && hoyHecha)) continue;
    out.push(t);
  }
  return out;
}

/** Vuelve a programar según el ajuste guardado. Se llama al abrir la app y al terminar una sesión. */
export async function syncReminders(store: Store, api: ReminderApi, ahora: number = Date.now()): Promise<void> {
  const hora = await store.getSetting(AJUSTE_RECORDATORIO);
  if (!hora) return;
  const hoyHecha = (await store.getSetting(AJUSTE_HOY)) === diaLocal(ahora);
  await api.cancelarTodo();
  for (const t of planReminders(hora, ahora, hoyHecha)) await api.programar(t);
}

/**
 * Activa (con una hora) o desactiva (null) el recordatorio. El permiso del sistema se pide solo al
 * activarlo; si se deniega, no se guarda nada y devuelve false.
 */
export async function setReminder(
  store: Store,
  api: ReminderApi,
  hora: Hora | null,
  ahora: number = Date.now(),
): Promise<boolean> {
  if (hora === null) {
    await api.cancelarTodo();
    await store.setSetting(AJUSTE_RECORDATORIO, '');
    return true;
  }
  if (!(await api.pedirPermiso())) return false;
  await store.setSetting(AJUSTE_RECORDATORIO, hora);
  await syncReminders(store, api, ahora);
  return true;
}
