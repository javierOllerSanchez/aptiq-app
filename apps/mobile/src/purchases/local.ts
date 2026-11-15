import { type Oferta, type Plan, PLAN_GRATIS, type PurchasesApi } from './api';

/** Precios decididos por el propietario (fase 7). Solo para el modo local: en la tienda los pone RevenueCat. */
export const OFERTAS_LOCALES: Oferta[] = [
  { id: 'anual', periodo: 'anual', precio: '39,99 €', prueba: true },
  { id: 'mensual', periodo: 'mensual', precio: '7,99 €', prueba: false },
  { id: 'tres-meses', periodo: 'tres-meses', precio: '19,99 €', prueba: false },
  { id: 'seis-meses', periodo: 'seis-meses', precio: '29,99 €', prueba: false },
];

/**
 * Compras de mentira para desarrollo y pruebas, sin tiendas ni RevenueCat.
 * shortcut: el estado vive en memoria y se pierde al cerrar la app; se sustituye por RevenueCat al tener sus claves.
 */
export function createLocalPurchases(inicial: Plan = PLAN_GRATIS): PurchasesApi {
  let plan = inicial;
  const oyentes = new Set<(p: Plan) => void>();
  const cambiar = (p: Plan) => {
    plan = p;
    oyentes.forEach((cb) => cb(p));
    return p;
  };
  return {
    plan: async () => plan,
    ofertas: async () => OFERTAS_LOCALES,
    comprar: async (id) => {
      const o = OFERTAS_LOCALES.find((x) => x.id === id);
      if (!o) return { resultado: 'error', plan };
      const renueva = o.periodo === 'mensual' || o.periodo === 'anual';
      return { resultado: 'ok', plan: cambiar({ premium: true, hasta: null, renueva, gestionUrl: null }) };
    },
    restaurar: async () => plan,
    usuario: async () => plan,
    escuchar: (cb) => {
      oyentes.add(cb);
      return () => oyentes.delete(cb);
    },
  };
}
