import { tokens } from '@aptiq/tokens';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { withAlpha } from './color';
import { easeOut } from './motion';

import { Icon } from './icon';
import { PressScale } from './press-scale';
import { LevelBubbles } from './progress';
import { Text } from './text';

const { color, border, radius, size, spacing, motion, opacity } = tokens;

/**
 * Casilla de aptitud de Inicio (prototipo inicio-v2): nombre, acierto en mono y, con Premium, el
 * nivel en burbujas. La aptitud a reforzar lleva el acierto y la etiqueta en rojo; las de Premium,
 * candado.
 */
export function AptitudeTile({
  label,
  acierto,
  fraccion = null,
  nivel,
  weak = false,
  locked = false,
  onPress,
}: {
  label: string;
  /** «64 %», o null si aún no hay respuestas. */
  acierto: string | null;
  /** Acierto 0–1 para la barra; null sin respuestas. */
  fraccion?: number | null;
  /** Nivel 1–5 redondeado; null si no se muestra (plan gratuito o sin datos). */
  nivel: number | null;
  weak?: boolean;
  locked?: boolean;
  onPress: () => void;
}) {
  const a11y = locked
    ? `${label}, incluido en Premium`
    : [
        label,
        acierto ? `${acierto} de acierto` : 'sin empezar',
        nivel !== null ? `nivel ${nivel} de 5` : null,
        weak ? 'a reforzar' : null,
      ]
        .filter(Boolean)
        .join(', ');
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11y}
      style={[styles.casilla, locked && styles.bloqueada]}
    >
      <View style={styles.cabecera}>
        <Text variant="bodyStrong" style={styles.flex}>
          {label}
        </Text>
        {!locked && acierto !== null && (
          <Text variant="formula" color={weak ? 'sealText' : 'ink'}>
            {acierto}
          </Text>
        )}
      </View>
      {locked ? (
        <View style={styles.candado}>
          <Icon name="lock" size={size.chevron} color="graphiteStrong" />
          <Text variant="label" color="graphiteStrong">
            Premium
          </Text>
        </View>
      ) : (
        <View style={styles.pie}>
          {nivel !== null && <LevelBubbles level={nivel} max={5} />}
          {fraccion !== null ? (
            <Barra fraccion={fraccion} weak={weak} />
          ) : (
            <Text variant="caption" color="graphite">
              Sin empezar
            </Text>
          )}
        </View>
      )}
      {weak && !locked && (
        <Text variant="label" color="sealText">
          A reforzar
        </Text>
      )}
    </PressScale>
  );
}

/** Barra de acierto: crece al aparecer (250 ms, guía §8). */
function Barra({ fraccion, weak }: { fraccion: number; weak: boolean }) {
  const w = useSharedValue(0);
  useEffect(() => {
    w.value = withDelay(
      motion.durationBase,
      withTiming(Math.max(0, Math.min(1, fraccion)) * 100, {
        duration: motion.durationSlow,
        easing: easeOut,
      }),
    );
  }, [fraccion, w]);
  const anim = useAnimatedStyle(() => ({ width: `${w.value}%` }));
  return (
    <View style={styles.pista}>
      <Animated.View style={[styles.relleno, weak && styles.rellenoFlojo, anim]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pie: { gap: spacing.s },
  pista: {
    height: size.bar,
    borderRadius: radius.pill,
    backgroundColor: withAlpha(color.ink, opacity.barTrack),
    overflow: 'hidden',
  },
  relleno: { height: '100%', borderRadius: radius.pill, backgroundColor: color.ink },
  rellenoFlojo: { backgroundColor: color.seal },
  flex: { flex: 1 },
  casilla: {
    flex: 1,
    minHeight: size.tileMin,
    padding: spacing.l,
    gap: spacing.m,
    justifyContent: 'space-between',
    backgroundColor: color.paperCard,
    borderRadius: radius.card - spacing.xs,
    borderWidth: border.hairline,
    borderColor: color.line,
  },
  // Bloqueada: papel en lugar de tarjeta; el candado ya lo dice.
  bloqueada: { backgroundColor: 'transparent' },
  cabecera: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.s },
  candado: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
