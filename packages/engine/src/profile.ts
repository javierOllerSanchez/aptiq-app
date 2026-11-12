import type { TypeCode } from './taxonomy';

/**
 * Perfil de examen de una oposición en una convocatoria (skill aptiq-exam-profile).
 * Cada dato no nulo cita su fuente oficial en `fieldSources`; un dato sin fuente es `null` y
 * aparece en `pendiente`. Nunca se inventa: la app muestra «Pendiente de confirmar».
 */
export interface ExamProfile {
  id: string;
  oposicion: string;
  convocatoria: string;
  version: number;
  sources: {
    organismo: string;
    titulo: string;
    url: string;
    tipo: 'bases' | 'plantilla' | 'cuestionario' | 'otro';
    fechaConsulta: string;
    /** Apartado concreto: «base 7.3». */
    apartado?: string;
  }[];
  format: {
    preguntas: number | null;
    minutos: number | null;
    opciones: 3 | 4 | null;
    puntuacion: {
      /** Y de la fórmula del BOE: puntuación máxima. */
      maxima: number | null;
      /** Nota mínima para superar la prueba. */
      minima: number | null;
    };
  };
  /** Proporción de tipos de ejercicio; null mientras no haya fuente oficial. */
  mix: { type: TypeCode; proporcion: number }[] | null;
  /** Ruta del dato → índice en `sources`. */
  fieldSources: Record<string, number>;
  pendiente: string[];
  /** Aclaraciones por ruta (por qué está pendiente, matices de las bases…). */
  notas: Record<string, string>;
}

/** Dominios de organismos públicos aceptados como fuente. */
const OFFICIAL = /(^|\.)(boe\.es|gob\.es|guardiacivil\.es|policia\.es|inap\.es)$/;

/** Rutas de datos que el validador comprueba. */
const FIELDS = [
  'format.preguntas',
  'format.minutos',
  'format.opciones',
  'format.puntuacion.maxima',
  'format.puntuacion.minima',
  'mix',
] as const;

const get = (p: ExamProfile, path: string): unknown =>
  path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | null)?.[k], p);

/** Devuelve la lista de errores (vacía si el perfil es válido). */
export function validateProfile(p: ExamProfile): string[] {
  const errors: string[] = [];
  p.sources.forEach((s, i) => {
    const host = new URL(s.url).hostname;
    if (!OFFICIAL.test(host)) errors.push(`la fuente ${i} no es de un dominio oficial: ${host}`);
  });
  for (const path of FIELDS) {
    const value = get(p, path);
    const source = p.fieldSources[path];
    const pending = p.pendiente.includes(path);
    if (value === null || value === undefined) {
      if (!pending) errors.push(`${path} es nulo pero no está en pendiente`);
    } else {
      if (pending) errors.push(`${path} está en pendiente pero tiene valor`);
      if (source === undefined) errors.push(`${path} tiene valor pero no tiene fuente en fieldSources`);
    }
    if (source !== undefined && !p.sources[source])
      errors.push(`${path} apunta a la fuente ${source}, que no existe`);
  }
  if (p.mix) {
    const sum = Math.round(p.mix.reduce((a, m) => a + m.proporcion, 0) * 1000) / 1000;
    if (sum !== 1) errors.push(`las proporciones del mix suman ${sum}, no 1`);
  }
  return errors;
}
