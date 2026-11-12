import { buildItem, type Draft } from '../build';
import type { Rng } from '../rng';
import { levels, type Generator, type Level } from '../types';

import { numSerieSolver, type NumSerieStem } from './num-serie.solver';

const VERSION = '1';
const TIP =
  'Calcula primero las diferencias entre términos seguidos. Si son iguales, es una suma constante; si crecen deprisa, prueba con multiplicaciones; si saltan arriba y abajo, mira las posiciones pares e impares por separado.';

const MIN = -99;
const MAX = 9999;
const list = (xs: number[]) => xs.join(', ');
const sign = (n: number) => (n >= 0 ? `+ ${n}` : `− ${-n}`);
const err = (value: number, error: string) => ({ value: String(value), error });

type Family = (rng: Rng) => Omit<Draft<NumSerieStem>, 'stem'> & { terms: number[] };

/** Suma constante. */
const arithmetic =
  (stepMin: number, stepMax: number, startMax: number, allowNegative: boolean): Family =>
  (rng) => {
    let step = rng.int(stepMin, stepMax);
    if (allowNegative && rng.next() < 0.5) step = -step;
    const start = step < 0 ? rng.int(-step * 6, -step * 6 + startMax) : rng.int(1, startMax);
    const terms = Array.from({ length: 5 }, (_, i) => start + i * step);
    const l = terms[4]!;
    const answer = l + step;
    return {
      terms,
      answer: String(answer),
      observe: `Entre cada término y el siguiente hay siempre la misma diferencia: ${sign(step)}.`,
      rule: `Cada número es el anterior ${sign(step)}.`,
      apply: `${l} ${sign(step)} = ${answer}`,
      distractors: [
        err(l + 2 * step, `Aplicas el paso ${sign(step)} dos veces seguidas.`),
        err(answer + 1, 'Error de cálculo de una unidad al aplicar el paso.'),
        err(answer - 1, 'Error de cálculo de una unidad al aplicar el paso.'),
        err(answer + 10, 'Error de cálculo de una decena al aplicar el paso.'),
      ],
    };
  };

/** Multiplicación constante. */
const geometric: Family = (rng) => {
  const r = rng.pick([2, 3]);
  const start = rng.int(1, r === 2 ? 9 : 5);
  const terms = Array.from({ length: 5 }, (_, i) => start * r ** i);
  const l = terms[4]!;
  const answer = l * r;
  const lastDiff = l - terms[3]!;
  return {
    terms,
    answer: String(answer),
    observe: `Cada término es ${r} veces el anterior: ${terms[3]} × ${r} = ${l}.`,
    rule: `Cada número es el anterior × ${r}.`,
    apply: `${l} × ${r} = ${answer}`,
    distractors: [
      err(l + lastDiff, `Sumas la última diferencia (${lastDiff}) en vez de multiplicar: la diferencia no es constante.`),
      err(l * (r + 1), `Multiplicas por ${r + 1} en lugar de por ${r}.`),
      err(answer + r, `Error de cálculo: sumas ${r} al multiplicar.`),
      err(l * r * r, `Multiplicas por ${r} dos veces.`),
    ],
  };
};

/** x × a + b. */
const affine: Family = (rng) => {
  const a = rng.pick([2, 3]);
  const b = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
  const start = rng.int(2, 6);
  const terms = [start];
  for (let i = 1; i < 5; i++) terms.push(terms[i - 1]! * a + b);
  const l = terms[4]!;
  const answer = l * a + b;
  const lastDiff = l - terms[3]!;
  return {
    terms,
    answer: String(answer),
    observe: `Las diferencias crecen deprisa (${list(terms.slice(1).map((x, i) => x - terms[i]!))}): hay una multiplicación.`,
    rule: `Cada número es el anterior × ${a} ${sign(b)}.`,
    apply: `${l} × ${a} ${sign(b)} = ${answer}`,
    distractors: [
      err(l * a, `Multiplicas por ${a} pero olvidas el ${sign(b)}.`),
      err((l + b) * a, `Cambias el orden: sumas ${b} antes de multiplicar.`),
      err(l + lastDiff, `Sumas otra vez la última diferencia (${lastDiff}); no ves que se multiplica.`),
      err(answer + 1, 'Error de cálculo de una unidad.'),
    ],
  };
};

