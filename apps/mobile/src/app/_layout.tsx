import { tokens } from '@aptiq/tokens';
import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '@/auth/provider';
import { StoreProvider } from '@/data/provider';
import { fontAssets } from '@/fonts';
import { PurchasesProvider } from '@/purchases/provider';

SplashScreen.preventAutoHideAsync();

// Fallos de la app (fase 9 · T8). Sin DSN (o en desarrollo) no envía nada. Servidor de la UE, según el DSN.
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
Sentry.init({
  dsn,
  enabled: !!dsn && !__DEV__,
  sendDefaultPii: false, // sin IP, usuario ni cabeceras (NFR-05)
  attachScreenshot: false,
  attachViewHierarchy: false, // la jerarquía incluiría el texto de la pantalla
});

export default Sentry.wrap(RootLayout);

function RootLayout() {
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
