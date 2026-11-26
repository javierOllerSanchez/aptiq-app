import { tokens } from '@aptiq/tokens';
import { type Tab, TabBar } from '@aptiq/ui';
import { router, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const ROUTES = {
  home: '/inicio',
  history: '/historial',
  account: '/cuenta',
} as const satisfies Record<Tab, string>;
const TAB_OF: Record<string, Tab> = { inicio: 'home', historial: 'history', cuenta: 'account' };

/** Inicio, Historial y Cuenta con la barra flotante en cristal (fase 5, prototipo aprobado). */
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  // Con el teclado abierto la barra flotante subiría y taparía el formulario (Android ajusta la ventana).
  const [teclado, setTeclado] = useState(false);
  useEffect(() => {
    const a = Keyboard.addListener('keyboardDidShow', () => setTeclado(true));
    const b = Keyboard.addListener('keyboardDidHide', () => setTeclado(false));
    return () => {
      a.remove();
      b.remove();
    };
  }, []);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: tokens.color.paper },
      }}
      tabBar={({ state }) => {
        const current = state.routes[state.index]?.name ?? 'inicio';
        if (teclado && Platform.OS === 'android') return null;
        const bottom = Math.max(insets.bottom, tokens.spacing.xxl);
        // Papel opaco bajo toda la barra y un difuminado de 48 px por encima.
        const difuminado = tokens.spacing.xxl * 2;
        const alto = bottom + tokens.size.tabBar + difuminado;
        return (
          <>
            {/* El contenido se desvanece en el papel bajo la barra: no se lee a través del cristal. */}
            <Svg pointerEvents="none" style={[styles.fade, { height: alto }]}>
              <Defs>
                <LinearGradient id="papel" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={tokens.color.paper} stopOpacity={0} />
                  <Stop offset={difuminado / alto} stopColor={tokens.color.paper} stopOpacity={1} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#papel)" />
            </Svg>
            <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
              <TabBar
                active={TAB_OF[current] ?? 'home'}
                onSelect={(tab) => router.navigate(ROUTES[tab])}
              />
            </View>
          </>
        );
      }}
    >
      <Tabs.Screen name="inicio" />
      <Tabs.Screen name="historial" />
      <Tabs.Screen name="cuenta" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  wrap: { position: 'absolute', left: tokens.spacing.screenX, right: tokens.spacing.screenX },
});
