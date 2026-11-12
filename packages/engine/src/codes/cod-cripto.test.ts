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

test.each([1, 2, 3] as const)(
  'nivel %i: la correcta no se adivina por ser «la que más se parece a las demás»',
  (level) => {
    // Estrategia de quien no resuelve: elegir la opción con más caracteres en la misma posición
    // que las demás (si todos los distractores son una sola modificación de la correcta, acierta).
    let hits = 0;
    const N = 3_000;
    for (let i = 0; i < N; i++) {
      const item = codCripto.generate(`k${i}`, level, 4);
      const score = item.options.map((o) =>
        item.options.reduce((acc, p) => acc + [...o].filter((c, j) => p[j] === c).length, 0),
      );
      const best = Math.max(...score);
      const winners = score.flatMap((s, j) => (s === best ? [j] : []));
      if (winners.includes(item.answerIndex)) hits += 1 / winners.length;
    }
    expect(hits / N).toBeLessThan(1.5 / 4);
  },
);
