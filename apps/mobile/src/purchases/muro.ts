import { taxonomy, type TypeCode } from '@aptiq/engine';

/** Tipos de una aptitud que entran en el plan. Vacío: la aptitud entera es de Premium. */
export function tiposDe(aptitud: string, tipos: readonly TypeCode[]): TypeCode[] {
  return tipos.filter((t) => taxonomy[t].aptitud === aptitud);
}
