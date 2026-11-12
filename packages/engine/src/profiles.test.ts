import { readdirSync, readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

import { validateProfile, type ExamProfile } from './profile';

const dir = new URL('../profiles/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));

test('hay al menos un perfil', () => {
  expect(files.length).toBeGreaterThan(0);
});

test.each(files)('el perfil %s cita una fuente oficial para cada dato o lo marca como pendiente', (f) => {
  const profile = JSON.parse(readFileSync(new URL(f, dir), 'utf8')) as ExamProfile;
  expect(validateProfile(profile)).toEqual([]);
  expect(`${profile.id}.json`).toBe(f);
});
