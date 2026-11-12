/**
 * Estado de un simulacro. Inmutable: cada función devuelve un estado nuevo.
 * El tiempo lo decide la app con sus marcas de reloj (`now`, en ms); aquí nunca se cuenta ticks (NFR-03).
 */
export interface ExamState {
  total: number;
  startedAt: number;
  durationMs: number;
  /** Opción elegida por pregunta, o null si quedó en blanco. */
  answers: (number | null)[];
  marked: boolean[];
  current: number;
  /** Hora de cierre (fin manual o agotamiento del tiempo); null mientras está abierto. */
  finishedAt: number | null;
}

export function createExam(total: number, startedAt: number, durationMs: number): ExamState {
  return {
    total,
    startedAt,
    durationMs,
    answers: Array.from({ length: total }, () => null),
    marked: Array.from({ length: total }, () => false),
    current: 0,
    finishedAt: null,
  };
}

const deadline = (s: ExamState): number => s.startedAt + s.durationMs;

export function remainingMs(s: ExamState, now: number): number {
  if (s.finishedAt !== null) return 0;
  return Math.max(0, deadline(s) - now);
}

/** Cierra el examen si el tiempo se ha agotado, con la hora exacta del agotamiento. */
export function tick(s: ExamState, now: number): ExamState {
  if (s.finishedAt !== null || now < deadline(s)) return s;
  return { ...s, finishedAt: deadline(s) };
}

export function finish(s: ExamState, now: number): ExamState {
  if (s.finishedAt !== null) return s;
  return { ...s, finishedAt: Math.min(now, deadline(s)) };
}

function assertIndex(s: ExamState, index: number): void {
  if (!Number.isInteger(index) || index < 0 || index >= s.total)
    throw new Error(`Pregunta ${index} fuera de rango (0-${s.total - 1})`);
}

export function answer(s: ExamState, index: number, option: number, now: number): ExamState {
  assertIndex(s, index);
  if (!Number.isInteger(option) || option < 0 || option > 3) throw new Error(`Opción ${option} no válida`);
  const closed = tick(s, now);
  if (closed.finishedAt !== null) return closed;
  const answers = [...s.answers];
  answers[index] = option;
  return { ...s, answers };
}

export function mark(s: ExamState, index: number): ExamState {
  assertIndex(s, index);
  const marked = [...s.marked];
  marked[index] = !marked[index];
  return { ...s, marked };
}

export function goTo(s: ExamState, index: number): ExamState {
  assertIndex(s, index);
  return { ...s, current: index };
}
