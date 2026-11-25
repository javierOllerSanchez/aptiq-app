import { tokens } from '@aptiq/tokens';
import { type ReactNode, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
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
import { Icon } from './icon';
import { PressScale } from './press-scale';
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
  // Alto real del panel; hasta medirlo, el panel no se ve (no asoma un fotograma fuera de sitio).
  const [alto, setAlto] = useState<number | null>(null);
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

  // Se lee fuera de la animación: en el hilo de interfaz no existe Dimensions.
  const fuera = Dimensions.get('window').height;
  const scrim = useAnimatedStyle(() => ({ opacity: p.value }));
  const panel = useAnimatedStyle(() =>
    alto === null
      ? // Hasta medirse, fuera de la pantalla (no transparente: el lector de pantalla la sigue viendo).
        { transform: [{ translateY: fuera }] }
      : reduce
        ? { opacity: p.value, transform: [{ translateY: drag.value }] }
        : { opacity: 1, transform: [{ translateY: (1 - p.value) * alto + drag.value }] },
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
        {/* Con teclado (p. ej. el correo de Cuenta), la hoja sube por encima. */}
        <KeyboardAvoidingView
          style={styles.abajo}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
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
            // VoiceOver ignora el fondo con accessibilityViewIsModal: el gesto de escape y la X cierran.
            onAccessibilityEscape={onClose}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.asa} accessible={false}>
                <View style={styles.asaBarra} />
              </View>
            </GestureDetector>
            <View style={styles.cabecera}>
              <View style={styles.fill}>
                {title !== undefined && (
                  <Text variant="questionTitle" accessibilityRole="header">
                    {title}
                  </Text>
                )}
              </View>
              <PressScale
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Cerrar"
                style={styles.cerrar}
              >
                <Icon name="cross" />
              </PressScale>
            </View>
            {children}
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrim: { backgroundColor: withAlpha(color.ink, opacity.scrim) },
  abajo: { flex: 1, justifyContent: 'flex-end' },
  panel: {
    maxHeight: '90%',
    backgroundColor: color.paperCard,
    borderTopLeftRadius: radius.cardLarge,
    borderTopRightRadius: radius.cardLarge,
    paddingHorizontal: spacing.screenX,
    gap: spacing.l,
  },
  // Zona de arrastre de 44 de alto aunque el asa visible sea fina.
  asa: {
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.size.touchMin,
    marginBottom: -spacing.l,
  },
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  cerrar: {
    width: tokens.size.touchMin,
    height: tokens.size.touchMin,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -spacing.m,
  },
  asaBarra: {
    width: tokens.size.sheetHandle,
    height: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: color.line,
  },
});
