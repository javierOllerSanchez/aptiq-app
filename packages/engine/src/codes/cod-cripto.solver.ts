import { ALPHABET } from '../series/alphabet';
import type { Item, Solver, Stem } from '../types';

export interface CodCriptoStem extends Stem {
  /** Ejemplos con su versión codificada, tal como los ve el opositor. */
  examples: { plain: string; code: string }[];
  target: string;
}

/**
 * Solucionador independiente de códigos. No conoce la clave: prueba todas las claves razonables
 * que encajan con los ejemplos y reúne lo que cada una produce para la palabra pedida.
 *  1. Sustitución directa (cada letra → un símbolo fijo), si la palabra solo usa letras conocidas.
 *  2. Desplazamientos en el alfabeto con periodo 1 o 2 (p. ej. +2 / −1 alternos), sin dar la vuelta.
 */
export function predictCodes(examples: CodCriptoStem['examples'], target: string): Set<string> {
  const out = new Set<string>();

  // 1. Sustitución directa.
  const map = new Map<string, string>();
  let consistent = examples.every((e) => e.plain.length === e.code.length);
  for (const e of examples)
    [...e.plain].forEach((ch, i) => {
      const prev = map.get(ch);
      if (prev !== undefined && prev !== e.code[i]) consistent = false;
      map.set(ch, e.code[i]!);
    });
  if (consistent && [...target].every((ch) => map.has(ch))) out.add([...target].map((ch) => map.get(ch)).join(''));

  // 2. Desplazamientos (solo si los códigos son letras).
  const idx = (ch: string) => ALPHABET.indexOf(ch);
  if (examples.every((e) => [...e.code].every((ch) => idx(ch) >= 0))) {
    for (let a = -6; a <= 6; a++)
      for (let b = -6; b <= 6; b++) {
        if (a === 0 && b === 0) continue;
        const shiftAt = (i: number) => (i % 2 === 0 ? a : b);
        const enc = (w: string) => {
          const r = [...w].map((ch, i) => ALPHABET[idx(ch) + shiftAt(i)]);
          return r.every(Boolean) ? r.join('') : null;
        };
        if (examples.every((e) => enc(e.plain) === e.code)) {
          const t = enc(target);
          if (t) out.add(t);
        }
      }
  }
  return out;
}

export const codCriptoSolver: Solver<CodCriptoStem> = {
  type: 'COD.CRIPTO',
  validOptions: (item: Item<CodCriptoStem>) => {
    const predicted = predictCodes(item.stem.examples, item.stem.target);
    return item.options.flatMap((o, i) => (predicted.has(o) ? [i] : []));
  },
};
