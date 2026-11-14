const fs = require('node:fs');
const { expect, test } = require('@jest/globals');

/** Claves repetidas dentro de un mismo objeto JSON (JSON.parse no avisa: gana la última). */
function clavesRepetidas(raw) {
  const repetidas = [];
  const pila = [];
  const re = /"((?:[^"\\]|\\.)*)"\s*:|[{}]/g;
  for (const m of raw.matchAll(re)) {
    if (m[0] === '{') pila.push(new Set());
    else if (m[0] === '}') pila.pop();
    else {
      const claves = pila[pila.length - 1];
      if (claves.has(m[1])) repetidas.push(m[1]);
      claves.add(m[1]);
    }
  }
  return repetidas;
}

test('detecta claves repetidas', () => {
  expect(clavesRepetidas('{"a": {"b": 1}, "a": {"c": "x"}}')).toEqual(['a']);
  expect(clavesRepetidas('{"a": {"b": 1}, "c": {"b": 2}}')).toEqual([]);
});

// Le pasó al identificador de la app: un segundo bloque "android" lo pisaba y volvía a com.anonymous.aptiq.
test('app.json no repite claves y lleva el identificador confirmado por el propietario', () => {
  const raw = fs.readFileSync(require.resolve('../app.json'), 'utf8');
  expect(clavesRepetidas(raw)).toEqual([]);
  const { expo } = JSON.parse(raw);
  expect(expo.ios.bundleIdentifier).toBe('com.javioller.aptiq');
  expect(expo.android.package).toBe('com.javioller.aptiq');
});
