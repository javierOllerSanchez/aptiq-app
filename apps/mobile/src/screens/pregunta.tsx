import { type Item, registry } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Figure, Text } from '@aptiq/ui';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

/** Enunciado en su tarjeta de papel (guía, sección 6; nunca cristal), con sus figuras si las tiene. */
export function Pregunta({ item }: { item: Item }) {
  const { width } = useWindowDimensions();
  const draw = registry[item.type].generator.draw;
  const stem = draw?.stem(item.stem);
  // Ancho útil de la tarjeta: pantalla menos márgenes y relleno.
  const inner = width - 2 * tokens.spacing.screenX - 2 * tokens.spacing.xl;
  return (
    <View style={styles.card}>
      <Text variant="questionTitle">{item.stem.text}</Text>
      {stem && stem.drawings.length === 1 && (
        <View style={styles.center}>
          <Figure drawing={stem.drawings[0]!} size={Math.min(inner, 220)} label={stem.alt} />
        </View>
      )}
      {stem && stem.drawings.length > 1 && (
        // Serie de figuras en una fila con la casilla «?» al final, como las series numéricas.
        <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel={stem.alt}>
          {stem.drawings.map((d, i) => (
            <Figure key={i} drawing={d} size={termSize(inner, stem.drawings.length)} />
          ))}
          <View style={[styles.hueco, { width: termSize(inner, stem.drawings.length), height: termSize(inner, stem.drawings.length) }]}>
            <Text variant="questionTitle" color="graphite">
              ?
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const termSize = (inner: number, n: number) => (inner - n * tokens.spacing.xs) / (n + 1);

export const cardStyle = {
  padding: tokens.spacing.xl,
  backgroundColor: tokens.color.paperCard,
  borderRadius: tokens.radius.card,
  borderWidth: tokens.border.hairline,
  borderColor: tokens.color.line,
} as const;

const styles = StyleSheet.create({
  card: { ...cardStyle, gap: tokens.spacing.l },
  center: { alignItems: 'center' },
  row: { flexDirection: 'row', gap: tokens.spacing.xs },
  hueco: {
    borderRadius: tokens.radius.tile,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
