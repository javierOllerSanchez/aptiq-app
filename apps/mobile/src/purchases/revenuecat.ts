import Purchases, { PACKAGE_TYPE, type PurchasesPackage } from 'react-native-purchases';

import { type Oferta, type Periodo, planDe, type PurchasesApi, resultadoDe } from './api';

const PERIODOS: Partial<Record<PACKAGE_TYPE, Periodo>> = {
  [PACKAGE_TYPE.MONTHLY]: 'mensual',
  [PACKAGE_TYPE.ANNUAL]: 'anual',
  [PACKAGE_TYPE.THREE_MONTH]: 'tres-meses',
  [PACKAGE_TYPE.SIX_MONTH]: 'seis-meses',
};

/** Compras reales con RevenueCat (PAY-01, PAY-02, PAY-03). `clave` es la clave pública del SDK, no un secreto. */
export function createRevenueCat(clave: string): PurchasesApi {
  Purchases.configure({ apiKey: clave });
  let paquetes: PurchasesPackage[] = [];

  return {
    plan: async () => planDe(await Purchases.getCustomerInfo()),
    ofertas: async () => {
      const actual = (await Purchases.getOfferings()).current;
      paquetes = actual?.availablePackages ?? [];
      return paquetes.flatMap((p): Oferta[] => {
        const periodo = PERIODOS[p.packageType];
        return periodo
          ? [{ id: p.identifier, periodo, precio: p.product.priceString, porMes: periodo === 'mensual' ? null : p.product.pricePerMonthString, prueba: p.product.introPrice?.price === 0 }]
          : [];
      });
    },
    comprar: async (id) => {
      const paquete = paquetes.find((p) => p.identifier === id);
      if (!paquete) return { resultado: 'error', plan: planDe(await Purchases.getCustomerInfo()) };
      try {
        const { customerInfo } = await Purchases.purchasePackage(paquete);
        return { resultado: 'ok', plan: planDe(customerInfo) };
      } catch (e) {
        return { resultado: resultadoDe(e), plan: planDe(await Purchases.getCustomerInfo()) };
      }
    },
    restaurar: async () => planDe(await Purchases.restorePurchases()),
    usuario: async (id) => {
      if (id) return planDe((await Purchases.logIn(id)).customerInfo);
      // Sin cuenta: si había una sesión de RevenueCat con usuario, se vuelve al anónimo del móvil.
      return (await Purchases.isAnonymous()) ? planDe(await Purchases.getCustomerInfo()) : planDe(await Purchases.logOut());
    },
    escuchar: (cb) => {
      const oyente = (info: Parameters<typeof planDe>[0]) => cb(planDe(info));
      Purchases.addCustomerInfoUpdateListener(oyente);
      return () => Purchases.removeCustomerInfoUpdateListener(oyente);
    },
  };
}
