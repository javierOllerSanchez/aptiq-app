// Comprueba las longitudes de docs/tiendas/ficha.md contra los límites de las tiendas. Uso: node scripts/ficha-longitudes.mjs
import { readFileSync } from 'node:fs';

const md = readFileSync('docs/tiendas/ficha.md', 'utf8');
const despues = (titulo) => md.split(titulo)[1].split('\n\n')[1].trim();
const fila = (campo) => md.match(new RegExp(`^\\| ${campo} \\| \\d+ \\| (.+) \\|$`, 'm'))[1];
const completa = md.split('**Descripción completa** (máx. 4.000):')[1].split('**Capturas:**')[0].trim();

const comprobar = [
  ['Nombre', md.match(/^\| Nombre de la app \| (.+) \|$/m)[1], 30],
  ['Descripción breve', despues('**Descripción breve** (máx. 80):'), 80],
  ['Descripción completa', completa, 4000],
  ['Subtítulo', fila('Subtítulo'), 30],
  ['Palabras clave', fila('Palabras clave'), 100],
  ['Texto promocional', fila('Texto promocional'), 170],
];
let mal = 0;
for (const [campo, texto, max] of comprobar) {
  const n = [...texto].length;
  if (n > max) mal++;
  console.log(`${n > max ? 'MAL' : 'ok '} ${campo}: ${n} / ${max}`);
}
process.exit(mal ? 1 : 0);
