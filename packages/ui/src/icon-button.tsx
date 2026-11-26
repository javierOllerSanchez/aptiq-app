import { tokens } from '@aptiq/tokens';
import { type ReactNode, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Icon, type IconName } from './icon';
import { PressScale } from './press-scale';
import { Sheet } from './sheet';

const { color, border, radius, size } = tokens;

/** Botón de icono: círculo de 44 con borde `ink` (cerrar, marcar, información). Activo: fondo `ink`. */
export function IconButton({
  icon,
  label,
  onPress,
  active,
  bordered = true,
  disabled = false,
}: {
  icon: IconName;
  /** Lo que dice el lector de pantalla (obligatorio: guía §10). */
  label: string;
  onPress: () => void;
  /** Solo en botones que se activan y desactivan (p. ej. marcar para revisar). */
  active?: boolean;
  bordered?: boolean;
  disabled?: boolean;
}) {
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      accessibilityState={{ disabled, ...(active !== undefined && { selected: active }) }}
      style={[
        styles.circle,
        bordered && styles.bordered,
        active && styles.active,
        disabled && { opacity: tokens.opacity.disabled },
      ]}
    >
      <Icon name={icon} color={active ? 'highlighter' : 'ink'} />
    </PressScale>
  );
}

/** Icono «i» que abre una hoja con la fuente, el método y el aviso de independencia (guía §7 bis). */
export function InfoButton({
  title,
  label = 'Información sobre el formato',
  children,
}: {
  title: string;
  label?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <IconButton icon="info" label={label} onPress={() => setOpen(true)} bordered={false} />
      <Sheet visible={open} onClose={() => setOpen(false)} title={title}>
        {children}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: size.touchMin,
    height: size.touchMin,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: { borderWidth: border.default, borderColor: color.ink },
  active: { backgroundColor: color.ink },
});
