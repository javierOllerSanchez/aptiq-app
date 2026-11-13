import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { withAlpha } from './color';
import { Text } from './text';

const { color, opacity, radius, size, spacing } = tokens;

/** Barra de porcentaje por aptitud (Resultado, guía §6): `ink`, o `seal` en la aptitud a reforzar. */
export function AptitudeBar({
  label,
  percent,
  weak = false,
}: {
  label: string;
  /** 0–100. */
  percent: number;
  weak?: boolean;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`${label}${weak ? ', a reforzar' : ''}: ${p} % de acierto`}
    >
      <View style={styles.head}>
        <Text variant="bodyStrong" color={weak ? 'sealText' : 'ink'} style={styles.label}>
          {label}
          {weak ? ' · a reforzar' : ''}
        </Text>
        <Text variant="timer" color={weak ? 'sealText' : 'ink'}>
          {p} %
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[styles.fill, { width: `${p}%`, backgroundColor: weak ? color.seal : color.ink }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.s },
  head: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.m },
  label: { flex: 1 },
  track: {
    height: size.bar,
    borderRadius: radius.bar,
    backgroundColor: withAlpha(color.ink, opacity.barTrack),
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radius.bar },
});
