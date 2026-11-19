import { buildItem, familyNames, type Distractor, type Draft, type Families } from '../build';
import { polygon, regular, transform, type Drawing, type Point, type Shape } from '../figures/draw';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import {
  absFigurasSolver,
  decodeTerm,
  encodeTerm,
  mod8,
  PARTS,
  type AbsFigurasStem,
  type Part,
  type Term,
} from './abs-figuras.solver';

const VERSION = '1';
const TIP =
  'No mires la serie entera de golpe: sigue un solo elemento cada vez y anota cuánto gira o avanza de una figura a la siguiente. Si los pasos no son iguales, comprueba si se alternan.';

const DIR = ['arriba', 'arriba a la derecha', 'la derecha', 'abajo a la derecha', 'abajo', 'abajo a la izquierda', 'la izquierda', 'arriba a la izquierda'];
/** Casillas del borde de la cuadrícula de 3 × 3, en el sentido de las agujas del reloj. */
const POS = ['arriba a la izquierda', 'arriba', 'arriba a la derecha', 'a la derecha', 'abajo a la derecha', 'abajo', 'abajo a la izquierda', 'a la izquierda'];
const RING: Point[] = [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]];
const NAME: Record<Part, string> = { f: 'La flecha', p: 'El punto', a: 'El aro' };

const describeTerm = (t: Term) =>
  PARTS.filter((p) => t[p] !== undefined)
    .map((p) => (p === 'f' ? `flecha hacia ${DIR[t.f!]}` : `${p === 'p' ? 'punto' : 'aro'} ${POS[t[p]!]}`))
    .join(', ');

const sense = (s: number) => (s > 0 ? 'en el sentido de las agujas del reloj' : 'en sentido contrario a las agujas del reloj');
const move = (p: Part, s: number) =>
  p === 'f'
    ? `gira ${Math.abs(s) * 45}° ${sense(s)}`
    : `avanza ${Math.abs(s)} ${Math.abs(s) === 1 ? 'casilla' : 'casillas'} por el borde ${sense(s)}`;

// --- Dibujo: marco de 3 × 3 con la flecha en el centro y el punto y el aro en el borde.
const ARROW: Point[] = [[0, -0.42], [0.3, -0.08], [0.11, -0.08], [0.11, 0.42], [-0.11, 0.42], [-0.11, -0.08], [-0.3, -0.08]];
const FRAME = polygon([[0.05, 0.05], [2.95, 0.05], [2.95, 2.95], [0.05, 2.95]], 'none', 'ink', 0.06);
const at = (cx: number, cy: number) => (x: number, y: number): Point => [cx + 0.5 + x, cy + 0.5 + y];

function drawTerm(t: Term): Drawing {
  const shapes: Shape[] = [transform(FRAME, (x, y) => [x, y])];
  if (t.f !== undefined) {
    const a = (t.f * Math.PI) / 4;
    const [c, s] = [Math.cos(a), Math.sin(a)];
    shapes.push(transform(polygon(ARROW, 'ink'), (x, y) => at(1, 1)(x * c - y * s, x * s + y * c)));
  }
  if (t.a !== undefined) shapes.push(transform(polygon(regular(0, 0, 0.32, 20), 'none', 'ink', 0.08), at(...RING[t.a]!)));
  if (t.p !== undefined) shapes.push(transform(polygon(regular(0, 0, 0.22, 20), 'ink'), at(...RING[t.p]!)));
  return { size: 3, shapes };
}

// --- Generación.
type Config = { parts: Part[]; maxStep: number; alternate?: Part };

/** Paso de 1 a `max` (× 45° o casillas), en cualquier sentido. Nunca 4: media vuelta no tiene sentido. */
const step = (rng: Rng, max: number) => rng.int(1, max) * (rng.next() < 0.5 ? 1 : -1);

