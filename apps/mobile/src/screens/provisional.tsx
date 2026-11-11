import { tokens } from '@aptiq/tokens';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Pattern, Rect } from 'react-native-svg';

import logo from '../../../../docs/marca/logo-aptiq.svg';

import { fontFamily } from '@/fonts';

const { color, opacity, size, spacing, type } = tokens;
const LOGO_WIDTH = 160; // ponytail: provisional; el componente Logo con sus tamaños llega en la fase 1

// Pantalla provisional de la fase 0: papel con cuadrícula, logotipo oficial y las tres fuentes.
export function Provisional() {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: Math.max(top, spacing.screenTop) }]}>
      <Svg style={StyleSheet.absoluteFill} accessible={false}>
        <Defs>
          <Pattern
            id="cuadricula"
            width={size.gridCell}
            height={size.gridCell}
            patternUnits="userSpaceOnUse">
            <Path
              d={`M 0 0.5 H ${size.gridCell} M 0.5 0 V ${size.gridCell}`}
              fill="none"
              stroke={color.ink}
              strokeOpacity={opacity.gridLine}
              strokeWidth={tokens.border.hairline}
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#cuadricula)" />
      </Svg>

      <Image
        source={logo}
        style={styles.logo}
        contentFit="contain"
        accessible
        accessibilityRole="image"
        accessibilityLabel="Aptiq"
      />
      <Text style={styles.label}>Fase 0 · Base del proyecto</Text>
      <Text style={styles.title} accessibilityRole="header">
        Saca tu apto.
      </Text>
      <Text style={styles.body}>
        Pantalla provisional. Instrument Sans para la interfaz, IBM Plex Mono para etiquetas y
        tiempos, y Bricolage Grotesque solo para el sello.
      </Text>
      <Text style={styles.brand}>Apto</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.paper,
    paddingHorizontal: spacing.screenX,
    gap: spacing.l,
  },
  logo: { width: LOGO_WIDTH, aspectRatio: 2 },
  label: {
    fontFamily: fontFamily('mono', type.label.weight),
    fontSize: type.label.size,
    letterSpacing: type.label.size * type.label.letterSpacing,
    textTransform: 'uppercase',
    color: color.graphite,
  },
  title: {
    fontFamily: fontFamily('ui', type.screenTitle.weight),
    fontSize: type.screenTitle.size,
    lineHeight: type.screenTitle.size * type.screenTitle.lineHeight,
    letterSpacing: type.screenTitle.size * type.screenTitle.letterSpacing,
    color: color.ink,
  },
  body: {
    fontFamily: fontFamily('ui', type.body.weight),
    fontSize: type.body.size,
    lineHeight: type.body.size * type.body.lineHeight,
    color: color.ink,
  },
  brand: {
    fontFamily: fontFamily('brand', type.seal.weight),
    fontSize: type.seal.size,
    letterSpacing: type.seal.size * type.seal.letterSpacing,
    textTransform: 'uppercase',
    color: color.ink,
  },
});
