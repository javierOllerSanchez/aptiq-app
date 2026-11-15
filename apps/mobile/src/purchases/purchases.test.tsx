import { render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { CustomerInfo } from 'react-native-purchases';

import { planDe, resultadoDe } from './api';
import { createLocalPurchases } from './local';
import { PurchasesProvider, usePlan } from './provider';

// Fase 7 · T2 (PAY-01, PAY-02, PAY-03).

jest.mock('@/auth/provider', () => ({ useAuth: () => ({ session: null }) }));

const info = (activo: object | null) =>
  ({ entitlements: { active: activo ? { premium: activo } : {} }, managementURL: 'https://tienda' }) as unknown as CustomerInfo;

test('Premium sale solo del permiso «premium» de RevenueCat', () => {
  expect(planDe(info(null))).toEqual({ premium: false, hasta: null, renueva: false, gestionUrl: 'https://tienda' });
  expect(planDe(info({ expirationDate: '2026-12-15T10:00:00Z', willRenew: true }))).toEqual({
    premium: true,
    hasta: Date.parse('2026-12-15T10:00:00Z'),
    renueva: true,
    gestionUrl: 'https://tienda',
  });
});

test('los errores de compra se traducen a algo que se puede explicar', () => {
  expect(resultadoDe({ userCancelled: true })).toBe('cancelada');
  expect(resultadoDe({ code: '20' })).toBe('pendiente');
  expect(resultadoDe({ code: '10' })).toBe('sin-red');
  expect(resultadoDe(new Error('x'))).toBe('error');
});

test('modo local: comprar un pase da Premium sin renovación y avisa a quien escucha', async () => {
  const api = createLocalPurchases();
  const vistos: boolean[] = [];
  api.escuchar((p) => vistos.push(p.premium));
  const { resultado, plan } = await api.comprar('tres-meses');
  expect(resultado).toBe('ok');
  expect(plan).toMatchObject({ premium: true, renueva: false });
  expect(vistos).toEqual([true]);
  expect((await api.comprar('anual')).plan.renueva).toBe(true);
  expect((await api.comprar('no-existe')).resultado).toBe('error');
});

test('el proveedor reparte el plan y lo actualiza al comprar', async () => {
  const api = createLocalPurchases();
  function Estado() {
    return <Text>{usePlan().plan.premium ? 'premium' : 'gratis'}</Text>;
  }
  await render(
    <PurchasesProvider api={api}>
      <Estado />
    </PurchasesProvider>,
  );
  expect(await screen.findByText('gratis')).toBeTruthy();
  await api.comprar('mensual');
  await waitFor(() => expect(screen.getByText('premium')).toBeTruthy());
});
