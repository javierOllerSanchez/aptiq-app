import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';

import { withAlpha } from './color';

const { color, size, radius, border, opacity, motion } = tokens;

/** Una casilla por pregunta: respondida, actual o pendiente (guía, sección 5). */
export function ProgressTicks({
  total,
  current,
  answered,
}: {
  total: number;
  /** Índice desde 0 de la pregunta en curso. */
  current: number;
  answered: readonly boolean[];
}) {
  return (
    <View
      style={styles.ticks}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Pregunta ${current + 1} de ${total}`}
      accessibilityValue={{ min: 1, max: total, now: current + 1 }}
    >
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.tick,
            i === current ? styles.current : answered[i] ? styles.answered : styles.pending,
          ]}
        />
      ))}
    </View>
  );
}

/** Diez burbujas de nivel: rellenas hasta el nivel actual, una tras otra al aparecer (guía §8). */
export function LevelBubbles({ level, max = 10 }: { level: number; max?: number }) {
  return (
    <View
      style={styles.levels}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`Nivel ${level} de ${max}`}
      accessibilityValue={{ min: 0, max, now: level }}
    >
      {Array.from({ length: max }, (_, i) => (
        <View key={i} style={[styles.level, styles.levelEmpty]}>
          {i < level && (
            // Solo fundido: se mantiene también con «reducir movimiento».
            <Animated.View
              entering={FadeIn.duration(motion.durationBase)
                .delay(i * motion.stagger * 2)
                .reduceMotion(ReduceMotion.Never)}
              style={[StyleSheet.absoluteFill, styles.level, styles.levelFilled]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ticks: { flexDirection: 'row', gap: size.tickGap, height: size.tick },
  tick: { flex: 1, borderRadius: radius.tick },
  answered: { backgroundColor: color.ink },
  current: {
    backgroundColor: color.highlighter,
    borderWidth: border.default,
    borderColor: color.ink,
  },
  pending: { backgroundColor: withAlpha(color.ink, opacity.pendingTick) },
  levels: { flexDirection: 'row', gap: size.levelGap },
  level: { width: size.levelBubble, height: size.levelBubble, borderRadius: size.levelBubble / 2 },
  levelFilled: { backgroundColor: color.ink, margin: -border.selected },
  levelEmpty: {
    borderWidth: border.selected,
    borderColor: withAlpha(color.ink, opacity.emptyBubbleBorder),
  },
});
