import { tokens } from '@aptiq/tokens';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

const { color, opacity, size, spacing, border } = tokens;
const g = size.gridCell;

/**
 * Papel con cuadrícula de 24 y márgenes de pantalla con el área segura incluida.
 * Con `scroll`, los márgenes van dentro del desplazamiento: así las sombras del cristal no se
 * recortan en los bordes y el texto grande (texto dinámico al 200 %) nunca queda cortado.
 */
export function PaperBackground({
  children,
  scroll = false,
  style,
}: {
  children?: ReactNode;
  scroll?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingHorizontal: spacing.screenX,
    paddingTop: Math.max(insets.top, spacing.screenTop),
    paddingBottom: insets.bottom + (scroll ? spacing.xxl * 2 : 0),
  };
  return (
    <View style={[styles.paper, !scroll && padding, !scroll && style]}>
      <Svg style={StyleSheet.absoluteFill} accessible={false} importantForAccessibility="no">
        <Defs>
          <Pattern id="cuadricula" width={g} height={g} patternUnits="userSpaceOnUse">
            <Path
              d={`M 0 0.5 H ${g} M 0.5 0 V ${g}`}
              fill="none"
              stroke={color.ink}
              strokeOpacity={opacity.gridLine}
              strokeWidth={border.hairline}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#cuadricula)" />
      </Svg>
      {scroll ? (
        <>
          <ScrollView contentContainerStyle={[padding, style]} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
          {/* Franja de papel bajo la barra de estado para que el contenido no se mezcle con la hora. */}
          <View style={[styles.statusBar, { height: insets.top }]} pointerEvents="none" />
        </>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { flex: 1, backgroundColor: color.paper },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: color.paper },
});
