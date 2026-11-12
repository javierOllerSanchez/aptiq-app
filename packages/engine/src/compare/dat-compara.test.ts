import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { datCompara } from './dat-compara';
import { countEqual, datComparaSolver } from './dat-compara.solver';

generatorSuite(datCompara, datComparaSolver);

test('cuenta solo las filas idénticas', () => {
  expect(
    countEqual([
      { left: 'A4K9', right: 'A4K9' },
      { left: '58271', right: '58721' },
      { left: 'B08S', right: '808S' },
    ]),
  ).toBe(1);
});

test('las filas marcadas como distintas lo son de verdad (ningún cambio se anula)', () => {
  for (let i = 0; i < 500; i++)
    for (const level of [1, 3, 5] as const) {
      const item = datCompara.generate(`c${i}`, level, 4);
      const notes = item.explanation.apply.match(/fila \d+/g) ?? [];
      expect(item.stem.rows.length - notes.length).toBe(countEqual(item.stem.rows));
    }
});

test('en las columnas de solo cifras nunca aparece una letra', () => {
  for (let i = 0; i < 500; i++) {
    const item = datCompara.generate(`l${i}`, 5, 4);
    for (const r of item.stem.rows) if (/^\d+$/.test(r.left)) expect(r.right, r.left).toMatch(/^\d+$/);
  }
});
