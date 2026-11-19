import { type Item, registry, type TypeCode } from '@aptiq/engine';

/** Mismos motivos y textos que la hoja «Reportar un error» de la app. */
export const MOTIVOS: Record<string, string> = {
  dos_correctas: 'Hay más de una respuesta correcta',
  correcta_mal: 'La respuesta marcada como correcta está mal',
  explicacion: 'La explicación tiene un error',
  no_se_entiende: 'No se entiende el enunciado o el dibujo',
  otro: 'Otro',
};
export type Estado = 'nuevo' | 'resuelto' | 'descartado';

export interface Reporte {
  id: string;
  tipo: string;
  nivel: number;
  semilla: string;
  version: string;
  opciones: 3 | 4;
  respuesta: number | null;
  motivo: string;
  comentario: string | null;
  estado: Estado;
  nota: string | null;
  creado: string;
}

/** Regenera la pregunta con el motor a partir de la semilla (criterio de aceptación de la fase 8). */
export function reproducir(r: Reporte): { item?: Item; aviso?: string | undefined; error?: string } {
  if (!(r.tipo in registry)) return { error: `El tipo ${r.tipo} no existe en esta versión del motor.` };
  try {
    const item = registry[r.tipo as TypeCode].generator.generate(r.semilla, r.nivel as 1, r.opciones);
    const aviso =
      item.meta.generatorVersion === r.version
        ? undefined
        : `Ojo: el reporte se hizo con la versión ${r.version} y ahora es la ${item.meta.generatorVersion}. La pregunta puede no ser exactamente la que vio.`;
    return { item, aviso };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

