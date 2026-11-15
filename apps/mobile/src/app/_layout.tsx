import { tokens } from '@aptiq/tokens';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/auth/provider';
import { StoreProvider } from '@/data/provider';
import { fontAssets } from '@/fonts';
import { PurchasesProvider } from '@/purchases/provider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (error) console.error('No se han podido cargar las fuentes de Aptiq', error);
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;
  return (
    <StoreProvider>
      <AuthProvider>
        <PurchasesProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: tokens.color.paper },
            }}
          />
        </PurchasesProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
