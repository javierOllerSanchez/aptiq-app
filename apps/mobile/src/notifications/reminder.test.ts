import { createMemoryStore } from '@/data/memory-store';
import { AJUSTE_HOY } from '@/progress/data';

import { AJUSTE_RECORDATORIO, HORAS, planReminders, type ReminderApi, setReminder, syncReminders } from './reminder';

// Fase 6 · T6 (NOT-01). Notificaciones locales; el módulo del sistema está simulado.

const at = (d: number, h: number, m = 0) => new Date(2026, 10, d, h, m).getTime();

function fakeApi(permiso = true) {
  const programadas: number[] = [];
  let canceladas = 0;
  let pedido = 0;
  const api: ReminderApi = {
    async pedirPermiso() {
      pedido++;
      return permiso;
    },
    async cancelarTodo() {
      canceladas++;
      programadas.length = 0;
    },
    async programar(fecha) {
      programadas.push(fecha);
    },
  };
  return {
    api,
    programadas,
    get canceladas() {
      return canceladas;
    },
    get pedido() {
      return pedido;
    },
  };
}

test('las horas son las aprobadas', () => {
  expect(HORAS).toEqual(['08:00', '14:00', '19:00', '21:00']);
});

test('programa los próximos 7 días a la hora elegida', () => {
  const fechas = planReminders('19:00', at(15, 10), false);
  expect(fechas).toHaveLength(7);
  expect(fechas[0]).toBe(at(15, 19));
  expect(fechas[6]).toBe(at(21, 19));
});

test('si la Sesión de hoy ya está hecha, hoy no avisa', () => {
  expect(planReminders('19:00', at(15, 10), true)[0]).toBe(at(16, 19));
});

test('si la hora de hoy ya ha pasado, empieza mañana', () => {
  expect(planReminders('08:00', at(15, 10), false)[0]).toBe(at(16, 8));
});

test('activar pide permiso, guarda la hora y programa; sin permiso no guarda nada', async () => {
  const store = createMemoryStore();
  const ok = fakeApi(true);
  expect(await setReminder(store, ok.api, '21:00', at(15, 10))).toBe(true);
  expect(await store.getSetting(AJUSTE_RECORDATORIO)).toBe('21:00');
  expect(ok.programadas).toHaveLength(7);

  const store2 = createMemoryStore();
  const no = fakeApi(false);
  expect(await setReminder(store2, no.api, '21:00', at(15, 10))).toBe(false);
  expect(await store2.getSetting(AJUSTE_RECORDATORIO)).toBeNull();
  expect(no.programadas).toHaveLength(0);
});

test('desactivar cancela todo y no pide permiso', async () => {
  const store = createMemoryStore();
  const f = fakeApi();
  await setReminder(store, f.api, '21:00', at(15, 10));
  await setReminder(store, f.api, null, at(15, 10));
  expect(f.programadas).toHaveLength(0);
  expect(await store.getSetting(AJUSTE_RECORDATORIO)).toBe('');
  expect(f.pedido).toBe(1);
});

test('al sincronizar tras hacer la sesión, se quita el aviso de hoy', async () => {
  const store = createMemoryStore();
  const f = fakeApi();
  await setReminder(store, f.api, '19:00', at(15, 10));
  await store.setSetting(AJUSTE_HOY, '2026-11-15');
  await syncReminders(store, f.api, at(15, 12));
  expect(f.programadas[0]).toBe(at(16, 19));
});

test('sin recordatorio activo, sincronizar no programa nada ni pide permiso', async () => {
  const f = fakeApi();
  await syncReminders(createMemoryStore(), f.api, at(15, 12));
  expect(f.programadas).toHaveLength(0);
  expect(f.pedido).toBe(0);
});
