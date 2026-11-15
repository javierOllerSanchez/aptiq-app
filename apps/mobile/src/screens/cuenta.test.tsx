import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMemoryStore } from '@/data/memory-store';

import { Cuenta } from './cuenta';
import { Historial } from './historial';

// Fase 5 · T5 (ONB-03, PRO-02). Router y sesión simulados.

const mockPush = jest.fn();
const mockNavigate = jest.fn();
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  router: { push: (...a: unknown[]) => mockPush(...a), navigate: (...a: unknown[]) => mockNavigate(...a), replace: (...a: unknown[]) => mockReplace(...a) },
  useFocusEffect: (cb: () => void | (() => void)) => jest.requireActual('react').useEffect(cb, [cb]),
}));

let mockAuth: Record<string, unknown> = {};
jest.mock('@/auth/provider', () => ({ useAuth: () => mockAuth }));

let mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};
const wrap = (ui: React.ReactElement) => render(<SafeAreaProvider initialMetrics={metrics}>{ui}</SafeAreaProvider>);

const q = { type: 'NUM.SERIE' as const, level: 2 as const, seed: 'x', answer: 0, marked: false };

beforeEach(() => {
  mockPush.mockClear();
  mockNavigate.mockClear();
  mockStore = createMemoryStore();
});

test('sin Supabase configurado lo dice y no ofrece crear cuenta', async () => {
  mockAuth = { auth: null, session: null, status: { lastSync: null, pending: 0 }, syncNow: () => {} };
  await wrap(<Cuenta />);
  expect(screen.getByText(/no están disponibles/)).toBeOnTheScreen();
  expect(screen.queryByRole('button', { name: 'Enviar código' })).toBeNull();
});

test('invitación: avisa de lo que se subirá, envía el código y pasa a la pantalla del código', async () => {
  await mockStore.saveSession({ id: 's1', creada: 1, questions: [q] });
  const sendCode = jest.fn(async () => ({ ok: true }));
  mockAuth = { auth: { sendCode }, session: null, status: { lastSync: null, pending: 0 }, syncNow: () => {} };
  await wrap(<Cuenta />);

  expect(await screen.findByText(/0 simulacros y 1 sesión/)).toBeOnTheScreen();
  await fireEvent.changeText(screen.getByLabelText('Correo electrónico'), ' Ana@Correo.es ');
  await fireEvent.press(screen.getByRole('button', { name: 'Enviar código' }));
  await waitFor(() =>
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/codigo', params: { email: 'ana@correo.es' } }),
  );
  await fireEvent.press(screen.getByRole('button', { name: 'Ahora no' }));
  expect(mockNavigate).toHaveBeenCalledWith('/inicio');
});

test('invitación: un error del servidor se explica con texto', async () => {
  const sendCode = jest.fn(async () => ({ ok: false, error: 'demasiados_intentos' }));
  mockAuth = { auth: { sendCode }, session: null, status: { lastSync: null, pending: 0 }, syncNow: () => {} };
  await wrap(<Cuenta />);
  await fireEvent.changeText(screen.getByLabelText('Correo electrónico'), 'ana@correo.es');
  await fireEvent.press(screen.getByRole('button', { name: 'Enviar código' }));
  expect(await screen.findByText(/varios códigos seguidos/)).toBeOnTheScreen();
  expect(mockPush).not.toHaveBeenCalled();
});

test('con sesión: correo, estado de sincronización y cerrar sesión', async () => {
  const signOut = jest.fn(async () => {});
  const syncNow = jest.fn();
  mockAuth = {
    auth: { signOut },
    session: { user: { email: 'ana@correo.es' } },
    status: { lastSync: null, pending: 2 },
    syncNow,
  };
  await wrap(<Cuenta />);
  expect(screen.getByText('ana@correo.es')).toBeOnTheScreen();
  expect(screen.getByText('2 cambios pendientes de subir')).toBeOnTheScreen();
  expect(syncNow).toHaveBeenCalled();
  await fireEvent.press(screen.getByRole('button', { name: /Cerrar sesión/ }));
  await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
});

test('borrar cuenta: pide confirmación y, al confirmar, borra y vuelve al principio', async () => {
  const deleteAccount = jest.fn(async () => ({ ok: true }));
  mockAuth = {
    auth: { deleteAccount },
    session: { user: { email: 'ana@correo.es' } },
    status: { lastSync: 1, pending: 0 },
    syncNow: () => {},
  };
  await wrap(<Cuenta />);
  await fireEvent.press(screen.getByRole('button', { name: /^Borrar cuenta, Elimina/ }));
  expect(deleteAccount).not.toHaveBeenCalled();
  expect(screen.getByText('¿Borrar tu cuenta?')).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', { name: 'Borrar cuenta' }));
  await waitFor(() => expect(deleteAccount).toHaveBeenCalledTimes(1));
  expect(mockReplace).toHaveBeenCalledWith('/onboarding');
});

test('Historial vacío lo explica', async () => {
  await wrap(<Historial />);
  expect(await screen.findByText(/cuando termines el primero/)).toBeOnTheScreen();
});

test('Historial lista la práctica y abre su revisión', async () => {
  await mockStore.saveSession({ id: 's1', creada: Date.UTC(2026, 10, 14, 10), questions: [q] });
  await wrap(<Historial />);
  const fila = await screen.findByRole('button', { name: /Práctica · 1 pregunta/ });
  await fireEvent.press(fila);
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/repasar', params: { sesion: 's1' } });
});

test('sin test de nivel, Historial no inventa un nivel', async () => {
  await wrap(<Historial />);
  expect(await screen.findByText(/cuando termines el primero/)).toBeOnTheScreen();
  expect(screen.queryByLabelText(/^Nivel global/)).toBeNull();
});

test('Historial abre con «Tu nivel»: nivel global, gráfico legible y nivel por aptitud', async () => {
  await mockStore.setSetting('niveles', JSON.stringify({ 'NUM.CALC': 2, 'NUM.SERIE': 2, 'VER.ORDEN': 2 }));
  await wrap(<Historial />);
  expect(await screen.findByLabelText('Nivel global 2,0 de 5')).toBeOnTheScreen();
  expect(screen.getByLabelText(/^Nivel global en las últimas 4 semanas/)).toBeOnTheScreen();
  expect(screen.getByRole('button', { name: /^Numérica, nivel 2,0 de 5/ })).toBeOnTheScreen();
});
