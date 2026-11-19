import { buildItem, familyNames, type Distractor, type Draft, type Families } from '../build';
import { mirror, normalize, rotate } from '../figures/grid';
import type { Rng } from '../rng';
import { levels, type Generator } from '../types';

import {
  CROSS_NETS,
  decodeNet,
  describeSym,
  orientation,
  describeView,
  encodeNet,
  fold,
  NETS,
  netDrawing,
  parseView,
  ROTATIONS,
  SYMBOLS,
  viewDrawing,
  viewOf,
  type CubeFace,
  type NetFace,
  type Sym,
} from './cube';
import { espCuboSolver, type EspCuboStem } from './esp-cubo.solver';

const VERSION = '1';
const TIP =
  'Descarta primero las opciones que juntan dos caras opuestas. Después fíjate en una esquina: las tres caras que la forman van siempre en el mismo orden. Si una cara tiene un dibujo con dirección, comprueba hacia qué cara vecina apunta en el desarrollo.';

const PLAIN: Sym[] = ['circulo', 'cuadro', 'aro', 'marco', 'cruz', 'equis'];
const the = (s: Sym) => SYMBOLS[s].the;

type Config = { nets: [number, number][][]; symbols: (rng: Rng) => Sym[]; kinds: ('opp' | 'swap' | 'rot')[] };

const cubo = (cfg: Config) => (rng: Rng): Draft<EspCuboStem> | null => {
  const base = rng.pick(cfg.nets);
  const turned = rotate(rng.next() < 0.5 ? mirror(base) : base, rng.int(0, 3));
  const syms = rng.shuffle(cfg.symbols(rng));
  const net: NetFace[] = normalize(turned).map(([x, y], i) => ({ x, y, sym: syms[i]!, rho: rng.int(0, 3) }));
  const faces = fold(net);
  const bySym = (s: Sym) => faces.find((f) => f.sym === s)!;
  const opposite = (f: CubeFace) => faces.find((g) => g.normal.every((n, k) => n === -f.normal[k]!))!;
  const answer = viewOf(faces, rng.pick(ROTATIONS));

  // Cada error se aplica a otra vista posible del cubo, no a la correcta: si no, la correcta sería
  // la opción que comparte más caras con las demás.
  const other = () => parseView(viewOf(faces, rng.pick(ROTATIONS)));
  const join = (v: { sym: Sym; r: number }[]) => v.map((s) => `${s.sym}${s.r}`).join(' ');
  const makers: Record<'opp' | 'swap' | 'rot', () => Distractor | null> = {
    opp: () => {
      const v = other();
      const [keep, drop] = rng.shuffle([0, 1, 2]);
      const o = opposite(bySym(v[keep!]!.sym)).sym;
      v[drop!] = { sym: o, r: rng.int(0, SYMBOLS[o].period - 1) };
      return {
        value: join(v),
        error: `Junta ${the(v[keep!]!.sym)} y ${the(o)}, que son caras opuestas: en el cubo nunca se ven a la vez.`,
      };
    },
    swap: () => {
      const v = other();
      const [a, b] = rng.shuffle([0, 1, 2]);
      [v[a!], v[b!]] = [v[b!]!, v[a!]!];
      return {
        value: join(v),
        error: 'Las tres caras se tocan en el cubo, pero alrededor de la esquina van en el orden inverso.',
      };
    },
    rot: () => {
      for (let t = 0; t < 10; t++) {
        const v = other();
        const slots = [0, 1, 2].filter((i) => SYMBOLS[v[i]!.sym].period > 1);
        if (slots.length === 0) continue;
        const i = rng.pick(slots);
        const { sym, r } = v[i]!;
        const period = SYMBOLS[sym].period;
        v[i] = { sym, r: (r + rng.int(1, period - 1)) % period };
        return {
          value: join(v),
          error: `Las caras pueden ir juntas, pero ${the(sym)} no queda así: en esa posición quedaría ${orientation(sym, r, i === 0)}.`,
        };
      }
      return null;
    },
  };
  const distractors = cfg.kinds.map((k) => makers[k]()).filter((d) => d !== null);

  const pairs = PLAIN.concat(['raya', 'flecha', 'triangulo', 'media'])
    .filter((s) => faces.some((f) => f.sym === s))
    .reduce<string[]>((out, s) => {
      const o = opposite(bySym(s)).sym;
      return out.some((p) => p.includes(the(o))) ? out : [...out, `${the(s)} y ${the(o)}`];
    }, []);
  // Hacia qué cara apunta cada dibujo con dirección: no cambia al plegar ni al girar el cubo.
  const pointsTo = faces
    .filter((f) => SYMBOLS[f.sym].period === 4)
    .map((f) => `${the(f.sym)} apunta hacia ${the(faces.find((g) => g.normal.every((n, k) => n === f.up[k]))!.sym)}`);
  const directional = faces.some((f) => SYMBOLS[f.sym].period > 1);
  return {
    stem: { text: '¿Qué cubo se puede formar con este desarrollo?', net: encodeNet(net) },
    answer,
    distractors,
    observe: 'Empieza por las caras opuestas: en el cubo nunca se ven dos a la vez.',
    rule:
      `Caras opuestas: ${pairs.join('; ')}. Alrededor de una esquina, las tres caras van siempre en el mismo orden; en un espejo, ese orden se invierte.` +
      (directional ? ' Un dibujo con dirección apunta siempre hacia la misma cara vecina.' : ''),
    apply:
      (pointsTo.length ? `Al plegar, ${pointsTo.join('; ')}. ` : '') +
      `Sin caras opuestas juntas y con las caras en el orden del desarrollo, solo vale: ${describeView(answer)}.`,
  };
};

