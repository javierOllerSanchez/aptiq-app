import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { HOY_PREGUNTAS } from '@aptiq/engine';

import type { ReminderApi } from './reminder';

const CANAL = 'recordatorio';

/** Notificaciones locales con `expo-notifications` (NOT-01). Sin servidor ni cuenta. */
// El canal se crea también al programar: el ajuste se sincroniza y otro móvil puede programar sin haber pedido permiso aquí.
async function canal() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: 'Recordatorio diario',
      importance: AndroidImportance.DEFAULT,
    });
  }
}

export const expoReminderApi: ReminderApi = {
  async pedirPermiso() {
    await canal();
    const actual = await Notifications.getPermissionsAsync();
    if (actual.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  },
  cancelarTodo: () => Notifications.cancelAllScheduledNotificationsAsync(),
  async programar(fecha) {
    await canal();
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Sesión de hoy', body: `Tienes ${HOY_PREGUNTAS} preguntas preparadas para hoy.` },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fecha, channelId: CANAL },
    });
  },
};
