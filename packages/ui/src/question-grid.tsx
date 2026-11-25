import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { withAlpha } from './color';
import { Icon } from './icon';
import { PressScale } from './press-scale';
import { Text } from './text';

const { color, border, opacity, radius, size, spacing } = tokens;

/**
 * Cuadrícula del simulacro (guía §5): una casilla por pregunta para saltar a cualquiera (SIM-02).
 * Respondida `ink`, en blanco con borde, actual `highlighter`; las marcadas llevan bandera.
 */
export function QuestionGrid({
  answered,
  marked,
  current,
  onSelect,
}: {
  answered: readonly boolean[];
  marked: readonly boolean[];
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <View style={styles.grid}>
      {answered.map((hecha, i) => {
        const actual = i === current;
        const estado = [
          hecha ? 'respondida' : 'en blanco',
          marked[i] ? 'marcada para revisar' : null,
          actual ? 'actual' : null,
        ]
          .filter(Boolean)
          .join(', ');
        return (
          <PressScale
            key={i}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
            accessibilityLabel={`Pregunta ${i + 1}, ${estado}`}
            style={[styles.cell, hecha && styles.hecha, actual && styles.actual]}
          >
            <Text
              variant="formula"
              color={hecha && !actual ? 'white' : 'ink'}
              maxFontSizeMultiplier={1}
            >
              {i + 1}
            </Text>
            {marked[i] && (
              <View style={styles.flag}>
                <Icon
                  name="flag"
                  size={size.tick}
                  color={hecha && !actual ? 'highlighter' : 'ink'}
                />
              </View>
            )}
          </PressScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: size.levelGap },
  cell: {
    width: size.questionCell,
    height: size.questionCell,
    borderRadius: radius.tile,
    borderWidth: border.default,
    borderColor: withAlpha(color.ink, opacity.emptyBubbleBorder),
    alignItems: 'center',
    justifyContent: 'center',
  },
  hecha: { backgroundColor: color.ink, borderColor: color.ink },
  actual: { backgroundColor: color.highlighter, borderColor: color.ink },
  flag: { position: 'absolute', top: spacing.xs / 2, right: spacing.xs / 2 },
});
