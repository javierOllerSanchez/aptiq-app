import { calendario } from './historial';

// Historial v2 (2026-11-25): calendario de constancia.

test('cinco semanas de lunes a domingo que terminan en la semana de hoy', () => {
  const c = calendario('2026-11-25', ['2026-11-25', '2026-11-20', '2026-10-01']); // miércoles
  expect(c).toHaveLength(5);
  expect(c[0]![0]!.dia).toBe('2026-10-26');
  expect(c[4]![6]!.dia).toBe('2026-11-29');
  const dias = c.flat();
  expect(dias.filter((d) => d.hecho).map((d) => d.dia)).toEqual(['2026-11-20', '2026-11-25']);
  expect(dias.find((d) => d.hoy)?.dia).toBe('2026-11-25');
  expect(dias.filter((d) => d.futuro)).toHaveLength(4);
});
