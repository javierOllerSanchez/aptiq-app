import { tokens } from '@aptiq/tokens';
import { Pressable, StyleSheet } from 'react-native';

import { Glass } from './glass';
import { Icon, type IconName } from './icon';

const { color, radius, size, spacing } = tokens;

export type Tab = 'home' | 'tests' | 'stats' | 'profile';

const tabs: { key: Tab; icon: IconName; label: string }[] = [
  { key: 'home', icon: 'home', label: 'Inicio' },
  { key: 'tests', icon: 'tests', label: 'Tests' },
  { key: 'stats', icon: 'stats', label: 'Estadísticas' },
  { key: 'profile', icon: 'profile', label: 'Perfil' },
];

/** Barra de navegación flotante en cristal. Activa: fondo tinta, icono subrayador. */
export function TabBar({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  return (
    <Glass radius={radius.nav} style={styles.bar} accessibilityRole="tablist">
      {tabs.map((t) => {
        const selected = t.key === active;
        return (
          <Pressable
            key={t.key}
            onPress={() => onSelect(t.key)}
            accessibilityRole="tab"
            accessibilityLabel={t.label}
            accessibilityState={{ selected }}
            style={({ pressed }) => [
              styles.tab,
              selected && styles.active,
              pressed && { opacity: tokens.opacity.pressed },
            ]}
          >
            <Icon name={t.icon} color={selected ? 'highlighter' : 'ink'} />
          </Pressable>
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
  tab: {
    flex: 1,
    maxWidth: size.navHeight + spacing.m,
    height: size.navHeight,
    minWidth: size.touchMin,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: color.ink },
});
