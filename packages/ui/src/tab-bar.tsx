import { tokens } from '@aptiq/tokens';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { withAlpha } from './color';
import { Icon, type IconName } from './icon';
import { easeOut } from './motion';
import { PressScale } from './press-scale';
import { textStyle } from './text';

const { color, glass, motion, radius, size, spacing, border } = tokens;

export type Tab = 'home' | 'history' | 'account';

// Fase 5: tres destinos (prototipo aprobado, docs/prototipos/cuenta.html).
const tabs: { key: Tab; icon: IconName; label: string }[] = [
  { key: 'home', icon: 'home', label: 'Inicio' },
  { key: 'history', icon: 'history', label: 'Historial' },
  { key: 'account', icon: 'profile', label: 'Cuenta' },
];

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedText = Animated.Text;
/** Muelle sin rebote: la muesca se desliza y frena suave (navegación, no recompensa). */
const desliza = { duration: motion.spring, dampingRatio: 1 };
const H = size.tabBar;
const R = radius.nav;
const A = size.tabNotch / 2;
const D = size.tabNotchDepth;
/** Hombro de la muesca: lo que tarda el borde en empezar a bajar. */
const S = spacing.m;

/** Contorno de la barra con la muesca centrada en `cx` (se calcula en el hilo de animación). */
function forma(w: number, cx: number) {
  'worklet';
  const x = Math.min(Math.max(cx, R + A + S), w - R - A - S);
  return [
    `M ${R} 0`,
    `L ${x - A - S} 0`,
    `C ${x - A} 0 ${x - A + S / 2} ${D} ${x} ${D}`,
    `C ${x + A - S / 2} ${D} ${x + A} 0 ${x + A + S} 0`,
    `L ${w - R} 0`,
    `A ${R} ${R} 0 0 1 ${w} ${R}`,
    `L ${w} ${H - R}`,
    `A ${R} ${R} 0 0 1 ${w - R} ${H}`,
    `L ${R} ${H}`,
    `A ${R} ${R} 0 0 1 0 ${H - R}`,
    `L 0 ${R}`,
    `A ${R} ${R} 0 0 1 ${R} 0`,
    'Z',
  ].join(' ');
}

/**
 * Barra de navegación flotante (2026-11-25, referencia aportada por el propietario): papel blanco
 * con una muesca sobre la pestaña activa y una burbuja de la hoja de respuestas dentro. La muesca y
 * la burbuja se deslizan a la pestaña nueva; el icono sube un poco y el nombre pasa a tinta. Con
 * «reducir movimiento», todo cambia sin desplazarse.
 */
export function TabBar({ active, onSelect }: { active: Tab; onSelect: (tab: Tab) => void }) {
  const reduce = useReducedMotion();
  const [ancho, setAncho] = useState(0);
  // Centro de cada pestaña, medido al pintarse.
  const [centros, setCentros] = useState<Partial<Record<Tab, number>>>({});
  const destino = centros[active];
  const cx = useSharedValue(-1);

  useEffect(() => {
    if (destino === undefined) return;
    // La primera vez se coloca sin animar: la barra no «llega» desde fuera al abrir la app.
    cx.value = cx.value < 0 || reduce ? destino : withSpring(destino, desliza);
  }, [destino, reduce, cx]);

  const contorno = useAnimatedProps(() => ({
    d: forma(ancho, cx.value < 0 ? ancho / 2 : cx.value),
  }));
  const burbuja = useAnimatedStyle(() => ({
    opacity: cx.value < 0 ? 0 : 1,
    transform: [{ translateX: cx.value - size.tabDot / 2 }],
  }));

  return (
    <View
      style={styles.barra}
      onLayout={(e) => setAncho(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {ancho > 0 && (
        <Svg width={ancho} height={H} style={StyleSheet.absoluteFill} pointerEvents="none">
          <AnimatedPath
            animatedProps={contorno}
            fill={glass.fallbackFill}
            stroke={glass.border}
            strokeWidth={border.hairline}
          />
        </Svg>
      )}
      <Animated.View style={[styles.burbuja, burbuja]} pointerEvents="none" />
      {tabs.map((t) => (
        <Pestana
          key={t.key}
          icon={t.icon}
          label={t.label}
          selected={t.key === active}
          reduce={reduce}
          onLayout={(c) => setCentros((h) => (h[t.key] === c ? h : { ...h, [t.key]: c }))}
          onPress={() => {
            if (t.key !== active) Haptics.selectionAsync().catch(() => {});
            onSelect(t.key);
          }}
        />
      ))}
    </View>
  );
}

function Pestana({
  icon,
  label,
  selected,
  reduce,
  onLayout,
  onPress,
}: {
  icon: IconName;
  label: string;
  selected: boolean;
  reduce: boolean;
  onLayout: (centro: number) => void;
  onPress: () => void;
}) {
  const on = useSharedValue(selected ? 1 : 0);
  useEffect(() => {
    on.value = withTiming(selected ? 1 : 0, { duration: motion.durationSlow, easing: easeOut });
  }, [selected, on]);
  const k = useDerivedValue(() => on.value);
  const sube = useAnimatedStyle(() => ({
    transform: [{ translateY: reduce ? 0 : -spacing.xs * k.value }],
  }));
  const tinta = useAnimatedStyle(() => ({ opacity: k.value }));
  const nombre = useAnimatedStyle(() => ({
    color: interpolateColor(k.value, [0, 1], [color.graphite, color.ink]),
  }));
  return (
    <PressScale
      onPress={onPress}
      onLayout={(e) => onLayout(e.nativeEvent.layout.x + e.nativeEvent.layout.width / 2)}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      style={styles.pestana}
    >
      <Animated.View style={sube}>
        {/* Dos iconos superpuestos con fundido cruzado: gris inactivo, tinta activo. */}
        <Icon name={icon} color="graphite" />
        <Animated.View style={[StyleSheet.absoluteFill, tinta]}>
          <Icon name={icon} color="ink" />
        </Animated.View>
      </Animated.View>
      <AnimatedText
        style={[textStyle('label'), nombre]}
        maxFontSizeMultiplier={1.2}
        numberOfLines={1}
      >
        {label}
      </AnimatedText>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    height: H,
    // El contenido empieza bajo la muesca: la burbuja no toca el icono al subir.
    paddingTop: D,
    borderRadius: R,
    boxShadow: `0 ${glass.shadow.offsetY}px ${glass.shadow.radius}px ${withAlpha(glass.shadow.color, glass.shadow.opacity)}`,
  },
  burbuja: {
    position: 'absolute',
    top: D / 2 - size.tabDot / 2 - border.hairline,
    left: 0,
    width: size.tabDot,
    height: size.tabDot,
    borderRadius: radius.pill,
    backgroundColor: color.highlighter,
    borderWidth: border.selected,
    borderColor: color.ink,
  },
  pestana: {
    flex: 1,
    minHeight: size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs / 2,
  },
});
