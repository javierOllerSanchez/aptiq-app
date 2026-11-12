import { buildItem, familyNames, type Draft, type Families } from '../build';
import { WORDS } from '../data/words';
import type { Rng } from '../rng';
import { ALPHABET } from '../series/alphabet';
import { levels, type Generator } from '../types';

import { verOrdenSolver, type VerOrdenStem } from './ver-orden.solver';

const VERSION = '2';
const TIP =
  'Compara primero la letra inicial; si coincide, la segunda, y así sucesivamente. La Ñ va después de la N: CANAL va antes que CAÑA.';

const ORDINALS = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo'];

/** Comparador propio: letra a letra según ALPHABET; si una palabra es prefijo de otra, va antes. */
const compare = (alphabet: string) => (x: string, y: string) => {
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const d = alphabet.indexOf(x[i]!) - alphabet.indexOf(y[i]!);
    if (d !== 0) return d;
  }
  return x.length - y.length;
};
const sortEs = (ws: string[]) => [...ws].sort(compare(ALPHABET));
// Error típico: ordenar la Ñ como si fuera N.
const sortNoÑ = (ws: string[]) =>
  [...ws].sort((x, y) => compare(ALPHABET)(x.replaceAll('Ñ', 'N'), y.replaceAll('Ñ', 'N')));

/** «CARTA va detrás de CAMPO: en la 3.ª letra, R va después de M». */
function whyNot(w: string, answer: string) {
  let i = 0;
  while (i < Math.min(w.length, answer.length) && w[i] === answer[i]) i++;
  const after = compare(ALPHABET)(w, answer) > 0;
  if (i >= Math.min(w.length, answer.length))
    return `${w} va ${after ? 'detrás' : 'delante'} de ${answer}: ${after ? answer : w} es más corta y empieza igual.`;
  return `${w} va ${after ? 'detrás' : 'delante'} de ${answer}: en la ${i + 1}.ª letra, ${w[i]} va ${after ? 'después' : 'antes'} de ${answer[i]}.`;
}

/** Palabras que comparten las primeras `shared` letras (más difícil cuanto más comparten). */
function pickWords(rng: Rng, count: number, shared: number): string[] | null {
  const groups = new Map<string, string[]>();
  for (const w of WORDS) {
    const key = w.slice(0, shared);
    groups.set(key, [...(groups.get(key) ?? []), w]);
  }
  const candidates =
    shared === 0
      ? [[...WORDS]]
      : [...groups.values()].filter((g) => g.length >= Math.min(count, 4));
  if (candidates.length === 0) return null;
  const group = rng.pick(candidates);
  // Si el grupo se queda corto, se completa con otras palabras del vocabulario.
  const chosen = rng.shuffle(group).slice(0, count);
  const rest = rng.shuffle(WORDS.filter((w) => !chosen.includes(w)));
  while (chosen.length < count) chosen.push(rest.pop()!);
  if (shared === 0 && new Set(chosen.map((w) => w[0])).size < count) return null;
  return rng.shuffle(chosen);
}

type Config = { count: number; shared: number; ask: 'first' | 'last' | 'nth' };

const question = (cfg: Config) => (rng: Rng): Draft<VerOrdenStem> | null => {
  const words = pickWords(rng, cfg.count, cfg.shared);
  if (!words) return null;
  const sorted = sortEs(words);
  const n = cfg.ask === 'first' ? 1 : cfg.ask === 'last' ? words.length : rng.int(2, words.length - 1);
  const answer = sorted[n - 1]!;
  const text =
    cfg.ask === 'first'
      ? '¿Qué palabra va primera en orden alfabético?'
      : cfg.ask === 'last'
        ? '¿Qué palabra va última en orden alfabético?'
        : `¿Qué palabra ocupa el ${ORDINALS[n]} lugar en orden alfabético?`;
  const around = sorted.slice(Math.max(0, n - 2), n + 1);
  return {
    stem: { text: `${text} ${words.join(', ')}`, words, position: n },
    answer,
    distractors: [
      { value: sortNoÑ(words)[n - 1]!, error: 'Ordenas la Ñ como si fuera una N.' },
      { value: sorted[words.length - n]!, error: 'Cuentas los puestos desde el final de la lista ordenada.' },
      { value: sorted[n]!, error: 'Te equivocas al contar: tomas la palabra del puesto siguiente.' },
      { value: sorted[n - 2]!, error: 'Te equivocas al contar: tomas la palabra del puesto anterior.' },
      { value: words[n - 1]!, error: 'Tomas la palabra que ocupa ese puesto en la lista sin ordenarla.' },
      // De reserva: el resto de palabras, con la primera letra que las separa de la respuesta.
      ...sorted.filter((w) => w !== answer).map((w) => ({ value: w, error: whyNot(w, answer) })),
    ].filter((d) => d.value !== undefined),
    observe: `Compara letra a letra. Ordenadas: ${sorted.join(', ')}.`,
    rule: 'Se ordena por la primera letra distinta, con la Ñ después de la N.',
    apply: `Puesto ${n}: ${answer} (${around.join(' < ')})`,
  };
};

const families: Families<ReturnType<typeof question>> = {
  1: { primeraSinPrefijo: question({ count: 4, shared: 0, ask: 'first' }) },
  2: {
    puestoSinPrefijo: question({ count: 5, shared: 0, ask: 'nth' }),
    primeraMismaInicial: question({ count: 5, shared: 1, ask: 'first' }),
  },
  3: {
    puestoMismaInicial: question({ count: 5, shared: 1, ask: 'nth' }),
    ultimaDosLetras: question({ count: 5, shared: 2, ask: 'last' }),
  },
  4: {
    puestoDosLetras: question({ count: 6, shared: 2, ask: 'nth' }),
    puestoTresLetras: question({ count: 6, shared: 3, ask: 'nth' }),
  },
  5: {
    puestoTresLetrasSiete: question({ count: 7, shared: 3, ask: 'nth' }),
    puestoDosLetrasSiete: question({ count: 7, shared: 2, ask: 'nth' }),
  },
};

// En las preguntas de «puesto N», la correcta no debe ser siempre la del medio alfabéticamente.
// (En «primera» o «última», ser la primera o la última de las opciones ES la solución.)
const alphabetical = compare(ALPHABET);

export const verOrden: Generator<VerOrdenStem> = {
  type: 'VER.ORDEN',
  version: VERSION,
  levels,
  families: familyNames(families),
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'VER.ORDEN', version: VERSION, tip: TIP, solver: verOrdenSolver, compare: alphabetical, families },
      seed,
      level,
      optionCount,
    ),
};
