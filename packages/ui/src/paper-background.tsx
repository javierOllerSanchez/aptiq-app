import { tokens } from '@aptiq/tokens';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

const { color, opacity, size, spacing, border } = tokens;
const g = size.gridCell;

/** Papel con cuadrícula de 24 y márgenes de pantalla con el área segura incluida. */
export function PaperBackground({
  children,
  style,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.paper,
        { paddingTop: Math.max(insets.top, spacing.screenTop), paddingBottom: insets.bottom },
        style,
      ]}>
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
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  paper: { flex: 1, backgroundColor: color.paper, paddingHorizontal: spacing.screenX },
});
