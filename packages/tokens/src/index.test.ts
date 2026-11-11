import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

import { tokens } from './index';

test('los tokens coinciden con docs/tokens.json (fuente única)', () => {
  const url = new URL('../../../docs/tokens.json', import.meta.url);
  const fuente = JSON.parse(readFileSync(url, 'utf8'));
  delete fuente.$description;
  expect(tokens).toStrictEqual(fuente);
});
