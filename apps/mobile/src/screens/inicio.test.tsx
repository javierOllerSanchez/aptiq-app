import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMemoryStore } from '@/data/memory-store';
import { diaLocal } from '@/progress/data';

import { Inicio } from './inicio';

// Fase 6 · T7 (ENT-02, PRO-03): racha, cuenta atrás y Sesión de hoy en Inicio.

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: (cb: () => void) => jest.requireActual('react').useEffect(cb, [cb]),
}));
let mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));

const metrics = { frame: { x: 0, y: 0, width: 390, height: 844 }, insets: { top: 59, left: 0, right: 0, bottom: 34 } };
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
  expect(await screen.findByText('Racha · 2 días')).toBeOnTheScreen();
  expect(screen.getByText('Faltan 10 días para el examen.')).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: /^Sesión de hoy, 12 preguntas/ })).toBeOnTheScreen();
});

test('sin fecha de examen no hay cuenta atrás', async () => {
  mockStore = createMemoryStore();
  await render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Inicio />
    </SafeAreaProvider>,
  );
  expect(await screen.findByRole('button', { name: /^Sesión de hoy/ })).toBeOnTheScreen();
  expect(screen.queryByText(/para el examen/)).toBeNull();
});
