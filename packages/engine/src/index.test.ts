import { expect, test } from 'vitest';

import { registry, typeCodes } from './index';

test('cada tipo de la taxonomía tiene generador y solucionador del mismo tipo', () => {
  for (const code of typeCodes) {
    expect(registry[code].generator.type).toBe(code);
    expect(registry[code].solver.type).toBe(code);
  }
});
