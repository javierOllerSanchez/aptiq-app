import { buildItem, byNumber, familyNames, finishFamilies, type Draft, type Families } from '../build';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import { numCalcSolver, type CalcData, type NumCalcStem } from './num-calc.solver';

const VERSION = '2';
const TIP =
  'Antes de calcular, estima el resultado (redondea los datos). Si una opción está muy lejos de tu estimación, descártala. En operaciones combinadas, primero multiplicaciones y divisiones; después sumas y restas.';

/** Números en español: separador de miles a partir de 10.000 (1.250 se escribe sin punto). */
export const fmt = (n: number) =>
  Math.abs(n) >= 10_000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n);
const show = (expr: string) => expr.replace(/-/g, '−');

type Raw = Omit<Draft<NumCalcStem>, 'stem' | 'answer' | 'distractors'> & {
  data: CalcData;
  text: string;
  answer: number;
  /** Valor máximo con sentido (p. ej. el total en un porcentaje): lo que lo supera se descarta. */
  max?: number;
  distractors: { value: number; error: string; generic?: boolean }[];
};
type Family = (rng: Rng) => Raw | null;

/** Errores de cálculo a ambos lados: completan cuando faltan errores de la regla. */
const slips = (answer: number) =>
  [
    { value: answer + 1, error: 'Error de cálculo: una unidad de más.' },
    { value: answer - 1, error: 'Error de cálculo: una unidad de menos.' },
    { value: answer + 10, error: 'Error de cálculo: una decena de más.' },
    { value: answer - 10, error: 'Error de cálculo: una decena de menos.' },
  ].map((d) => ({ ...d, generic: true }));

const addSub: Family = (rng) => {
  const a = rng.int(20, 99);
  const b = rng.int(10, 99);
  const c = rng.int(5, 60);
  const answer = a + b - c;
  const expr = `${a} + ${b} - ${c}`;
  return {
    data: { kind: 'expr', expr },
    text: `¿Cuál es el resultado de ${show(expr)}?`,
    answer,
    observe: 'Solo hay sumas y restas: se hacen de izquierda a derecha.',
    rule: 'Suma los dos primeros números y resta el tercero.',
    apply: `${a} + ${b} = ${a + b}; ${a + b} − ${c} = ${answer}`,
    distractors: [
      { value: a + b + c, error: `Sumas ${c} en lugar de restarlo.` },
      { value: a - b + c, error: `Restas ${b} y sumas ${c}: cambias los signos.` },
      ...slips(answer),
    ],
  };
};

const product: Family = (rng) => {
  const a = rng.int(3, 9);
  let b = rng.int(12, 39);
  if (b % 10 === 0) b += 1; // con unidades 0 la descomposición no enseña nada
  const tens = b - (b % 10);
  const answer = a * b;
  const expr = `${a} × ${b}`;
  return {
    data: { kind: 'expr', expr },
    text: `¿Cuál es el resultado de ${expr}?`,
    answer,
    observe: `Descompón ${b} en decenas y unidades para multiplicar de cabeza.`,
    rule: `${a} × ${b} = ${a} × ${tens} + ${a} × ${b % 10}.`,
    apply: `${a * tens} + ${a * (b % 10)} = ${answer}`,
    distractors: [
      { value: answer + a, error: `Multiplicas por ${b + 1} en lugar de por ${b}.` },
      { value: answer - a, error: `Multiplicas por ${b - 1} en lugar de por ${b}.` },
      { value: a * tens + (b % 10), error: `Sumas las unidades (${b % 10}) en vez de multiplicarlas por ${a}.` },
      ...slips(answer),
    ],
  };
};

