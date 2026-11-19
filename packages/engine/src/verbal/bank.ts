/**
 * Preguntas verbales redactadas (skill aptiq-generator, principio 4): no se generan por código.
 * Viven en Supabase y solo llegan a la app las aprobadas por una persona; la app las carga aquí
 * con `loadBank`. La semilla de una pregunta del banco es `${id}~${n}`: el id elige la pregunta y
 * `n`, el orden de las opciones. Con la misma semilla y la misma versión, la misma pregunta.
 */
import { createRng } from '../rng';
import { taxonomy, type TypeCode, typeCodes } from '../taxonomy';
import type { Generator, Item, Level, Solver, Stem } from '../types';

export type VerbalType = 'VER.SINON' | 'VER.ANALOG';

export interface VerbalEntry {
  id: string;
  tipo: VerbalType;
  nivel: Level;
  /** Sube cada vez que se edita la pregunta (reportes e historial). */
  version: number;
  enunciado: string;
  /** Cuatro opciones; los distractores, del más al menos plausible (con 3 opciones se quita el último). */
  opciones: string[];
  correcta: number;
  explicacion: Item['explanation'];
  /** Ya no está aprobada: se guarda para regenerar el historial, pero no se propone. */
  retirada?: boolean;
}

/** Preguntas aprobadas que necesita un tipo verbal para aparecer en la app (decisión del propietario). */
export const MIN_APROBADAS = 10;

const banks = new Map<TypeCode, Map<string, VerbalEntry>>();

/** Sustituye el banco entero (al abrir la app o tras descargar las aprobadas). */
export function loadBank(entries: readonly VerbalEntry[]) {
  banks.clear();
  for (const e of entries) {
    if (!banks.has(e.tipo)) banks.set(e.tipo, new Map());
    banks.get(e.tipo)!.set(e.id, e);
  }
}

export const isBankType = (t: TypeCode) => 'banco' in taxonomy[t];
/** Preguntas que se pueden proponer (aprobadas y no retiradas). */
export const bankEntries = (t: TypeCode): VerbalEntry[] => [...(banks.get(t)?.values() ?? [])].filter((e) => !e.retirada);

/** Tipos que se pueden proponer ahora: los generados siempre; los del banco, con bastantes preguntas. */
export const availableTypes = (): TypeCode[] =>
  typeCodes.filter((t) => !isBankType(t) || bankEntries(t).length >= MIN_APROBADAS);

const entryOf = (type: TypeCode, seed: string) => {
  const e = banks.get(type)?.get(seed.split('~')[0]!);
  if (!e) throw new Error(`${type}: la pregunta ${seed.split('~')[0]} no está en el banco`);
  return e;
};

export function bankGenerator(type: VerbalType): Generator {
  return {
    type,
    version: 'banco',
    levels: [1, 2, 3, 4, 5],
    families: { 1: ['banco'], 2: ['banco'], 3: ['banco'], 4: ['banco'], 5: ['banco'] },
    generate(seed, _level, optionCount) {
      const e = entryOf(type, seed);
      const wrong = e.opciones.map((_, i) => i).filter((i) => i !== e.correcta).slice(0, optionCount - 1);
      const order = createRng(`${type}:${seed}:${optionCount}`).shuffle([e.correcta, ...wrong]);
      const stem: Stem = { text: e.enunciado };
      return {
        id: `${type}:${e.version}:${seed}:${e.nivel}`,
        type,
        level: e.nivel,
        seed,
        stem,
        options: order.map((i) => e.opciones[i]!),
        answerIndex: order.indexOf(e.correcta),
        explanation: {
          ...e.explicacion,
          distractors: order.flatMap((orig, optionIndex) => {
            const d = e.explicacion.distractors.find((x) => x.optionIndex === orig);
            return d ? [{ optionIndex, error: d.error }] : [];
          }),
        },
        meta: {
          expectedSeconds: taxonomy[type].segundosEsperados[e.nivel - 1]!,
          generatorVersion: String(e.version),
          family: 'banco',
        },
      };
    },
  };
}

/** En lo redactado no hay solucionador automático: la única respuesta la garantiza la revisión humana. */
export const bankSolver = (type: VerbalType): Solver => ({
  type,
  validOptions: (item) => {
    const e = entryOf(type, item.seed);
    return item.options.flatMap((o, i) => (o === e.opciones[e.correcta] ? [i] : []));
  },
});

/** Problemas de una pregunta redactada; vacío si se puede aprobar. Lo usa el panel antes de aprobar. */
export function validateVerbal(e: VerbalEntry): string[] {
  const out: string[] = [];
  const x = e.explicacion;
  if (!e.enunciado.trim()) out.push('Falta el enunciado.');
  if (e.opciones.length !== 4 || e.opciones.some((o) => !o.trim())) out.push('Hacen falta cuatro opciones con texto.');
  if (new Set(e.opciones.map((o) => o.trim().toLowerCase())).size !== e.opciones.length) out.push('Hay opciones repetidas.');
  if (!(e.correcta >= 0 && e.correcta < e.opciones.length)) out.push('La respuesta correcta no es ninguna de las opciones.');
  if (![1, 2, 3, 4, 5].includes(e.nivel)) out.push('El nivel debe ser de 1 a 5.');
  for (const [k, name] of [['observe', 'Observa'], ['rule', 'Regla'], ['tip', 'Truco']] as const)
    if ((x[k] ?? '').trim().length < 10) out.push(`Falta el paso «${name}».`);
  if (!(x.apply ?? '').includes(e.opciones[e.correcta] ?? '\u0000'))
    out.push('El paso «Aplica» debe llegar a la respuesta correcta.');
  const wrong = e.opciones.map((_, i) => i).filter((i) => i !== e.correcta);
  const explained = wrong.every((i) => x.distractors.some((d) => d.optionIndex === i && d.error.trim().length >= 10));
  if (!explained) out.push('Falta explicar por qué falla cada opción incorrecta.');
  return out;
}
