#!/usr/bin/env node
// Fase 5 · T7 (NFR-06): falla si aparece una clave secreta de Supabase en el repositorio
// o en el paquete de la app. Uso:
//   node scripts/buscar-secretos.mjs             → archivos versionados en git
//   node scripts/buscar-secretos.mjs <carpeta>   → además, todo lo que haya en <carpeta> (p. ej. el export de Expo)
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Skills de terceros: documentación ajena con ejemplos de claves; no forman parte de la app.
const IGNORAR = [/^\.claude\/skills\//, /^pnpm-lock\.yaml$/];

/** Devuelve los motivos por los que `texto` contiene un secreto (vacío si no hay ninguno). */
export function secretosEn(texto) {
  const hallazgos = [];
  // Clave secreta moderna. supabase-js contiene el prefijo suelto «sb_secret_» para detectarlas: no cuenta.
  if (/sb_secret_[A-Za-z0-9-][A-Za-z0-9_-]{15,}/.test(texto)) hallazgos.push('clave sb_secret_');
  // Variable de la clave de servicio con un valor asignado (no solo el nombre).
  if (/SUPABASE_SERVICE_ROLE_KEY\s*[=:]\s*['"]?[A-Za-z0-9._-]{20,}/.test(texto)) {
    hallazgos.push('SUPABASE_SERVICE_ROLE_KEY con valor');
  }
  // JWT heredado cuyo rol es service_role.
  for (const [jwt] of texto.matchAll(/eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g)) {
    try {
      const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString('utf8'));
      if (payload.role === 'service_role') hallazgos.push('JWT con role service_role');
    } catch {
      // no es un JWT válido: se ignora
    }
  }
  return hallazgos;
}

function archivosDe(carpeta) {
  const out = [];
  for (const nombre of readdirSync(carpeta)) {
    const ruta = join(carpeta, nombre);
    if (statSync(ruta).isDirectory()) out.push(...archivosDe(ruta));
    else out.push(ruta);
  }
  return out;
}

if (process.argv[1]?.endsWith('buscar-secretos.mjs')) {
  const versionados = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
    .split('\0')
    .filter((f) => f && !IGNORAR.some((r) => r.test(f)));
  const extra = process.argv[2] ? archivosDe(process.argv[2]) : [];

  let fallos = 0;
  for (const archivo of [...versionados, ...extra]) {
    let texto;
    try {
      texto = readFileSync(archivo, 'latin1');
    } catch {
      continue; // borrado en el árbol de trabajo
    }
    for (const motivo of secretosEn(texto)) {
      console.error(`SECRETO · ${archivo}: ${motivo}`);
      fallos++;
    }
  }
  if (fallos) {
    console.error(`\n${fallos} posible(s) secreto(s). Quítalos y rota la clave en el panel de Supabase.`);
    process.exit(1);
  }
  console.log(`Sin secretos en ${versionados.length + extra.length} archivos.`);
}
