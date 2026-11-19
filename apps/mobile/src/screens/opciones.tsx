import { type Item, registry } from '@aptiq/engine';
import { tokens } from '@aptiq/tokens';
import { Figure, OptionBubble, type OptionState } from '@aptiq/ui';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { LETTERS, textoOpcion } from '@/practice/run';

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
  const { width } = useWindowDimensions();
  const draw = registry[item.type].generator.draw;
  // Media pantalla menos márgenes, hueco entre casillas y relleno de la casilla.
  const figura = Math.min(130, (width - 2 * tokens.spacing.screenX - tokens.spacing.s) / 2 - 2 * tokens.spacing.l - 8);
  return (
    <View accessibilityRole="radiogroup" style={draw ? styles.grid : styles.list}>
      {item.options.map((value, i) => (
        <View key={i} style={draw ? styles.cell : null}>
          <OptionBubble
            letter={LETTERS[i] ?? ''}
            value={textoOpcion(item, i)}
            state={stateOf(i)}
            {...(draw ? { figure: <Figure drawing={draw.option(value)} size={figura} /> } : {})}
            {...(onPress ? { onPress: () => onPress(i) } : {})}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: tokens.spacing.s },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: tokens.spacing.s },
  cell: { width: '48.5%' },
});
