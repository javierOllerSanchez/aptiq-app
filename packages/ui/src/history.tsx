import { tokens } from '@aptiq/tokens';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { withAlpha } from './color';
import { muelle } from './reward';
import { Text } from './text';

const { color, border, motion, opacity, radius, size, spacing } = tokens;

export interface DiaCalendario {
  dia: string;
  hecho: boolean;
  hoy: boolean;
  futuro: boolean;
}

/**
 * Constancia (Historial v2): semanas de lunes a domingo en burbujas de la hoja de respuestas,
 * rellenas los días con práctica. Aparecen escalonadas con un fundido (también con «reducir
 * movimiento»).
 */
export function ConsistencyCalendar({
  semanas,
  resumen,
}: {
  semanas: DiaCalendario[][];
  /** Lo que dice el lector de pantalla, p. ej. «18 días con práctica en las últimas 5 semanas». */
  resumen: string;
}) {
  return (
    <View style={styles.cal} accessible accessibilityRole="image" accessibilityLabel={resumen}>
      <View style={styles.filaCal}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((l) => (
          <View key={l} style={styles.celdaCal}>
            <Text variant="label" color="graphite" maxFontSizeMultiplier={1.2}>
              {l}
            </Text>
          </View>
        ))}
      </View>
      {semanas.map((semana, s) => (
        <View key={semana[0]?.dia ?? s} style={styles.filaCal}>
          {semana.map((d, i) => (
            <View key={d.dia} style={styles.celdaCal}>
              <Animated.View
                entering={FadeIn.duration(motion.durationBase)
                  .delay((s * 7 + i) * (motion.stagger / 4))
                  .reduceMotion(ReduceMotion.Never)}
                style={[
                  styles.burbuja,
                  d.hecho && styles.hecha,
                  d.futuro && styles.futura,
                  d.hoy && styles.hoy,
                ]}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export interface HitoVista {
  id: string;
  marca: string;
  titulo: string;
  progreso: number;
  conseguido: boolean;
}

/**
 * Hitos (Historial v2, aprobado el 2026-11-25): sellos de subrayador los conseguidos y discontinuos
 * con su barra los pendientes. Los recién conseguidos entran con rebote (recompensa).
 */
export function MilestoneGrid({ hitos, nuevos = [] }: { hitos: HitoVista[]; nuevos?: string[] }) {
  return (
    <View style={styles.hitos}>
      {hitos.map((h) => (
        <View
          key={h.id}
          style={styles.hito}
          accessible
          accessibilityLabel={
            h.conseguido
              ? `${h.titulo}: conseguido`
              : `${h.titulo}: ${Math.round(h.progreso * 100)} % hecho`
          }
        >
          <Sello marca={h.marca} conseguido={h.conseguido} nuevo={nuevos.includes(h.id)} />
          <Text variant="caption" color="graphiteStrong" style={styles.centro}>
            {h.titulo}
          </Text>
          {!h.conseguido && (
            <View style={styles.mini}>
              <View style={[styles.miniRelleno, { width: `${Math.round(h.progreso * 100)}%` }]} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

function Sello({
  marca,
  conseguido,
  nuevo,
}: {
  marca: string;
  conseguido: boolean;
  nuevo: boolean;
}) {
  const reduce = useReducedMotion();
  const k = useSharedValue(nuevo && !reduce ? 0 : 1);
  useEffect(() => {
    if (nuevo && !reduce) k.value = withSpring(1, muelle);
  }, [nuevo, reduce, k]);
  const anim = useAnimatedStyle(() => ({
    opacity: Math.min(1, k.value * 2),
    transform: [{ scale: 0.5 + 0.5 * k.value }, { rotate: `${(1 - k.value) * -12}deg` }],
  }));
  return (
    <Animated.View
      style={[styles.sello, conseguido ? styles.selloOk : styles.selloPendiente, anim]}
    >
      <Text
        variant="bodyStrong"
        color={conseguido ? 'ink' : 'graphite'}
        maxFontSizeMultiplier={1.2}
      >
        {marca}
      </Text>
    </Animated.View>
  );
}

const SELLO = size.ring * (2 / 3);

const styles = StyleSheet.create({
  centro: { textAlign: 'center' },
  cal: { gap: spacing.s },
  filaCal: { flexDirection: 'row' },
  celdaCal: { flex: 1, alignItems: 'center' },
  burbuja: {
    width: size.weekBubble - spacing.xs,
    height: size.weekBubble - spacing.xs,
    borderRadius: radius.pill,
    borderWidth: border.selected,
    borderColor: withAlpha(color.ink, opacity.emptyBubbleBorder),
  },
  hecha: { backgroundColor: color.ink, borderColor: color.ink },
  futura: { borderStyle: 'dashed', borderColor: withAlpha(color.ink, opacity.pendingTick) },
  hoy: { borderColor: color.ink, outlineColor: color.highlighter, outlineWidth: border.stampGap },
  hitos: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.l },
  hito: { width: '33.333%', alignItems: 'center', gap: spacing.s, paddingHorizontal: spacing.xs },
  sello: {
    width: SELLO,
    height: SELLO,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selloOk: {
    backgroundColor: color.highlighter,
    borderWidth: border.selected,
    borderColor: color.ink,
  },
  selloPendiente: {
    borderWidth: border.selected,
    borderStyle: 'dashed',
    borderColor: withAlpha(color.ink, opacity.emptyBubbleBorder),
  },
  mini: {
    width: SELLO - spacing.s,
    height: spacing.xs + border.selected,
    borderRadius: radius.pill,
    backgroundColor: withAlpha(color.ink, opacity.barTrack),
    overflow: 'hidden',
  },
  miniRelleno: { height: '100%', borderRadius: radius.pill, backgroundColor: color.ink },
});
