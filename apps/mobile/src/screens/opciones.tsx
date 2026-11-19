import { type Item, registry } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Figure, OptionBubble, type OptionState } from '@aptiq/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { LETTERS, textoOpcion } from '@/practice/run';

const gap = tokens.spacing.s;
/** Relleno horizontal y borde de la casilla (OptionBubble): lo que la figura no puede ocupar. */
const marco = 2 * (tokens.spacing.l + tokens.border.selected);

/**
 * Opciones de una pregunta: en lista si son texto; en cuadrícula de 2 × 2 si son figuras
 * (prototipo pregunta-figuras, aprobado). Sin `onPress`, solo se muestran (repaso).
 */
export function Opciones({
  item,
  stateOf,
  onPress,
}: {
  item: Item;
  stateOf: (i: number) => OptionState;
  onPress?: (i: number) => void;
}) {
  const [ancho, setAncho] = useState(0);
  const draw = registry[item.type].generator.draw;
  const casilla = (ancho - gap) / 2;
  const figura = Math.min(tokens.size.figureOption, casilla - marco);
  return (
    <View
      accessibilityRole="radiogroup"
      style={draw ? styles.grid : styles.list}
      onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
    >
      {item.options.map((value, i) => (
        <View key={i} style={draw ? { width: Math.max(casilla, 0) } : null}>
          <OptionBubble
            letter={LETTERS[i] ?? ''}
            value={textoOpcion(item, i)}
            state={stateOf(i)}
            {...(draw
              ? {
                  // Hasta medir el hueco, un espacio del mismo alto: la cuadrícula no salta.
                  figure: ancho > 0 ? <Figure drawing={draw.option(value)} size={figura} /> : <View style={styles.hueco} />,
                }
              : {})}
            {...(onPress ? { onPress: () => onPress(i) } : {})}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap },
  hueco: { height: tokens.size.figureOption },
});