/** Diferencias que crecen de forma constante (segundas diferencias iguales). */
const quadratic: Family = (rng) => {
  const d0 = rng.int(1, 6);
  const dd = rng.int(1, 4);
  const start = rng.int(1, 30);
  const terms = [start];
  for (let i = 1; i < 6; i++) terms.push(terms[i - 1]! + d0 + (i - 1) * dd);
  const l = terms[5]!;
  const lastDiff = l - terms[4]!;
  const nextDiff = lastDiff + dd;
  const answer = l + nextDiff;
  return {
    terms,
    answer: String(answer),
    observe: `Las diferencias son ${list(terms.slice(1).map((x, i) => x - terms[i]!))}: aumentan ${dd} cada vez.`,
    rule: `Se suma una cantidad que crece ${dd} en cada paso.`,
    apply: `La siguiente diferencia es ${lastDiff} + ${dd} = ${nextDiff}; ${l} + ${nextDiff} = ${answer}`,
    distractors: [
      err(l + lastDiff, `Repites la última diferencia (${lastDiff}) sin aumentarla.`),
      err(l + nextDiff + dd, `Aumentas la diferencia dos veces (${nextDiff + dd}).`),
      err(answer + 1, 'Error de cálculo de una unidad.'),
      err(answer - 1, 'Error de cálculo de una unidad.'),
    ],
  };
};

/** Diferencias que se multiplican (se duplican o triplican). */
const differencesGeometric: Family = (rng) => {
  const d0 = rng.int(1, 4);
  const r = rng.pick([2, 3]);
  const start = rng.int(1, 20);
  const terms = [start];
  for (let i = 1; i < 6; i++) terms.push(terms[i - 1]! + d0 * r ** (i - 1));
  const l = terms[5]!;
  const lastDiff = l - terms[4]!;
  const prevDiff = terms[4]! - terms[3]!;
  const nextDiff = lastDiff * r;
  const answer = l + nextDiff;
  return {
    terms,
    answer: String(answer),
    observe: `Las diferencias son ${list(terms.slice(1).map((x, i) => x - terms[i]!))}: cada una es ${r} veces la anterior.`,
    rule: `Se suma una cantidad que se multiplica por ${r} en cada paso.`,
    apply: `La siguiente diferencia es ${lastDiff} × ${r} = ${nextDiff}; ${l} + ${nextDiff} = ${answer}`,
    distractors: [
      err(l + lastDiff, `Repites la última diferencia (${lastDiff}) sin multiplicarla.`),
      err(l + lastDiff + (lastDiff - prevDiff), `Crees que la diferencia aumenta siempre lo mismo (${lastDiff - prevDiff}), pero se multiplica.`),
      err(l * r, `Multiplicas el último término por ${r} en vez de multiplicar la diferencia.`),
      err(answer + 1, 'Error de cálculo de una unidad.'),
    ],
  };
};

/** Dos series intercaladas con pasos distintos. */
const interleaved =
  (mixed: boolean): Family =>
  (rng) => {
    const a0 = rng.int(1, 20);
    const sa = rng.int(2, 9);
    const b0 = rng.int(20, 60);
    let sb = rng.pick([-5, -4, -3, -2, 3, 4, 5, 6, 7]);
    // Con el mismo paso, las dos series juntas pueden formar una aritmética simple: no sería nivel 4.
    if (sb === sa) sb += 1;
    const ratio = rng.pick([2, 3]);
    const bStart = Math.max(1, Math.round(b0 / 10));
    const bAt = (k: number) => (mixed ? bStart * ratio ** k : b0 + k * sb);
    const terms: number[] = [];
    for (let i = 0; i < 7; i++) terms.push(i % 2 === 0 ? a0 + (i / 2) * sa : bAt((i - 1) / 2));
    // El término 8 (índice 7) pertenece a la segunda serie.
    const answer = bAt(3);
    const otherNext = a0 + 4 * sa;
    const l = terms[6]!;
    const bLast = terms[5]!;
    const bRule = mixed ? `× ${ratio}` : sign(sb);
    return {
      terms,
      answer: String(answer),
      observe: `Los términos en posición impar (${list(terms.filter((_, i) => i % 2 === 0))}) y en posición par (${list(terms.filter((_, i) => i % 2 === 1))}) siguen reglas distintas.`,
      rule: `Hay dos series intercaladas: la de las posiciones impares suma ${sa}; la de las pares va ${bRule}.`,
      apply: `Toca la serie de las posiciones pares: ${bLast} ${bRule} = ${answer}`,
      distractors: [
        err(otherNext, `Continúas la serie de las posiciones impares (${l} + ${sa}) cuando toca la de las pares.`),
        err(l + (l - bLast), 'Tratas todo como una sola serie y repites la última diferencia.'),
        err(answer + 1, 'Error de cálculo de una unidad.'),
        err(answer - 1, 'Error de cálculo de una unidad.'),
      ],
    };
  };

