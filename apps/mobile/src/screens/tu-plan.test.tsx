import { fireEvent, render, screen } from '@testing-library/react-native';
import { Linking } from 'react-native';

import { type Plan, PLAN_GRATIS } from '@/purchases/api';
import { createLocalPurchases } from '@/purchases/local';

import { detallePlan, TuPlan } from './tu-plan';

// Fase 7 · T6 (PAY-03).

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockPush(...a) } }));
let mockState = { plan: PLAN_GRATIS as Plan, api: createLocalPurchases() };
jest.mock('@/purchases/provider', () => ({ usePlan: () => mockState }));

const hasta = new Date(2026, 11, 15, 12).getTime();

test('el detalle dice si se renueva o hasta cuándo dura el pase', () => {
  expect(detallePlan(PLAN_GRATIS)).toBe('1 Sesión de hoy al día y 1 simulacro a la semana');
  expect(detallePlan({ premium: true, hasta, renueva: true, gestionUrl: null })).toBe(
    'Se renueva el 15 dic 2026',
  );
  expect(detallePlan({ premium: true, hasta, renueva: false, gestionUrl: null })).toBe(
    'Activo hasta el 15 dic 2026, no se renueva',
  );
});

test('plan gratuito: lleva al muro y restaurar sin compras lo explica', async () => {
  mockState = { plan: PLAN_GRATIS, api: createLocalPurchases() };
  await render(<TuPlan />);
  await fireEvent.press(screen.getByRole('button', { name: /^Plan gratuito/ }));
  expect(mockPush).toHaveBeenCalledWith('/muro-pago');
  await fireEvent.press(screen.getByRole('button', { name: 'Restaurar compras' }));
  expect(await screen.findByText(/No hay compras que restaurar/)).toBeOnTheScreen();
});

test('suscripción: gestionar abre la página de la tienda que da RevenueCat', async () => {
  const abrir = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  mockState = {
    plan: { premium: true, hasta, renueva: true, gestionUrl: 'https://tienda/gestion' },
    api: createLocalPurchases(),
  };
  await render(<TuPlan />);
  expect(screen.getByText('Se renueva el 15 dic 2026')).toBeOnTheScreen();
  await fireEvent.press(screen.getByRole('button', { name: /^Gestionar suscripción/ }));
  expect(abrir).toHaveBeenCalledWith('https://tienda/gestion');
});

test('pase: no hay suscripción que gestionar', async () => {
  mockState = {
    plan: { premium: true, hasta, renueva: false, gestionUrl: null },
    api: createLocalPurchases(),
  };
  await render(<TuPlan />);
  expect(screen.queryByRole('button', { name: /^Gestionar suscripción/ })).toBeNull();
});
