import { tokens } from '@aptiq/tokens';
import { IconTile, Text, withAlpha } from '@aptiq/ui';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { AccessibilityInfo, Platform, Pressable, StyleSheet, Switch, View } from 'react-native';

import { useStore } from '@/data/provider';
import { expoReminderApi } from '@/notifications/expo-api';
import { AJUSTE_RECORDATORIO, type Hora, HORAS, setReminder } from '@/notifications/reminder';

const HORA_INICIAL: Hora = '19:00';

/** Recordatorio diario (NOT-01). Prototipo aprobado: docs/prototipos/cuenta-recordatorio.html. */
export function Recordatorio() {
  const store = useStore();
  const [hora, setHora] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      store.getSetting(AJUSTE_RECORDATORIO).then((h) => setHora(h ?? ''));
    }, [store]),
  );
  if (hora === null) return null;
  const activo = hora !== '';

  const cambiar = async (nueva: Hora | null) => {
    setAviso(null);
    const ok = await setReminder(store, expoReminderApi, nueva);
    if (!ok) {
      const texto = 'Sin permiso para avisarte. Puedes darlo en los ajustes del móvil.';
      setAviso(texto);
      if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(texto);
      return;
    }
    setHora(nueva ?? '');
  };

  return (
    <View>
      <View style={styles.fila}>
        <IconTile name="bell" />
        <View style={styles.flex}>
          <Text variant="bodyStrong">Recordatorio diario</Text>
          <Text variant="caption" color="graphite">
            Si ya has hecho la sesión de hoy, no avisa
          </Text>
        </View>
        <Switch
          value={activo}
          onValueChange={(v) => cambiar(v ? HORA_INICIAL : null)}
          accessibilityLabel="Recordatorio diario"
          trackColor={{
            false: withAlpha(tokens.color.ink, tokens.opacity.pendingTick),
            true: tokens.color.ink,
          }}
          thumbColor={activo ? tokens.color.highlighter : tokens.color.paperCard}
          ios_backgroundColor={withAlpha(tokens.color.ink, tokens.opacity.pendingTick)}
        />
      </View>
      {aviso && (
        <Text color="sealText" accessibilityLiveRegion="polite" accessibilityRole="alert">
          {aviso}
        </Text>
      )}
      {activo && (
        <View style={styles.horas}>
          <Text variant="label" color="graphite">
            Hora
          </Text>
          <View
            accessibilityRole="radiogroup"
            accessibilityLabel="Hora del recordatorio"
            style={styles.pildoras}
          >
            {HORAS.map((h) => {
              const on = h === hora;
              return (
                <Pressable
                  key={h}
                  onPress={() => cambiar(h)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`A las ${h}`}
                  style={({ pressed }) => [
                    styles.pildora,
                    on && styles.pildoraOn,
                    pressed && styles.pulsada,
                  ]}
                >
                  <Text variant="timer" color={on ? 'paperCard' : 'ink'}>
                    {h}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text variant="caption" color="graphite">
            El aviso sale de este móvil, sin necesidad de cuenta ni conexión.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.m,
    minHeight: tokens.size.listRow,
    borderBottomWidth: tokens.border.hairline,
    borderBottomColor: withAlpha(tokens.color.ink, tokens.opacity.divider),
    paddingVertical: tokens.spacing.s,
  },
  flex: { flex: 1 },
  horas: { gap: tokens.spacing.s, marginTop: tokens.spacing.xs },
  pildoras: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.s },
  pildora: {
    minWidth: tokens.size.touchMin + tokens.spacing.xl,
    minHeight: tokens.size.touchMin,
    paddingHorizontal: tokens.spacing.m,
    borderRadius: tokens.radius.pill,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pildoraOn: { backgroundColor: tokens.color.ink },
  pulsada: { opacity: tokens.opacity.pressed },
});
