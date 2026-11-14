import type { Session } from '@supabase/supabase-js';
import * as Network from 'expo-network';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { useBaseStore } from '@/data/provider';
import { createRetrier } from '@/sync/backoff';

import { createSupabaseClient, secureLink } from './client';
import { createAuth } from './session';
import { createSupabaseRemote } from './supabase-remote';

type Auth = ReturnType<typeof createAuth>;

interface AuthState {
  /** null si Supabase no está configurado: la app funciona sin cuenta. */
  auth: Auth | null;
  session: Session | null;
}

const AuthContext = createContext<AuthState>({ auth: null, session: null });

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
    return { client, auth };
  });
  const auth = setup?.auth ?? null;
  const [session, setSession] = useState<Session | null>(null);

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

  const signedIn = session !== null;
  useEffect(() => {
    if (!auth || !signedIn) return;
    const retrier = createRetrier({
      run: () => auth.sync.sync(),
      schedule: (fn, ms) => {
        const t = setTimeout(fn, ms);
        return () => clearTimeout(t);
      },
    });
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
      retrier.stop();
      netSub.remove();
      appSub.remove();
    };
  }, [auth, signedIn]);

  return <AuthContext.Provider value={{ auth, session }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