const precedence =
  (parens: boolean): Family =>
  (rng) => {
    if (!parens) {
      const a = rng.int(5, 40);
      const b = rng.int(2, 9);
      const c = rng.int(3, 12);
      const d = rng.int(1, 20);
      const answer = a + b * c - d;
      const expr = `${a} + ${b} × ${c} - ${d}`;
      return {
        data: { kind: 'expr', expr },
        text: `¿Cuál es el resultado de ${show(expr)}?`,
        answer,
        observe: 'Hay una multiplicación entre sumas y restas: va primero.',
        rule: 'Primero multiplicaciones y divisiones; después sumas y restas, de izquierda a derecha.',
        apply: `${b} × ${c} = ${b * c}; ${a} + ${b * c} − ${d} = ${answer}`,
        distractors: [
          { value: (a + b) * c - d, error: 'Operas de izquierda a derecha sin dar prioridad a la multiplicación.' },
          { value: a + b * c + d, error: `Sumas ${d} en lugar de restarlo.` },
          { value: a + b * (c - d), error: 'Restas antes de multiplicar.' },
          ...slips(answer),
        ],
      };
    }
    const d = rng.pick([2, 3, 4, 5]);
    let c = rng.int(2, 6);
    if (c === d) c += 1; // × d ÷ d se anularía
    const a = rng.int(5, 30);
    let b = rng.int(3, 30);
    b += (d - ((a + b) % d)) % d; // (a + b) divisible entre d
    const answer = ((a + b) * c) / d;
    const expr = `(${a} + ${b}) × ${c} ÷ ${d}`;
    return {
      data: { kind: 'expr', expr },
      text: `¿Cuál es el resultado de ${expr}?`,
      answer,
      observe: 'Hay un paréntesis: se resuelve antes que nada.',
      rule: 'Paréntesis primero; después multiplicaciones y divisiones de izquierda a derecha.',
      apply: `${a} + ${b} = ${a + b}; ${a + b} × ${c} = ${(a + b) * c}; ${(a + b) * c} ÷ ${d} = ${answer}`,
      distractors: [
        { value: a + (b * c) / d, error: 'Ignoras el paréntesis y multiplicas antes de sumar.' },
        { value: (a + b) * c, error: `Olvidas dividir entre ${d}.` },
        { value: (a + b) / d, error: `Olvidas multiplicar por ${c}.` },
        { value: answer + c, error: `Error al multiplicar: sumas ${c} de más.` },
        ...slips(answer),
      ],
    };
  };

const percent =
  (ps: number[]): Family =>
  (rng) => {
    const p = rng.pick(ps);
    const unit = 100 / gcd(p, 100);
    const n = unit * rng.int(Math.ceil(40 / unit), Math.floor(900 / unit));
    const answer = (n * p) / 100;
    return {
      data: { kind: 'percent', p, n },
      text: `¿Cuánto es el ${p} % de ${fmt(n)}?`,
      answer,
      max: n,
      observe: `El ${p} % significa ${p} de cada 100.`,
      rule: `Multiplica ${fmt(n)} por ${p} y divide entre 100.`,
      apply: `${fmt(n)} × ${p} ÷ 100 = ${fmt(answer)}`,
      distractors: [
        { value: (n * p) / 1000, error: 'Corres la coma un lugar de más al dividir.' },
        { value: n - answer, error: `Calculas el ${100 - p} % (lo que queda) en vez del ${p} %.` },
        { value: (n * p) / 10, error: 'Divides entre 10 en vez de entre 100.' },
        ...slips(answer),
      ],
    };
  };

const fraction: Family = (rng) => {
  const den = rng.int(3, 8);
  // Fracción irreducible: en un examen nunca aparecería 2/8 en lugar de 1/4.
  const num = rng.pick(Array.from({ length: den - 2 }, (_, i) => i + 2).filter((k) => gcd(k, den) === 1));
  const n = den * rng.int(10, 90);
  const part = n / den;
  const answer = part * num;
  return {
    data: { kind: 'fraction', num, den, n },
    text: `¿Cuánto son los ${num}/${den} de ${fmt(n)}?`,
    answer,
    max: n,
    observe: `Primero se calcula una de las ${den} partes iguales.`,
    rule: `Divide entre ${den} y multiplica por ${num}.`,
    apply: `${fmt(n)} ÷ ${den} = ${part}; ${part} × ${num} = ${fmt(answer)}`,
    distractors: [
      { value: part, error: `Calculas solo 1/${den}: olvidas multiplicar por ${num}.` },
      { value: n - answer, error: `Calculas la parte que queda (${den - num}/${den}).` },
      { value: answer + part, error: `Multiplicas por ${num + 1} en lugar de por ${num}.` },
      { value: answer - part, error: `Multiplicas por ${num - 1} en lugar de por ${num}.` },
      ...slips(answer),
    ],
  };
};

