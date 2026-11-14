import { createContext, type ReactNode, useContext, useState } from 'react';

import { withSyncQueue } from '@/sync/queued-store';

import { createSqliteStore } from './sqlite-store';
import type { Store } from './store';

const StoreContext = createContext<Store | null>(null);

/** Abre la base local una sola vez y la comparte con las pantallas. Cada cambio queda en la cola de sincronización. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => withSyncQueue(createSqliteStore()));
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore debe usarse dentro de StoreProvider');
  return store;
}
