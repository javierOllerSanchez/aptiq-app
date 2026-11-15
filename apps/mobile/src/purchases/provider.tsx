import { createContext, type ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { useAuth } from '@/auth/provider';

import { type Plan, PLAN_GRATIS, type PurchasesApi } from './api';
import { createLocalPurchases } from './local';

interface PlanState {
  plan: Plan;
  api: PurchasesApi;
}

const PlanContext = createContext<PlanState>({ plan: PLAN_GRATIS, api: createLocalPurchases() });

/** Versión publicada sin claves: plan gratuito y sin planes que comprar. */
const SIN_TIENDA: PurchasesApi = {
  plan: async () => PLAN_GRATIS,
  ofertas: async () => [],
  comprar: async () => ({ resultado: 'error', plan: PLAN_GRATIS }),
  restaurar: async () => PLAN_GRATIS,
  usuario: async () => PLAN_GRATIS,
  escuchar: () => () => {},
};

/** RevenueCat si hay clave pública para esta plataforma; si no, el modo local de desarrollo. */
function crearApi(): PurchasesApi {
  const clave =
    Platform.OS === 'ios'
      ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
      : process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;
  // Sin clave, compras de mentira solo en desarrollo; una versión publicada nunca regala Premium.
  if (!clave) return __DEV__ ? createLocalPurchases() : SIN_TIENDA;
  // Import diferido: el módulo nativo solo se carga cuando hay clave (y las pruebas no lo necesitan).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createRevenueCat } = require('./revenuecat') as typeof import('./revenuecat');
  return createRevenueCat(clave);
}

export function PurchasesProvider({ children, api: dada }: { children: ReactNode; api?: PurchasesApi }) {
  const [api] = useState(() => dada ?? crearApi());
  const [plan, setPlan] = useState<Plan>(PLAN_GRATIS);
  const userId = useAuth().session?.user.id ?? null;
  // La sesión de Supabase llega un momento después de arrancar: sin cuenta antes ni ahora no se toca
  // el usuario de RevenueCat (un logOut en cada arranque dejaría sin Premium a quien no tiene red).
  const anterior = useRef<string | null>(null);

  useEffect(() => api.escuchar(setPlan), [api]);

  // Las compras siguen a la cuenta: al entrar o salir se cambia el usuario de RevenueCat (PAY-03).
  useEffect(() => {
    let vivo = true;
    const pedido = userId === null && anterior.current === null ? api.plan() : api.usuario(userId);
    anterior.current = userId;
    pedido
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
