// node --test scripts/buscar-secretos.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { secretosEn } from './buscar-secretos.mjs';

// Valores falsos montados en tiempo de ejecución: así este archivo no dispara la búsqueda sobre el repositorio.
const P = 'sb_' + 'secret_';
const V = 'SUPABASE_SERVICE_' + 'ROLE_KEY';

const jwt = (payload) =>
  ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', Buffer.from(JSON.stringify(payload)).toString('base64url'), 'firmaFalsaDePrueba123'].join('.');

test('detecta la clave secreta moderna, pero no el prefijo suelto de supabase-js', () => {
  assert.deepEqual(secretosEn(`const k = "${P}AbCdEf0123456789xyz"`), ['clave sb_secret_']);
  assert.deepEqual(secretosEn('startsWith("sb_secret_")'), []);
  // En el paquete compilado los textos van pegados: «sb_secret_» + «_internal_expo_router…».
  assert.deepEqual(secretosEn('sb_secret__internal_expo_router_no_animation'), []);
  // Hermes pega textos sin separador: «sb_secret_» + «addResourceSpans» + «entry» (fase 9).
  assert.deepEqual(secretosEn('removePartsb_secret_addResourceSpansentry.is_remote'), []);
});

test('detecta un JWT service_role y deja pasar el anon', () => {
  assert.deepEqual(secretosEn(jwt({ iss: 'supabase', role: 'service_role' })), ['JWT con role service_role']);
  assert.deepEqual(secretosEn(jwt({ iss: 'supabase', role: 'anon' })), []);
});

test('la variable de servicio solo cuenta si lleva valor', () => {
  assert.deepEqual(secretosEn("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')"), []);
  assert.deepEqual(secretosEn(`${V}=abcdefghijklmnopqrstuvwxyz`), ['SUPABASE_SERVICE_ROLE_KEY con valor']);
});

test('la clave publicable no es un secreto', () => {
  assert.deepEqual(secretosEn('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-vEWzmgDSaRMuJstSjk9Rg'), []);
});
