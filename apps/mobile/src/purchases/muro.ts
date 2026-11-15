/** Ajuste local que recuerda que el muro de pago ya se mostró. */
export const AJUSTE_MURO = 'muro_visto';

/** El muro aparece al terminar el primer simulacro, una vez, y nunca a quien ya es Premium. */
export function debeAbrirMuro({ premium, visto, terminados }: { premium: boolean; visto: boolean; terminados: number }) {
  return !premium && !visto && terminados === 1;
}