const serie = (cfg: Config) => (rng: Rng): Draft<AbsFigurasStem> | null => {
  const steps = {} as Record<Part, number[]>;
  const start = {} as Record<Part, number>;
  for (const p of cfg.parts) {
    start[p] = rng.int(0, 7);
    if (p === cfg.alternate) {
      const sign = rng.next() < 0.5 ? 1 : -1;
      const [x, y] = rng.shuffle([1, 2, 3]);
      steps[p] = [x! * sign, y! * sign];
    } else steps[p] = [step(rng, cfg.maxStep)];
  }
  const shown = cfg.alternate ? 5 : 4;
  const value = (p: Part, i: number) =>
    mod8(start[p] + Array.from({ length: i }, (_, j) => steps[p][j % steps[p].length]!).reduce((a, b) => a + b, 0));
  const termAt = (i: number): Term => Object.fromEntries(cfg.parts.map((p) => [p, value(p, i)]));
  const terms = Array.from({ length: shown }, (_, i) => termAt(i));
  const answer = termAt(shown);
  const last = terms.at(-1)!;
  const nextStep = (p: Part) => steps[p][(shown - 1) % steps[p].length]!;

  // Errores típicos de cada elemento, del más al menos plausible.
  const variants = (p: Part): { value: number; error: string }[] => {
    const s = nextStep(p);
    const unit = p === 'f' ? '45°' : 'una casilla';
    const verb = p === 'f' ? 'gira' : 'avanza';
    const out = rng.shuffle([
      { value: last[p]! + s + Math.sign(s), error: `${NAME[p]} ${verb} ${unit} de más.` },
      { value: last[p]! + s - Math.sign(s), error: `${NAME[p]} ${verb} ${unit} de menos.` },
    ]);
    if (steps[p].length === 2)
      out.unshift({ value: last[p]! + steps[p][shown % 2]!, error: `${NAME[p]} repite el paso anterior, pero los pasos se alternan.` });
    out.push(
      { value: last[p]! - s, error: `${NAME[p]} se mueve en el sentido contrario.` },
      { value: last[p]!, error: `${NAME[p]} se queda como en la última figura: falta aplicar el cambio.` },
      { value: last[p]! + 2 * s, error: `${NAME[p]} aplica el cambio dos veces.` },
    );
    return out
      .map((v) => ({ ...v, value: mod8(v.value) }))
      .filter((v, i, all) => v.value !== answer[p] && all.findIndex((w) => w.value === v.value) === i);
  };
  const wrong = Object.fromEntries(cfg.parts.map((p) => [p, variants(p)])) as Record<Part, ReturnType<typeof variants>>;
  /** Distractor con un error elegido (índice en `wrong`) por elemento; null = ese elemento bien. */
  const combo = (pick: Partial<Record<Part, number>>): Distractor => {
    const t: Term = { ...answer };
    const errors: string[] = [];
    for (const p of cfg.parts)
      if (pick[p] !== undefined) {
        t[p] = wrong[p][pick[p]]!.value;
        errors.push(wrong[p][pick[p]]!.error);
      }
    return { value: encodeTerm(t), error: errors.join(' ') };
  };
  const [p1, p2, p3] = cfg.parts;
  // Con varios elementos, cada valor correcto no puede ser el más repetido entre las opciones
  // (se acertaría eligiendo «lo que más se repite»). Por eso los distractores comparten errores.
  const distractors: Distractor[] =
    cfg.parts.length === 1
      ? wrong[p1!].map((_, i) => combo({ [p1!]: i }))
      : cfg.parts.length === 2
        ? [combo({ [p1!]: 0, [p2!]: 0 }), combo({ [p1!]: 1, [p2!]: 0 }), combo({ [p1!]: 0 })]
        : [combo({ [p1!]: 0, [p2!]: 0, [p3!]: 0 }), combo({ [p1!]: 1, [p2!]: 0, [p3!]: 0 }), combo({ [p1!]: 0 })];

  const rules = cfg.parts.map((p) =>
    steps[p].length === 2
      ? `${NAME[p].toLowerCase()} ${move(p, steps[p][0]!)} y luego ${move(p, steps[p][1]!).replace(/^(gira|avanza) /, '')}, y así se van alternando`
      : `${NAME[p].toLowerCase()} ${move(p, steps[p][0]!)} cada vez`,
  );
  const firstUpper = (s: string) => s[0]!.toUpperCase() + s.slice(1);
  return {
    stem: { text: '¿Qué figura continúa la serie?', terms: terms.map(encodeTerm) },
    answer: encodeTerm(answer),
    distractors,
    observe:
      cfg.parts.length === 1
        ? `Solo cambia un elemento: ${NAME[cfg.parts[0]!].toLowerCase()}. Mira cuánto se mueve entre una figura y la siguiente.`
        : `Cambian ${cfg.parts.length} elementos a la vez. Síguelos por separado, uno cada vez.`,
    rule: rules.map((r) => `${firstUpper(r)}.`).join(' '),
    apply: `Aplicado a la última figura, la siguiente tiene: ${describeTerm(answer)}.`,
  };
};

const families: Families<ReturnType<typeof serie>> = {
  1: { giro: serie({ parts: ['f'], maxStep: 2 }), recorrido: serie({ parts: ['p'], maxStep: 2 }) },
  2: { giro: serie({ parts: ['f'], maxStep: 3 }), recorrido: serie({ parts: ['p'], maxStep: 3 }) },
  3: { doble: serie({ parts: ['f', 'p'], maxStep: 2 }) },
  4: { doble: serie({ parts: ['f', 'p'], maxStep: 3 }), alterna: serie({ parts: ['f'], maxStep: 3, alternate: 'f' }) },
  5: {
    triple: serie({ parts: ['f', 'p', 'a'], maxStep: 3 }),
    alternaDoble: serie({ parts: ['f', 'p'], maxStep: 3, alternate: 'f' }),
  },
};

export const absFiguras: Generator<AbsFigurasStem> = {
  type: 'ABS.FIGURAS',
  version: VERSION,
  levels,
  families: familyNames(families),
  describe: (option) => describeTerm(decodeTerm(option)),
  draw: {
    stem: (stem) => ({
      drawings: stem.terms.map((t) => drawTerm(decodeTerm(t))),
      alt: `Serie: ${stem.terms.map((t, i) => `${i + 1}) ${describeTerm(decodeTerm(t))}`).join('; ')}; ¿cuál sigue?`,
    }),
    option: (option) => drawTerm(decodeTerm(option)),
  },
  generate: (seed, level, optionCount) =>
    buildItem(
      { type: 'ABS.FIGURAS', version: VERSION, tip: TIP, solver: absFigurasSolver, families },
      seed,
      level,
      optionCount,
    ),
};
