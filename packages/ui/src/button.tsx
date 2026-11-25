import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { Glass } from './glass';
import { PressScale } from './press-scale';
import { Text } from './text';

const { color, radius, border, size, spacing, opacity } = tokens;

export type ButtonVariant = 'primary' | 'secondary' | 'glass' | 'text';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityHint,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityHint?: string;
}) {
  const content = (
    <Text variant="button" weight={variant === 'primary' ? 700 : 600} style={styles.label}>
      {label}
    </Text>
  );
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...(accessibilityHint !== undefined && { accessibilityHint })}
      style={[styles.base, disabled && { opacity: opacity.disabled }]}
    >
      {variant === 'glass' ? (
        <Glass radius={radius.button} style={styles.inner}>
          {content}
        </Glass>
      ) : (
        <View
          style={[
            styles.inner,
            variant !== 'text' && styles.bordered,
            variant === 'primary' && styles.primary,
          ]}
        >
          {content}
        </View>
      )}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: size.buttonHeight, minWidth: size.touchMin },
  inner: {
    flexGrow: 1,
    minHeight: size.buttonHeight,
    borderRadius: radius.button,
    paddingHorizontal: spacing.l,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: { borderWidth: border.default, borderColor: color.ink },
  primary: { backgroundColor: color.highlighter },
  // Con texto grande o una etiqueta larga, las dos líneas van centradas.
  label: { textAlign: 'center' },
});
