import { tokens } from '@aptiq/tokens';
import { StyleSheet } from 'react-native';

import { Glass } from './glass';
import { Icon } from './icon';
import { Text } from './text';

const { radius, spacing, size } = tokens;

/**
 * Cronómetro del simulacro: píldora de cristal con reloj y tiempo en mono (guía, sección 5).
 * La etiqueta accesible cambia por minutos, no cada segundo, para no saturar al lector de pantalla.
 */
export function Timer({ remainingMs }: { remainingMs: number }) {
  const seconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const minutes = Math.ceil(seconds / 60);
  const label =
    minutes === 0
      ? 'Tiempo agotado'
      : `Queda${minutes === 1 ? '' : 'n'} ${minutes} minuto${minutes === 1 ? '' : 's'}`;

  return (
    <Glass
      radius={radius.pill}
      style={styles.pill}
      accessible
      accessibilityRole="timer"
      accessibilityLabel={label}
      accessibilityLiveRegion="polite"
    >
      <Icon name="clock" size={tokens.type.timer.size + spacing.xs} />
      <Text variant="timer">
        {mm}:{ss}
      </Text>
    </Glass>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: size.touchMin,
    paddingHorizontal: spacing.m,
  },
});
