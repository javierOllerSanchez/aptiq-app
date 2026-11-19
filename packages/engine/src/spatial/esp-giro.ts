import { buildItem, familyNames, type Distractor, type Draft, type Families } from '../build';
import {
  cellsDrawing,
  decodeCells,
  describeCells,
  encodeCells,
  mirror,
  normalize,
  rotate,
  sameShape,
  type Cell,
} from '../figures/grid';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import { espGiroSolver, type EspGiroStem } from './esp-giro.solver';

const VERSION = '1';
/** Caja de los dibujos, en cuadros: igual para el modelo y las opciones (el tamaño no delata). */
const BOX = 4;
const TIP =
  'Gira mentalmente un solo detalle (el saliente o una esquina) y descarta primero las figuras que lo tienen al otro lado: son el espejo. Solo entonces comprueba el resto.';
const TURNS = ['', '90° en el sentido de las agujas del reloj', '180° (media vuelta)', '90° en sentido contrario a las agujas del reloj'];

const STEPS: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const has = (cells: readonly Cell[], [x, y]: Cell) => cells.some((c) => c[0] === x && c[1] === y);
const extentOk = (cells: readonly Cell[]) =>
  normalize(cells).every(([x, y]) => x < BOX && y < BOX);

function connected(cells: readonly Cell[]) {
  const seen: Cell[] = [cells[0]!];
  for (let i = 0; i < seen.length; i++)
    for (const [dx, dy] of STEPS) {
      const n: Cell = [seen[i]![0] + dx, seen[i]![1] + dy];
      if (has(cells, n) && !has(seen, n)) seen.push(n);
    }
  return seen.length === cells.length;
}

/** Figura de `n` cuadros unidos por un lado, que cabe en la caja. */
function grow(rng: Rng, n: number): Cell[] | null {
  const cells: Cell[] = [[0, 0]];
  for (let guard = 0; cells.length < n && guard < 200; guard++) {
    const [x, y] = rng.pick(cells);
    const [dx, dy] = rng.pick(STEPS);
    const next: Cell = [x + dx, y + dy];
    if (!has(cells, next) && extentOk([...cells, next])) cells.push(next);
  }
  return cells.length === n ? normalize(cells) : null;
}

/** La misma figura con un cuadro cambiado de sitio, que ya no es la figura ni su espejo. */
function moved(rng: Rng, cells: readonly Cell[], model: readonly Cell[]): Cell[] | null {
  for (let t = 0; t < 30; t++) {
    const drop = rng.int(0, cells.length - 1);
    const rest = cells.filter((_, i) => i !== drop);
    if (!connected(rest)) continue;
    const [x, y] = rng.pick(rest);
    const [dx, dy] = rng.pick(STEPS);
    const add: Cell = [x + dx, y + dy];
    if (has(cells, add)) continue;
    const out = [...rest, add];
    if (extentOk(out) && !sameShape(model, out) && !sameShape(mirror(model), out)) return normalize(out);
  }
  return null;
}

type Config = { cells: [number, number]; changedFirst: boolean };

const giro = (cfg: Config) => (rng: Rng): Draft<EspGiroStem> | null => {
  const base = grow(rng, rng.int(...cfg.cells));
  // Una figura igual a su espejo tendría dos respuestas correctas.
  if (!base || sameShape(base, mirror(base))) return null;
  const model = normalize(rotate(base, rng.int(0, 3)));
  const turns = rng.int(1, 3);
  const answer = normalize(rotate(model, turns));
  if (encodeCells(answer) === encodeCells(model)) return null;

  const mirrorError =
    'Es el modelo en espejo: para conseguirla habría que darle la vuelta al papel, no basta con girarlo.';
  const changedError =
    'Se parece, pero tiene un cuadro en otro sitio: compárala cuadro a cuadro con el modelo girado.';
  const mirrors: Distractor[] = [0, 1, 2, 3].map((t) => ({
    value: encodeCells(rotate(mirror(answer), t)),
    error: mirrorError,
  }));
  const changed: Distractor[] = [0, 1].flatMap(() => {
    const m = moved(rng, rotate(answer, rng.int(0, 3)), model);
    return m ? [{ value: encodeCells(m), error: changedError }] : [];
  });
  return {
    stem: { text: '¿Qué figura es el modelo girado, sin darle la vuelta?', model: encodeCells(model) },
    answer: encodeCells(answer),
    distractors: cfg.changedFirst ? [changed[0]!, ...mirrors, ...changed.slice(1)].filter(Boolean) : [...mirrors, ...changed],
    observe: `El modelo tiene ${model.length} cuadros. Busca su detalle más reconocible (el saliente o la fila más larga) y fíjate en a qué lado queda.`,
    rule: 'Girar una figura no cambia su forma; darle la vuelta (espejo) sí. Solo vale la que coincide con el modelo después de girarlo.',
    apply: `Gira el modelo ${TURNS[turns]}: queda ${describeCells(answer)}.`,
  };
};

const families: Families<ReturnType<typeof giro>> = {
  1: { espejo: giro({ cells: [4, 5], changedFirst: false }) },
  2: { espejo: giro({ cells: [5, 6], changedFirst: false }) },
  3: { espejo: giro({ cells: [6, 7], changedFirst: false }), cambio: giro({ cells: [6, 7], changedFirst: true }) },
  4: { espejo: giro({ cells: [7, 8], changedFirst: false }), cambio: giro({ cells: [7, 8], changedFirst: true }) },
  5: { cambio: giro({ cells: [8, 9], changedFirst: true }) },
};

export const espGiro: Generator<EspGiroStem> = {
  type: 'ESP.GIRO',
  version: VERSION,
  levels,
  families: familyNames(families),
  describe: (option) => describeCells(decodeCells(option)),
  draw: {
    stem: (stem) => ({
      drawings: [cellsDrawing(decodeCells(stem.model), BOX)],
      alt: `Modelo: ${describeCells(decodeCells(stem.model))}`,
    }),
    option: (option) => cellsDrawing(decodeCells(option), BOX),
  },
  generate: (seed, level, optionCount) =>
    buildItem({ type: 'ESP.GIRO', version: VERSION, tip: TIP, solver: espGiroSolver, families }, seed, level, optionCount),
};
