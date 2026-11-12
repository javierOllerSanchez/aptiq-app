import { expect, test } from 'vitest';

import { generatorSuite } from '../../test/suite';

import { codCripto } from './cod-cripto';
import { codCriptoSolver, predictCodes } from './cod-cripto.solver';

generatorSuite(codCripto, codCriptoSolver);

test('sustitución por cifras: CASA = 3121 → SACA = 2131', () => {
  expect(predictCodes([{ plain: 'CASA', code: '3121' }], 'SACA')).toEqual(new Set(['2131']));
});

test('desplazamiento +1 contando la Ñ: MONO → NPÑP', () => {
  // M→N, O→P, N→Ñ, O→P
  expect(predictCodes([{ plain: 'GATO', code: 'HBUP' }], 'MONO')).toContain('NPÑP');
});

test('desplazamiento alterno +2 / −1', () => {
  expect(predictCodes([{ plain: 'PERRO', code: 'RDTQQ' }], 'TORO')).toEqual(new Set(['VÑTÑ']));
  // Sin vuelta al alfabeto: la A no puede retroceder, así que MESA no tiene código.
  expect(predictCodes([{ plain: 'PERRO', code: 'RDTQQ' }], 'MESA').size).toBe(0);
});

test('si la palabra usa una letra que no aparece en el ejemplo, la sustitución no la adivina', () => {
  expect(predictCodes([{ plain: 'CASA', code: '3121' }], 'COSA').size).toBe(0);
});
