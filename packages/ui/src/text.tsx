import { tokens } from '@aptiq/tokens';
import { Text as RNText, StyleSheet, type TextProps as RNTextProps } from 'react-native';

type Font = keyof typeof tokens.font;
export type TextVariant = keyof typeof tokens.type;
export type ColorName = keyof typeof tokens.color;

// En Android el peso no elige archivo: cada peso es una familia propia («InstrumentSans_700»).
export const fontFamily = (font: Font, weight: number) => `${tokens.font[font]}_${weight}`;

const variants = StyleSheet.create(
  Object.fromEntries(
    Object.entries(tokens.type).map(([name, t]) => [
      name,
      {
        fontFamily: fontFamily(t.font, t.weight),
        fontSize: t.size,
        ...('lineHeight' in t && { lineHeight: t.size * t.lineHeight }),
        ...('letterSpacing' in t && { letterSpacing: t.size * t.letterSpacing }),
        ...('uppercase' in t && { textTransform: 'uppercase' as const }),
      },
    ]),
  ) as Record<TextVariant, object>,
);

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  color?: ColorName;
  /** Solo para el valor de opción marcada (600 → 700). */
  weight?: number;
};

/** Estilo resuelto de una variante, para componentes que no son Text (por ejemplo, TextInput). */
export const textStyle = (variant: TextVariant) => variants[variant];

export function Text({ variant = 'body', color = 'ink', weight, style, ...rest }: TextProps) {
  const t = tokens.type[variant];
  return (
    <RNText
      style={[
        variants[variant],
        { color: tokens.color[color] },
        weight !== undefined && { fontFamily: fontFamily(t.font, weight) },
        style,
      ]}
      {...rest}
    />
  );
}
