import { taxonomy, type TypeCode } from '@aptiq/engine';

/** Tipos de una aptitud que entran en el plan. Vacío: la aptitud entera es de Premium. */
export function tiposDe(aptitud: string, tipos: readonly TypeCode[]): TypeCode[] {
  return tipos.filter((t) => taxonomy[t].aptitud === aptitud);
}

/** Ajuste local que recuerda que el muro de pago ya se mostró. */
export const AJUSTE_MURO = 'muro_visto';

/** El muro aparece al terminar el primer simulacro, una vez, y nunca a quien ya es Premium. */
export function debeAbrirMuro({ premium, visto, terminados }: { premium: boolean; visto: boolean; terminados: number }) {
  return !premium && !visto && terminados === 1;
}
