import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

import { useStore } from '@/data/provider';

/** Primer arranque: sin oposición elegida va al onboarding; con ella, a Inicio. */
export default function Index() {
  const store = useStore();
  const [destino, setDestino] = useState<'/onboarding' | '/inicio' | null>(null);

  useEffect(() => {
    store.getSetting('oposicion').then((v) => setDestino(v ? '/inicio' : '/onboarding'));
  }, [store]);

  if (!destino) return null;
  return <Redirect href={destino} />;
}
