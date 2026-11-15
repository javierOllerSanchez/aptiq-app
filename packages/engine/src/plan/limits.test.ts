import fc from 'fast-check';
import { expect, test } from 'vitest';

import { addDays } from '../review/spaced';
import { typeCodes } from '../taxonomy';
import { allowance, TIPOS_GRATIS } from './limits';

// Fase 7 · T1 (PAY-01, tabla «Monetización»): qué permite el plan gratuito.

const base = { premium: false, hoy: '2026-11-18', sesionHoyHecha: false, diasSimulacro: [] };

test('gratis: tres tipos básicos, 1 Sesión de hoy al día y 1 simulacro a la semana', () => {
  expect(TIPOS_GRATIS).toEqual(['NUM.SERIE', 'DAT.COMPARA', 'VER.ORDEN']);
  const a = allowance(base);
  expect(a).toEqual({ sesionHoy: true, simulacro: true, proximoSimulacro: null, tipos: TIPOS_GRATIS });
});

test('gratis: la Sesión de hoy vuelve al día siguiente', () => {
  expect(allowance({ ...base, sesionHoyHecha: true }).sesionHoy).toBe(false);
  expect(allowance({ ...base, sesionHoyHecha: false }).sesionHoy).toBe(true);
});

test('gratis: el simulacro vuelve el lunes siguiente (semana de lunes a domingo)', () => {
  const a = allowance({ ...base, diasSimulacro: ['2026-11-16'] }); // lunes de la misma semana
  expect(a.simulacro).toBe(false);
  expect(a.proximoSimulacro).toBe('2026-11-23');
  expect(allowance({ ...base, diasSimulacro: ['2026-11-15'] }).simulacro).toBe(true); // domingo anterior
  expect(allowance({ ...base, hoy: '2026-11-23', diasSimulacro: ['2026-11-22'] }).simulacro).toBe(true); // ya es el lunes siguiente
});

test('Premium: todo abierto, sin límites', () => {
  const a = allowance({ ...base, premium: true, sesionHoyHecha: true, diasSimulacro: ['2026-11-18'] });
  expect(a).toEqual({ sesionHoy: true, simulacro: true, proximoSimulacro: null, tipos: typeCodes });
});

test('propiedad: con un simulacro hecho, el próximo es siempre un lunes de 1 a 7 días después', () => {
  fc.assert(
    fc.property(fc.integer({ min: 0, max: 3000 }), fc.integer({ min: 0, max: 6 }), (n, k) => {
      const hoy = addDays('2020-01-06', n); // 2020-01-06 fue lunes
      const lunes = addDays('2020-01-06', n - (n % 7));
      const a = allowance({ ...base, hoy, diasSimulacro: [addDays(lunes, Math.min(k, n % 7))] });
      expect(a.simulacro).toBe(false);
      expect(a.proximoSimulacro).toBe(addDays(lunes, 7));
    }),
  );
});
