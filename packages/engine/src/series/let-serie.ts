import { buildItem, familyNames, finishFamilies, type Draft, type Families } from '../build';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import { ALPHABET, letterAt, position } from './alphabet';
import { letSerieSolver, type LetSerieStem } from './let-serie.solver';

const VERSION = '4';
const TIP =
  'Escribe debajo de cada letra su posición en el alfabeto (A = 1… Z = 27) y trabaja con números. No olvides la Ñ, que va después de la N.';

const L = ALPHABET.length;
const step = (n: number) => (n >= 0 ? `+ ${n}` : `− ${-n}`);
const named = (p: number) => `${letterAt(p)} (${p})`;
const byAlphabet = (a: string, b: string) => position(a) - position(b);

/** Letra que sale si se cuenta con el alfabeto inglés de 26 letras (sin Ñ). */
function withoutÑ(from: number, delta: number) {
  const en = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const i = en.indexOf(letterAt(from)!);
  return i < 0 ? undefined : en[i + delta];
}

/**
 * Coloca una serie de saltos dentro del alfabeto; null si no cabe. La última posición (la
 * respuesta) queda a 3 letras o más de los extremos, para que haya errores a los dos lados.
 */
const EDGE = 3;
function place(rng: Rng, steps: number[]) {
  const offsets = [0];
  for (const s of steps) offsets.push(offsets[offsets.length - 1]! + s);
  const end = offsets[offsets.length - 1]!;
  const lo = Math.max(1 - Math.min(...offsets), 1 + EDGE - end);
  const hi = Math.min(L - Math.max(...offsets), L - EDGE - end);
  if (lo > hi) return null;
  const start = rng.int(lo, hi);
  return offsets.map((o) => start + o);
}

/** Contar una o dos letras de más o de menos, en el sentido en que avanza la serie. */
const miscounts = (answer: number, dir: number) => [
  { pos: answer + dir, error: 'Cuentas una letra de más.' },
  { pos: answer - dir, error: 'Cuentas una letra de menos.' },
  { pos: answer + 2 * dir, error: 'Cuentas dos letras de más.' },
  { pos: answer - 2 * dir, error: 'Cuentas dos letras de menos.' },
  { pos: answer + 3 * dir, error: 'Cuentas tres letras de más.' },
  { pos: answer - 3 * dir, error: 'Cuentas tres letras de menos.' },
];

type Raw = Omit<Draft<LetSerieStem>, 'stem' | 'answer' | 'distractors'> & {
  positions: number[];
  answer: number;
  lastDelta: number;
  distractors: { pos: number | string | undefined; error: string }[];
};
type Family = (rng: Rng) => Raw | null;

/** Salto fijo, hacia delante o hacia atrás. */
const fixed =
  (min: number, max: number, backwards: boolean): Family =>
  (rng) => {
    let s = rng.int(min, max);
    if (backwards && rng.next() < 0.5) s = -s;
    const count = rng.int(4, 6);
    const all = place(rng, Array.from({ length: count }, () => s));
    if (!all) return null;
    const positions = all.slice(0, count);
    const answer = all[count]!;
    const l = positions[count - 1]!;
    return {
      positions,
      answer,
      lastDelta: s,
      observe: `Entre cada letra y la siguiente hay siempre el mismo salto: ${step(s)} posiciones.`,
      rule: `Cada letra está ${Math.abs(s)} posiciones ${s > 0 ? 'después' : 'antes'} de la anterior.`,
      apply: `${named(l)} ${step(s)} = ${named(answer)} → ${letterAt(answer)}`,
      distractors: [
        { pos: l + 2 * s, error: `Aplicas el salto (${step(s)}) dos veces.` },
        // Contar mal el salto (+3 en lugar de +4…): errores a los dos lados de la respuesta.
        ...[-3, -2, -1, 1, 2]
          .map((k) => s + Math.sign(s) * k)
          .filter((t) => t !== 0 && Math.sign(t) === Math.sign(s))
          .map((t) => ({ pos: l + t, error: `Cuentas mal el salto: ${step(t)} en lugar de ${step(s)}.` })),
        ...miscounts(answer, Math.sign(s)),
      ],
    };
  };

