// Genera apps/web/tokens.css desde docs/tokens.json (fuente única). Uso: node scripts/tokens-css.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const t = JSON.parse(readFileSync('docs/tokens.json', 'utf8'));
const px = (o, p) => Object.entries(o).map(([k, v]) => `  --${p}${k}: ${v}px;`);
const lines = [
  ...Object.entries(t.color).map(([k, v]) => `  --${k}: ${v};`),
  ...Object.entries(t.opacity).map(([k, v]) => `  --o-${k}: ${v};`),
  ...px(t.radius, 'r-'),
  ...px(t.spacing, 's-'),
  ...px(t.size, 'z-'),
  ...px(t.border, 'b-'),
  ...Object.entries(t.type).flatMap(([k, v]) => [
    `  --t-${k}: ${v.weight} ${v.size}px/${v.lineHeight ?? 1.2};`,
    `  --t-${k}-ls: ${v.letterSpacing ?? 0}em;`,
  ]),
  `  --d-fast: ${t.motion.durationFast}ms;`,
  `  --d-base: ${t.motion.durationBase}ms;`,
  `  --d-slow: ${t.motion.durationSlow}ms;`,
  `  --ease: cubic-bezier(${t.motion.easingCurve.join(', ')});`,
  `  --rot-stamp: ${t.rotate.stamp}deg;`,
];
writeFileSync('apps/web/tokens.css', `/* Generado por scripts/tokens-css.mjs desde docs/tokens.json. No editar a mano. */\n:root {\n${lines.join('\n')}\n}\n`);
