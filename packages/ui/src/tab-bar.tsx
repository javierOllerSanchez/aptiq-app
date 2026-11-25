import { tokens } from '@aptiq/tokens';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Glass } from './glass';
import { Icon, type IconName } from './icon';
import { easeOut } from './motion';
import { PressScale } from './press-scale';

const { color, radius, size, spacing, motion } = tokens;

export type Tab = 'home' | 'history' | 'account';

// Fase 5: tres destinos (prototipo aprobado, docs/prototipos/cuenta.html).
const tabs: { key: Tab; icon: IconName; label: string }[] = [
  { key: 'home', icon: 'home', label: 'Inicio' },
  { key: 'history', icon: 'history', label: 'Historial' },
  { key: 'account', icon: 'profile', label: 'Cuenta' },
];

/**
 * Barra de navegación flotante en cristal. Activa: fondo tinta, icono subrayador.
 * La pastilla negra se desliza hasta la pestaña activa (guía §8).
 */
export function TabBar({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  // Posición y ancho de cada pestaña, medidos al pintarse.
  const [huecos, setHuecos] = useState<Partial<Record<Tab, { x: number; w: number }>>>({});
  const destino = huecos[active];
  const pill = useAnimatedStyle(() => {
    if (!destino) return { opacity: 0 };
    const t = { duration: motion.durationSlow, easing: easeOut };
    return {
      opacity: 1,
      width: withTiming(destino.w, t),
      transform: [{ translateX: withTiming(destino.x, t) }],
    };
  });

  return (
    <Glass radius={radius.nav} style={styles.bar} accessibilityRole="tablist">
      <Animated.View style={[styles.pill, pill]} pointerEvents="none" />
      {tabs.map((t) => {
        const selected = t.key === active;
        return (
          <PressScale
            key={t.key}
            onPress={() => onSelect(t.key)}
            onLayout={(e) => {
              const { x, width } = e.nativeEvent.layout;
              setHuecos((h) => ({ ...h, [t.key]: { x, w: width } }));
            }}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected }}
            style={styles.tab}
          >
            <Icon name={t.icon} color={selected ? 'highlighter' : 'ink'} />
          </PressScale>
        );
      })}
    </Glass>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.s,
  },
  pill: {
    position: 'absolute',
    top: spacing.s,
    left: 0,
    height: size.navHeight,
    borderRadius: radius.button,
    backgroundColor: color.ink,
  },
  tab: {
    flex: 1,
    maxWidth: size.navHeight + spacing.m,
    height: size.navHeight,
    minWidth: size.touchMin,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
