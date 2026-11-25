import { tokens } from '@aptiq/tokens';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { easeOut } from './motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESSED = tokens.motion.pressScale;

/**
 * Todo lo pulsable (guía §5): escala a 0,97 mientras se mantiene pulsado, 150 ms ease-out.
 * Con «reducir movimiento», en lugar de escalar baja la opacidad mientras se pulsa.
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
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  // Con «reducir movimiento» no hay escala: la respuesta es un fundido de opacidad (permitido).
  const animated = useAnimatedStyle(() =>
    reduce
      ? scale.value < 1
        ? { opacity: tokens.opacity.pressed }
        : {}
      : { transform: [{ scale: scale.value }] },
  );
  const to = (v: number) => {
    // .set() en lugar de .value =: el compilador de React no deja mutar valores en manejadores.
    scale.set(
      reduce ? v : withTiming(v, { duration: tokens.motion.durationFast, easing: easeOut }),
    );
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
