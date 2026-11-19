import { createRng, type Rng } from '../rng';
import { taxonomy, type TypeCode } from '../taxonomy';
import { availableTypes, bankEntries, isBankType } from '../verbal/bank';
import type { Level } from '../types';

export interface PracticeInput {
  /** Semilla de la sesión: la misma semilla da la misma lista (NFR-09). */
  sessionSeed: string;
  count: number;
  /** Si se indica, solo entran los tipos de esa aptitud (ENT-01). */
  aptitude?: string;
  /** Si se indica, solo entran estos tipos (plan gratuito, fase 7). */
  types?: readonly TypeCode[];
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
  const candidates = availableTypes().filter(
    (code) =>
      (input.aptitude === undefined || taxonomy[code].aptitud === input.aptitude) &&
      (input.types === undefined || input.types.includes(code)),
  );
  if (candidates.length === 0)
    throw new Error(`Ningún tipo permitido para la aptitud ${input.aptitude ?? '(todas)'}`);

  const rng: Rng = createRng(input.sessionSeed);
  const taken = new Set(input.usedSeeds ?? []);
  const order = rng.shuffle(candidates);
  const out: PracticeItemSpec[] = [];

  for (let i = 0; i < input.count; i++) {
    const type =
      input.reparto === 'equitativo'
        ? order[i % order.length]!
        : pickWeighted(rng, candidates, input.fallos);
    const level = input.levelFor(type);
    out.push({ type, level, seed: nextSeed(type, level, rng, taken) });
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

/**
 * Semilla nueva para una pregunta (CON-02: no repetir). En los tipos del banco, la semilla elige
 * una pregunta aún no vista, del nivel más cercano; si ya se han visto todas, se repite alguna.
 */
export function nextSeed(type: TypeCode, level: Level, rng: Rng, taken: Set<string>): string {
  let seed: string;
  if (isBankType(type)) {
    const seen = new Set([...taken].map((s) => s.split('~')[0]));
    const entries = bankEntries(type);
    const fresh = entries.filter((e) => !seen.has(e.id));
    const pool = fresh.length ? fresh : entries;
    const best = Math.min(...pool.map((e) => Math.abs(e.nivel - level)));
    const id = rng.pick(pool.filter((e) => Math.abs(e.nivel - level) === best)).id;
    do seed = `${id}~${rng.int(0, 1_679_615).toString(36)}`;
    while (taken.has(seed));
  } else {
    do seed = rng.int(0, 2_147_483_647).toString(36);
    while (taken.has(seed));
  }
  taken.add(seed);
  return seed;
}
