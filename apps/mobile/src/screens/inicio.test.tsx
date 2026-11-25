import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMemoryStore } from '@/data/memory-store';
import { diaLocal } from '@/progress/data';

import { AJUSTE_CELEBRADO, haciaSiguiente, Inicio, semanaDe } from './inicio';

// Fase 6 · T7 (ENT-02, PRO-03): racha, cuenta atrás y Sesión de hoy en Inicio.

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (cb: () => void) => jest.requireActual('react').useEffect(cb, [cb]),
}));
let mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};
const q = { type: 'NUM.SERIE' as const, level: 2 as const, seed: 'x', answer: 0, marked: false };
const dia = (n: number) => Date.now() - n * 86_400_000;

test('muestra racha, cuenta atrás y la Sesión de hoy', async () => {
  mockStore = createMemoryStore();
  await mockStore.setSetting('niveles', JSON.stringify({ 'NUM.SERIE': 2 }));
  await mockStore.setSetting('fecha', diaLocal(dia(-10)));
  await mockStore.saveSession({ id: 'a', creada: dia(1), questions: [q] });
  await mockStore.saveSession({ id: 'b', creada: dia(0), questions: [q] });
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Inicio />
    </SafeAreaProvider>,
  );
  expect(await screen.findByLabelText('Racha de 2 días')).toBeOnTheScreen();
  expect(screen.getByText(/· examen en [a-z]+ de \d{4}$/)).toBeOnTheScreen();
  // Una pregunta hoy: estado intermedio del objetivo (revisión de la ronda 2).
  expect(screen.getByText('Te quedan 11 preguntas para el objetivo')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Empezar sesión de hoy' })).toBeOnTheScreen();
});

test('sin fecha de examen no hay cuenta atrás', async () => {
  mockStore = createMemoryStore();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Inicio />
    </SafeAreaProvider>,
  );
  expect(await screen.findByRole('button', { name: 'Empezar sesión de hoy' })).toBeOnTheScreen();
  expect(screen.queryByText(/examen en/)).toBeNull();
});

test('plan gratuito: candados, Sesión de hoy hecha y simulacro de la semana gastado llevan al muro (fase 7)', async () => {
  mockStore = createMemoryStore();
  await mockStore.setSetting('sesion_hoy', diaLocal(Date.now()));
  await mockStore.saveAttempt({
    id: 'i1',
    empezado: Date.now(),
    durationMs: 1,
    finishedAt: Date.now(),
    questions: [q],
  });
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Inicio />
    </SafeAreaProvider>,
  );
  expect(await screen.findByText(/Próximo gratuito el lunes/)).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Empezar' })).toBeNull();
  expect(screen.getByText('Hecha · vuelve mañana para seguir la racha')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: 'Sesión ilimitada con Premium' })).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', { name: 'Abstracta, incluido en Premium' }));
  expect(router.push).toHaveBeenCalledWith('/muro-pago');
  expect(screen.getByRole('button', { name: /^Numérica, / })).toBeOnTheScreen();
});

// Inicio v2 (2026-11-25): semana, nivel siguiente y recompensa del objetivo de hoy.

test('la semana va de lunes a domingo y marca los días practicados y hoy', () => {
  const s = semanaDe('2026-11-25', ['2026-11-23', '2026-11-25', '2026-11-16']); // miércoles
  expect(s.map((d) => d.letra).join('')).toBe('LMXJVSD');
  expect(s.map((d) => d.hecho)).toEqual([true, false, true, false, false, false, false]);
  expect(s.findIndex((d) => d.hoy)).toBe(2);
});

test('avance hacia el nivel siguiente, y nada en el máximo', () => {
  expect(haciaSiguiente(2.8)).toEqual({
    siguiente: 3,
    falta: expect.closeTo(0.2),
    fraccion: expect.closeTo(0.8),
  });
  expect(haciaSiguiente(5)).toBeNull();
});

test('con 12 preguntas respondidas hoy, la recompensa se apunta una sola vez al día', async () => {
  mockStore = createMemoryStore();
  const doce = Array.from({ length: 12 }, () => q);
  await mockStore.saveSession({ id: 'hoy', creada: Date.now(), questions: doce });
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Inicio />
    </SafeAreaProvider>,
  );
  expect(await screen.findByText('Objetivo cumplido')).toBeOnTheScreen();
  expect(await mockStore.getSetting(AJUSTE_CELEBRADO)).toBe(diaLocal(Date.now()));
});
