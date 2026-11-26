import { tokens } from '@aptiq/tokens';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { withAlpha } from './color';
import { easeOut } from './motion';
import { Text } from './text';

const { color, motion, opacity, radius, size, spacing } = tokens;

/** Barra de porcentaje por aptitud (Resultado, guía §6): `ink`, o `seal` en la aptitud a reforzar. */
export function AptitudeBar({
  label,
  percent,
  weak = false,
  orden = 0,
}: {
  label: string;
  /** 0–100. */
  percent: number;
  weak?: boolean;
  /** Posición en la lista: las barras crecen escalonadas (guía §8). */
  orden?: number;
}) {
  const p = Math.max(0, Math.min(100, Math.round(percent)));
  // Crece desde 0 al aparecer; con «reducir movimiento», Reanimated la pone ya en su valor.
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(
      orden * motion.stagger * 2,
      withTiming(p, { duration: motion.durationSlow, easing: easeOut }),
    );
  }, [p, orden, w]);
  const grow = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View
      style={styles.wrap}
      accessible
      accessibilityLabel={`${label}${weak ? ', a reforzar' : ''}: ${p} % de acierto`}
    >
      <View style={styles.head}>
        <Text variant="bodyStrong" style={styles.label}>
          {label}
          {weak ? ' · a reforzar' : ''}
        </Text>
        <Text variant="timer" color={weak ? 'sealText' : 'ink'}>
          {p} %
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[styles.fill, { backgroundColor: weak ? color.seal : color.ink }, grow]}
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
