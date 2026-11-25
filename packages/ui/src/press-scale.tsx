import { tokens } from '@aptiq/tokens';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { easeOut } from './motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESSED = tokens.motion.pressScale;

/**
 * Todo lo pulsable (guía §5): escala a 0,97 mientras se mantiene pulsado, 150 ms ease-out.
 * Con «reducir movimiento», Reanimated salta la escala (ReduceMotion.System por defecto).
 */
export function PressScale({
  children,
  style,
  onPressIn,
  onPressOut,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const to = (v: number) => {
    // .set() en lugar de .value =: el compilador de React no deja mutar valores en manejadores.
    scale.set(withTiming(v, { duration: tokens.motion.durationFast, easing: easeOut }));
  };
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        to(PRESSED);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        to(1);
        onPressOut?.(e);
      }}
      style={[style, animated]}
    >
      {children}
    </AnimatedPressable>
  );
}
