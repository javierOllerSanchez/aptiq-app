import { buildItem, byNumber, familyNames, finishFamilies, type Draft, type Families } from '../build';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import { numSerieSolver, type NumSerieStem } from './num-serie.solver';

const VERSION = '2';
const TIP =
  'Calcula primero las diferencias entre términos seguidos. Si son iguales, es una suma constante; si crecen deprisa, prueba con multiplicaciones; si saltan arriba y abajo, mira las posiciones pares e impares por separado.';

const MAX = 9999;
const list = (xs: number[]) => xs.join(', ');
const sign = (n: number) => (n >= 0 ? `+ ${n}` : `− ${-n}`);
const err = (value: number, error: string) => ({ value: String(value), error });
const diffs = (t: number[]) => t.slice(1).map((x, i) => x - t[i]!);

/** Errores de cálculo a ambos lados de la respuesta: completan cuando faltan errores de la regla. */
const slips = (answer: number) =>
  [
    err(answer + 1, 'Error de cálculo: una unidad de más.'),
    err(answer - 1, 'Error de cálculo: una unidad de menos.'),
    err(answer + 10, 'Error de cálculo: una decena de más.'),
    err(answer - 10, 'Error de cálculo: una decena de menos.'),
  ].map((d) => ({ ...d, generic: true }));

/** Errores al leer la diferencia (+4 en lugar de +5…), a los dos lados de la respuesta. */
const misreads = (l: number, s: number) =>
  [1, -1, 2, -2, 3, -3]
    .map((k) => s + Math.sign(s) * k)
    .filter((t) => t !== 0 && Math.sign(t) === Math.sign(s))
    .map((t) => err(l + t, `Calculas mal la diferencia: ${sign(t)} en lugar de ${sign(s)}.`));

type Raw = Omit<Draft<NumSerieStem>, 'stem' | 'answer'> & { terms: number[]; answer: number };
type Family = (rng: Rng) => Raw;

