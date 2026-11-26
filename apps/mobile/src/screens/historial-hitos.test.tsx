import { render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMemoryStore } from '@/data/memory-store';
import { AJUSTE_HITOS } from '@/progress/hitos';

import { Historial } from './historial';

// Historial v2 (2026-11-25): un hito nuevo trae recompensa; la primera vez se apuntan sin celebrar.

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
const simulacro = {
  id: 'i1',
  empezado: Date.now(),
  durationMs: 1,
  finishedAt: Date.now(),
  questions: [q],
};
const pinta = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <Historial />
    </SafeAreaProvider>,
  );

test('un hito nuevo se celebra con el aviso y se apunta', async () => {
  mockStore = createMemoryStore();
  await mockStore.setSetting(AJUSTE_HITOS, '[]');
  await mockStore.saveAttempt(simulacro);
  await pinta();
  expect(
    await screen.findByLabelText('Hito conseguido. Primer simulacro', {}, { timeout: 2000 }),
  ).toBeOnTheScreen();
  expect(JSON.parse((await mockStore.getSetting(AJUSTE_HITOS))!)).toContain('primer-simulacro');
});

test('la primera vez se apuntan los hitos que ya había, sin aviso', async () => {
  mockStore = createMemoryStore();
  await mockStore.saveAttempt(simulacro);
  await pinta();
  expect(await screen.findByText('Hitos')).toBeOnTheScreen();
  expect(JSON.parse((await mockStore.getSetting(AJUSTE_HITOS))!)).toEqual(['primer-simulacro']);
  expect(screen.queryByText('Hito conseguido')).toBeNull();
});
