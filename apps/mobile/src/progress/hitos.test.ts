import { hitos, hitosNuevos, rachaMasLarga } from './hitos';

const base = {
  simulacros: 0,
  minimoAlcanzado: false,
  mejorNota: null,
  notaMinima: 12,
  diasPractica: [],
  totalRespondidas: 0,
  mejorNivel: 1,
};

test('la racha más larga cuenta días seguidos aunque haya huecos y el orden no importe', () => {
  expect(rachaMasLarga([])).toBe(0);
  expect(rachaMasLarga(['2026-11-25', '2026-11-23', '2026-11-24', '2026-11-20'])).toBe(3);
  expect(rachaMasLarga(['2026-12-31', '2027-01-01'])).toBe(2);
});

test('sin datos no hay ningún hito conseguido', () => {
  expect(hitos(base).filter((h) => h.conseguido)).toEqual([]);
});

test('cada hito se consigue con su dato y lleva su progreso', () => {
  const h = hitos({
    ...base,
    simulacros: 1,
    mejorNota: 9,
    diasPractica: ['2026-11-23', '2026-11-24', '2026-11-25'],
    totalRespondidas: 96,
    mejorNivel: 3.1,
  });
  const por = Object.fromEntries(h.map((x) => [x.id, x]));
  expect(por['primer-simulacro']!.conseguido).toBe(true);
  expect(por['racha-3']!.conseguido).toBe(true);
  expect(por['racha-7']!.progreso).toBeCloseTo(3 / 7);
  expect(por['preguntas-100']!.progreso).toBeCloseTo(0.96);
  expect(por['nivel-3']!.conseguido).toBe(true);
  expect(por['nota-minima']!.progreso).toBeCloseTo(9 / 12);
  expect(por['nota-minima']!.conseguido).toBe(false);
});

test('un hito conseguido no se pierde aunque su dato salga de la ventana', () => {
  const h = hitos({ ...base, mejorNivel: 2, vistos: ['nivel-3'] });
  expect(h.find((x) => x.id === 'nivel-3')!.conseguido).toBe(true);
});

test('solo son nuevos los conseguidos que no se han celebrado', () => {
  const h = hitos({ ...base, simulacros: 1, minimoAlcanzado: true });
  expect(hitosNuevos(h, ['primer-simulacro']).map((x) => x.id)).toEqual(['nota-minima']);
});
