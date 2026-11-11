import { tokens } from '@aptiq/tokens';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Icon } from './icon';
import { Text } from './text';

const { color, radius, border, size, spacing, motion } = tokens;

export type OptionState = 'empty' | 'marked' | 'correct' | 'wrong';

const stateLabel: Record<OptionState, string> = {
  empty: '',
  marked: '',
  correct: ', correcta',
  wrong: ', incorrecta',
};

/** Fila de respuesta con burbuja de hoja de examen (guía, sección 5). */
export function OptionBubble({
  letter,
  value,
  state = 'empty',
  onPress,
}: {
  letter: string;
  value: string;
  state?: OptionState;
  onPress?: () => void;
}) {
  const filled = state !== 'empty';
  // Relleno de la burbuja: 150 ms ease-out. Reanimated lo omite con «reducir movimiento» (ReduceMotion.System).
  const fill = useSharedValue(filled ? 1 : 0);
  useEffect(() => {
    fill.value = withTiming(filled ? 1 : 0, {
      duration: motion.durationFast,
      easing: Easing.out(Easing.quad),
    });
  }, [filled, fill]);
  const fillStyle = useAnimatedStyle(() => ({ opacity: fill.value }));

  const press = onPress
    ? () => {
        Haptics.selectionAsync().catch(() => {});
        onPress();
      }
    : undefined;

  const wrong = state === 'wrong';
  return (
    <Pressable
      onPress={press}
      disabled={!onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: state === 'marked', disabled: !onPress }}
      accessibilityLabel={`Opción ${letter}, ${value}${stateLabel[state]}`}
      style={[styles.row, rowStyle[state]]}>
      <View style={[styles.bubble, wrong && styles.bubbleWrong]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: wrong ? color.seal : color.ink }, fillStyle]}
        />
        {state === 'correct' ? (
          <Icon name="check" color="highlighter" size={size.icon * 0.8} strokeWidth={3} />
        ) : wrong ? (
          <Icon name="cross" color="white" size={size.icon * 0.75} strokeWidth={3} />
        ) : (
          <Text variant="timer" color={state === 'marked' ? 'highlighter' : 'ink'}>
            {letter}
          </Text>
        )}
      </View>
      <Text variant="optionValue" weight={state === 'empty' ? 600 : 700} style={styles.value}>
        {value}
      </Text>
    </Pressable>
  );
}

const rowStyle = StyleSheet.create({
  empty: { backgroundColor: color.paperCard, borderWidth: border.hairline, borderColor: color.line },
  marked: { backgroundColor: color.white, borderWidth: border.selected, borderColor: color.ink },
  correct: { backgroundColor: color.highlighter, borderWidth: border.default, borderColor: color.ink },
  wrong: { backgroundColor: color.paperCard, borderWidth: border.default, borderColor: color.seal },
});

const styles = StyleSheet.create({
  row: {
    minHeight: size.optionHeight,
    borderRadius: radius.option,
    paddingHorizontal: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
  },
  bubble: {
    width: size.bubble,
    height: size.bubble,
    borderRadius: size.bubble / 2,
    borderWidth: border.selected,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bubbleWrong: { borderColor: color.seal },
  value: { flex: 1 },
});
