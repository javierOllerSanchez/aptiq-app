import type { AuthErrorReason } from './session';

/** Textos aprobados en el prototipo (docs/prototipos/cuenta-codigo.html). */
export const AUTH_MESSAGES: Record<AuthErrorReason, string> = {
  correo_no_valido: 'Revisa el correo: parece que falta algo.',
  codigo_no_valido: 'Ese código no vale. Revisa el último correo o pide otro.',
  demasiados_intentos: 'Has pedido varios códigos seguidos. Espera unos minutos.',
  sin_red: 'No hay conexión. Tu progreso sigue guardado en el móvil.',
  desconocido: 'No se ha podido completar. Inténtalo de nuevo en un momento.',
};

/** «hace 2 min» desde la última sincronización correcta. */
export function haceCuanto(desde: number, ahora: number): string {
  const min = Math.floor((ahora - desde) / 60_000);
  if (min < 1) return 'ahora mismo';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} ${d === 1 ? 'día' : 'días'}`;
}

/** Frase de estado de la tarjeta de sincronización. */
export function estadoSync(pending: number, lastSync: number | null): string {
  if (pending > 0) return pending === 1 ? '1 cambio pendiente de subir' : `${pending} cambios pendientes de subir`;
  return lastSync === null ? 'Sincronizando…' : 'Todo guardado en tu cuenta';
}
