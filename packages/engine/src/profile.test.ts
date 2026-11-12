import { expect, test } from 'vitest';

import { validateProfile, type ExamProfile } from './profile';

const valid = (): ExamProfile => ({
  id: 'prueba-2026',
  oposicion: 'Oposición de prueba',
  convocatoria: '2026',
  version: 1,
  sources: [
    {
      organismo: 'BOE',
      titulo: 'Bases',
      url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-0001',
      tipo: 'bases',
      fechaConsulta: '2026-11-12',
    },
  ],
  format: {
    preguntas: 80,
    minutos: 55,
    opciones: 4,
    puntuacion: { maxima: 30, minima: 12 },
  },
  mix: null,
  fieldSources: {
    'format.preguntas': 0,
    'format.minutos': 0,
    'format.opciones': 0,
    'format.puntuacion.maxima': 0,
    'format.puntuacion.minima': 0,
  },
  pendiente: ['mix'],
  notas: {},
});

test('un perfil con todas sus fuentes es válido', () => {
  expect(validateProfile(valid())).toEqual([]);
});

test('un dato no nulo sin fuente es un error', () => {
  const p = valid();
  delete p.fieldSources['format.minutos'];
  expect(validateProfile(p)).toContain('format.minutos tiene valor pero no tiene fuente en fieldSources');
});

test('un dato nulo que no está en «pendiente» es un error', () => {
  const p = valid();
  p.pendiente = [];
  expect(validateProfile(p)).toContain('mix es nulo pero no está en pendiente');
});

test('un dato marcado como pendiente no puede tener valor', () => {
  const p = valid();
  p.pendiente.push('format.minutos');
  expect(validateProfile(p)).toContain('format.minutos está en pendiente pero tiene valor');
});

test('una fuente debe ser de un organismo público (dominio oficial)', () => {
  const p = valid();
  p.sources[0]!.url = 'https://academia-ejemplo.com/examen';
  expect(validateProfile(p)).toContain('la fuente 0 no es de un dominio oficial: academia-ejemplo.com');
});

test('fieldSources debe apuntar a una fuente que existe', () => {
  const p = valid();
  p.fieldSources['format.minutos'] = 3;
  expect(validateProfile(p)).toContain('format.minutos apunta a la fuente 3, que no existe');
});

test('las proporciones del mix suman 1', () => {
  const p = valid();
  p.mix = [
    { type: 'NUM.SERIE', proporcion: 0.5 },
    { type: 'LET.SERIE', proporcion: 0.4 },
  ];
  p.pendiente = [];
  p.fieldSources.mix = 0;
  expect(validateProfile(p)).toContain('las proporciones del mix suman 0.9, no 1');
});
