// node --test scripts/buscar-secretos.test.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { secretosEn } from './buscar-secretos.mjs';

const jwt = (payload) =>
  ['eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', Buffer.from(JSON.stringify(payload)).toString('base64url'), 'firmaFalsaDePrueba123'].join('.');

test('detecta la clave secreta moderna, pero no el prefijo suelto de supabase-js', () => {
  assert.deepEqual(secretosEn('const k = "sb_secret_AbCdEf0123456789xyz"'), ['clave sb_secret_']);
  assert.deepEqual(secretosEn('startsWith("sb_secret_")'), []);
  // En el paquete compilado los textos van pegados: «sb_secret_» + «_internal_expo_router…».
  assert.deepEqual(secretosEn('sb_secret__internal_expo_router_no_animation'), []);
});

test('detecta un JWT service_role y deja pasar el anon', () => {
  assert.deepEqual(secretosEn(jwt({ iss: 'supabase', role: 'service_role' })), ['JWT con role service_role']);
  assert.deepEqual(secretosEn(jwt({ iss: 'supabase', role: 'anon' })), []);
});

test('la variable de servicio solo cuenta si lleva valor', () => {
  assert.deepEqual(secretosEn("Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')"), []);
  assert.deepEqual(secretosEn('SUPABASE_SERVICE_ROLE_KEY=abcdefghijklmnopqrstuvwxyz'), ['SUPABASE_SERVICE_ROLE_KEY con valor']);
});

test('la clave publicable no es un secreto', () => {
  assert.deepEqual(secretosEn('EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-vEWzmgDSaRMuJstSjk9Rg'), []);
});
