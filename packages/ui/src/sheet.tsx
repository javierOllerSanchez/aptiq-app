import { tokens } from '@aptiq/tokens';
import { type ReactNode, useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { withAlpha } from './color';
import { easeOut } from './motion';
import { Text } from './text';

const { color, motion, opacity, radius, spacing } = tokens;
/** Arrastre que cierra la hoja (px) o velocidad hacia abajo (px/s). */
const CIERRE = { distancia: 96, velocidad: 800 };

/**
 * Hoja inferior propia (guía §5): sustituye a los diálogos nativos. Sube desde abajo en 250 ms con
 * el fondo oscurecido; se cierra deslizando, tocando fuera o con «atrás». Con «reducir movimiento»,
 * solo fundido.
 */
export function Sheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  // Montada mientras se ve o mientras sale: el Modal se quita al terminar la animación de salida.
  const [montada, setMontada] = useState(visible);
  if (visible && !montada) setMontada(true);
  const [alto, setAlto] = useState(400);
  const p = useSharedValue(0);
  const drag = useSharedValue(0);

  useEffect(() => {
    const t = { duration: motion.durationSlow, easing: easeOut };
    if (visible) {
      drag.set(0);
      p.set(withTiming(1, t));
      return;
    }
    p.set(withTiming(0, { ...t, duration: motion.durationBase }));
    const fin = setTimeout(() => setMontada(false), motion.durationBase);
    return () => clearTimeout(fin);
  }, [visible, p, drag]);

  const scrim = useAnimatedStyle(() => ({ opacity: p.value }));
  const panel = useAnimatedStyle(() =>
    reduce
      ? { opacity: p.value, transform: [{ translateY: drag.value }] }
      : { transform: [{ translateY: (1 - p.value) * alto + drag.value }] },
  );

  const pan = Gesture.Pan()
    .runOnJS(true)
    .onChange((e) => drag.set(Math.max(0, e.translationY)))
    .onEnd((e) => {
      if (e.translationY > CIERRE.distancia || e.velocityY > CIERRE.velocidad) onClose();
      else drag.set(withTiming(0, { duration: motion.durationFast, easing: easeOut }));
    });

  if (!montada) return null;
  return (
    <Modal
      transparent
      visible
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.fill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrim]}>
          <Pressable
            style={styles.fill}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cerrar"
          />
        </Animated.View>
        <Animated.View
          style={[styles.panel, { paddingBottom: insets.bottom + spacing.xxl }, panel]}
          onLayout={(e) => setAlto(e.nativeEvent.layout.height)}
          accessibilityViewIsModal
        >
          <GestureDetector gesture={pan}>
            <View style={styles.asa} accessible={false}>
              <View style={styles.asaBarra} />
            </View>
          </GestureDetector>
          {title !== undefined && (
            <Text variant="questionTitle" accessibilityRole="header">
              {title}
            </Text>
          )}
          {children}
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrim: { backgroundColor: withAlpha(color.ink, opacity.scrim) },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '90%',
    backgroundColor: color.paperCard,
    borderTopLeftRadius: radius.cardLarge,
    borderTopRightRadius: radius.cardLarge,
    paddingHorizontal: spacing.screenX,
    gap: spacing.l,
  },
  asa: { alignItems: 'center', paddingTop: spacing.m, paddingBottom: spacing.xs },
  asaBarra: {
    width: tokens.size.sheetHandle,
    height: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: color.line,
  },
});