const plain = (n: number) => (rng: Rng) => rng.shuffle(PLAIN).slice(0, n);
const families: Families<ReturnType<typeof cubo>> = {
  1: { opuestas: cubo({ nets: CROSS_NETS, symbols: plain(6), kinds: ['opp', 'opp', 'opp', 'swap'] }) },
  2: {
    opuestas: cubo({ nets: NETS, symbols: plain(6), kinds: ['opp', 'opp', 'opp', 'swap'] }),
    espejo: cubo({ nets: NETS, symbols: plain(6), kinds: ['swap', 'opp', 'swap', 'opp'] }),
  },
  3: {
    espejo: cubo({ nets: NETS, symbols: (rng) => [...plain(5)(rng), 'raya'], kinds: ['swap', 'opp', 'swap', 'opp'] }),
    giro: cubo({ nets: NETS, symbols: (rng) => [...plain(5)(rng), 'raya'], kinds: ['rot', 'swap', 'rot', 'opp', 'opp'] }),
  },
  4: {
    espejo: cubo({ nets: NETS, symbols: (rng) => [...plain(4)(rng), 'flecha', 'triangulo'], kinds: ['swap', 'rot', 'opp', 'swap', 'opp'] }),
    giro: cubo({ nets: NETS, symbols: (rng) => [...plain(4)(rng), 'flecha', 'triangulo'], kinds: ['rot', 'swap', 'rot', 'opp', 'opp'] }),
  },
  5: {
    giro: cubo({
      nets: NETS,
      symbols: (rng) => [...plain(2)(rng), 'raya', 'flecha', 'triangulo', 'media'],
      kinds: ['rot', 'rot', 'swap', 'rot', 'opp', 'opp'],
    }),
  },
};

const describeNet = (net: NetFace[]) => {
  const ys = [...new Set(net.map((f) => f.y))].sort((a, b) => b - a);
  const minX = Math.min(...net.map((f) => f.x));
  return ys
    .map(
      (y, i) =>
        `fila ${i + 1}: ` +
        net
          .filter((f) => f.y === y)
          .sort((a, b) => a.x - b.x)
          .map((f) => `${describeSym(f.sym, f.rho % SYMBOLS[f.sym].period)} en la columna ${f.x - minX + 1}`)
          .join(', '),
    )
    .join('; ');
};

export const espCubo: Generator<EspCuboStem> = {
  type: 'ESP.CUBO',
  version: VERSION,
  levels,
  families: familyNames(families),
  describe: describeView,
  draw: {
    stem: (stem) => ({
      drawings: [netDrawing(decodeNet(stem.net))],
      alt: `Desarrollo del cubo. ${describeNet(decodeNet(stem.net))}.`,
    }),
    option: viewDrawing,
  },
  generate: (seed, level, optionCount) =>
    buildItem({ type: 'ESP.CUBO', version: VERSION, tip: TIP, solver: espCuboSolver, families }, seed, level, optionCount),
};
