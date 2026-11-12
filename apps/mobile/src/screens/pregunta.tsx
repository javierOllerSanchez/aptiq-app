import { tokens } from '@aptiq/tokens';
import { Text } from '@aptiq/ui';
import { StyleSheet, View } from 'react-native';

/** Enunciado en su tarjeta de papel (guía, sección 6; nunca cristal). */
export function Pregunta({ texto }: { texto: string }) {
  return (
    <View style={styles.card}>
      <Text variant="questionTitle">{texto}</Text>
    </View>
  );
}

export const cardStyle = {
  padding: tokens.spacing.xl,
  backgroundColor: tokens.color.paperCard,
  borderRadius: tokens.radius.card,
  borderWidth: tokens.border.hairline,
  borderColor: tokens.color.line,
} as const;

const styles = StyleSheet.create({ card: cardStyle });
