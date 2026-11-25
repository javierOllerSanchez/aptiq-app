import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { withAlpha } from './color';
import { Icon } from './icon';
import { PressScale } from './press-scale';
import { Text } from './text';

const { color, opacity, size, spacing } = tokens;

/**
 * Fila de lista (guía §5): 52 de alto, separador al 14 %, nombre 17/600, valor en mono y chevron.
 * El valor va en `sealText` si es el punto débil.
 */
export function ListRow({
  label,
  detail,
  value,
  valueLabel,
  weak = false,
  weakLabel = 'a reforzar',
  locked = false,
  lockedLabel = 'incluido en Premium',
  external = false,
  onPress,
}: {
  label: string;
  /** Segunda línea en gris (fecha, duración…). */
  detail?: string | undefined;
  value?: string | undefined;
  /** Lectura del valor para VoiceOver y TalkBack (p. ej. «81 % de acierto»). */
  valueLabel?: string | undefined;
  weak?: boolean;
  /** Qué significa el valor en rojo; se escribe junto al nombre para no depender del color. */
  weakLabel?: string;
  /** No incluido en el plan gratuito: candado y «Premium» en lugar del valor (fase 7). */
  locked?: boolean;
  /** Qué lee el lector de pantalla en una fila bloqueada. */
  lockedLabel?: string;
  /** Abre una página fuera de la app (fase 9): flecha hacia fuera en lugar del chevron. */
  external?: boolean;
  onPress: () => void;
}) {
  const a11y = locked
    ? [label, detail, lockedLabel].filter(Boolean).join(', ')
    : [label, detail, valueLabel ?? value, weak ? weakLabel : null].filter(Boolean).join(', ');
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole={external ? 'link' : 'button'}
      accessibilityLabel={a11y}
      style={styles.row}
    >
      <View style={styles.label}>
        <Text variant="bodyStrong">
          {label}
          {weak && !locked ? ` · ${weakLabel}` : ''}
        </Text>
        {detail !== undefined && (
          <Text variant="caption" color="graphite">
            {detail}
          </Text>
        )}
      </View>
      {locked ? (
        <View style={styles.lock}>
          <Icon name="lock" size={size.chevron} color="graphiteStrong" />
          <Text variant="label" color="graphiteStrong">
            Premium
          </Text>
        </View>
      ) : (
        <>
          {value !== undefined && (
            <Text variant="timer" color={weak ? 'sealText' : 'ink'}>
              {value}
            </Text>
          )}
          <Icon name={external ? 'external' : 'chevron'} size={size.chevron} />
        </>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: size.listRow,
    paddingVertical: spacing.s,
    borderBottomWidth: tokens.border.hairline,
    borderBottomColor: withAlpha(color.ink, opacity.divider),
  },
  label: { flex: 1 },
  lock: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});
