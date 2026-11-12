// Exporta preguntas de muestra a docs/muestras/ para revisión humana (skill aptiq-generator).
// Uso: pnpm --filter @aptiq/engine muestras
import { mkdirSync, writeFileSync } from 'node:fs';

import { test } from 'vitest';

import { levels, registry, taxonomy, typeCodes, type Item } from '../src';

const PER_LEVEL = 4; // 4 por nivel × 5 niveles = 20 por tipo (decisión del propietario)
const LETTERS = 'ABCD';
const out = new URL('../../../docs/muestras/', import.meta.url);

const render = (item: Item, n: number) => {
  const e = item.explanation;
  const errors = new Map(e.distractors.map((d) => [d.optionIndex, d.error]));
  return [
    `### ${n}. Nivel ${item.level} · semilla \`${item.seed}\``,
    '',
    item.stem.text.includes('\n') ? '```\n' + item.stem.text + '\n```' : `> ${item.stem.text}`,
    '',
    ...item.options.map(
      (o, i) => `- **${LETTERS[i]})** ${o}${i === item.answerIndex ? ' ✔ correcta' : ` — ${errors.get(i)}`}`,
    ),
    '',
    `1. **Observa:** ${e.observe}`,
    `2. **Regla:** ${e.rule}`,
    `3. **Aplica:** ${e.apply}`,
    '',
    '- [ ] Revisada · Comentarios:',
    '',
  ].join('\n');
};

test('exportar muestras', () => {
  mkdirSync(out, { recursive: true });
  for (const code of typeCodes) {
    const { generator } = registry[code];
    const items = levels.flatMap((level) =>
      Array.from({ length: PER_LEVEL }, (_, k) => generator.generate(`muestra-${level}-${k + 1}`, level, 4)),
    );
    const md = [
      `# Muestras · ${taxonomy[code].nombre} (\`${code}\`, versión ${generator.version})`,
      '',
      `${taxonomy[code].descripcion}`,
      '',
      'Generadas automáticamente para revisión humana. Para cada pregunta, comprueba:',
      '- que solo hay una respuesta defendible;',
      '- que la explicación es correcta y clara;',
      '- que cada error descrito es plausible;',
      '- que la dificultad crece con el nivel.',
      '',
      `**Truco de examen del tipo:** ${items[0]!.explanation.tip}`,
      '',
      ...items.map((item, i) => render(item, i + 1)),
    ].join('\n');
    writeFileSync(new URL(`${code.toLowerCase().replace('.', '-')}.md`, out), md);
  }
});