/** El tamaño del salto crece o decrece de uno en uno (+1, +2, +3… o +5, +4, +3…). */
const growing: Family = (rng) => {
  const dir = rng.next() < 0.5 ? 1 : -1;
  const dd = rng.pick([1, -1]);
  const s0 = dd > 0 ? rng.int(1, 3) : rng.int(5, 7);
  const steps = Array.from({ length: 5 }, (_, i) => dir * (s0 + i * dd));
  const all = place(rng, steps);
  if (!all) return null;
  const positions = all.slice(0, 5);
  const answer = all[5]!;
  const l = positions[4]!;
  const grows = dd > 0 ? 'crece' : 'decrece';
  return {
    positions,
    answer,
    lastDelta: steps[4]!,
    observe: `Los saltos entre letras son ${steps.slice(0, 4).map(step).join(', ')}: su tamaño ${grows} de uno en uno.`,
    rule: `El tamaño del salto ${grows} 1 en cada paso${dir < 0 ? ', yendo hacia atrás en el alfabeto' : ''}.`,
    apply: `El siguiente salto es ${step(steps[4]!)}: ${named(l)} ${step(steps[4]!)} = ${named(answer)} → ${letterAt(answer)}`,
    distractors: [
      { pos: l + steps[3]!, error: `Repites el último salto (${step(steps[3]!)}) sin cambiarlo.` },
      { pos: l + steps[4]! + dir * dd, error: `Cambias el salto dos veces (${step(steps[4]! + dir * dd)}).` },
      { pos: l + steps[0]!, error: `Vuelves a usar el primer salto (${step(steps[0]!)}).` },
      ...miscounts(answer, dir),
    ],
  };
};

/** Dos saltos que se alternan; en el nivel alto, uno hacia delante y otro hacia atrás. */
const alternating =
  (mixedSigns: boolean): Family =>
  (rng) => {
    const a = rng.int(1, 4);
    let b = rng.int(2, 5);
    if (b === a) b = a + 1;
    if (mixedSigns) b = -rng.int(1, a + 2);
    if (b === -a) return null; // ida y vuelta: repetiría letras
    const steps = [a, b, a, b, a, b];
    const all = place(rng, steps);
    if (!all) return null;
    const positions = all.slice(0, 6);
    const answer = all[6]!; // 6 letras y 5 saltos (a, b, a, b, a): el siguiente es b
    const l = positions[5]!;
    return {
      positions,
      answer,
      lastDelta: b,
      observe: `Los saltos se alternan: ${step(a)}, ${step(b)}, ${step(a)}, ${step(b)}…`,
      rule: `Se alternan dos saltos: ${step(a)} y ${step(b)}.`,
      apply: `El último salto fue ${step(a)}, ahora toca ${step(b)}: ${named(l)} ${step(b)} = ${named(answer)} → ${letterAt(answer)}`,
      distractors: [
        { pos: l + a, error: `Repites el último salto (${step(a)}); no ves que se alternan.` },
        { pos: l + a + b, error: 'Aplicas los dos saltos a la vez.' },
        { pos: l - b, error: `Aplicas ${step(b)} en sentido contrario.` },
        ...miscounts(answer, Math.sign(b)),
      ],
    };
  };