/** Cada término es la suma de los dos anteriores. */
const fibonacci: Family = (rng) => {
  const terms = [rng.int(1, 9), rng.int(1, 9)];
  for (let i = 2; i < 6; i++) terms.push(terms[i - 1]! + terms[i - 2]!);
  const l = terms[5]!;
  const p = terms[4]!;
  const answer = l + p;
  return {
    terms,
    answer: String(answer),
    observe: `Desde el tercero, cada término coincide con la suma de los dos anteriores: ${terms[0]} + ${terms[1]} = ${terms[2]}.`,
    rule: 'Cada número es la suma de los dos anteriores.',
    apply: `${p} + ${l} = ${answer}`,
    distractors: [
      err(l + (l - p), `Sumas la última diferencia (${l - p}) en vez de sumar los dos anteriores.`),
      err(l * 2, 'Duplicas el último término.'),
      err(l + p + terms[3]!, 'Sumas los tres anteriores en lugar de los dos anteriores.'),
      err(answer + 1, 'Error de cálculo de una unidad.'),
    ],
  };
};

/** Dos operaciones que se alternan: + a, × b, + a, × b… */
const alternating: Family = (rng) => {
  const a = rng.int(1, 6);
  const b = rng.pick([2, 3]);
  const terms = [rng.int(1, 6)];
  for (let i = 1; i < 6; i++) terms.push(i % 2 === 1 ? terms[i - 1]! + a : terms[i - 1]! * b);
  const l = terms[5]!;
  // Índice 6: paso par (de 5 a 6) → toca + a.
  const answer = l + a;
  return {
    terms,
    answer: String(answer),
    observe: `Los pasos se alternan: ${terms[0]} + ${a} = ${terms[1]}, ${terms[1]} × ${b} = ${terms[2]}, y así sucesivamente.`,
    rule: `Se alternan dos operaciones: primero + ${a}, después × ${b}.`,
    apply: `El último paso fue × ${b}, así que ahora toca + ${a}: ${l} + ${a} = ${answer}`,
    distractors: [
      err(l * b, `Aplicas otra vez × ${b}; no ves que las operaciones se alternan.`),
      err((l + a) * b, 'Aplicas las dos operaciones en el mismo paso.'),
      err(answer + 1, 'Error de cálculo de una unidad.'),
      err(l + a + a, `Sumas ${a} dos veces.`),
    ],
  };
};

/** Familias por nivel: el 1 se resuelve en segundos; el 5 equivale a lo más difícil publicado. */
const families: Record<Level, Family[]> = {
  1: [arithmetic(2, 9, 60, false)],
  2: [arithmetic(11, 25, 40, true), geometric],
  3: [affine, quadratic],
  4: [interleaved(false), differencesGeometric],
  5: [fibonacci, alternating, interleaved(true)],
};

export const numSerie: Generator<NumSerieStem> = {
  type: 'NUM.SERIE',
  version: VERSION,
  levels,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'NUM.SERIE', version: VERSION, tip: TIP, solver: numSerieSolver },
      seed,
      level,
      optionCount,
      (rng) => {
        const { terms, ...rest } = rng.pick(families[level])(rng);
        const values = [...terms, Number(rest.answer), ...rest.distractors.map((d) => Number(d.value))];
        if (values.some((v) => v < MIN || v > MAX)) return null;
        return { ...rest, stem: { text: `¿Qué número continúa la serie? ${list(terms)}, ?`, terms } };
      },
    ),
};
