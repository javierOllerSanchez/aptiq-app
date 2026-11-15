import type { TypeCode } from '../taxonomy';

/** Días entre repasos de un tipo fallado (REP-01, decisión del propietario 2026-11-15). */
export const INTERVALOS = [1, 3, 7, 14] as const;
const APRUEBA = 0.7;

/** Una respuesta con su día LOCAL («AAAA-MM-DD»). La app calcula el día; el motor no usa relojes. */
export interface DayResult {
  dia: string;
  type: TypeCode;
  correct: boolean;
  blank: boolean;
}

// Días desde 1970-01-01 y vuelta, con aritmética de calendario pura (sin Date: el motor no usa relojes).
// Algoritmo de H. Hinnant, «chrono-Compatible Low-Level Date Algorithms».
function aDias(y: number, m: number, d: number): number {
  y -= m <= 2 ? 1 : 0;
  const era = Math.floor(y / 400);
  const yoe = y - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

function aFecha(z: number): string {
  z += 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp + (mp < 10 ? 3 : -9);
  const y = yoe + era * 400 + (m <= 2 ? 1 : 0);
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Suma días a una fecha «AAAA-MM-DD». */
export function addDays(dia: string, n: number): string {
  const [y, m, d] = dia.split('-').map(Number) as [number, number, number];
  return aFecha(aDias(y, m, d) + n);
}

/** Días de `desde` a `hasta` (ambas «AAAA-MM-DD»); negativo si `hasta` es anterior. */
export function daysBetween(desde: string, hasta: string): number {
  const [a, b, c] = desde.split('-').map(Number) as [number, number, number];
  const [x, y, z] = hasta.split('-').map(Number) as [number, number, number];
  return aDias(x, y, z) - aDias(a, b, c);
}

interface Estado {
  paso: number;
  toca: string;
}

/**
 * Tipos que tocan repaso `hoy` (REP-01). Un día con fallos mete el tipo en repaso para el día
 * siguiente. En el día que toca, con al menos el 70 % de acierto pasa al siguiente intervalo
 * (1, 3, 7 y 14 días; tras el último sale del repaso) y con menos vuelve a 1 día. Practicar antes
 * de tiempo solo cuenta si hay fallos (vuelve a 1 día).
 */
export function dueTypes(history: readonly DayResult[], hoy: string): TypeCode[] {
  // Aciertos y total por tipo y día, en orden de fecha («AAAA-MM-DD» se ordena como texto).
  const porTipo = new Map<TypeCode, Map<string, { ok: number; n: number }>>();
  for (const r of history) {
    const dias = porTipo.get(r.type) ?? new Map<string, { ok: number; n: number }>();
    porTipo.set(r.type, dias);
    const t = dias.get(r.dia) ?? { ok: 0, n: 0 };
    t.n++;
    if (r.correct && !r.blank) t.ok++;
    dias.set(r.dia, t);
  }

  const out: TypeCode[] = [];
  for (const [type, dias] of porTipo) {
    let e: Estado | null = null;
    for (const dia of [...dias.keys()].sort()) {
      if (dia > hoy) break;
      const { ok, n } = dias.get(dia)!;
      const bien = ok / n >= APRUEBA;
      const conFallos = ok < n;
      if (e === null) {
        if (conFallos) e = { paso: 0, toca: addDays(dia, INTERVALOS[0]) };
      } else if (dia >= e.toca) {
        const paso: number = bien ? e.paso + 1 : 0;
        e = paso < INTERVALOS.length ? { paso, toca: addDays(dia, INTERVALOS[paso]!) } : null;
      } else if (!bien) {
        e = { paso: 0, toca: addDays(dia, INTERVALOS[0]) };
      }
    }
    if (e !== null && e.toca <= hoy) out.push(type);
  }
  return out.sort();
}
