import { registry } from '@aptiq/engine';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { createMemoryStore } from '@/data/memory-store';
import type { Reporte } from '@/reports/reports';

import { Explicacion } from './explicacion';

// Fase 8 · T9 y T15 (SOP-01, EXP-04).

const mockPush = jest.fn();
jest.mock('expo-router', () => ({ router: { push: (...a: unknown[]) => mockPush(...a) } }));
const mockStore = createMemoryStore();
jest.mock('@/data/provider', () => ({ useStore: () => mockStore }));
const mockEnviados: Reporte[] = [];
jest.mock('@/auth/provider', () => ({
  useAuth: () => ({ reportes: { enviar: async (r: Reporte) => void mockEnviados.push(r) } }),
}));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ bottom: 0 }) }));

const item = registry['ESP.CUBO'].generator.generate('muestra-4-2', 4, 4);

test('las opciones con figura se nombran por su letra en la explicación', async () => {
  await render(<Explicacion item={item} answer={(item.answerIndex + 1) % 4} />);
  expect(screen.getByText(`Incorrecta. La correcta es la ${'ABCD'[item.answerIndex]}.`)).toBeOnTheScreen();
});

test('«Cómo se resuelve este tipo» abre la ficha de método del tipo', async () => {
  await render(<Explicacion item={item} answer={item.answerIndex} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Cómo se resuelve este tipo' }));
  expect(mockPush).toHaveBeenCalledWith({ pathname: '/metodo', params: { tipo: 'ESP.CUBO' } });
});

test('reportar envía la semilla y la versión, y no deja reportar dos veces', async () => {
  const respuesta = (item.answerIndex + 1) % 4;
  await render(<Explicacion item={item} answer={respuesta} />);
  await fireEvent.press(screen.getByRole('button', { name: 'Reportar un error' }));
  const enviar = screen.getByRole('button', { name: 'Enviar' });
  expect(enviar).toBeDisabled(); // sin motivo no se envía
  await fireEvent.press(screen.getByRole('radio', { name: 'Hay más de una respuesta correcta' }));
  await fireEvent.changeText(screen.getByLabelText('Comentario (opcional)'), 'La C también vale');
  await fireEvent.press(enviar);
  expect(await screen.findByText('Error reportado. Gracias.')).toBeOnTheScreen();
  expect(mockEnviados).toEqual([
    expect.objectContaining({
      tipo: 'ESP.CUBO',
      nivel: 4,
      semilla: 'muestra-4-2',
      version: item.meta.generatorVersion,
      opciones: 4,
      respuesta,
      motivo: 'dos_correctas',
      comentario: 'La C también vale',
    }),
  ]);
  expect(screen.queryByRole('button', { name: 'Reportar un error' })).toBeNull();
});