/** Dos series intercaladas; en el nivel alto avanzan en sentidos opuestos. */
const interleaved =
  (opposite: boolean): Family =>
  (rng) => {
    const sa = rng.int(1, 3);
    let sb = (opposite ? -1 : 1) * rng.int(2, 4);
    // Con el mismo salto, las dos series juntas pueden formar una serie simple: no sería nivel 4-5.
    if (sb === sa) sb += 1;
    const aSeries = place(rng, [sa, sa, sa, sa]);
    const bSeries = place(rng, [sb, sb, sb]);
    if (!aSeries || !bSeries) return null;
    const positions: number[] = [];
    for (let i = 0; i < 7; i++) positions.push(i % 2 === 0 ? aSeries[i / 2]! : bSeries[(i - 1) / 2]!);
    const answer = bSeries[3]!; // la 8.ª letra es de la serie de las posiciones pares
    const l = positions[6]!;
    const bLast = positions[5]!;
    return {
      positions,
      answer,
      lastDelta: sb,
      observe: `Las letras en posición impar (${positions.filter((_, i) => i % 2 === 0).map(letterAt).join(', ')}) y en posición par (${positions.filter((_, i) => i % 2 === 1).map(letterAt).join(', ')}) forman dos series distintas.`,
      rule: `Hay dos series intercaladas: las impares van ${step(sa)} y las pares ${step(sb)}.`,
      apply: `Toca la serie de las posiciones pares: ${named(bLast)} ${step(sb)} = ${named(answer)} → ${letterAt(answer)}`,
      distractors: [
        { pos: l + sa, error: `Continúas la serie de las posiciones impares (${letterAt(l)} ${step(sa)}).` },
        { pos: bLast + sa, error: `Aplicas a la serie de las pares el salto de las impares (${step(sa)}).` },
        { pos: bLast + 2 * sb, error: `Aplicas el salto de las pares (${step(sb)}) dos veces.` },
        ...miscounts(answer, Math.sign(sb)),
      ],
    };
  };

const families: Families<Family> = {
  // Saltos fijos en los dos sentidos: con saltos de 1 en un solo sentido no caben errores entre la
  // última letra y la respuesta, y la correcta se delataría por ser «la primera letra posible».
  1: { saltoFijo: fixed(2, 4, true) },
  2: { saltoFijoGrande: fixed(3, 6, true), saltosAlternos: alternating(false) },
  3: { saltoVariable: growing },
  4: { intercaladas: interleaved(false), saltosAlternosOpuestos: alternating(true) },
  5: { intercaladasOpuestas: interleaved(true) },
};

const drafts = finishFamilies(families, (raw: Raw) => {
  if ([...raw.positions, raw.answer].some((p) => p < 1 || p > L)) return null;
  // Respuesta lejos de los extremos: si no, no habría errores posibles a uno de los lados y
  // la correcta se delataría por ser la primera o la última letra de las opciones.
  if (raw.answer < 1 + EDGE || raw.answer > L - EDGE) return null;
  const letters = raw.positions.map((p) => letterAt(p)!);
  const forgotÑ = withoutÑ(raw.answer - raw.lastDelta, raw.lastDelta);
  const distractors = [
    { pos: forgotÑ, error: 'Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.' },
    ...raw.distractors,
  ].flatMap(({ pos, error }) => {
    const value = typeof pos === 'number' ? (pos >= 1 && pos <= L ? letterAt(pos) : undefined) : pos;
    if (!value) return [];
    // Fuera: letras ya visibles en la serie (si la respuesta no lo es) y, en una serie que solo
    // avanza en un sentido, lo que va en sentido contrario. Se descartarían sin pensar.
    const v = position(value);
    if (!letters.includes(letterAt(raw.answer)!) && letters.includes(value)) return [];
    if (value === letters[letters.length - 1]) return []; // repetir la última letra no es un error creíble
    const steps = [...raw.positions, raw.answer].slice(1).map((x, i) => x - raw.positions[i]!);
    const last = raw.positions[raw.positions.length - 1]!;
    if (steps.every((d) => d > 0) && v <= last) return [];
    if (steps.every((d) => d < 0) && v >= last) return [];
    return [{ value, error }];
  });
  return {
    stem: { text: `¿Qué letra continúa la serie? ${letters.join(', ')}, ?`, letters },
    answer: letterAt(raw.answer)!,
    distractors,
    observe: raw.observe,
    rule: raw.rule,
    apply: raw.apply,
  };
});

export const letSerie: Generator<LetSerieStem> = {
  type: 'LET.SERIE',
  version: VERSION,
  levels,
  families: familyNames(families),
  compareOptions: byAlphabet,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'LET.SERIE', version: VERSION, tip: TIP, solver: letSerieSolver, compare: byAlphabet, families: drafts },
      seed,
      level,
      optionCount,
    ),
};
