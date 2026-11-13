import { createRng, type Rng } from '../rng';
import { taxonomy, type TypeCode, typeCodes } from '../taxonomy';
import type { Level } from '../types';

export interface PracticeInput {
  /** Semilla de la sesión: la misma semilla da la misma lista (NFR-09). */
  sessionSeed: string;
  count: number;
  /** Si se indica, solo entran los tipos de esa aptitud (ENT-01). */
  aptitude?: string;
  /** `equitativo`: mezcla de simulacro; `prioritario`: más preguntas donde se falla (ENT-02). */
  reparto: 'equitativo' | 'prioritario';
  /** Fallos recientes por tipo; con `prioritario`, pesan más. */
  fallos?: Partial<Record<TypeCode, number>>;
  /** Semillas ya usadas por este usuario: no se vuelven a proponer (CON-02). */
  usedSeeds?: ReadonlySet<string>;
  levelFor: (type: TypeCode) => Level;
}

export interface PracticeItemSpec {
  type: TypeCode;
  level: Level;
  seed: string;
}

/**
 * Elige qué preguntas van en una sesión de práctica o en un simulacro.
 * Solo decide tipo, nivel y semilla; el enunciado lo genera el generador del tipo.
 */
export function buildPractice(input: PracticeInput): PracticeItemSpec[] {
  const candidates = typeCodes.filter(
    (code) => input.aptitude === undefined || taxonomy[code].aptitud === input.aptitude,
  );
  if (candidates.length === 0)
    throw new Error(`Ningún tipo de ejercicio tiene la aptitud ${input.aptitude}`);

  const rng: Rng = createRng(input.sessionSeed);
  const taken = new Set(input.usedSeeds ?? []);
  const order = rng.shuffle(candidates);
  const out: PracticeItemSpec[] = [];

  for (let i = 0; i < input.count; i++) {
    const type =
      input.reparto === 'equitativo'
        ? order[i % order.length]!
        : pickWeighted(rng, candidates, input.fallos);
    let seed: string;
    do {
      seed = rng.int(0, 2_147_483_647).toString(36);
    } while (taken.has(seed));
    taken.add(seed);
    out.push({ type, level: input.levelFor(type), seed });
  }
  // Barajado: el tipo de la siguiente pregunta no se puede prever (A, B, C… A, B, C…).
  return input.reparto === 'equitativo' ? rng.shuffle(out) : out;
}

function pickWeighted(
  rng: Rng,
  types: readonly TypeCode[],
  fallos: PracticeInput['fallos'] = {},
): TypeCode {
  const weights = types.map((t) => 1 + (fallos[t] ?? 0));
  let r = rng.next() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < types.length; i++) {
    r -= weights[i]!;
    if (r < 0) return types[i]!;
  }
  return types[types.length - 1]!;
}
