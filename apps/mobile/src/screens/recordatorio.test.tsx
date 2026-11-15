import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { createMemoryStore } from '@/data/memory-store';
import { AJUSTE_RECORDATORIO } from '@/notifications/reminder';

import { Recordatorio } from './recordatorio';

// Fase 6 · T6 (NOT-01). Sistema de notificaciones simulado.

const mockApi = { pedirPermiso: jest.fn(async () => true), cancelarTodo: jest.fn(async () => {}), programar: jest.fn(async () => {}) };
jest.mock('@/notifications/expo-api', () => ({
  get expoReminderApi() {
    return mockApi;
  },
}));
jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => jest.requireActual('react').useEffect(cb, [cb]),
}));
let mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));

beforeEach(() => {
  mockStore = createMemoryStore();
  jest.clearAllMocks();
});

test('desactivado por defecto: sin horas visibles', async () => {
  await render(<Recordatorio />);
  expect(await screen.findByRole('switch', { name: 'Recordatorio diario' })).toHaveProp('value', false);
  expect(screen.queryByRole('radio')).toBeNull();
});

test('al activarlo pide permiso, guarda las 19:00 y deja elegir otra hora', async () => {
  await render(<Recordatorio />);
  await fireEvent(await screen.findByRole('switch', { name: 'Recordatorio diario' }), 'valueChange', true);
  await waitFor(async () => expect(await mockStore.getSetting(AJUSTE_RECORDATORIO)).toBe('19:00'));
  expect(mockApi.pedirPermiso).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('radio', { name: 'A las 19:00' })).toBeChecked();
  await fireEvent.press(screen.getByRole('radio', { name: 'A las 08:00' }));
  await waitFor(async () => expect(await mockStore.getSetting(AJUSTE_RECORDATORIO)).toBe('08:00'));
});

test('sin permiso lo explica y no lo activa', async () => {
  mockApi.pedirPermiso.mockResolvedValueOnce(false);
  await render(<Recordatorio />);
  await fireEvent(await screen.findByRole('switch', { name: 'Recordatorio diario' }), 'valueChange', true);
  expect(await screen.findByText(/Sin permiso para avisarte/)).toBeOnTheScreen();
  expect(await mockStore.getSetting(AJUSTE_RECORDATORIO)).toBeNull();
});
