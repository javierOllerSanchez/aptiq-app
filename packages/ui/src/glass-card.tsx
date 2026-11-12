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
}: {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Glass radius={tokens.radius.cardLarge} style={[styles.card, style]} accessible>
      {children}
    </Glass>
  );
}

const styles = StyleSheet.create({
  card: { padding: tokens.spacing.xl, gap: tokens.spacing.s },
});
