import { AUTH_MESSAGES, estadoSync, haceCuanto } from './messages';

test('cada motivo de error tiene un texto sin exclamaciones', () => {
  for (const text of Object.values(AUTH_MESSAGES)) {
    expect(text.length).toBeGreaterThan(0);
    expect(text).not.toMatch(/[!¡]/);
  }
});

test('tiempo desde la última sincronización', () => {
  const t = 1_000_000_000;
  expect(haceCuanto(t, t + 30_000)).toBe('ahora mismo');
  expect(haceCuanto(t, t + 2 * 60_000)).toBe('hace 2 min');
  expect(haceCuanto(t, t + 3 * 3_600_000)).toBe('hace 3 h');
  expect(haceCuanto(t, t + 26 * 3_600_000)).toBe('hace 1 día');
});

test('estado de sincronización', () => {
  expect(estadoSync(0, 5)).toBe('Todo guardado en tu cuenta');
  expect(estadoSync(0, null)).toBe('Sincronizando…');
  expect(estadoSync(1, 5)).toBe('1 cambio pendiente de subir');
  expect(estadoSync(4, null)).toBe('4 cambios pendientes de subir');
});
