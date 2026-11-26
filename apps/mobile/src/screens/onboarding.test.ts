import { finDeMes } from './onboarding';

test('el mes del examen se guarda como su último día', () => {
  expect(finDeMes('2027-06')).toBe('2027-06-30');
  expect(finDeMes('2028-02')).toBe('2028-02-29');
  expect(finDeMes('2027-02')).toBe('2027-02-28');
  expect(finDeMes('2026-12')).toBe('2026-12-31');
});
