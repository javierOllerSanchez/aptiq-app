import { tokens } from '@aptiq/tokens';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Icon } from './icon';
import { Text } from './text';

const { color, radius, border, size, spacing, motion, opacity } = tokens;

export type OptionState = 'empty' | 'marked' | 'correct' | 'wrong';

// Guía, sección 10: «Opción B, 63, seleccionada».
const stateLabel: Record<OptionState, string> = {
  empty: '',
  marked: ', seleccionada',
  correct: ', correcta',
  wrong: ', incorrecta',
};

const rowBorder: Record<OptionState, number> = {
  empty: border.hairline,
  marked: border.selected,
  correct: border.default,
  wrong: border.default,
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
  // Relleno de la burbuja: 150 ms con ease-out marcada. Solo opacidad, así que se mantiene también
  // con «reducir movimiento» (ReduceMotion.Never): la guía permite fundidos.
  const fill = useSharedValue(filled ? 1 : 0);
  useEffect(() => {
    fill.value = withTiming(filled ? 1 : 0, {
      duration: motion.durationFast,
      easing: Easing.bezier(...motion.easingCurve),
      reduceMotion: ReduceMotion.Never,
    });
  }, [filled, fill]);
  const fillStyle = useAnimatedStyle(() => ({ opacity: fill.value }));

  const press = onPress
    ? () => {
        if (state !== 'marked') Haptics.selectionAsync().catch(() => {});
        onPress();
      }
    : undefined;

  const wrong = state === 'wrong';
  // Mismo hueco interior con cualquier grosor de borde: el contenido no salta al marcar.
  const paddingHorizontal = spacing.l + border.selected - rowBorder[state];

  return (
    <Pressable
      onPress={press}
      accessibilityRole="radio"
      accessibilityState={{ checked: state === 'marked' }}
      accessibilityLabel={`Opción ${letter}, ${value}${stateLabel[state]}`}
      style={({ pressed }) => [
        styles.row,
        rowStyle[state],
        { borderWidth: rowBorder[state], paddingHorizontal },
        pressed && { opacity: opacity.pressed },
      ]}
    >
      <View style={[styles.bubble, wrong && styles.bubbleWrong]}>
        {/* Letra en tinta debajo; encima, el relleno con la letra en subrayador (fundido cruzado). */}
        {/* La letra es un gráfico de tamaño fijo, como un icono: la etiqueta accesible ya la incluye. */}
        <Text variant="timer" maxFontSizeMultiplier={1}>
          {letter}
        </Text>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.center,
            { backgroundColor: wrong ? color.seal : color.ink },
            fillStyle,
          ]}
        >
          {state === 'correct' ? (
            <Icon name="check" color="highlighter" strokeWidth={border.selected * 1.5} />
          ) : wrong ? (
            <Icon name="cross" color="white" strokeWidth={border.selected * 1.5} />
          ) : (
            <Text variant="timer" color="highlighter" maxFontSizeMultiplier={1}>
              {letter}
            </Text>
          )}
        </Animated.View>
      </View>
      <Text variant="optionValue" weight={state === 'empty' ? 600 : 700} style={styles.value}>
        {value}
      </Text>
    </Pressable>
  );
}

const rowStyle = StyleSheet.create({
  empty: { backgroundColor: color.paperCard, borderColor: color.line },
  marked: { backgroundColor: color.white, borderColor: color.ink },
  correct: { backgroundColor: color.highlighter, borderColor: color.ink },
  wrong: { backgroundColor: color.paperCard, borderColor: color.seal },
});

const styles = StyleSheet.create({
  row: {
    minHeight: size.optionHeight,
    borderRadius: radius.option,
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
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  bubbleWrong: { borderColor: color.seal },
  value: { flex: 1 },
});
