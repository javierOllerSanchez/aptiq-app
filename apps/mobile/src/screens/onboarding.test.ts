import { fechaReal } from './onboarding';

test('la fecha del examen tiene que existir', () => {
  expect(fechaReal('2027-06-15')).toBe(true);
  expect(fechaReal('2028-02-29')).toBe(true);
  expect(fechaReal('2027-02-31')).toBe(false);
  expect(fechaReal('2027-13-01')).toBe(false);
  expect(fechaReal('15/06/2027')).toBe(false);
});
