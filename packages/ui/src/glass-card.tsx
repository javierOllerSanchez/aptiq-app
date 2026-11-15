import { tokens } from '@aptiq/tokens';
import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Glass } from './glass';

/**
 * Tarjeta de resumen en cristal (nivel estimado, aciertos, fallos…). Nunca para preguntas.
 * Agrupa su contenido para el lector de pantalla («Racha, 6 días» en un solo elemento).
 */
export function GlassCard({
  children,
  style,
  accessible = true,
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** false si dentro hay controles (campos, botones): agrupados, VoiceOver no llega a ellos. */
  accessible?: boolean;
}) {
  return (
    <Glass radius={tokens.radius.cardLarge} style={[styles.card, style]} accessible={accessible}>
      {children}
    </Glass>
  );
}

const styles = StyleSheet.create({
  card: { padding: tokens.spacing.xl, gap: tokens.spacing.s },
});
