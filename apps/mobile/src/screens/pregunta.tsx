import { type Item, registry } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Figure, Text } from '@aptiq/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

/** Enunciado en su tarjeta de papel (guía, sección 6; nunca cristal), con sus figuras si las tiene. */
export function Pregunta({ item }: { item: Item }) {
  // Ancho real del interior de la tarjeta: las figuras nunca se salen, esté donde esté.
  const [ancho, setAncho] = useState(0);
  const draw = registry[item.type].generator.draw;
  const stem = draw?.stem(item.stem);
  const n = stem?.drawings.length ?? 0;
  const termino = Math.min(tokens.size.figureOption, (ancho - n * tokens.spacing.xs) / (n + 1));
  return (
    <View style={styles.card} onLayout={(e) => setAncho(e.nativeEvent.layout.width - 2 * tokens.spacing.xl)}>
      <Enunciado texto={item.stem.text} />
      {stem && ancho > 0 && n === 1 && (
        <View style={styles.center}>
          <Figure drawing={stem.drawings[0]!} size={Math.min(ancho, tokens.size.figureStem)} label={stem.alt} />
        </View>
      )}
      {stem && ancho > 0 && n > 1 && (
        // Serie de figuras en una fila con la casilla «?» al final, como las series numéricas.
        <View style={styles.row} accessible accessibilityRole="image" accessibilityLabel={stem.alt}>
          {stem.drawings.map((d, i) => (
            <Figure key={i} drawing={d} size={termino} />
          ))}
          <View style={[styles.hueco, { width: termino, height: termino }]}>
            <Text variant="questionTitle" color="graphite" maxFontSizeMultiplier={1}>
              ?
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/** La palabra clave entre «» va subrayada (prototipo pregunta-verbal); el lector de pantalla lee el texto tal cual. */
function Enunciado({ texto }: { texto: string }) {
  const partes = texto.split(/«([^»]+)»/);
  if (partes.length === 1) return <Text variant="questionTitle">{texto}</Text>;
  return (
    <Text variant="questionTitle" accessibilityLabel={texto}>
      {partes.map((p, i) =>
        i % 2 === 1 ? (
          <Text key={i} variant="questionTitle" style={styles.clave}>
            {p}
          </Text>
        ) : (
          p
        ),
      )}
    </Text>
  );
}

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
  clave: { backgroundColor: tokens.color.highlighter },
  hueco: {
    borderRadius: tokens.radius.tile,
    borderWidth: tokens.border.default,
    borderColor: tokens.color.ink,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
