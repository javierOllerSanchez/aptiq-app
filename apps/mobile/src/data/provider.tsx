import { createContext, type ReactNode, useContext, useState } from 'react';

import { createSqliteStore } from './sqlite-store';
import type { Store } from './store';

const StoreContext = createContext<Store | null>(null);

/** Abre la base local una sola vez y la comparte con las pantallas. */
export function StoreProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createSqliteStore());
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore debe usarse dentro de StoreProvider');
  return store;
}
