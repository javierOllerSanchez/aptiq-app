// Exporta preguntas de muestra a docs/muestras/ para revisión humana (skill aptiq-generator).
// Uso: pnpm --filter @aptiq/engine muestras
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

import { test } from 'vitest';

import { isBankType, levels, registry, taxonomy, typeCodes, type Drawing, type Generator, type Item } from '../src';

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

// Colores de la guía (docs/tokens.json, fuente única) para pintar las figuras.
const color = JSON.parse(readFileSync(new URL('../../../docs/tokens.json', import.meta.url), 'utf8')).color as Record<
  string,
  string
>;
const paint = (p: string) => (p === 'none' ? 'none' : color[p]);
const svg = (d: Drawing, label: string, px = 110) =>
  `<svg viewBox="0 0 ${d.size} ${d.size}" width="${px}" height="${px}" role="img" aria-label="${label}">` +
  d.shapes.map((s) => `<path d="${s.d}" fill="${paint(s.fill)}" stroke="${paint(s.stroke)}" stroke-width="${s.width}"/>`).join('') +
  '</svg>';

/** Tipos con figuras: HTML con los dibujos (en Markdown no se verían). */
function renderHtml(gen: Generator, item: Item, n: number) {
  const e = item.explanation;
  const errors = new Map(e.distractors.map((d) => [d.optionIndex, d.error]));
  const { drawings, alt } = gen.draw!.stem(item.stem);
  return `<section><h3>${n}. Nivel ${item.level} · semilla <code>${item.seed}</code></h3>
<p>${item.stem.text}</p><div class="fila">${drawings.map((d) => svg(d, alt, drawings.length === 1 ? 200 : 110)).join('')}</div>
<ol type="A">${item.options
    .map(
      (o, i) =>
        `<li>${svg(gen.draw!.option(o), gen.describe!(o))} ${i === item.answerIndex ? '<b>✔ correcta</b>' : errors.get(i)}</li>`,
    )
    .join('')}</ol>
<p><b>Observa:</b> ${e.observe}<br><b>Regla:</b> ${e.rule}<br><b>Aplica:</b> ${e.apply}</p>
<p>☐ Revisada · Comentarios:</p></section>`;
}

test('exportar muestras', () => {
  mkdirSync(out, { recursive: true });
  // Las verbales del banco se revisan en el panel, no aquí.
  for (const code of typeCodes.filter((c) => !isBankType(c))) {
    const { generator } = registry[code];
    const items = levels.flatMap((level) =>
      Array.from({ length: PER_LEVEL }, (_, k) => generator.generate(`muestra-${level}-${k + 1}`, level, 4)),
    );
    const name = code.toLowerCase().replace('.', '-');
    if (generator.draw) {
      const html = `<!doctype html><meta charset="utf-8"><title>Muestras · ${taxonomy[code].nombre}</title>
<style>body{font-family:sans-serif;background:${color.paper};color:${color.ink};max-width:900px;margin:auto;padding:16px}
svg{background:${color.paperCard};border:1px solid ${color.line};border-radius:8px;vertical-align:middle;margin:4px}
li{margin:6px 0}section{border-top:1px solid ${color.line};padding-top:8px}</style>
<h1>Muestras · ${taxonomy[code].nombre} (<code>${code}</code>, versión ${generator.version})</h1>
<p>${taxonomy[code].descripcion}</p>
<p>Generadas automáticamente para revisión humana. Comprueba que solo hay una respuesta defendible, que la explicación es correcta, que cada error es plausible y que la dificultad crece con el nivel.</p>
<p><b>Truco de examen del tipo:</b> ${items[0]!.explanation.tip}</p>
${items.map((item, i) => renderHtml(generator, item, i + 1)).join('\n')}`;
      writeFileSync(new URL(`${name}.html`, out), html);
      continue;
    }
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
    writeFileSync(new URL(`${name}.md`, out), md);
  }
});
