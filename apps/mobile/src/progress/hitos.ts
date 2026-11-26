import { addDays } from '@aptiq/engine';

/** Ajuste local con los hitos ya celebrados (JSON con sus id). */
export const AJUSTE_HITOS = 'hitos_vistos';

export interface Hito {
  id: string;
  /** Lo que va dentro del sello: «1», «7», «100», «N3», «12». */
  marca: string;
  titulo: string;
  /** 0–1, para la barra de lo que falta. */
  progreso: number;
  conseguido: boolean;
}

export interface DatosHitos {
  simulacros: number;
  /** Algún simulacro llegó a la nota mínima. */
  minimoAlcanzado: boolean;
  /** Mejor nota de un simulacro y la mínima del perfil (para la barra); null sin simulacros. */
  mejorNota: number | null;
  notaMinima: number | null;
  diasPractica: readonly string[];
  totalRespondidas: number;
  /** Mejor nivel en una aptitud en las semanas que se ven. */
  mejorNivel: number;
  /** Hitos ya conseguidos y celebrados: no se pierden aunque el dato salga de la ventana. */
  vistos?: readonly string[];
}

/** Racha más larga de días seguidos en una lista de días «AAAA-MM-DD». */
export function rachaMasLarga(dias: readonly string[]): number {
  const hechos = new Set(dias);
  let mejor = 0;
  for (const d of hechos) {
    if (hechos.has(addDays(d, -1))) continue; // solo se cuenta desde el inicio de cada racha
    let n = 1;
    while (hechos.has(addDays(d, n))) n++;
    mejor = Math.max(mejor, n);
  }
  return mejor;
}

const parte = (valor: number, meta: number) => Math.max(0, Math.min(1, valor / meta));

/** Los seis hitos de Historial v2 (aprobados el 2026-11-25), calculados con datos que ya se guardan. */
export function hitos(d: DatosHitos): Hito[] {
  const racha = rachaMasLarga(d.diasPractica);
  const lista: Omit<Hito, 'conseguido'>[] = [
    {
      id: 'primer-simulacro',
      marca: '1',
      titulo: 'Primer simulacro',
      progreso: parte(d.simulacros, 1),
    },
    { id: 'racha-3', marca: '3', titulo: 'Racha de 3 días', progreso: parte(racha, 3) },
    {
      id: 'preguntas-100',
      marca: '100',
      titulo: '100 preguntas',
      progreso: parte(d.totalRespondidas, 100),
    },
    { id: 'racha-7', marca: '7', titulo: 'Racha de 7 días', progreso: parte(racha, 7) },
    {
      id: 'nivel-3',
      marca: 'N3',
      titulo: 'Nivel 3 en una aptitud',
      progreso: parte(d.mejorNivel, 3),
    },
    {
      id: 'nota-minima',
      marca: d.notaMinima !== null ? String(d.notaMinima) : '—',
      titulo: 'Llegar a la nota mínima',
      progreso: d.minimoAlcanzado
        ? 1
        : d.mejorNota !== null && d.notaMinima
          ? parte(d.mejorNota, d.notaMinima)
          : 0,
    },
  ];
  const vistos = d.vistos ?? [];
  return lista.map((h) => {
    const conseguido = h.progreso >= 1 || vistos.includes(h.id);
    return { ...h, conseguido, progreso: conseguido ? 1 : h.progreso };
  });
}

/** Hitos conseguidos que aún no se han celebrado. */
export function hitosNuevos(lista: readonly Hito[], vistos: readonly string[]): Hito[] {
  return lista.filter((h) => h.conseguido && !vistos.includes(h.id));
}