const rule3 =
  (inverse: boolean): Family =>
  (rng) => {
    if (!inverse) {
      const k = rng.int(3, 15); // kg por caja
      const a = rng.int(2, 9);
      let c = rng.int(2, 12);
      if (c === a) c += 1;
      const b = k * a;
      const answer = k * c;
      return {
        data: { kind: 'rule3', a, b, c, inverse: false },
        text: `Si ${a} cajas iguales pesan ${b} kg, ¿cuántos kg pesan ${c} cajas?`,
        answer,
        observe: 'A más cajas, más peso, en la misma proporción: regla de tres directa.',
        rule: `Peso = ${c} × (${b} ÷ ${a}).`,
        apply: `${b} ÷ ${a} = ${k} kg por caja; ${c} × ${k} = ${answer}`,
        distractors: [
          { value: b + (c - a), error: 'Sumas la diferencia de cajas en lugar de multiplicar.' },
          { value: answer + k, error: 'Cuentas una caja de más.' },
          { value: answer - k, error: 'Cuentas una caja de menos.' },
          ...slips(answer),
        ],
      };
    }
    const total = rng.pick([12, 24, 30, 36, 48, 60, 72]);
    const divisors = [2, 3, 4, 6, 8, 12].filter((d) => total % d === 0);
    const a = rng.pick(divisors);
    let c = rng.pick(divisors);
    if (c === a) c = divisors.find((d) => d !== a)!;
    const b = total / a;
    const answer = total / c;
    return {
      data: { kind: 'rule3', a, b, c, inverse: true },
      text: `${a} operarios tardan ${b} días en terminar una obra. Al mismo ritmo, ¿cuántos días tardarían ${c} operarios?`,
      answer,
      observe: 'A más operarios, menos días: es una regla de tres inversa.',
      rule: `Días = ${a} × ${b} ÷ ${c} (el trabajo total, ${a} × ${b}, no cambia).`,
      apply: `${a} × ${b} = ${total}; ${total} ÷ ${c} = ${answer}`,
      distractors: [
        { value: (b * c) / a, error: 'Aplicas una regla de tres directa: más operarios no significa más días.' },
        { value: b + (a - c), error: 'Sumas la diferencia de operarios a los días.' },
        { value: b - (a - c), error: 'Restas la diferencia de operarios a los días.' },
        ...slips(answer),
      ],
    };
  };

const change: Family = (rng) => {
  const p = rng.pick([10, 20, 25, 30, 40, 50]);
  const up = rng.next() < 0.5;
  const unit = 100 / gcd(p, 100);
  const n = unit * rng.int(Math.ceil(20 / unit), Math.floor(400 / unit));
  const delta = (n * p) / 100;
  const answer = up ? n + delta : n - delta;
  return {
    data: { kind: 'change', p, n, up },
    text: `Un artículo cuesta ${fmt(n)} euros. Si su precio ${up ? 'sube' : 'baja'} un ${p} %, ¿cuántos euros cuesta ahora?`,
    answer,
    observe: `Hay que calcular el ${p} % y ${up ? 'sumarlo al' : 'restarlo del'} precio.`,
    rule: `Precio nuevo = precio ${up ? '+' : '−'} ${p} % del precio.`,
    apply: `${p} % de ${fmt(n)} = ${fmt(delta)}; ${fmt(n)} ${up ? '+' : '−'} ${fmt(delta)} = ${fmt(answer)}`,
    distractors: [
      { value: up ? n - delta : n + delta, error: `Aplicas una ${up ? 'bajada' : 'subida'} en lugar de una ${up ? 'subida' : 'bajada'}.` },
      { value: up ? n + p : n - p, error: `${up ? 'Sumas' : 'Restas'} ${p} euros en lugar del ${p} %.` },
      { value: delta, error: `Te quedas con el ${p} % y no lo ${up ? 'sumas al' : 'restas del'} precio.` },
      ...slips(answer),
    ],
  };
};

