import { buildItem, type Draft } from '../build';
import { WORDS } from '../data/words';
import type { Rng } from '../rng';
import { ALPHABET } from '../series/alphabet';
import { levels, type Generator, type Level } from '../types';

import { codCriptoSolver, type CodCriptoStem } from './cod-cripto.solver';

const VERSION = '1';
const TIP =
  'Escribe la clave antes de mirar las opciones: qué cifra o qué salto corresponde a cada letra. Después codifica letra a letra y compara con las opciones de izquierda a derecha.';

const sign = (n: number) => (n >= 0 ? `+${n}` : `−${-n}`);
const swap = (s: string, i: number) => s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2);
const distinct = (w: string) => new Set(w).size;

type Raw = Omit<Draft<CodCriptoStem>, 'stem'> & { examples: CodCriptoStem['examples']; target: string };
type Family = (rng: Rng) => Raw | null;

/** Sustitución letra → cifra, deducida de uno o dos ejemplos. */
const digits =
  (exampleCount: 1 | 2, targetLen: number): Family =>
  (rng) => {
    const pool = WORDS.filter((w) => w.length >= 4 && w.length <= 6 && !w.includes('Ñ'));
    const examples = [rng.pick(pool)];
    if (exampleCount === 2) examples.push(rng.pick(pool.filter((w) => w !== examples[0])));
    const letters = [...new Set(examples.join(''))];
    if (letters.length > 10 || letters.length < 4) return null;
    const digitsFor = rng.shuffle([...'0123456789']).slice(0, letters.length);
    const code = new Map(letters.map((l, i) => [l, digitsFor[i]!]));
    const enc = (w: string) => [...w].map((ch) => code.get(ch)).join('');
    // Palabra pedida: letras de los ejemplos (si hay dos, de los dos), sin repetir ningún ejemplo.
    let target = '';
    for (let tries = 0; tries < 20 && (target === '' || examples.includes(target)); tries++) {
      target = Array.from({ length: targetLen }, () => rng.pick(letters)).join('');
      if (exampleCount === 2 && ![...target].some((c) => !examples[0]!.includes(c))) target = '';
      if (distinct(target) < 3) target = '';
    }
    if (target === '') return null;
    const answer = enc(target);
    const [x, y] = rng.shuffle([...new Set(target)]).slice(0, 2) as [string, string];
    const confused = enc(target.replaceAll(x, '\0').replaceAll(y, x).replaceAll('\0', y));
    const i = rng.int(0, targetLen - 2);
    const lastDigit = Number(answer[answer.length - 1]);
    return {
      examples: examples.map((plain) => ({ plain, code: enc(plain) })),
      target,
      answer,
      observe: `Cada letra se escribe siempre con la misma cifra: ${letters
        .filter((l) => target.includes(l))
        .map((l) => `${l} = ${code.get(l)}`)
        .join(', ')}.`,
      rule: `Sustituye cada letra de ${target} por su cifra, en el mismo orden.`,
      apply: `${[...target].join(' ')} → ${[...answer].join(' ')} = ${answer}`,
      distractors: [
        { value: swap(answer, i), error: 'Intercambias el orden de dos cifras seguidas.' },
        { value: confused, error: `Confundes la cifra de la ${x} con la de la ${y}.` },
        { value: [...answer].reverse().join(''), error: 'Escribes el código de derecha a izquierda.' },
        { value: answer.slice(0, -1) + ((lastDigit + 1) % 10), error: 'Te equivocas en la cifra de la última letra.' },
      ],
    };
  };

/** Desplazamiento en el alfabeto (con periodo 1 o 2), deducido de un ejemplo. */
const shift =
  (pattern: (rng: Rng) => [number, number], minLen: number): Family =>
  (rng) => {
    const [a, b] = pattern(rng);
    const at = (i: number) => (i % 2 === 0 ? a : b);
    const enc = (w: string, f: (i: number) => number = at, alphabet = ALPHABET) => {
      const r = [...w].map((ch, i) => alphabet[alphabet.indexOf(ch) + f(i)]);
      return r.every(Boolean) && [...w].every((ch) => alphabet.includes(ch)) ? r.join('') : null;
    };
    const pool = WORDS.filter((w) => w.length >= minLen && w.length <= minLen + 2 && enc(w));
    if (pool.length < 2) return null;
    const plain = rng.pick(pool);
    const target = rng.pick(pool.filter((w) => w !== plain));
    const answer = enc(target)!;
    const uniform = a === b;
    const describe = uniform ? `${sign(a)} posiciones` : `${sign(a)} y ${sign(b)} posiciones, alternando`;
    const firstPairs = [...plain]
      .slice(0, 3)
      .map((ch, i) => `${ch}→${enc(plain)![i]}`)
      .join(', ');
    const without26 = enc(target, at, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    return {
      examples: [{ plain, code: enc(plain)! }],
      target,
      answer,
      observe: `Compara letra a letra: ${firstPairs}… ${uniform ? 'Todas se desplazan lo mismo' : 'El salto cambia según la posición'}.`,
      rule: `Cada letra se sustituye por la que está ${describe} en el alfabeto (con Ñ).`,
      apply: `${target} → ${answer}`,
      distractors: [
        { value: without26 ?? '', error: 'Olvidas la Ñ al contar las posiciones.' },
        { value: enc(target, (i) => -at(i)) ?? '', error: 'Desplazas hacia el lado contrario del alfabeto.' },
        uniform
          ? { value: enc(target, (i) => at(i) + Math.sign(a)) ?? '', error: 'Desplazas una posición de más.' }
          : { value: enc(target, () => a) ?? '', error: `Aplicas ${sign(a)} a todas las letras, sin alternar.` },
        uniform
          ? { value: enc(target, (i) => (i === target.length - 1 ? 0 : at(i))) ?? '', error: 'Olvidas codificar la última letra.' }
          : { value: enc(target, (i) => (i % 2 === 0 ? b : a)) ?? '', error: 'Empiezas la alternancia por el salto equivocado.' },
        { value: enc(target, (i) => at(i) + Math.sign(at(i))) ?? '', error: 'Desplazas una posición de más.' },
      ].filter((d) => d.value !== ''),
    };
  };

const families: Record<Level, Family[]> = {
  1: [digits(1, 4)],
  2: [digits(1, 5), shift(() => [1, 1], 4)],
  3: [digits(2, 5), shift((r) => { const k = r.pick([-2, -1, 2]); return [k, k]; }, 4)],
  4: [shift((r) => { const k = r.pick([-3, 3, 4]); return [k, k]; }, 5)],
  5: [shift((r) => [r.pick([1, 2]), r.pick([-1, -2])], 5), shift((r) => [r.pick([2, 3]), r.pick([1])], 6)],
};

export const codCripto: Generator<CodCriptoStem> = {
  type: 'COD.CRIPTO',
  version: VERSION,
  levels,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'COD.CRIPTO', version: VERSION, tip: TIP, solver: codCriptoSolver },
      seed,
      level,
      optionCount,
      (rng) => {
        const raw = rng.pick(families[level])(rng);
        if (!raw) return null;
        const { examples, target, ...rest } = raw;
        const shown = examples.map((e) => `${e.plain} se escribe ${e.code}`).join(' y ');
        return {
          ...rest,
          stem: {
            text: `En un código, ${shown}. Con la misma clave, ¿cómo se escribe ${target}?`,
            examples,
            target,
          },
        };
      },
    ),
};
