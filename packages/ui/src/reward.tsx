import { tokens } from '@aptiq/tokens';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  ReduceMotion,
  useAnimatedProps,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { withAlpha } from './color';
import { Icon } from './icon';
import { easeOut } from './motion';
import { Text } from './text';

const { color, motion, opacity, radius, size, spacing, border } = tokens;

/** Muelle de recompensa (guía §8, «Recompensas»): rebote suave. Nunca en el simulacro. */
export const muelle = { duration: motion.spring, dampingRatio: motion.springDamping };

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Anillo del objetivo de hoy: se rellena en 600 ms y, al completarse, el centro se pinta de
 * subrayador con un rebote suave. Con «reducir movimiento», todo aparece ya en su sitio.
 */
export function ProgressRing({
  value,
  children,
  label,
}: {
  /** 0–1. */
  value: number;
  children?: ReactNode;
  /** Lo que dice el lector de pantalla, p. ej. «5 de 12 preguntas hoy». */
  label: string;
}) {
  const reduce = useReducedMotion();
  const v = Math.max(0, Math.min(1, value));
  const r = (size.ring - size.ringStroke) / 2;
  const c = 2 * Math.PI * r;
  const p = useSharedValue(0);
  const lleno = useSharedValue(0);
  useEffect(() => {
    p.value = withTiming(v, { duration: motion.countUp, easing: easeOut });
    lleno.value =
      v >= 1 ? withDelay(reduce ? 0 : motion.countUp, withSpring(1, muelle)) : withTiming(0);
  }, [v, p, lleno, reduce]);
  const arco = useAnimatedProps(() => ({ strokeDashoffset: c * (1 - p.value) }));
  const fondo = useAnimatedStyle(() => ({
    opacity: Math.min(1, lleno.value * 2),
    transform: [{ scale: reduce ? 1 : 0.6 + 0.4 * lleno.value }],
  }));
  return (
    <View
      style={styles.anillo}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(v * 100) }}
    >
      <Animated.View style={[styles.fondo, fondo]} />
      <Svg width={size.ring} height={size.ring} style={styles.girado}>
        <Circle
          cx={size.ring / 2}
          cy={size.ring / 2}
          r={r}
          fill="none"
          stroke={withAlpha(color.ink, opacity.barTrack)}
          strokeWidth={size.ringStroke}
        />
        <AnimatedCircle
          cx={size.ring / 2}
          cy={size.ring / 2}
          r={r}
          fill="none"
          stroke={color.ink}
          strokeWidth={size.ringStroke}
          strokeLinecap="round"
          strokeDasharray={c}
          animatedProps={arco}
        />
      </Svg>
      <View style={styles.centro}>{children}</View>
    </View>
  );
}

/** Semana como fila de burbujas de la hoja de respuestas: marcada si ese día practicaste. */
export function WeekStrip({
  dias,
  marcar,
}: {
  dias: { letra: string; nombre: string; hecho: boolean; hoy: boolean }[];
  /** Índice del día que se acaba de marcar: rebota al aparecer (recompensa). */
  marcar?: number | null;
}) {
  return (
    <View style={styles.semana} accessible accessibilityLabel={resumenSemana(dias)}>
      {dias.map((d, i) => (
        <View key={d.letra + i} style={styles.dia}>
          <DiaBurbuja hecho={d.hecho} hoy={d.hoy} rebota={marcar === i} />
          <Text variant="label" color={d.hoy ? 'ink' : 'graphite'} maxFontSizeMultiplier={1.2}>
            {d.letra}
          </Text>
        </View>
      ))}
    </View>
  );
}

const resumenSemana = (dias: { nombre: string; hecho: boolean; hoy: boolean }[]) => {
  const hechos = dias.filter((d) => d.hecho).map((d) => d.nombre);
  const hoy = dias.find((d) => d.hoy)?.nombre;
  return [
    hechos.length
      ? `Esta semana has practicado: ${hechos.join(', ')}`
      : 'Esta semana aún no has practicado',
    hoy ? `Hoy es ${hoy}` : null,
  ]
    .filter(Boolean)
    .join('. ');
};

