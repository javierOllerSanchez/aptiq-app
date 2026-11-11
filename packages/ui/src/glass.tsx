import { tokens } from '@aptiq/tokens';
import { BlurView } from 'expo-blur';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { withAlpha } from './color';

const { glass } = tokens;

function useReduceTransparency() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceTransparencyEnabled().then(setReduce, () => {});
    const sub = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReduce);
    return () => sub.remove();
  }, []);
  return reduce;
}

/**
 * Superficie de cristal (guía, sección 4). Solo para lo que flota: navegación, cronómetro y resúmenes.
 * ponytail: en Android siempre la alternativa sin desenfoque; el desenfoque de expo-blur en Android
 * necesita envolver la pantalla en BlurTargetView. Añadirlo si el aspecto en Android se queda corto.
 */
export function Glass({
  children,
  radius,
  style,
}: {
  children?: ReactNode;
  radius: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduce = useReduceTransparency();
  const blur = Platform.OS === 'ios' && !reduce;
  const s = glass.shadow;
  return (
    <View
      style={[
        {
          borderRadius: radius,
          boxShadow: `0 ${s.offsetY}px ${s.radius}px ${withAlpha(s.color, s.opacity)}`,
        },
        style,
      ]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius: radius, overflow: 'hidden' }]}>
        {blur ? (
          <>
            {/* ponytail: intensidad aproximada a 16 px de desenfoque; ajustar comparando con el prototipo */}
            <BlurView intensity={glass.blur * 3} tint="light" style={StyleSheet.absoluteFill} />
            <Svg style={StyleSheet.absoluteFill}>
              <Defs>
                <LinearGradient id="relleno" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor={glass.fillTop} />
                  <Stop offset="1" stopColor={glass.fillBottom} />
                </LinearGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#relleno)" />
            </Svg>
          </>
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: glass.fallbackFill }]} />
        )}
        <View style={styles.highlight} />
      </View>
      <View
        style={[StyleSheet.absoluteFill, styles.border, { borderRadius: radius }]}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: tokens.border.hairline,
    backgroundColor: glass.innerHighlight,
  },
  border: { borderWidth: tokens.border.hairline, borderColor: glass.border },
});
