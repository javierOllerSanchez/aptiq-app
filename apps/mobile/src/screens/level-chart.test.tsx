import type { WeekLevel } from '@aptiq/engine';

import { nivelTexto, resumenGrafico } from './level-chart';

// Fase 6 · T5 (PRO-01, NFR-04): el gráfico se lee como texto.

const s = (global: number): WeekLevel => ({ semana: '2026-11-09', global, porAptitud: {} });

test('el nivel se escribe con coma decimal', () => {
  expect(nivelTexto(2.75)).toBe('2,8');
  expect(nivelTexto(3)).toBe('3,0');
});

test('el resumen dice los valores y la tendencia', () => {
  expect(resumenGrafico([s(2), s(2.3), s(2.5)])).toBe(
    'Nivel global en las últimas 3 semanas: 2,0; 2,3 y 2,5 de 5. Sube.',
  );
  expect(resumenGrafico([s(3), s(2)])).toMatch(/Baja\.$/);
  expect(resumenGrafico([s(3), s(3)])).toMatch(/Se mantiene\.$/);
  expect(resumenGrafico([])).toBe('Sin datos de nivel.');
});
