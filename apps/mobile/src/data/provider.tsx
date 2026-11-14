import { createContext, type ReactNode, useContext, useState } from 'react';

import { withSyncQueue } from '@/sync/queued-store';

import { createSqliteStore } from './sqlite-store';
import type { Store } from './store';

interface Stores {
  /** Para las pantallas: cada cambio queda en la cola de sincronización. */
  store: Store;
  /** Sin cola: solo para la sincronización (lo que llega del servidor no se vuelve a encolar). */
  base: Store;
}

const StoreContext = createContext<Stores | null>(null);

/** Abre la base local una sola vez y la comparte con las pantallas. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores] = useState<Stores>(() => {
    const base = createSqliteStore();
    return { base, store: withSyncQueue(base) };
  });
  return <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>;
}

function useStores(): Stores {
  const stores = useContext(StoreContext);
  if (!stores) throw new Error('useStore debe usarse dentro de StoreProvider');
  return stores;
}

export function useStore(): Store {
  return useStores().store;
}

export function useBaseStore(): Store {
  return useStores().base;
}
