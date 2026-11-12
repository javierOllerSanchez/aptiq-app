import { tokens } from '@aptiq/tokens';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from './text';

const { color, border, radius, spacing, motion, rotate } = tokens;

/**
 * Sello «APTO» (solo en Resultado, más pequeño que la nota). Único elemento inclinado.
 * Aparece con escala de 1,15 a 1 y giro en 250 ms; con «reducir movimiento», solo fundido.
 */
export function Stamp({ label = 'Apto' }: { label?: string }) {
  const reduce = useReducedMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(1, { duration: motion.durationSlow, easing: Easing.bezier(...motion.easingCurve) });
  }, [p]);
  const appear = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: reduce
      ? [{ rotate: `${rotate.stamp}deg` }]
      : [{ rotate: `${rotate.stamp * (2 - p.value)}deg` }, { scale: 1.15 - 0.15 * p.value }],
  }));

  return (
    <Animated.View style={[styles.outer, appear]} accessible accessibilityLabel={label}>
      <View style={styles.inner}>
        <Text variant="seal" style={styles.text}>
          {label}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'flex-start',
    borderWidth: border.stampOuter,
    borderColor: color.seal,
    borderRadius: radius.tile,
    padding: border.stampGap,
  },
  inner: {
    borderWidth: border.default,
    borderColor: color.seal,
    borderRadius: radius.tile - border.stampGap,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
  },
  text: { color: color.seal },
});
