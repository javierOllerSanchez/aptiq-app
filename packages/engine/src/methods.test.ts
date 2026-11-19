import { expect, test } from 'vitest';

import { methods } from './methods';
import { taxonomy, typeCodes } from './taxonomy';

test.each(typeCodes)('el tipo %s tiene ficha de método completa (EXP-04)', (code) => {
  const m = methods[code];
  expect(m.pasos.length).toBeGreaterThanOrEqual(4);
  expect(m.pasos.length).toBeLessThanOrEqual(6);
  for (const p of m.pasos) expect(p.length).toBeGreaterThan(20);
  expect(m.errores.length).toBeGreaterThanOrEqual(2);
  expect(m.truco.length).toBeGreaterThan(30);
  // Sin exclamaciones ni emojis (tono de la guía).
  expect(JSON.stringify(m)).not.toMatch(/[!¡]|\p{Extended_Pictographic}/u);
  expect(taxonomy[code].nombre.length).toBeGreaterThan(0);
});