function DiaBurbuja({ hecho, hoy, rebota }: { hecho: boolean; hoy: boolean; rebota: boolean }) {
  const reduce = useReducedMotion();
  const s = useSharedValue(1);
  useEffect(() => {
    if (!rebota || reduce) return;
    s.value = 0.6;
    s.value = withSpring(1, muelle);
  }, [rebota, reduce, s]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Animated.View
      style={[
        styles.burbuja,
        hecho && styles.burbujaHecha,
        hoy && !hecho && styles.burbujaHoy,
        anim,
      ]}
    >
      {hecho && (
        <Icon
          name="check"
          color="highlighter"
          size={size.weekBubble / 2 + spacing.xs}
          strokeWidth={border.selected * 1.5}
        />
      )}
    </Animated.View>
  );
}

/** Racha: píldora con burbuja de subrayador y el número, que sube con un rebote al crecer. */
export function StreakChip({ dias }: { dias: number }) {
  const reduce = useReducedMotion();
  const antes = useRef(dias);
  const y = useSharedValue(0);
  const o = useSharedValue(1);
  useEffect(() => {
    const subio = dias > antes.current;
    antes.current = dias;
    if (!subio || reduce) return;
    y.value = spacing.m;
    o.value = 0;
    y.value = withSpring(0, muelle);
    o.value = withTiming(1, { duration: motion.durationBase });
  }, [dias, reduce, y, o]);
  const anim = useAnimatedStyle(() => ({ opacity: o.value, transform: [{ translateY: y.value }] }));
  return (
    <View
      style={styles.racha}
      accessible
      accessibilityLabel={`Racha de ${dias} ${dias === 1 ? 'día' : 'días'}`}
    >
      <View style={styles.rachaBurbuja} />
      <Animated.View style={anim}>
        <Text variant="timer">{dias}</Text>
      </Animated.View>
    </View>
  );
}

/**
 * Burbujas tinta y amarillas que saltan desde el centro y se desvanecen (guía §8, «Recompensas»).
 * Se dispara al cambiar `disparo`. Con «reducir movimiento» no se pinta nada.
 */
export function Burst({ disparo, cantidad = 14 }: { disparo: number; cantidad?: number }) {
  const reduce = useReducedMotion();
  if (reduce || disparo === 0) return null;
  return (
    <View
      style={styles.burst}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {Array.from({ length: cantidad }, (_, i) => (
        <Particula
          key={`${disparo}-${i}`}
          angulo={(i / cantidad) * 2 * Math.PI}
          par={i % 2 === 0}
        />
      ))}
    </View>
  );
}

function Particula({ angulo, par }: { angulo: number; par: boolean }) {
  const k = useSharedValue(0);
  useEffect(() => {
    k.value = withTiming(1, { duration: motion.burst, easing: easeOut });
  }, [k]);
  // Distancia algo distinta según el ángulo: así no parece un círculo perfecto.
  const d = motion.burstDistance * (0.85 + 0.3 * Math.abs(Math.sin(angulo * 3)));
  const anim = useAnimatedStyle(() => ({
    opacity: 1 - k.value,
    transform: [
      { translateX: Math.cos(angulo) * d * k.value },
      { translateY: Math.sin(angulo) * d * k.value },
      { scale: 1 - 0.6 * k.value },
    ],
  }));
  return (
    <Animated.View
      style={[styles.particula, par ? styles.particulaTinta : styles.particulaAmarilla, anim]}
    />
  );
}