/** Suma constante. */
const arithmetic =
  (stepMin: number, stepMax: number, startMax: number, allowNegative: boolean): Family =>
  (rng) => {
    let step = rng.int(stepMin, stepMax);
    if (allowNegative && rng.next() < 0.5) step = -step;
    const start = step < 0 ? rng.int(-step * 7, -step * 7 + startMax) : rng.int(1, startMax);
    const terms = Array.from({ length: 5 }, (_, i) => start + i * step);
    const l = terms[4]!;
    const answer = l + step;
    return {
      terms,
      answer,
      observe: `Entre cada término y el siguiente hay siempre la misma diferencia: ${sign(step)}.`,
      rule: `Cada número es el anterior ${sign(step)}.`,
      apply: `${l} ${sign(step)} = ${answer}`,
      distractors: [
        err(l + 2 * step, `Aplicas el paso ${sign(step)} dos veces seguidas.`),
        ...misreads(l, step),
        ...slips(answer),
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
    answer,
    observe: `Cada término es ${r} veces el anterior: ${terms[3]} × ${r} = ${l}.`,
    rule: `Cada número es el anterior × ${r}.`,
    apply: `${l} × ${r} = ${answer}`,
    distractors: [
      err(l + lastDiff, `Sumas la última diferencia (${lastDiff}) en vez de multiplicar: la diferencia no es constante.`),
      err(l * (r + 1), `Multiplicas por ${r + 1} en lugar de por ${r}.`),
      err(l * r * r, `Multiplicas por ${r} dos veces.`),
      ...(r === 3 ? [err(l * 2, 'Multiplicas por 2 en lugar de por 3.')] : []),
      ...slips(answer),
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
    answer,
    observe: `Las diferencias crecen deprisa (${list(diffs(terms))}): hay una multiplicación.`,
    rule: `Cada número es el anterior × ${a} ${sign(b)}.`,
    apply: `${l} × ${a} ${sign(b)} = ${answer}`,
    distractors: [
      err(l * a, `Multiplicas por ${a} pero olvidas el ${sign(b)}.`),
      err((l + b) * a, `Cambias el orden: haces ${sign(b)} antes de multiplicar.`),
      err(l + lastDiff, `Sumas otra vez la última diferencia (${lastDiff}); no ves que se multiplica.`),
      err(l * (a + 1) + b, `Multiplicas por ${a + 1} en lugar de por ${a}.`),
      ...slips(answer),
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
    answer,
    observe: `Las diferencias son ${list(diffs(terms))}: aumentan ${dd} cada vez.`,
    rule: `Se suma una cantidad que crece ${dd} en cada paso.`,
    apply: `La siguiente diferencia es ${lastDiff} + ${dd} = ${nextDiff}; ${l} + ${nextDiff} = ${answer}`,
    distractors: [
      err(l + lastDiff, `Repites la última diferencia (${lastDiff}) sin aumentarla.`),
      err(l + nextDiff + dd, `Aumentas la diferencia dos veces (${nextDiff + dd}).`),
      ...slips(answer),
    ],
  };
};

/** Las diferencias crecen cada vez más: sus propias diferencias aumentan de forma constante. */
const cubic: Family = (rng) => {
  const d0 = rng.int(1, 5);
  const dd0 = rng.int(1, 3);
  const k = rng.int(1, 3);
  const second = Array.from({ length: 6 }, (_, i) => dd0 + i * k); // segundas diferencias
  const firstDiffs = [d0];
  for (let i = 0; i < 5; i++) firstDiffs.push(firstDiffs[i]! + second[i]!);
  const terms = [rng.int(1, 20)];
  for (let i = 0; i < 6; i++) terms.push(terms[i]! + firstDiffs[i]!);
  const l = terms[6]!;
  const lastDiff = firstDiffs[5]!;
  const lastSecond = second[4]!;
  const nextSecond = second[5]!;
  const nextDiff = lastDiff + nextSecond;
  const answer = l + nextDiff;
  return {
    terms,
    answer,
    observe: `Las diferencias son ${list(firstDiffs)}, y las diferencias entre ellas, ${list(second.slice(0, 5))}: también crecen, ${k} cada vez.`,
    rule: `La diferencia aumenta cada vez ${k} más que la vez anterior.`,
    apply: `Aumento siguiente: ${lastSecond} + ${k} = ${nextSecond}; diferencia: ${lastDiff} + ${nextSecond} = ${nextDiff}; ${l} + ${nextDiff} = ${answer}`,
    distractors: [
      err(l + lastDiff + lastSecond, `Repites el último aumento (${lastSecond}) sin aumentarlo en ${k}.`),
      err(l + lastDiff, `Repites la última diferencia (${lastDiff}).`),
      err(answer + k, `Aumentas el aumento dos veces (${k} de más).`),
      ...slips(answer),
    ],
  };
};

/**
 * Dos series intercaladas con reglas distintas. La que multiplica muestra 4 términos: con solo 3
 * («6, 12, 24») también valdría «diferencias que crecen 6» y la pregunta sería ambigua.
 */
const interleaved =
  (mixed: boolean): Family =>
  (rng) => {
    const count = mixed ? 9 : 7;
    const a0 = rng.int(1, 20);
    const sa = rng.int(2, 9);
    const b0 = rng.int(20, 60);
    let sb = rng.pick([-5, -4, -3, -2, 3, 4, 5, 6, 7]);
    // Con el mismo paso, las dos series juntas pueden formar una aritmética simple: no sería nivel 4.
    if (sb === sa) sb += 1;
    const ratio = rng.pick([2, 3]);
    const bStart = rng.int(1, ratio === 2 ? 9 : 4);
    const bAt = (k: number) => (mixed ? bStart * ratio ** k : b0 + k * sb);
    const terms: number[] = [];
    for (let i = 0; i < count; i++) terms.push(i % 2 === 0 ? a0 + (i / 2) * sa : bAt((i - 1) / 2));
    const bShown = (count - 1) / 2;
    const answer = bAt(bShown); // el siguiente término es de la serie de las posiciones pares
    const l = terms[count - 1]!;
    const bLast = terms[count - 2]!;
    const bPrev = terms[count - 4]!;
    const bRule = mixed ? `× ${ratio}` : sign(sb);
    return {
      terms,
      answer,
      observe: `Los términos en posición impar (${list(terms.filter((_, i) => i % 2 === 0))}) y en posición par (${list(terms.filter((_, i) => i % 2 === 1))}) siguen reglas distintas.`,
      rule: `Hay dos series intercaladas: la de las posiciones impares suma ${sa}; la de las pares va ${bRule}.`,
      apply: `Toca la serie de las posiciones pares: ${bLast} ${bRule} = ${answer}`,
      distractors: [
        err(l + sa, `Continúas la serie de las posiciones impares (${l} + ${sa}) cuando toca la de las pares.`),
        err(l + (l - bLast), 'Tratas todo como una sola serie y repites la última diferencia.'),
        ...(mixed
          ? [
              err(bLast + (bLast - bPrev), `Sumas la última diferencia de la serie par (${bLast - bPrev}) en vez de multiplicar.`),
              err(answer * ratio, `Multiplicas por ${ratio} dos veces.`),
            ]
          : [
              err(bLast + 2 * sb, `Aplicas el paso de la serie par (${sign(sb)}) dos veces.`),
              ...misreads(bLast, sb),
            ]),
        ...slips(answer),
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
    answer,
    observe: `Desde el tercero, cada término coincide con la suma de los dos anteriores: ${terms[0]} + ${terms[1]} = ${terms[2]}.`,
    rule: 'Cada número es la suma de los dos anteriores.',
    apply: `${p} + ${l} = ${answer}`,
    distractors: [
      err(l + (l - p), `Sumas la última diferencia (${l - p}) en vez de sumar los dos anteriores.`),
      err(l * 2, 'Duplicas el último término.'),
      err(l + p + terms[3]!, 'Sumas los tres anteriores en lugar de los dos anteriores.'),
      ...slips(answer),
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
  // El último paso (del 5.º al 6.º término) fue + a; el siguiente es × b.
  const answer = l * b;
  return {
    terms,
    answer,
    observe: `Los pasos se alternan: ${terms[0]} + ${a} = ${terms[1]}, ${terms[1]} × ${b} = ${terms[2]}, y así sucesivamente.`,
    rule: `Se alternan dos operaciones: primero + ${a}, después × ${b}.`,
    apply: `El último paso fue + ${a}, así que ahora toca × ${b}: ${l} × ${b} = ${answer}`,
    distractors: [
      err(l + a, `Aplicas otra vez + ${a}; no ves que las operaciones se alternan.`),
      err(answer + a, 'Aplicas las dos operaciones en el mismo paso.'),
      err(answer * b, `Multiplicas por ${b} dos veces.`),
      ...slips(answer),
    ],
  };
};

/** Familias por nivel: el 1 se resuelve en segundos; el 5 equivale a lo más difícil publicado. */
const families: Families<Family> = {
  1: { aritmetica: arithmetic(2, 9, 60, false) },
  2: { aritmeticaGrande: arithmetic(11, 25, 40, true), geometrica: geometric },
  3: { multiplicaYSuma: affine, diferenciasCrecientes: quadratic },
  4: { intercaladas: interleaved(false), diferenciasDeSegundoOrden: cubic },
  5: { fibonacci, operacionesAlternas: alternating, intercaladasMixtas: interleaved(true) },
};

const drafts = finishFamilies(families, ({ terms, answer, distractors, ...rest }: Raw) => {
  if ([...terms, answer].some((v) => v < 0 || v > MAX)) return null;
  return {
    ...rest,
    answer: String(answer),
    // Fuera: negativos, números enormes, términos ya visibles y, en una serie que solo sube (o solo
    // baja), lo que no sigue ese sentido. Se descartarían sin pensar.
    distractors: distractors.filter((d) => {
      const v = Number(d.value);
      if (v < 0 || v > MAX) return false;
      if (!terms.includes(answer) && terms.includes(v)) return false;
      const ds = diffs([...terms, answer]);
      if (ds.every((x) => x > 0) && v <= terms[terms.length - 1]!) return false;
      if (ds.every((x) => x < 0) && v >= terms[terms.length - 1]!) return false;
      return true;
    }),
    stem: { text: `¿Qué número continúa la serie? ${list(terms)}, ?`, terms },
  };
});

export const numSerie: Generator<NumSerieStem> = {
  type: 'NUM.SERIE',
  version: VERSION,
  levels,
  families: familyNames(families),
  compareOptions: byNumber,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'NUM.SERIE', version: VERSION, tip: TIP, solver: numSerieSolver, compare: byNumber, families: drafts },
      seed,
      level,
      optionCount,
    ),
};
