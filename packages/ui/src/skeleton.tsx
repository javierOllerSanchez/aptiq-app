import { tokens } from '@aptiq/tokens';
import { useEffect } from 'react';
import { type DimensionValue, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { withAlpha } from './color';
import { easeOut } from './motion';

const { color, motion, opacity, radius, spacing, size } = tokens;

/** Bloque de carga: papel que late suavemente en lugar de «Cargando…» (guía §5). */
export function Skeleton({
  height,
  width = '100%',
  r = radius.button,
}: {
  height: number;
  width?: DimensionValue;
  r?: number;
}) {
  const o = useSharedValue<number>(opacity.skeletonLow);
  useEffect(() => {
    // Con «reducir movimiento», Reanimated deja el bloque quieto (ReduceMotion.System).
    o.set(withRepeat(withTiming(1, { duration: motion.pulse, easing: easeOut }), -1, true));
  }, [o]);
  const pulse = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.block, { height, width, borderRadius: r }, pulse]} />;
}

/** Pantalla de carga genérica: etiqueta, título, tarjeta y tres filas. */
export function SkeletonScreen({ label = 'Cargando' }: { label?: string }) {
  return (
    <View
      style={styles.screen}
      accessible
      accessibilityLabel={label}
      accessibilityRole="progressbar"
      accessibilityLiveRegion="polite"
    >
      <Skeleton height={size.tick} width="30%" r={radius.tick} />
      <Skeleton height={tokens.type.screenTitle.size} width="65%" r={radius.bar} />
      <Skeleton height={size.figureStem + spacing.xxl} r={radius.cardLarge} />
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} height={size.optionHeight} r={radius.option} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { backgroundColor: withAlpha(color.ink, opacity.barTrack) },
  screen: { gap: spacing.l },
});