/** Aviso de logro que baja desde arriba y se va solo (guía §8, «Recompensas»). */
export function RewardToast({
  visible,
  titulo,
  detalle,
  onHide,
}: {
  visible: boolean;
  titulo: string;
  detalle?: string | undefined;
  onHide: () => void;
}) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [montado, setMontado] = useState(visible);
  if (visible && !montado) setMontado(true);
  const p = useSharedValue(0);
  useEffect(() => {
    if (!visible) return;
    // Con «reducir movimiento», fundido (ReduceMotion.Never: si no, aparecería de golpe).
    const fundido = { duration: motion.durationBase, reduceMotion: ReduceMotion.Never };
    p.value = reduce ? withTiming(1, fundido) : withSpring(1, muelle);
    // VoiceOver no lee las regiones vivas: en iOS se anuncia a mano.
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility([titulo, detalle].filter(Boolean).join('. '));
    }
    const sale = setTimeout(() => {
      p.value = withTiming(0, { ...fundido, easing: easeOut });
    }, motion.toast);
    const fin = setTimeout(() => {
      setMontado(false);
      onHide();
    }, motion.toast + motion.durationBase);
    return () => {
      clearTimeout(sale);
      clearTimeout(fin);
    };
    // El aviso se anuncia al abrirse; los textos no cambian mientras se ve.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, reduce, p, onHide]);
  const anim = useAnimatedStyle(() =>
    reduce
      ? { opacity: p.value }
      : {
          opacity: Math.min(1, p.value * 2),
          transform: [{ translateY: (p.value - 1) * size.ring }],
        },
  );
  if (!montado) return null;
  return (
    <Animated.View
      style={[styles.aviso, { top: insets.top + spacing.s }, anim]}
      accessible
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      accessibilityLabel={[titulo, detalle].filter(Boolean).join('. ')}
    >
      <View style={styles.avisoBurbuja}>
        <Icon name="check" size={size.icon - spacing.xs} strokeWidth={border.selected * 1.5} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong" color="paperCard">
          {titulo}
        </Text>
        {detalle !== undefined && (
          <Text variant="caption" color="highlighter">
            {detalle}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  anillo: { width: size.ring, height: size.ring, alignItems: 'center', justifyContent: 'center' },
  girado: { position: 'absolute', transform: [{ rotate: '-90deg' }] },
  fondo: {
    position: 'absolute',
    width: size.ring - size.ringStroke * 2.5,
    height: size.ring - size.ringStroke * 2.5,
    borderRadius: radius.pill,
    backgroundColor: color.highlighter,
  },
  centro: { alignItems: 'center', justifyContent: 'center' },
  semana: { flexDirection: 'row', justifyContent: 'space-between' },
  dia: { alignItems: 'center', gap: spacing.xs },
  burbuja: {
    width: size.weekBubble,
    height: size.weekBubble,
    borderRadius: radius.pill,
    borderWidth: border.selected,
    borderColor: withAlpha(color.ink, opacity.emptyBubbleBorder),
    alignItems: 'center',
    justifyContent: 'center',
  },
  burbujaHecha: { backgroundColor: color.ink, borderColor: color.ink },
  burbujaHoy: { borderColor: color.ink },
  racha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    minHeight: size.touchMin - spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: radius.pill,
    borderWidth: border.default,
    borderColor: color.ink,
    overflow: 'hidden',
  },
  rachaBurbuja: {
    width: size.streakBubble,
    height: size.streakBubble,
    borderRadius: radius.pill,
    backgroundColor: color.highlighter,
    borderWidth: border.selected,
    borderColor: color.ink,
  },
  burst: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particula: {
    position: 'absolute',
    width: size.particle,
    height: size.particle,
    borderRadius: radius.pill,
  },
  particulaTinta: { backgroundColor: color.ink },
  particulaAmarilla: {
    backgroundColor: color.highlighter,
    borderWidth: border.default,
    borderColor: color.ink,
  },
  aviso: {
    position: 'absolute',
    left: spacing.screenX,
    right: spacing.screenX,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    padding: spacing.l,
    borderRadius: radius.card,
    backgroundColor: color.ink,
  },
  avisoBurbuja: {
    width: size.icon + spacing.s,
    height: size.icon + spacing.s,
    borderRadius: radius.pill,
    backgroundColor: color.highlighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
