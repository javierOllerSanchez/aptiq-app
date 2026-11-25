import { tokens } from '@aptiq/tokens';
import { Text, withAlpha } from '@aptiq/ui';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { useStore } from '@/data/provider';
import { AJUSTE_SONIDOS, sonar, sonidosActivos } from '@/sound/sound';

/** Ajuste «Sonidos» de Cuenta: los de recompensa se pueden apagar (decisión del 2026-11-25). */
export function Sonidos() {
  const store = useStore();
  const [activos, setActivos] = useState(true);

  useFocusEffect(
    useCallback(() => {
      sonidosActivos(store).then(setActivos);
    }, [store]),
  );

  const cambiar = async (si: boolean) => {
    setActivos(si);
    await store.setSetting(AJUSTE_SONIDOS, si ? '1' : '0');
    if (si) void sonar(store, 'acierto'); // muestra de cómo suena
  };

  return (
    <View style={styles.bloque}>
      <Text variant="label" color="graphite" accessibilityRole="header">
        Preferencias
      </Text>
      <View style={styles.fila}>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Sonidos</Text>
          <Text variant="caption" color="graphite">
            Al cumplir el objetivo, acertar y terminar un simulacro
          </Text>
        </View>
        <Switch
          value={activos}
          onValueChange={cambiar}
          accessibilityLabel="Sonidos"
          trackColor={{
            false: withAlpha(tokens.color.ink, tokens.opacity.pendingTick),
            true: tokens.color.ink,
          }}
          thumbColor={activos ? tokens.color.highlighter : tokens.color.paperCard}
          ios_backgroundColor={withAlpha(tokens.color.ink, tokens.opacity.pendingTick)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloque: { gap: tokens.spacing.xs, marginTop: tokens.spacing.m },
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.listRow,
  },
  flex: { flex: 1 },
});
