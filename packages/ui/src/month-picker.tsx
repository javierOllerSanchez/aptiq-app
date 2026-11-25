import { tokens } from '@aptiq/tokens';
import { StyleSheet, View } from 'react-native';

import { PressScale } from './press-scale';
import { Text } from './text';

const { color, border, radius, size, spacing } = tokens;

export const MESES_CORTOS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];
const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Mes y año del examen (guía §5): las convocatorias se anuncian por mes. `value` es «AAAA-MM» o null.
 * Ofrece el año en curso y el siguiente; los meses ya pasados del año en curso no se pueden elegir.
 */
export function MonthPicker({
  value,
  onChange,
  hoy,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  /** Mes actual, «AAAA-MM». */
  hoy: string;
}) {
  const anioHoy = Number(hoy.slice(0, 4));
  const mesHoy = Number(hoy.slice(5, 7));
  const anio = value ? Number(value.slice(0, 4)) : anioHoy;
  const mes = value ? Number(value.slice(5, 7)) : null;
  const pon = (a: number, m: number) => onChange(`${a}-${String(m).padStart(2, '0')}`);

  return (
    <View style={styles.wrap}>
      <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Año">
        {[anioHoy, anioHoy + 1].map((a) => (
          <Chip
            key={a}
            label={String(a)}
            selected={value !== null && a === anio}
            // Al cambiar de año se conserva el mes si sigue siendo futuro.
            onPress={() =>
              pon(a, mes && (a > anioHoy || mes >= mesHoy) ? mes : a === anioHoy ? mesHoy : 1)
            }
          />
        ))}
      </View>
      <View style={styles.grid} accessibilityRole="radiogroup" accessibilityLabel="Mes">
        {MESES_CORTOS.map((m, i) => {
          const pasado = anio === anioHoy && i + 1 < mesHoy;
          return (
            <View key={m} style={styles.cell}>
              <Chip
                label={m}
                a11y={`${MESES[i]} de ${anio}`}
                selected={value !== null && mes === i + 1}
                disabled={pasado}
                onPress={() => pon(anio, i + 1)}
              />
            </View>
          );
        })}
      </View>
      <Chip label="Aún no lo sé" selected={value === null} onPress={() => onChange(null)} />
    </View>
  );
}

function Chip({
  label,
  a11y,
  selected,
  disabled = false,
  onPress,
}: {
  label: string;
  a11y?: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={a11y ?? label}
      accessibilityState={{ checked: selected, disabled }}
      style={[styles.chip, selected && styles.selected, disabled && styles.disabled]}
    >
      <Text variant="bodyStrong" color={selected ? 'highlighter' : 'ink'}>
        {label}
      </Text>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.l },
  row: { flexDirection: 'row', gap: spacing.s },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: spacing.s,
    marginHorizontal: -spacing.xs,
  },
  cell: { width: '33.333%', paddingHorizontal: spacing.xs },
  chip: {
    minHeight: size.touchMin,
    paddingHorizontal: spacing.l,
    borderRadius: radius.pill,
    borderWidth: border.default,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: color.ink },
  disabled: { opacity: tokens.opacity.disabled },
});
