import { mesCorto } from './fecha-examen';

// Cuenta v2 (2026-11-25): la fecha del examen se enseña como mes y año.

test('mes y año cortos, o nada si no hay fecha válida', () => {
  expect(mesCorto('2027-03-31')).toBe('mar 2027');
  expect(mesCorto('')).toBeNull();
  expect(mesCorto(null)).toBeNull();
});
