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
  'Gira mentalmente un solo detalle (un cuadro que sobresale, una muesca o una esquina) y descarta primero las figuras que lo tienen al otro lado: son el espejo. Solo entonces comprueba el resto cuadro a cuadro.';
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

/** Ancho y alto, en cualquier orden: la caja de una figura girada es la misma. */
const boxOf = (cells: readonly Cell[]) => {
  const n = normalize(cells);
  return [Math.max(...n.map((c) => c[0])), Math.max(...n.map((c) => c[1]))].sort().join('x');
};

/**
 * La misma figura con un cuadro cambiado de sitio, que ya no es la figura ni su espejo, no es
 * simétrica (su espejo sería ella misma girada) y ocupa la misma caja (si no, se descartaría
 * sin girar nada).
 */
function moved(rng: Rng, cells: readonly Cell[], model: readonly Cell[]): Cell[] | null {
  for (let t = 0; t < 200; t++) {
    const drop = rng.int(0, cells.length - 1);
    const rest = cells.filter((_, i) => i !== drop);
    if (!connected(rest)) continue;
    const [x, y] = rng.pick(rest);
    const [dx, dy] = rng.pick(STEPS);
    const add: Cell = [x + dx, y + dy];
    if (has(cells, add)) continue;
    const out = [...rest, add];
    if (
      extentOk(out) &&
      boxOf(out) === boxOf(model) &&
      !sameShape(model, out) &&
      !sameShape(mirror(model), out) &&
      !sameShape(out, mirror(out))
    )
      return normalize(out);
  }
  return null;
}

/** `turns`: giros posibles en cuartos de vuelta (90° es más fácil de imaginar que 180°). */
type Config = { cells: [number, number]; turns: number[] };

const giro = (cfg: Config) => (rng: Rng): Draft<EspGiroStem> | null => {
  const base = grow(rng, rng.int(...cfg.cells));
  // Una figura igual a su espejo tendría dos respuestas correctas.
  if (!base || sameShape(base, mirror(base))) return null;
  const model = normalize(rotate(base, rng.int(0, 3)));
  // Solo giros que cambian el dibujo: con simetría de media vuelta, 180° dejaría el modelo igual.
  const turnsOk = cfg.turns.filter((t) => encodeCells(rotate(model, t)) !== encodeCells(model));
  if (turnsOk.length === 0) return null;
  const turns = rng.pick(turnsOk);
  const answer = normalize(rotate(model, turns));

  const mirrorError =
    'Es el modelo en espejo: los detalles que en el modelo salen hacia un lado aquí salen hacia el contrario, y eso no se consigue girando.';
  const changedError =
    'Ocupa el mismo espacio, pero tiene un cuadro en otro sitio: compárala fila a fila con el modelo girado.';
  // Opciones: correcta, su espejo, una figura con un cuadro cambiado y el espejo de esa. Así no se
  // acierta buscando «la figura distinta» ni «la pareja de figuras iguales».
  const changed = moved(rng, rotate(answer, rng.int(0, 3)), model);
  if (!changed) return null;
  const turn = () => rng.int(0, 3);
  const distractors: Distractor[] = [
    { value: encodeCells(rotate(mirror(answer), turn())), error: mirrorError },
    { value: encodeCells(changed), error: changedError },
    {
      value: encodeCells(rotate(mirror(changed), turn())),
      error: 'Tiene un cuadro en otro sitio: por mucho que la gires, no coincide con el modelo.',
    },
  ];
  return {
    stem: { text: '¿Qué figura es el modelo girado, sin darle la vuelta?', model: encodeCells(model) },
    answer: encodeCells(answer),
    distractors,
    observe: 'Elige un detalle del modelo fácil de seguir (un cuadro que sobresale o una muesca) y fíjate hacia qué lado mira respecto al resto.',
    rule: 'Al girar, cada detalle sigue mirando hacia el mismo lado respecto al resto de la figura; en un espejo, mira hacia el lado contrario. Solo vale la que coincide con el modelo girado, cuadro a cuadro.',
    apply: `Gira el modelo ${TURNS[turns]}: queda ${describeCells(answer)}.`,
  };
};

const families: Families<ReturnType<typeof giro>> = {
  1: { giro: giro({ cells: [4, 5], turns: [1, 3] }) },
  2: { giro: giro({ cells: [5, 6], turns: [1, 3] }) },
  3: { giro: giro({ cells: [6, 7], turns: [1, 2, 3] }) },
  4: { giro: giro({ cells: [7, 8], turns: [1, 2, 3] }) },
  5: { giro: giro({ cells: [7, 9], turns: [2] }) },
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
