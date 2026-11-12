import { tokens } from '@aptiq/tokens';
import { fontFamily } from '@aptiq/ui';

import { fontAssets } from './fonts';

test('se carga una fuente por cada familia y peso de tokens.type (y la opción marcada a 700)', () => {
  const needed = [
    ...Object.values(tokens.type).map((t) => fontFamily(t.font, t.weight)),
    fontFamily('ui', 700),
  ];
  for (const family of needed) expect(fontAssets).toHaveProperty([family]);
});
