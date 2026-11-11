import { tokens } from '@aptiq/tokens';
import { Pressable, StyleSheet, View } from 'react-native';

import { Glass } from './glass';
import { Text } from './text';

const { color, radius, border, size, spacing, opacity } = tokens;

export type ButtonVariant = 'primary' | 'secondary' | 'glass';

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
    <Text variant="button" weight={variant === 'primary' ? 700 : 600}>
      {label}
    </Text>
  );
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      {...(accessibilityHint !== undefined && { accessibilityHint })}
      style={({ pressed }) => [
        styles.base,
        (pressed || disabled) && { opacity: disabled ? opacity.disabled : opacity.pressed },
      ]}>
      {variant === 'glass' ? (
        <Glass radius={radius.button} style={styles.inner}>
          {content}
        </Glass>
      ) : (
        <View style={[styles.inner, styles.bordered, variant === 'primary' && styles.primary]}>
          {content}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: size.buttonHeight, minWidth: size.touchMin },
  inner: {
    flexGrow: 1,
    minHeight: size.buttonHeight,
    borderRadius: radius.button,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: { borderWidth: border.default, borderColor: color.ink },
  primary: { backgroundColor: color.highlighter },
});
