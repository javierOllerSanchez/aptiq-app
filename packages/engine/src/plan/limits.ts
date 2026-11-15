import { mondayOf } from '../progress/history';
import { addDays } from '../review/spaced';
import { type TypeCode, typeCodes } from '../taxonomy';

/** Tipos abiertos en el plan gratuito (decisión del propietario, fase 7). */
export const TIPOS_GRATIS: readonly TypeCode[] = ['NUM.SERIE', 'DAT.COMPARA', 'VER.ORDEN'];

export interface PlanInput {
  premium: boolean;
  /** Día local «AAAA-MM-DD». */
  hoy: string;
  /** Días en que se hizo una Sesión de hoy. */
  diasSesionHoy: readonly string[];
  /** Días en que se empezó un simulacro. */
  diasSimulacro: readonly string[];
}

export interface Allowance {
  sesionHoy: boolean;
  simulacro: boolean;
  /** Lunes en que vuelve el simulacro gratuito; null si ya está disponible. */
  proximoSimulacro: string | null;
  tipos: readonly TypeCode[];
  historialCompleto: boolean;
}

/** Qué puede hacer el usuario hoy (tabla «Monetización»): gratis 1 Sesión de hoy al día y 1 simulacro por semana. */
export function allowance({ premium, hoy, diasSesionHoy, diasSimulacro }: PlanInput): Allowance {
  if (premium) return { sesionHoy: true, simulacro: true, proximoSimulacro: null, tipos: typeCodes, historialCompleto: true };
  const lunes = mondayOf(hoy);
  const simulacro = !diasSimulacro.some((d) => mondayOf(d) === lunes);
  return {
    sesionHoy: !diasSesionHoy.includes(hoy),
    simulacro,
    proximoSimulacro: simulacro ? null : addDays(lunes, 7),
    tipos: TIPOS_GRATIS,
    historialCompleto: false,
  };
}
