import { act, renderHook } from '@testing-library/react-native';
import { AppState, type AppStateStatus } from 'react-native';

import { createExam } from '@aptiq/engine';

import { useExamClock } from './use-exam-clock';

const MIN = 60_000;

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(1_000_000);
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test('muestra los minutos que quedan según el reloj', async () => {
  const state = createExam(80, Date.now(), 55 * MIN);
  const { result } = await renderHook(() => useExamClock(state));
  expect(result.current).toBe(55 * MIN);

  await act(async () => {
    jest.advanceTimersByTime(MIN);
  });
  expect(result.current).toBe(54 * MIN);
});

test('al volver de segundo plano recupera el tiempo real (NFR-03)', async () => {
  let onChange: ((s: AppStateStatus) => void) | undefined;
  jest.spyOn(AppState, 'addEventListener').mockImplementation((_type, cb) => {
    onChange = cb;
    return { remove: () => undefined };
  });

  const state = createExam(80, Date.now(), 55 * MIN);
  const { result } = await renderHook(() => useExamClock(state));

  // La app pasa 12 minutos en segundo plano: no corren los temporizadores de JS.
  jest.setSystemTime(Date.now() + 12 * MIN);
  await act(async () => onChange?.('active'));

  expect(result.current).toBe(43 * MIN);
});

test('llega a cero y no baja de cero', async () => {
  const state = createExam(80, Date.now(), 55 * MIN);
  const { result } = await renderHook(() => useExamClock(state));
  await act(async () => {
    jest.advanceTimersByTime(70 * MIN);
  });
  expect(result.current).toBe(0);
});
