import { buildItem, type Draft } from '../build';
import type { Rng } from '../rng';
import { levels, type Generator, type Level } from '../types';

import { ALPHABET, letterAt } from './alphabet';
import { letSerieSolver, type LetSerieStem } from './let-serie.solver';

const VERSION = '1';
const TIP =
  'Escribe debajo de cada letra su posición en el alfabeto (A = 1… Z = 27) y trabaja con números. No olvides la Ñ, que va después de la N.';

const L = ALPHABET.length;
const step = (n: number) => (n >= 0 ? `+ ${n}` : `− ${-n}`);
const named = (p: number) => `${letterAt(p)} (${p})`;

/** Letra que sale si se cuenta con el alfabeto inglés de 26 letras (sin Ñ). */
function withoutÑ(from: number, delta: number) {
  const en = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const i = en.indexOf(letterAt(from)!);
  return i < 0 ? undefined : en[i + delta];
}

type Raw = { positions: number[]; answer: number; lastDelta: number } & Omit<
  Draft<LetSerieStem>,
  'stem' | 'answer' | 'distractors'
> & { distractors: { pos: number | string | undefined; error: string }[] };
type Family = (rng: Rng) => Raw;

const fixed =
  (min: number, max: number, backwards: boolean): Family =>
  (rng) => {
    let s = rng.int(min, max);
    if (backwards && rng.next() < 0.5) s = -s;
    const count = rng.int(4, 6);
    const span = Math.abs(s) * count;
    const start = s > 0 ? rng.int(1, L - span) : rng.int(span + 1, L);
    const positions = Array.from({ length: count }, (_, i) => start + i * s);
    const l = positions[count - 1]!;
    const answer = l + s;
    return {
      positions,
      answer,
      lastDelta: s,
      observe: `Entre cada letra y la siguiente hay siempre el mismo salto: ${step(s)} posiciones.`,
      rule: `Cada letra está ${Math.abs(s)} ${s > 0 ? 'posiciones después' : 'posiciones antes'} de la anterior.`,
      apply: `${named(l)} ${step(s)} = ${named(answer)} → ${letterAt(answer)}`,
      distractors: [
        { pos: l + 2 * s, error: `Aplicas el salto (${step(s)}) dos veces.` },
        { pos: answer + 1, error: 'Cuentas una letra de más.' },
        { pos: answer - 1, error: 'Cuentas una letra de menos.' },
      ],
    };
  };

const growing =
  (dd: number): Family =>
  (rng) => {
    // Hacia delante (A → Z) o hacia atrás (Z → A): el tamaño del salto crece igual.
    const dir = rng.next() < 0.5 ? 1 : -1;
    const s0 = rng.int(1, 3);
    const steps = Array.from({ length: 5 }, (_, i) => dir * (s0 + i * dd));
    const total = Math.abs(steps.reduce((a, b) => a + b, 0));
    const start = dir > 0 ? rng.int(1, L - total) : rng.int(total + 1, L);
    const positions = [start];
    for (let i = 0; i < 4; i++) positions.push(positions[i]! + steps[i]!);
    const l = positions[4]!;
    const answer = l + steps[4]!;
    return {
      positions,
      answer,
      lastDelta: steps[4]!,
      observe: `Los saltos entre letras son ${steps.slice(0, 4).map(step).join(', ')}: su tamaño crece ${dd} cada vez.`,
      rule: `El salto aumenta ${dd} en cada paso${dir < 0 ? ', yendo hacia atrás en el alfabeto' : ''}.`,
      apply: `El siguiente salto es ${step(steps[4]!)}: ${named(l)} ${step(steps[4]!)} = ${named(answer)} → ${letterAt(answer)}`,
      distractors: [
        { pos: l + steps[3]!, error: `Repites el último salto (${step(steps[3]!)}) sin aumentarlo.` },
        { pos: answer + dir * dd, error: 'Aumentas el salto dos veces.' },
        { pos: l + steps[0]!, error: `Vuelves a usar el primer salto (${step(steps[0]!)}) en vez del que toca.` },
        { pos: answer + 2 * dir, error: 'Cuentas dos letras de más.' },
        { pos: answer + dir, error: 'Cuentas una letra de más.' },
        { pos: answer - dir, error: 'Cuentas una letra de menos.' },
      ],
    };
  };

