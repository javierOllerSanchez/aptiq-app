import type { CustomerInfo } from 'react-native-purchases';

/** Permiso de RevenueCat que da Premium (PAY-01, PAY-02). Es la única fuente de verdad: la app no calcula precios ni fechas. */
export const PERMISO = 'premium';

export interface Plan {
  premium: boolean;
  /** Fin del periodo pagado (ms); null si no hay o no caduca. */
  hasta: number | null;
  /** Suscripción que se renovará sola; los pases nunca se renuevan. */
  renueva: boolean;
  /** Página de la tienda para gestionar o cancelar la suscripción (PAY-03). */
  gestionUrl: string | null;
}

export const PLAN_GRATIS: Plan = { premium: false, hasta: null, renueva: false, gestionUrl: null };

export type Periodo = 'mensual' | 'anual' | 'tres-meses' | 'seis-meses';

export interface Oferta {
  /** Identificador del paquete en RevenueCat. */
  id: string;
  periodo: Periodo;
  /** Precio ya formateado por la tienda en la moneda del usuario. */
  precio: string;
  /** Precio equivalente al mes, si la tienda lo da (para el anual y los pases). */
  porMes: string | null;
  /**
   * Tiene prueba gratuita (solo el anual, configurado en la tienda).
   * shortcut: la pantalla dice «7 días» fijo; si la tienda cambia la duración, leer introPrice.periodNumberOfUnits.
   */
  prueba: boolean;
}

export type Resultado = 'ok' | 'cancelada' | 'pendiente' | 'sin-red' | 'error';

export interface PurchasesApi {
  plan(): Promise<Plan>;
  ofertas(): Promise<Oferta[]>;
  comprar(id: string): Promise<{ resultado: Resultado; plan: Plan }>;
  restaurar(): Promise<Plan>;
  /** Asocia las compras a la cuenta (o al móvil sin cuenta) para recuperarlas en otro dispositivo. */
  usuario(id: string | null): Promise<Plan>;
  /** Avisa de renovaciones, caducidades y compras hechas fuera. Devuelve cómo dejar de escuchar. */
  escuchar(cb: (plan: Plan) => void): () => void;
}

export function planDe(info: CustomerInfo): Plan {
  const p = info.entitlements.active[PERMISO];
  if (!p) return { ...PLAN_GRATIS, gestionUrl: info.managementURL };
  return {
    premium: true,
    hasta: p.expirationDate ? Date.parse(p.expirationDate) : null,
    renueva: p.willRenew,
    gestionUrl: info.managementURL,
  };
}

/** Códigos de error de RevenueCat (`PURCHASES_ERROR_CODE`) que se explican al usuario. */
export function resultadoDe(error: unknown): Resultado {
  const e = error as { code?: string; userCancelled?: boolean } | null;
  if (e?.userCancelled || e?.code === '1') return 'cancelada';
  if (e?.code === '20') return 'pendiente';
  if (e?.code === '10') return 'sin-red';
  return 'error';
}
