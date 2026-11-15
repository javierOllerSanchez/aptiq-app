import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import type { ReminderApi } from './reminder';

const CANAL = 'recordatorio';

/** Notificaciones locales con `expo-notifications` (NOT-01). Sin servidor ni cuenta. */
export const expoReminderApi: ReminderApi = {
  async pedirPermiso() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CANAL, {
        name: 'Recordatorio diario',
        importance: AndroidImportance.DEFAULT,
      });
    }
    const actual = await Notifications.getPermissionsAsync();
    if (actual.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  },
  cancelarTodo: () => Notifications.cancelAllScheduledNotificationsAsync(),
  async programar(fecha) {
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Sesión de hoy', body: 'Tienes 12 preguntas preparadas para hoy.' },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fecha, channelId: CANAL },
    });
  },
};
