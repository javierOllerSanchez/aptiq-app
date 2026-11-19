import type { Session } from '@supabase/supabase-js';
import * as Network from 'expo-network';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { actualizarContenido, cargarContenido } from '@/content/content';
import { createSupabaseContent } from '@/content/supabase-content';
import { useBaseStore } from '@/data/provider';
import { createSupabaseReports, enviarPendientes, type ReportRemote } from '@/reports/reports';
import { createRetrier } from '@/sync/backoff';

import { createSupabaseClient, secureLink } from './client';
import { createAuth } from './session';
import { createSupabaseRemote } from './supabase-remote';

type Auth = ReturnType<typeof createAuth>;

export interface SyncStatus {
  /** Última sincronización correcta (ms), o null si aún no ha habido ninguna en esta apertura. */
  lastSync: number | null;
  pending: number;
}

interface AuthState {
  /** null si Supabase no está configurado: la app funciona sin cuenta. */
  auth: Auth | null;
  session: Session | null;
  status: SyncStatus;
  /** Sincroniza ya (al abrir la pantalla Cuenta, tras cerrar un simulacro…). */
  syncNow: () => void;
  /** Envío de reportes de errores (SOP-01), con o sin cuenta; null sin Supabase configurado. */
  reportes: ReportRemote | null;
}

const AuthContext = createContext<AuthState>({
  auth: null,
  session: null,
  status: { lastSync: null, pending: 0 },
  syncNow: () => {},
  reportes: null,
});

/**
 * Sesión de Supabase y sincronización automática: al abrir la app (volver a primer plano)
 * y al recuperar la red, con reintentos de espera creciente (T3). Sin sesión no se sincroniza.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const base = useBaseStore();
  const [setup] = useState(() => {
    const client = createSupabaseClient();
    if (!client) return null;
    const auth = createAuth({ client, store: base, remote: createSupabaseRemote(client), link: secureLink });
    return { client, auth, reportes: createSupabaseReports(client) };
  });
  const auth = setup?.auth ?? null;
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<SyncStatus>({ lastSync: null, pending: 0 });
  const trigger = useRef<() => void>(() => {});
  const syncNow = useCallback(() => trigger.current(), []);

  useEffect(() => {
    if (!setup) return;
    const { client } = setup;
    client.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = client.auth.onAuthStateChange((_event, s) => setSession(s));

    // Recomendación de Supabase para React Native: refrescar el token solo en primer plano.
    if (AppState.currentState === 'active') client.auth.startAutoRefresh();
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    });
    return () => {
      data.subscription.unsubscribe();
      appSub.remove();
      client.auth.stopAutoRefresh();
    };
  }, [setup]);

  // Contenido público (verbales aprobadas y perfil): con o sin cuenta, al abrir y al recuperar la red.
  useEffect(() => {
    void cargarContenido(base);
    if (!setup) return;
    const remote = createSupabaseContent(setup.client);
    const reportes = setup.reportes;
    const refresh = () => {
      void actualizarContenido(base, remote);
      void enviarPendientes(base, reportes);
    };
    refresh();
    let wasOnline = true;
    const netSub = Network.addNetworkStateListener((s) => {
      const online = s.isConnected === true && s.isInternetReachable !== false;
      if (online && !wasOnline) refresh();
      wasOnline = online;
    });
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => {
      netSub.remove();
      appSub.remove();
    };
  }, [setup, base]);

  const signedIn = session !== null;
  useEffect(() => {
    if (!auth || !signedIn) return;
    const retrier = createRetrier({
      run: async () => {
        const ok = await auth.sync.sync();
        const pending = (await base.pendingOps()).length;
        setStatus((prev) => ({ lastSync: ok ? Date.now() : prev.lastSync, pending }));
        return ok;
      },
      schedule: (fn, ms) => {
        const t = setTimeout(fn, ms);
        return () => clearTimeout(t);
      },
    });
    trigger.current = () => void retrier.trigger();
    void retrier.trigger();

    let wasOnline = true;
    const netSub = Network.addNetworkStateListener((s) => {
      const online = s.isConnected === true && s.isInternetReachable !== false;
      if (online && !wasOnline) void retrier.trigger();
      wasOnline = online;
    });
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void retrier.trigger();
    });
    return () => {
      trigger.current = () => {};
      retrier.stop();
      netSub.remove();
      appSub.remove();
    };
  }, [auth, base, signedIn]);

  return <AuthContext.Provider value={{ auth, session, status, syncNow, reportes: setup?.reportes ?? null }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