const alternating: Family = (rng) => {
  const a = rng.int(1, 3);
  let b = rng.int(2, 4);
  if (b === a) b = a + 1;
  const total = 3 * (a + b);
  const start = rng.int(1, L - total);
  const positions = [start];
  for (let i = 0; i < 5; i++) positions.push(positions[i]! + (i % 2 === 0 ? a : b));
  const l = positions[5]!;
  const answer = l + a; // 6 letras, 5 saltos: el siguiente es el sexto, de tipo «a».
  return {
    positions,
    answer,
    lastDelta: a,
    observe: `Los saltos se alternan: ${step(a)}, ${step(b)}, ${step(a)}, ${step(b)}…`,
    rule: `Se alternan dos saltos: ${step(a)} y ${step(b)}.`,
    apply: `El último salto fue ${step(b)}, ahora toca ${step(a)}: ${named(l)} ${step(a)} = ${named(answer)} → ${letterAt(answer)}`,
    distractors: [
      { pos: l + b, error: `Repites el último salto (${step(b)}); no ves que se alternan.` },
      { pos: l + a + b, error: 'Aplicas los dos saltos a la vez.' },
      { pos: answer + 1, error: 'Cuentas una letra de más.' },
      { pos: answer - 1, error: 'Cuentas una letra de menos.' },
    ],
  };
};

const interleaved =
  (opposite: boolean): Family =>
  (rng) => {
    const sa = rng.int(1, 3);
    let sb = (opposite ? -1 : 1) * rng.int(2, 4);
    // Con el mismo salto, las dos series juntas pueden formar una serie simple: no sería nivel 4-5.
    if (sb === sa) sb += 1;
    const aStart = rng.int(1, L - 4 * sa);
    const bStart = sb > 0 ? rng.int(1, L - 4 * sb) : rng.int(-4 * sb + 1, L);
    const positions: number[] = [];
    for (let i = 0; i < 7; i++) positions.push(i % 2 === 0 ? aStart + (i / 2) * sa : bStart + ((i - 1) / 2) * sb);
    const answer = bStart + 3 * sb; // la 8.ª letra es de la serie de las posiciones pares
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
        { pos: bLast - sb, error: 'Aplicas el salto de las pares en sentido contrario.' },
        { pos: answer + 1, error: 'Cuentas una letra de más.' },
        { pos: answer - 1, error: 'Cuentas una letra de menos.' },
      ],
    };
  };

const families: Record<Level, Family[]> = {
  1: [fixed(1, 3, false)],
  2: [fixed(2, 4, true)],
  3: [growing(1)],
  4: [alternating, interleaved(false)],
  5: [interleaved(true), growing(2)],
};

export const letSerie: Generator<LetSerieStem> = {
  type: 'LET.SERIE',
  version: VERSION,
  levels,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'LET.SERIE', version: VERSION, tip: TIP, solver: letSerieSolver },
      seed,
      level,
      optionCount,
      (rng) => {
        const raw = rng.pick(families[level])(rng);
        const all = [...raw.positions, raw.answer];
        if (all.some((p) => p < 1 || p > L)) return null;
        const letters = raw.positions.map((p) => letterAt(p)!);
        const forgotÑ = withoutÑ(raw.answer - raw.lastDelta, raw.lastDelta);
        const distractors = [
          { pos: forgotÑ, error: 'Olvidas la Ñ al contar: el alfabeto español tiene 27 letras.' },
          ...raw.distractors,
        ].flatMap(({ pos, error }) => {
          const value = typeof pos === 'number' ? (pos >= 1 && pos <= L ? letterAt(pos) : undefined) : pos;
          return value ? [{ value, error }] : [];
        });
        return {
          stem: { text: `¿Qué letra continúa la serie? ${letters.join(', ')}, ?`, letters },
          answer: letterAt(raw.answer)!,
          distractors,
          observe: raw.observe,
          rule: raw.rule,
          apply: raw.apply,
        };
      },
    ),
};

