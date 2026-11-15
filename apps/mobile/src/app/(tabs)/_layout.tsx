import { tokens } from '@aptiq/tokens';
import { type Tab, TabBar } from '@aptiq/ui';
import { router, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ROUTES = { home: '/inicio', history: '/historial', account: '/cuenta' } as const satisfies Record<Tab, string>;
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
        if (teclado) return null;
        return (
          <View
            pointerEvents="box-none"
            style={[styles.wrap, { bottom: Math.max(insets.bottom, tokens.spacing.xxl) }]}
          >
            <TabBar
              active={TAB_OF[current] ?? 'home'}
              onSelect={(tab) => router.navigate(ROUTES[tab])}
            />
          </View>
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
  wrap: { position: 'absolute', left: tokens.spacing.screenX, right: tokens.spacing.screenX },
});
