import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { createMemoryStore } from '@/data/memory-store';
import type { PurchasesApi } from '@/purchases/api';
import { createLocalPurchases } from '@/purchases/local';
import { tiposDe } from '@/purchases/muro';

import { MuroPago } from './muro-pago';

// Fase 7 · T4 (PAY-01, PAY-02, PAY-03).

const mockRouter = { back: jest.fn(), replace: jest.fn(), canGoBack: () => true };
jest.mock('expo-router', () => ({
  get router() {
    return mockRouter;
  },
}));
let mockApi: PurchasesApi = createLocalPurchases();
jest.mock('@/purchases/provider', () => ({ usePlan: () => ({ api: mockApi }) }));
const mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));

const metrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};
const pintar = () =>
  render(
    <SafeAreaProvider initialMetrics={metrics}>
      <MuroPago />
    </SafeAreaProvider>,
  );

beforeEach(() => {
  mockRouter.back.mockClear();
  mockApi = createLocalPurchases();
});

test('muestra los cuatro planes con el anual elegido y su prueba gratuita', async () => {
  await pintar();
  expect(
    await screen.findByRole('radio', {
      name: 'Anual, 7 días gratis, 3,33 € al mes, 39,99 €',
      checked: true,
    }),
  ).toBeOnTheScreen();
  expect(screen.getAllByRole('radio')).toHaveLength(4);
  expect(screen.getByRole('button', { name: 'Probar 7 días gratis' })).toBeOnTheScreen();
  expect(
    screen.getByText(/Si no cancelas antes de que acaben los 7 días, se cobran 39,99 € al año/),
  ).toBeOnTheScreen();
});

test('al elegir un pase el texto dice que no se renueva, y al comprarlo se cierra', async () => {
  await pintar();
  await fireEvent.press(await screen.findByRole('radio', { name: /^Pase 3 meses/ }));
  expect(screen.getByText(/No se renueva/)).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
  expect(mockRouter.back).toHaveBeenCalled();
});

test('sin red explica qué pasa y no cierra', async () => {
  mockApi = {
    ...createLocalPurchases(),
    comprar: async () => ({
      resultado: 'sin-red',
      plan: { premium: false, hasta: null, renueva: false, gestionUrl: null },
    }),
  };
  await pintar();
  await fireEvent.press(await screen.findByRole('button', { name: 'Probar 7 días gratis' }));
  expect(await screen.findByText(/No hay conexión/)).toBeOnTheScreen();
  expect(mockRouter.back).not.toHaveBeenCalled();
});

test('restaurar sin compras lo dice; la X cierra sin comprar', async () => {
  await pintar();
  await fireEvent.press(await screen.findByRole('button', { name: 'Restaurar compras' }));
  expect(await screen.findByText(/No hay compras que restaurar/)).toBeOnTheScreen();
  await fireEvent.press(
    screen.getByRole('button', { name: 'Cerrar, seguir con el plan gratuito' }),
  );
  expect(mockRouter.back).toHaveBeenCalled();
});

test('tiposDe: abstracta no tiene tipos gratis; numérica solo series', () => {
  const gratis = ['NUM.SERIE', 'DAT.COMPARA', 'VER.ORDEN'] as const;
  expect(tiposDe('abstracta', gratis)).toEqual([]);
  expect(tiposDe('numerica', gratis)).toEqual(['NUM.SERIE']);
});

test('al pie enlaza Términos de uso y Privacidad de la web (Apple, norma 3.1.2)', async () => {
  process.env.EXPO_PUBLIC_WEB_URL = 'https://web.prueba/';
  const abrir = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  await pintar();
  fireEvent.press(await screen.findByRole('link', { name: 'Términos de uso' }));
  fireEvent.press(screen.getByRole('link', { name: 'Privacidad' }));
  expect(abrir.mock.calls.map((c) => c[0])).toEqual([
    'https://web.prueba/terminos.html',
    'https://web.prueba/privacidad.html',
  ]);
  delete process.env.EXPO_PUBLIC_WEB_URL;
});
