import { buildItem, byNumber, familyNames, type Draft, type Families } from '../build';
import { WORDS } from '../data/words';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import { datComparaSolver, type DatComparaStem } from './dat-compara.solver';

const VERSION = '4';
const TIP =
  'Compara de izquierda a derecha y por bloques cortos (tres o cuatro caracteres), señalando con el dedo. Los cambios más difíciles de ver son dos cifras que intercambian su lugar y las letras que se parecen a cifras (O y 0, I y 1, B y 8, S y 5).';

const LOOKALIKE: Record<string, string> = { O: '0', '0': 'O', I: '1', '1': 'I', B: '8', '8': 'B', S: '5', '5': 'S', Z: '2', '2': 'Z' };
// En columnas solo de cifras, una letra se vería enseguida: se cambia por una cifra parecida.
const DIGIT_LOOKALIKE: Record<string, string> = { '1': '7', '7': '1', '3': '8', '8': '3', '5': '6', '6': '9', '9': '6' };
const CODE_CHARS = 'ABCDEFGHJKLMNPRTUVWXY0123456789';

type Kind = (rng: Rng) => string;
const code =
  (len: number): Kind =>
  (rng) =>
    Array.from({ length: len }, () => rng.pick([...CODE_CHARS])).join('');
const digits =
  (len: number): Kind =>
  (rng) =>
    String(rng.int(1, 9)) + Array.from({ length: len - 1 }, () => rng.int(0, 9)).join('');
const nameNumber: Kind = (rng) => `${rng.pick(WORDS)} ${rng.int(10, 999)}`;
/** Códigos que incluyen a propósito caracteres que se confunden (nivel 5). */
const tricky =
  (len: number): Kind =>
  (rng) =>
    Array.from({ length: len }, () => rng.pick([...'OIBSZ01852ABCDEFGHJKLMN'])).join('');

type Change = { apply: (s: string, rng: Rng) => string | null; describe: string };
const changes: Change[] = [
  {
    describe: 'dos caracteres seguidos cambian de lugar',
    apply: (s, rng) => {
      const i = rng.int(0, s.length - 2);
      return s[i] === s[i + 1] || s[i] === ' ' || s[i + 1] === ' ' ? null : s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
    },
  },
  {
    describe: 'un carácter cambia por otro parecido',
    apply: (s, rng) => {
      const map = /^\d+$/.test(s) ? DIGIT_LOOKALIKE : LOOKALIKE;
      const spots = [...s].flatMap((c, i) => (map[c] ? [i] : []));
      if (spots.length === 0) return null;
      const i = rng.pick(spots);
      return s.slice(0, i) + map[s[i]!] + s.slice(i + 1);
    },
  },
  {
    describe: 'falta un carácter',
    apply: (s, rng) => {
      const i = rng.int(1, s.length - 2);
      return s[i] === ' ' ? null : s.slice(0, i) + s.slice(i + 1);
    },
  },
  {
    describe: 'una cifra cambia',
    apply: (s, rng) => {
      const spots = [...s].flatMap((c, i) => (/\d/.test(c) ? [i] : []));
      if (spots.length === 0) return null;
      const i = rng.pick(spots);
      return s.slice(0, i) + ((Number(s[i]) + rng.int(1, 8)) % 10) + s.slice(i + 1);
    },
  },
];

type Config = { rows: number; kinds: Kind[]; subtle: boolean };

const comparison = (cfg: Config) => (rng: Rng): Draft<DatComparaStem> | null => {
  const kind = rng.pick(cfg.kinds);
  const different = rng.int(1, cfg.rows - 1);
  const differentRows = new Set(rng.shuffle(Array.from({ length: cfg.rows }, (_, i) => i)).slice(0, different));
  // En los niveles altos se prefieren los cambios difíciles de ver (orden y parecidos).
  const pool = cfg.subtle ? [changes[0]!, changes[1]!, changes[0]!, changes[1]!, changes[2]!] : changes;
  const notes: string[] = [];
  const rows: DatComparaStem['rows'] = [];
  for (let i = 0; i < cfg.rows; i++) {
    const left = kind(rng);
    let right = left;
    if (differentRows.has(i)) {
      const order = rng.shuffle(pool);
      const change = order.find((c) => (right = c.apply(left, rng) ?? left) !== left);
      if (!change) return null;
      notes.push(`fila ${i + 1}: ${change.describe} (${left} / ${right})`);
    }
    rows.push({ left, right });
  }
  const equal = cfg.rows - different;
  const table = rows.map((r, i) => `${i + 1}. ${r.left} | ${r.right}`).join('\n');
  return {
    stem: { text: `¿Cuántas filas tienen exactamente los mismos datos en las dos columnas?\n${table}`, rows },
    answer: String(equal),
    distractors: [
      { value: String(equal + 1), error: 'Pasas por alto una de las diferencias y cuentas como igual una fila distinta.' },
      { value: String(equal - 1), error: 'Ves una diferencia donde no la hay y descuentas una fila igual.' },
      { value: String(different), error: 'Cuentas las filas distintas en lugar de las iguales.' },
      { value: String(equal + 2), error: 'Pasas por alto dos diferencias.' },
      { value: String(equal - 2), error: 'Ves dos diferencias donde no las hay.' },
      { value: String(equal + 3), error: 'Pasas por alto tres diferencias.' },
      { value: String(equal - 3), error: 'Ves tres diferencias donde no las hay.' },
    ].filter((d) => Number(d.value) >= 0 && Number(d.value) <= cfg.rows),
    observe: `Hay ${cfg.rows} filas. Compara cada pareja carácter a carácter.`,
    rule: 'Una fila solo cuenta si las dos columnas son idénticas: un carácter cambiado, de menos o fuera de sitio ya la hace distinta.',
    apply: `Diferencias: ${notes.join('; ')}. Filas iguales: ${cfg.rows} − ${different} = ${equal}`,
  };
};

const families: Families<ReturnType<typeof comparison>> = {
  1: { cuatroFilas: comparison({ rows: 4, kinds: [code(4), digits(5)], subtle: false }) },
  2: { cincoFilas: comparison({ rows: 5, kinds: [code(5), digits(6), nameNumber], subtle: false }) },
  3: { seisFilasSutiles: comparison({ rows: 6, kinds: [code(6), digits(7), nameNumber], subtle: true }) },
  4: { sieteFilasSutiles: comparison({ rows: 7, kinds: [code(7), digits(9)], subtle: true }) },
  5: { ochoFilasParecidas: comparison({ rows: 8, kinds: [tricky(7), digits(10)], subtle: true }) },
};

export const datCompara: Generator<DatComparaStem> = {
  type: 'DAT.COMPARA',
  version: VERSION,
  levels,
  families: familyNames(families),
  compareOptions: byNumber,
  generate: (seed, level, optionCount) =>
    buildItem(
      {
        type: 'DAT.COMPARA',
        version: VERSION,
        tip: TIP,
        solver: datComparaSolver,
        compare: byNumber,
        // Las opciones son recuentos seguidos (0, 1, 2…): estar cerca de otras no delata nada.
        avoidCenter: false,
        families,
      },
      seed,
      level,
      optionCount,
    ),
};
