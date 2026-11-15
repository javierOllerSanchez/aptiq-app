import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/auth/provider';

import { type Plan, PLAN_GRATIS, type PurchasesApi } from './api';
import { createLocalPurchases } from './local';

interface PlanState {
  plan: Plan;
  api: PurchasesApi;
}

const PlanContext = createContext<PlanState>({ plan: PLAN_GRATIS, api: createLocalPurchases() });

/** RevenueCat si hay clave pública para esta plataforma; si no, el modo local de desarrollo. */
function crearApi(): PurchasesApi {
  const clave =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  if (!clave) return createLocalPurchases();
  // Import diferido: el módulo nativo solo se carga cuando hay clave (y las pruebas no lo necesitan).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRevenueCat } = require('./revenuecat') as typeof import('./revenuecat');
  return createRevenueCat(clave);
}

export function PurchasesProvider({ children, api: dada }: { children: ReactNode; api?: PurchasesApi }) {
  const [api] = useState(() => dada ?? crearApi());
  const [plan, setPlan] = useState<Plan>(PLAN_GRATIS);
  const userId = useAuth().session?.user.id ?? null;

  useEffect(() => api.escuchar(setPlan), [api]);

  // Las compras siguen a la cuenta: al entrar o salir se cambia el usuario de RevenueCat (PAY-03).
  useEffect(() => {
    let vivo = true;
    api
      .usuario(userId)
      .then((p) => vivo && setPlan(p))
      .catch(() => {}); // Sin red se mantiene el último plan conocido; el oyente avisará al volver.
    return () => {
      vivo = false;
    };
  }, [api, userId]);

  return <PlanContext.Provider value={{ plan, api }}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanState {
  return useContext(PlanContext);
}