const chain: Family = (rng) => {
  const p1 = rng.pick([10, 20, 25, 50]);
  const p2 = rng.pick([10, 20, 25, 50]);
  const n = 100 * rng.int(2, 99);
  const mid = (n * (100 + p1)) / 100;
  const answer = (mid * (100 - p2)) / 100;
  return {
    data: { kind: 'chain', n, p1, p2 },
    text: `Un precio de ${fmt(n)} euros sube un ${p1} % y después baja un ${p2} %. ¿Cuál es el precio final, en euros?`,
    answer,
    observe: 'La bajada se calcula sobre el precio ya subido, no sobre el original.',
    rule: 'Aplica cada porcentaje sobre el resultado del anterior.',
    apply: `${fmt(n)} + ${p1} % = ${fmt(mid)}; ${fmt(mid)} − ${p2} % = ${fmt(answer)}`,
    distractors: [
      { value: (n * (100 + p1 - p2)) / 100, error: 'Sumas y restas los porcentajes sobre el precio original.' },
      { value: mid, error: 'Olvidas aplicar la bajada.' },
      { value: (n * (100 - p2)) / 100, error: 'Olvidas aplicar la subida.' },
      { value: n, error: 'Crees que subir y bajar un porcentaje deja el precio igual.' },
      ...slips(answer),
    ],
  };
};

/** Porcentaje inverso: se conoce el precio después del cambio y se pide el de antes. */
const reverse: Family = (rng) => {
  const p = rng.pick([10, 20, 25, 50]);
  const up = rng.next() < 0.5;
  const n = (100 / gcd(p, 100)) * rng.int(2, 60);
  const final = (n * (100 + (up ? p : -p))) / 100;
  const wrong = (final * (100 + (up ? -p : p))) / 100;
  return {
    data: { kind: 'reverse', p, final, up },
    text: `Después de ${up ? 'subir' : 'bajar'} un ${p} %, un artículo cuesta ${fmt(final)} euros. ¿Cuántos euros costaba antes?`,
    answer: n,
    observe: `${fmt(final)} euros es el ${100 + (up ? p : -p)} % del precio de antes, no el 100 %.`,
    rule: `Precio de antes = ${fmt(final)} × 100 ÷ ${100 + (up ? p : -p)}.`,
    apply: `${fmt(final)} × 100 ÷ ${100 + (up ? p : -p)} = ${fmt(n)}`,
    distractors: [
      { value: wrong, error: `${up ? 'Restas' : 'Sumas'} el ${p} % del precio final: el porcentaje se aplicó sobre el precio de antes.` },
      { value: up ? final - p : final + p, error: `${up ? 'Restas' : 'Sumas'} ${p} euros en lugar de deshacer el ${p} %.` },
      { value: (final * (100 + (up ? p : -p))) / 100, error: `Aplicas otra vez el cambio en lugar de deshacerlo.` },
      ...slips(n),
    ],
  };
};

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const families: Families<Family> = {
  1: { sumasYRestas: addSub, multiplicacion: product },
  2: { porcentajeSencillo: percent([10, 20, 25, 50]), prioridad: precedence(false) },
  3: { porcentaje: percent([5, 15, 30, 40, 60, 75]), fraccion: fraction, reglaDeTres: rule3(false) },
  4: { subidaOBajada: change, reglaDeTresInversa: rule3(true), parentesis: precedence(true) },
  5: { porcentajesEncadenados: chain, porcentajeInverso: reverse },
};

const drafts = finishFamilies(families, (raw: Raw) => {
  if (!Number.isInteger(raw.answer) || raw.answer <= 0) return null;
  return {
    stem: { text: raw.text, data: raw.data },
    answer: fmt(raw.answer),
    // Solo enteros positivos y con sentido: un decimal, un negativo o una parte mayor que el todo
    // delatarían el error sin calcular.
    distractors: raw.distractors
      .filter((d) => Number.isInteger(d.value) && d.value > 0 && (raw.max === undefined || d.value < raw.max))
      .map((d) => ({ value: fmt(d.value), error: d.error, ...(d.generic && { generic: true }) })),
    observe: raw.observe,
    rule: raw.rule,
    apply: raw.apply,
  };
});

export const numCalc: Generator<NumCalcStem> = {
  type: 'NUM.CALC',
  version: VERSION,
  levels,
  families: familyNames(families),
  compareOptions: byNumber,
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'NUM.CALC', version: VERSION, tip: TIP, solver: numCalcSolver, compare: byNumber, families: drafts },
      seed,
      level,
      optionCount,
    ),
};
